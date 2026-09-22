
create schema if not exists kitty_website_private;
revoke all on schema kitty_website_private from public, anon;
grant usage on schema kitty_website_private to authenticated;
create table kitty_website_private.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table kitty_website_private.admins enable row level security;
create table kitty_website_private.settings (key text primary key, value text not null);
alter table kitty_website_private.settings enable row level security;
create function kitty_website_private.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
 select auth.uid() is not null and exists (
   select 1 from kitty_website_private.admins a
   join auth.users u on u.id=a.user_id
   join auth.sessions s on s.user_id=u.id
   where a.user_id=auth.uid()
     and s.id=(auth.jwt()->>'session_id')::uuid
     and (u.banned_until is null or u.banned_until<now())
     and (s.not_after is null or s.not_after>now())
 );
$$;
revoke all on function kitty_website_private.is_admin() from public, anon;
grant execute on function kitty_website_private.is_admin() to authenticated;

create table public.kitty_website_notices (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 120),
  body text not null check (char_length(body) between 10 and 4000),
  category text not null default 'Studio note' check(category in ('Studio note','Development','Launch note','Community')),
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.kitty_website_notices enable row level security;
grant select on public.kitty_website_notices to anon, authenticated;
grant insert,update,delete on public.kitty_website_notices to authenticated;
create policy "Published website notices" on public.kitty_website_notices for select to anon,authenticated using (published=true and published_at<=now());
create policy "Website admins manage notices" on public.kitty_website_notices for all to authenticated using ((select kitty_website_private.is_admin())) with check ((select kitty_website_private.is_admin()));
create index kitty_website_notices_published_idx on public.kitty_website_notices(published_at desc) where published=true;

create table public.kitty_website_feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null check(char_length(name) between 2 and 100),
  email text not null check(char_length(email) between 3 and 254),
  message text not null check(char_length(message) between 10 and 5000),
  fingerprint text not null,
  created_at timestamptz not null default now()
);
alter table public.kitty_website_feedback enable row level security;
revoke all on public.kitty_website_feedback from anon, authenticated;
grant select on public.kitty_website_feedback to authenticated;
create policy "Only website admins read feedback" on public.kitty_website_feedback for select to authenticated using ((select kitty_website_private.is_admin()));
create index kitty_website_feedback_created_idx on public.kitty_website_feedback(created_at desc);
create index kitty_website_feedback_email_idx on public.kitty_website_feedback(email,created_at desc);
create index kitty_website_feedback_fingerprint_idx on public.kitty_website_feedback(fingerprint,created_at desc);

create function public.kitty_website_submit_feedback(p_name text,p_email text,p_message text,p_fingerprint text,p_gateway_token text) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare result_id uuid;
begin
  if not exists (
    select 1 from kitty_website_private.settings
    where key='feedback_gateway_hash'
      and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')
  ) then raise exception 'Unauthorized' using errcode='42501'; end if;
  if char_length(trim(p_name)) not between 2 and 100
    or char_length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    or char_length(trim(p_message)) not between 10 and 5000
    or p_fingerprint !~ '^[a-f0-9]{64}$'
  then raise exception 'Invalid submission' using errcode='22023'; end if;
  perform pg_catalog.pg_advisory_xact_lock(761209);
  if (select count(*) from public.kitty_website_feedback where created_at>now()-interval '1 hour' and (email=lower(trim(p_email)) or fingerprint=p_fingerprint))>=3
    or (select count(*) from public.kitty_website_feedback where created_at>now()-interval '24 hours')>=1000
  then raise exception 'Rate limit exceeded' using errcode='P0001'; end if;
  insert into public.kitty_website_feedback(name,email,message,fingerprint)
  values(trim(p_name),lower(trim(p_email)),trim(p_message),p_fingerprint) returning id into result_id;
  return result_id;
end;
$$;
revoke all on function public.kitty_website_submit_feedback(text,text,text,text,text) from public;
grant execute on function public.kitty_website_submit_feedback(text,text,text,text,text) to anon,authenticated;

