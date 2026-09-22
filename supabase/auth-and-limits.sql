create function public.kitty_website_admin_status() returns boolean language sql stable security invoker set search_path='' as $$select kitty_website_private.is_admin();$$;
revoke all on function public.kitty_website_admin_status() from public,anon;
grant execute on function public.kitty_website_admin_status() to authenticated;
create table kitty_website_private.login_attempts (
 id bigint generated always as identity primary key,
 fingerprint text not null,
 created_at timestamptz not null default now()
);
alter table kitty_website_private.login_attempts enable row level security;
create index kitty_website_login_attempts_time_idx on kitty_website_private.login_attempts(created_at);
create function public.kitty_website_login_attempt(p_fingerprint text,p_gateway_token text) returns void
language plpgsql security definer set search_path='' as $$
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
revoke all on function public.kitty_website_login_attempt(text,text) from public;
grant execute on function public.kitty_website_login_attempt(text,text) to anon,authenticated;
