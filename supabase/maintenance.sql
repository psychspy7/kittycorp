-- Emergency maintenance state. Access-code hashes are provisioned separately.
-- No access code, gateway token or other credential belongs in this file.
create schema if not exists kitty_maintenance_private;
revoke all on schema kitty_maintenance_private from public;
grant usage on schema kitty_maintenance_private to anon, authenticated;
create table kitty_maintenance_private.state (
  id boolean primary key default true check (id),
  enabled boolean not null default false,
  revision bigint not null default 0 check (revision >= 0),
  updated_at timestamptz not null default now()
);
create table kitty_maintenance_private.access (
  id boolean primary key default true check (id), code_hash text not null
);
create table kitty_maintenance_private.attempts (
  id bigint generated always as identity primary key,
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);
create index kitty_maintenance_attempts_time_idx on kitty_maintenance_private.attempts(created_at);
create table kitty_maintenance_private.audit (
  id bigint generated always as identity primary key,
  enabled boolean not null,
  source text not null check (source in ('emergency', 'studio')),
  created_at timestamptz not null default now()
);
alter table kitty_maintenance_private.state enable row level security;
alter table kitty_maintenance_private.access enable row level security;
alter table kitty_maintenance_private.attempts enable row level security;
alter table kitty_maintenance_private.audit enable row level security;
revoke all on all tables in schema kitty_maintenance_private from public, anon, authenticated;
revoke all on all sequences in schema kitty_maintenance_private from public, anon, authenticated;
insert into kitty_maintenance_private.state(id) values(true);

create function kitty_maintenance_private.status() returns jsonb
language sql stable security definer set search_path='' as $$
  select jsonb_build_object('enabled',enabled,'revision',revision,'updated_at',updated_at)
  from kitty_maintenance_private.state where id=true;
$$;
revoke all on function kitty_maintenance_private.status() from public;
grant execute on function kitty_maintenance_private.status() to anon, authenticated;

create function kitty_maintenance_private.set_state(p_enabled boolean,p_revision bigint,p_source text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare current_state kitty_maintenance_private.state;
begin
  select * into current_state from kitty_maintenance_private.state where id=true for update;
  if p_enabled is null or p_revision is null or p_revision<0 then
    return jsonb_build_object('error','Invalid site control request.','status',400);
  end if;
  if p_revision is distinct from current_state.revision then
    return jsonb_build_object('error','The site status changed. Review it and try again.','status',409,'state',kitty_maintenance_private.status());
  end if;
  if p_enabled is distinct from current_state.enabled then
    update kitty_maintenance_private.state set enabled=p_enabled,revision=revision+1,updated_at=now() where id=true;
    insert into kitty_maintenance_private.audit(enabled,source) values(p_enabled,p_source);
  end if;
  return jsonb_build_object('state',kitty_maintenance_private.status());
end;
$$;
revoke all on function kitty_maintenance_private.set_state(boolean,bigint,text) from public,anon,authenticated;

create function kitty_maintenance_private.emergency_control(p_code text,p_enabled boolean,p_revision bigint,p_fingerprint text,p_gateway_token text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare stored_hash text;
begin
  if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then
    return jsonb_build_object('error','This request could not be verified.','status',403);
  end if;
  if p_code is null or char_length(p_code) not between 1 and 72 or p_fingerprint is null or p_fingerprint !~ '^[a-f0-9]{64}$' then
    return jsonb_build_object('error','Invalid access request.','status',400);
  end if;
  perform pg_catalog.pg_advisory_xact_lock(897637);
  delete from kitty_maintenance_private.attempts where created_at<now()-interval '1 hour';
  if (select count(*) from kitty_maintenance_private.attempts where fingerprint=p_fingerprint and created_at>now()-interval '15 minutes')>=5
    or (select count(*) from kitty_maintenance_private.attempts)>=100 then
    return jsonb_build_object('error','Too many attempts. Try again in 15 minutes or use Studio.','status',429);
  end if;
  select code_hash into stored_hash from kitty_maintenance_private.access where id=true;
  if stored_hash is null then
    return jsonb_build_object('error','Emergency access is not configured. Use Studio.','status',503);
  end if;
  if extensions.crypt(p_code,stored_hash) is distinct from stored_hash then
    insert into kitty_maintenance_private.attempts(fingerprint) values(p_fingerprint);
    return jsonb_build_object('error','Incorrect access code.','status',401);
  end if;
  if p_enabled is null then
    return jsonb_build_object('state',kitty_maintenance_private.status());
  end if;
  return kitty_maintenance_private.set_state(p_enabled,p_revision,'emergency');
end;
$$;
revoke all on function kitty_maintenance_private.emergency_control(text,boolean,bigint,text,text) from public;
grant execute on function kitty_maintenance_private.emergency_control(text,boolean,bigint,text,text) to anon, authenticated;

create function kitty_maintenance_private.admin_set(p_enabled boolean,p_revision bigint) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
  if not coalesce(kitty_website_private.is_admin(),false) then
    return jsonb_build_object('error','Please sign in to Studio.','status',403);
  end if;
  return kitty_maintenance_private.set_state(p_enabled,p_revision,'studio');
end;
$$;
revoke all on function kitty_maintenance_private.admin_set(boolean,bigint) from public,anon;
grant execute on function kitty_maintenance_private.admin_set(boolean,bigint) to authenticated;

-- Exposed wrappers remain SECURITY INVOKER; privileged helpers live privately.
create function public.kitty_website_maintenance_status() returns jsonb
language sql stable security invoker set search_path='' as $$select kitty_maintenance_private.status();$$;
revoke all on function public.kitty_website_maintenance_status() from public;
grant execute on function public.kitty_website_maintenance_status() to anon, authenticated;

create function public.kitty_website_emergency_control(p_code text,p_enabled boolean,p_revision bigint,p_fingerprint text,p_gateway_token text) returns jsonb
language sql security invoker set search_path='' as $$
  select kitty_maintenance_private.emergency_control(p_code,p_enabled,p_revision,p_fingerprint,p_gateway_token);
$$;
revoke all on function public.kitty_website_emergency_control(text,boolean,bigint,text,text) from public;
grant execute on function public.kitty_website_emergency_control(text,boolean,bigint,text,text) to anon, authenticated;

create function public.kitty_website_admin_maintenance(p_enabled boolean,p_revision bigint) returns jsonb
language sql security invoker set search_path='' as $$select kitty_maintenance_private.admin_set(p_enabled,p_revision);$$;
revoke all on function public.kitty_website_admin_maintenance(boolean,bigint) from public,anon;
grant execute on function public.kitty_website_admin_maintenance(boolean,bigint) to authenticated;
notify pgrst, 'reload schema';

create policy "No direct maintenance state access" on kitty_maintenance_private.state for all to anon,authenticated using(false) with check(false);
create policy "No direct emergency secret access" on kitty_maintenance_private.access for all to anon,authenticated using(false) with check(false);
create policy "No direct emergency attempt access" on kitty_maintenance_private.attempts for all to anon,authenticated using(false) with check(false);
create policy "No direct maintenance audit access" on kitty_maintenance_private.audit for all to anon,authenticated using(false) with check(false);
