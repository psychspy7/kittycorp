-- Extension to the installed Studio security schema. Apply once after the
-- provider is configured. No credentials are included in this source snapshot.
create or replace function kitty_website_private.studio_google_grant(
 p_google_email text,p_google_subject text,p_gateway_token text
) returns void language plpgsql security definer set search_path='' as $$
declare v_email text; v_subject text; v_session uuid; v_expires timestamptz;
begin
 if not kitty_website_private.studio_gateway_valid(p_gateway_token)
  or auth.uid() is null
  or not exists(select 1 from kitty_website_private.admins where user_id=auth.uid())
  or not exists(select 1 from jsonb_array_elements(coalesce(auth.jwt()->'amr','[]'::jsonb)) m
   where m->>'method'='oauth' and to_timestamp((m->>'timestamp')::double precision)>now()-interval '5 minutes')
  then raise exception 'Unauthorized' using errcode='42501'; end if;
 select value into v_email from kitty_website_private.settings where key='studio_google_email';
 select value into v_subject from kitty_website_private.settings where key='studio_google_subject';
 if v_email is null or p_google_email is null or lower(p_google_email)<>lower(v_email)
  or p_google_subject is null or p_google_subject !~ '^[a-zA-Z0-9._-]{1,255}$'
  or not exists(select 1 from auth.users u where u.id=auth.uid() and lower(u.email)=lower(v_email)
   and u.email_confirmed_at is not null and (u.banned_until is null or u.banned_until<now()))
  or not exists(select 1 from auth.identities i where i.user_id=auth.uid()
   and i.provider='google' and i.provider_id=p_google_subject)
  then raise exception 'Unauthorized' using errcode='42501'; end if;
 -- The callback verifies Google's current userinfo response before this call.
 -- Keep the immutable Google subject pinned to the owner's existing account.
 perform pg_catalog.pg_advisory_xact_lock(761212);
 insert into kitty_website_private.settings(key,value) values('studio_google_subject',p_google_subject) on conflict(key) do nothing;
 select value into v_subject from kitty_website_private.settings where key='studio_google_subject';
 if v_subject<>p_google_subject then raise exception 'Unauthorized' using errcode='42501'; end if;
 select s.id into v_session from auth.sessions s where s.id::text=auth.jwt()->>'session_id'
  and s.user_id=auth.uid() and (s.not_after is null or s.not_after>now());
 if v_session is null then raise exception 'Unauthorized' using errcode='42501'; end if;
 v_expires:=least(now()+interval '1 hour',to_timestamp((auth.jwt()->>'exp')::double precision));
 if v_expires<=now() then raise exception 'Unauthorized' using errcode='42501'; end if;
 insert into kitty_website_private.studio_sessions(session_id,user_id,google_subject,expires_at)
  values(v_session,auth.uid(),p_google_subject,v_expires)
  on conflict(session_id) do update set verified_at=now(),expires_at=excluded.expires_at;
end;$$;
revoke all on function kitty_website_private.studio_google_grant(text,text,text) from public,anon;
grant execute on function kitty_website_private.studio_google_grant(text,text,text) to authenticated;
create or replace function public.kitty_website_studio_google_grant(p_google_email text,p_google_subject text,p_gateway_token text)
returns void language sql security invoker set search_path='' as $$select kitty_website_private.studio_google_grant(p_google_email,p_google_subject,p_gateway_token);$$;
revoke all on function public.kitty_website_studio_google_grant(text,text,text) from public,anon;
grant execute on function public.kitty_website_studio_google_grant(text,text,text) to authenticated;
update kitty_website_private.settings set value='true' where key='studio_google_enforced';
-- Retire the former password-bound entry points after deploying Google-only code.
revoke all on function public.kitty_website_studio_begin(uuid,text,text,text,text) from public,anon,authenticated;
revoke all on function kitty_website_private.studio_begin(uuid,text,text,text,text) from public,anon,authenticated;
revoke all on function public.kitty_website_studio_complete(uuid,text,text,text,text,text,text) from public,anon,authenticated;
revoke all on function kitty_website_private.studio_complete(uuid,text,text,text,text,text,text) from public,anon,authenticated;
notify pgrst,'reload schema';
