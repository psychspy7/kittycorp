-- Keep the pre-login/contact gateway contract while removing privileged public
-- function bodies. Public wrappers run as callers; narrow private helpers retain
-- owner privileges only after checking the server gateway's SHA-256 hash.
-- Anonymous callers intentionally have no auth.uid() before login/contact;
-- possession of the server-only gateway token authorizes these two operations.

grant usage on schema kitty_website_private to anon,authenticated;

create or replace function kitty_website_private.kitty_website_login_attempt(p_fingerprint text,p_gateway_token text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex'))
 then raise exception 'Unauthorized' using errcode='42501'; end if;
 if p_fingerprint !~ '^[a-f0-9]{64}$' then raise exception 'Invalid fingerprint'; end if;
 perform pg_catalog.pg_advisory_xact_lock(761210);
 delete from kitty_website_private.login_attempts where created_at < now()-interval '1 hour';
 if (select count(*) from kitty_website_private.login_attempts where fingerprint=p_fingerprint and created_at>now()-interval '15 minutes')>=5
 or (select count(*) from kitty_website_private.login_attempts)>=30
 then raise exception 'Rate limit exceeded'; end if;
 insert into kitty_website_private.login_attempts(fingerprint) values(p_fingerprint);
end;$$;
revoke all on function kitty_website_private.kitty_website_login_attempt(text,text) from public;
grant execute on function kitty_website_private.kitty_website_login_attempt(text,text) to anon,authenticated;

create or replace function public.kitty_website_login_attempt(p_fingerprint text,p_gateway_token text)
returns void language sql security invoker set search_path='' as $$
select kitty_website_private.kitty_website_login_attempt(p_fingerprint,p_gateway_token);
$$;
revoke all on function public.kitty_website_login_attempt(text,text) from public;
grant execute on function public.kitty_website_login_attempt(text,text) to anon,authenticated;

create or replace function kitty_website_private.kitty_website_submit_feedback(p_name text,p_email text,p_message text,p_fingerprint text,p_gateway_token text)
returns uuid language plpgsql security definer set search_path='' as $$
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
revoke all on function kitty_website_private.kitty_website_submit_feedback(text,text,text,text,text) from public;
grant execute on function kitty_website_private.kitty_website_submit_feedback(text,text,text,text,text) to anon,authenticated;

create or replace function public.kitty_website_submit_feedback(p_name text,p_email text,p_message text,p_fingerprint text,p_gateway_token text)
returns uuid language sql security invoker set search_path='' as $$
select kitty_website_private.kitty_website_submit_feedback(p_name,p_email,p_message,p_fingerprint,p_gateway_token);
$$;
revoke all on function public.kitty_website_submit_feedback(text,text,text,text,text) from public;
grant execute on function public.kitty_website_submit_feedback(text,text,text,text,text) to anon,authenticated;

-- Schema USAGE is needed by invoker wrappers; it grants no direct table access.
-- Restrictive false policies remain a deny even if a permissive policy is added
-- accidentally later. Definer owners retain their normal owner/RLS exemption.
revoke all on kitty_website_private.admins,kitty_website_private.settings,kitty_website_private.login_attempts,
  kitty_website_private.assistant_requests,kitty_website_private.studio_login_challenges,kitty_website_private.studio_sessions
  from public,anon,authenticated;

drop policy if exists "No direct private access" on kitty_website_private.admins;
create policy "No direct private access" on kitty_website_private.admins as restrictive for all to anon,authenticated using(false) with check(false);
drop policy if exists "No direct private access" on kitty_website_private.settings;
create policy "No direct private access" on kitty_website_private.settings as restrictive for all to anon,authenticated using(false) with check(false);
drop policy if exists "No direct private access" on kitty_website_private.login_attempts;
create policy "No direct private access" on kitty_website_private.login_attempts as restrictive for all to anon,authenticated using(false) with check(false);
drop policy if exists "No direct private access" on kitty_website_private.assistant_requests;
create policy "No direct private access" on kitty_website_private.assistant_requests as restrictive for all to anon,authenticated using(false) with check(false);
drop policy if exists "No direct private access" on kitty_website_private.studio_login_challenges;
create policy "No direct private access" on kitty_website_private.studio_login_challenges as restrictive for all to anon,authenticated using(false) with check(false);
drop policy if exists "No direct private access" on kitty_website_private.studio_sessions;
create policy "No direct private access" on kitty_website_private.studio_sessions as restrictive for all to anon,authenticated using(false) with check(false);

notify pgrst,'reload schema';
