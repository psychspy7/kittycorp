-- Remove artificial 10,000 floor seed; reflect 100% authentic cumulative visitor sessions and active presence.

create or replace function public.kitty_website_record_telemetry(
  p_session_id text,
  p_fingerprint text,
  p_path text,
  p_heartbeat boolean,
  p_gateway_token text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  active_count bigint;
  total_count bigint;
begin
  if p_session_id is null
    or char_length(p_session_id) not between 1 and 128
    or p_fingerprint is null
    or p_fingerprint !~ '^[a-f0-9]{64}$'
    or p_path is null
    or char_length(p_path) not between 1 and 300
    or left(p_path, 1) <> '/'
    or position('?' in p_path) > 0
    or position('#' in p_path) > 0
  then
    raise exception 'Invalid telemetry payload' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from kitty_website_private.settings
    where key = 'feedback_gateway_hash'
      and value = encode(extensions.digest(p_gateway_token, 'sha256'), 'hex')
  ) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(761219);

  insert into public.kitty_website_active_presence (
    session_id, visitor_fingerprint, last_seen
  ) values (
    p_session_id, p_fingerprint, now()
  )
  on conflict (session_id) do update set
    visitor_fingerprint = excluded.visitor_fingerprint,
    last_seen = now();

  if coalesce(p_heartbeat, false) is false then
    insert into public.kitty_website_visitor_sessions (
      visitor_fingerprint, session_id, page_path, created_at
    ) values (
      p_fingerprint, p_session_id, p_path, now()
    )
    on conflict (session_id) do nothing;

    insert into public.kitty_website_page_view_events (
      event_id, visitor_fingerprint, page_path, created_at
    ) values (
      gen_random_uuid(), p_fingerprint, p_path, now()
    );
  end if;

  -- Active presence: distinct fingerprints seen in past 60s
  select count(distinct visitor_fingerprint)
  into active_count
  from public.kitty_website_active_presence
  where last_seen > now() - interval '60 seconds';

  -- Authentic cumulative total: exactly count unique sessions without artificial offsets
  select count(*)
  into total_count
  from public.kitty_website_visitor_sessions;

  return jsonb_build_object(
    'active', active_count,
    'total', total_count
  );
end;
$$;

create or replace function public.kitty_website_get_telemetry(
  p_gateway_token text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  active_count bigint;
  total_count bigint;
begin
  if not exists (
    select 1
    from kitty_website_private.settings
    where key = 'feedback_gateway_hash'
      and value = encode(extensions.digest(p_gateway_token, 'sha256'), 'hex')
  ) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  select count(distinct visitor_fingerprint)
  into active_count
  from public.kitty_website_active_presence
  where last_seen > now() - interval '60 seconds';

  -- Authentic cumulative total: exactly count unique sessions without artificial offsets
  select count(*)
  into total_count
  from public.kitty_website_visitor_sessions;

  return jsonb_build_object(
    'active', active_count,
    'total', total_count
  );
end;
$$;

grant execute on function public.kitty_website_record_telemetry(text, text, text, boolean, text)
  to anon, authenticated;
grant execute on function public.kitty_website_get_telemetry(text)
  to anon, authenticated;

notify pgrst, 'reload schema';
