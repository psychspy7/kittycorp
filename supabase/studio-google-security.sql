-- Password and Google verification are required together only after the owner
-- enables studio_google_enforced. Leave false until real Google OAuth is tested.
insert into kitty_website_private.settings(key,value)
values ('studio_google_enforced','false'), ('studio_google_email','viratanand1221@gmail.com')
on conflict(key) do nothing;

create table if not exists kitty_website_private.studio_login_challenges (
  id uuid primary key,
  token_hash text not null unique check(token_hash ~ '^[a-f0-9]{64}$'),
  flow_hash text not null check(flow_hash ~ '^[a-f0-9]{64}$'),
  fingerprint text not null check(fingerprint ~ '^[a-f0-9]{64}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  password_session_id uuid not null references auth.sessions(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now()+interval '5 minutes',
  consumed_at timestamptz
);
create table if not exists kitty_website_private.studio_sessions (
  session_id uuid primary key references auth.sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  google_subject text not null,
  verified_at timestamptz not null default now(),
  expires_at timestamptz not null
);
alter table kitty_website_private.studio_login_challenges enable row level security;
alter table kitty_website_private.studio_sessions enable row level security;
revoke all on kitty_website_private.studio_login_challenges from public,anon,authenticated;
revoke all on kitty_website_private.studio_sessions from public,anon,authenticated;

create or replace function kitty_website_private.studio_gateway_valid(p_token text)
returns boolean language sql stable security definer set search_path='' as $$
  select p_token is not null and exists (
    select 1 from kitty_website_private.settings
    where key='feedback_gateway_hash'
      and value=encode(extensions.digest(p_token,'sha256'),'hex')
  );
$$;
revoke all on function kitty_website_private.studio_gateway_valid(text) from public,anon,authenticated;

create or replace function kitty_website_private.studio_security(p_gateway_token text)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_enforced text;
begin
  if not kitty_website_private.studio_gateway_valid(p_gateway_token)
    then raise exception 'Unauthorized' using errcode='42501'; end if;
  select value into v_enforced from kitty_website_private.settings where key='studio_google_enforced';
  if v_enforced is null or v_enforced not in ('true','false')
    then raise exception 'Security configuration unavailable' using errcode='42501'; end if;
  return jsonb_build_object('google_enforced',v_enforced='true');
end;$$;
revoke all on function kitty_website_private.studio_security(text) from public;
grant usage on schema kitty_website_private to anon;
grant execute on function kitty_website_private.studio_security(text) to anon,authenticated;
create or replace function public.kitty_website_studio_security(p_gateway_token text) returns jsonb
language sql stable security invoker set search_path='' as $$select kitty_website_private.studio_security(p_gateway_token);$$;
revoke all on function public.kitty_website_studio_security(text) from public;
grant execute on function public.kitty_website_studio_security(text) to anon,authenticated;

create or replace function kitty_website_private.studio_begin(
  p_challenge_id uuid,p_challenge_token text,p_flow_hash text,p_fingerprint text,p_gateway_token text
) returns void language plpgsql security definer set search_path='' as $$
declare v_session uuid;
begin
  if not kitty_website_private.studio_gateway_valid(p_gateway_token)
    or auth.uid() is null
    or not exists(select 1 from kitty_website_private.admins where user_id=auth.uid())
    or not exists(select 1 from auth.users u where u.id=auth.uid()
      and (u.banned_until is null or u.banned_until<now())
      and u.email_confirmed_at is not null)
    or not exists(select 1 from jsonb_array_elements(coalesce(auth.jwt()->'amr','[]'::jsonb)) m
      where m->>'method'='password' and to_timestamp((m->>'timestamp')::double precision)>now()-interval '5 minutes')
    then raise exception 'Unauthorized' using errcode='42501'; end if;
  select s.id into v_session from auth.sessions s
    where s.id::text=auth.jwt()->>'session_id' and s.user_id=auth.uid()
      and (s.not_after is null or s.not_after>now());
  if v_session is null or p_challenge_id is null or p_challenge_token is null or p_flow_hash is null or p_fingerprint is null
    or p_challenge_token !~ '^[a-f0-9]{64}$' or p_flow_hash !~ '^[a-f0-9]{64}$' or p_fingerprint !~ '^[a-f0-9]{64}$'
    then raise exception 'Unauthorized' using errcode='42501'; end if;
  delete from kitty_website_private.studio_login_challenges where expires_at<now();
  insert into kitty_website_private.studio_login_challenges
    (id,token_hash,flow_hash,fingerprint,user_id,password_session_id)
    values(p_challenge_id,encode(extensions.digest(p_challenge_token,'sha256'),'hex'),p_flow_hash,p_fingerprint,auth.uid(),v_session);
end;$$;
revoke all on function kitty_website_private.studio_begin(uuid,text,text,text,text) from public,anon;
grant execute on function kitty_website_private.studio_begin(uuid,text,text,text,text) to authenticated;
create or replace function public.kitty_website_studio_begin(p_challenge_id uuid,p_challenge_token text,p_flow_hash text,p_fingerprint text,p_gateway_token text) returns void
language sql security invoker set search_path='' as $$select kitty_website_private.studio_begin(p_challenge_id,p_challenge_token,p_flow_hash,p_fingerprint,p_gateway_token);$$;
revoke all on function public.kitty_website_studio_begin(uuid,text,text,text,text) from public,anon;
grant execute on function public.kitty_website_studio_begin(uuid,text,text,text,text) to authenticated;

create or replace function kitty_website_private.studio_complete(
  p_challenge_id uuid,p_challenge_token text,p_flow_hash text,p_fingerprint text,
  p_google_email text,p_google_subject text,p_gateway_token text
) returns void language plpgsql security definer set search_path='' as $$
declare
  v_pending kitty_website_private.studio_login_challenges%rowtype;
  v_session uuid;
  v_email text;
  v_subject text;
begin
  if not kitty_website_private.studio_gateway_valid(p_gateway_token)
    or auth.uid() is null
    or not exists(select 1 from kitty_website_private.admins where user_id=auth.uid())
    or not exists(select 1 from jsonb_array_elements(coalesce(auth.jwt()->'amr','[]'::jsonb)) m
      where m->>'method'='oauth' and to_timestamp((m->>'timestamp')::double precision)>now()-interval '5 minutes')
    then raise exception 'Unauthorized' using errcode='42501'; end if;
  select value into v_email from kitty_website_private.settings where key='studio_google_email';
  if v_email is null or p_google_email is null or lower(p_google_email)<>lower(v_email)
    or p_challenge_id is null or p_challenge_token is null or p_flow_hash is null or p_fingerprint is null
    or p_challenge_token !~ '^[a-f0-9]{64}$' or p_flow_hash !~ '^[a-f0-9]{64}$' or p_fingerprint !~ '^[a-f0-9]{64}$'
    or p_google_subject is null or p_google_subject !~ '^[a-zA-Z0-9._-]{1,255}$'
    or not exists(select 1 from auth.users u where u.id=auth.uid() and lower(u.email)=lower(v_email)
      and u.email_confirmed_at is not null and (u.banned_until is null or u.banned_until<now()))
    then raise exception 'Unauthorized' using errcode='42501'; end if;
  select * into v_pending from kitty_website_private.studio_login_challenges
    where id=p_challenge_id for update;
  if not found or v_pending.user_id<>auth.uid() or v_pending.consumed_at is not null
    or v_pending.expires_at<=now()
    or v_pending.token_hash<>encode(extensions.digest(p_challenge_token,'sha256'),'hex')
    or v_pending.flow_hash<>p_flow_hash or v_pending.fingerprint<>p_fingerprint
    or not exists(select 1 from auth.sessions s where s.id=v_pending.password_session_id and s.user_id=auth.uid()
      and (s.not_after is null or s.not_after>now()))
    then raise exception 'Unauthorized' using errcode='42501'; end if;
  select s.id into v_session from auth.sessions s where s.id::text=auth.jwt()->>'session_id'
    and s.user_id=auth.uid() and (s.not_after is null or s.not_after>now());
  if v_session is null or v_session=v_pending.password_session_id
    then raise exception 'Unauthorized' using errcode='42501'; end if;
  -- Pin Google's immutable subject after the first verified account connection.
  perform pg_catalog.pg_advisory_xact_lock(761212);
  insert into kitty_website_private.settings(key,value) values('studio_google_subject',p_google_subject) on conflict(key) do nothing;
  select value into v_subject from kitty_website_private.settings where key='studio_google_subject';
  if v_subject<>p_google_subject then raise exception 'Unauthorized' using errcode='42501'; end if;
  update kitty_website_private.studio_login_challenges set consumed_at=now() where id=p_challenge_id;
  insert into kitty_website_private.studio_sessions(session_id,user_id,google_subject,expires_at)
    values(v_session,auth.uid(),p_google_subject,least(now()+interval '1 hour',to_timestamp((auth.jwt()->>'exp')::double precision)));
end;$$;
revoke all on function kitty_website_private.studio_complete(uuid,text,text,text,text,text,text) from public,anon;
grant execute on function kitty_website_private.studio_complete(uuid,text,text,text,text,text,text) to authenticated;
create or replace function public.kitty_website_studio_complete(p_challenge_id uuid,p_challenge_token text,p_flow_hash text,p_fingerprint text,p_google_email text,p_google_subject text,p_gateway_token text) returns void
language sql security invoker set search_path='' as $$select kitty_website_private.studio_complete(p_challenge_id,p_challenge_token,p_flow_hash,p_fingerprint,p_google_email,p_google_subject,p_gateway_token);$$;
revoke all on function public.kitty_website_studio_complete(uuid,text,text,text,text,text,text) from public,anon;
grant execute on function public.kitty_website_studio_complete(uuid,text,text,text,text,text,text) to authenticated;

create or replace function kitty_website_private.studio_end(p_gateway_token text)
returns void language plpgsql security definer set search_path='' as $$
begin
  if not kitty_website_private.studio_gateway_valid(p_gateway_token) or auth.uid() is null
    then raise exception 'Unauthorized' using errcode='42501'; end if;
  delete from kitty_website_private.studio_sessions where user_id=auth.uid() and session_id::text=auth.jwt()->>'session_id';
end;$$;
revoke all on function kitty_website_private.studio_end(text) from public,anon;
grant execute on function kitty_website_private.studio_end(text) to authenticated;
create or replace function public.kitty_website_studio_end(p_gateway_token text) returns void
language sql security invoker set search_path='' as $$select kitty_website_private.studio_end(p_gateway_token);$$;
revoke all on function public.kitty_website_studio_end(text) from public,anon;
grant execute on function public.kitty_website_studio_end(text) to authenticated;

create or replace function kitty_website_private.is_admin() returns boolean
language sql stable security definer set search_path='' as $$
  select auth.uid() is not null and exists(
    select 1 from kitty_website_private.admins a
    join auth.users u on u.id=a.user_id
    join auth.sessions s on s.user_id=u.id
    where a.user_id=auth.uid() and s.id::text=auth.jwt()->>'session_id'
      and (u.banned_until is null or u.banned_until<now())
      and (s.not_after is null or s.not_after>now())
      and (exists(select 1 from kitty_website_private.settings where key='studio_google_enforced' and value='false')
        or (exists(select 1 from kitty_website_private.settings where key='studio_google_enforced' and value='true')
          and exists(select 1 from kitty_website_private.studio_sessions g
            where g.session_id=s.id and g.user_id=u.id and g.expires_at>now())))
  );
$$;
revoke all on function kitty_website_private.is_admin() from public,anon;
grant execute on function kitty_website_private.is_admin() to authenticated;
