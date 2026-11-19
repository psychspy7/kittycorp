-- Fix cumulative website visit counting.
-- Count one visit per browser session ID, not one visit per fingerprint per 24 hours.
-- Heartbeats and repeated route telemetry in the same session do not increase total visits.

-- Clean up any historical duplicate session IDs before enforcing uniqueness.
delete from public.kitty_website_visitor_sessions newer
using public.kitty_website_visitor_sessions older
where newer.session_id = older.session_id
  and newer.id > older.id;

create unique index if not exists kitty_website_visitor_sessions_session_id_uidx
  on public.kitty_website_visitor_sessions(session_id);

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

  -- Count a new browser session once. Repeated visits by the same person
  -- in separate sessions count separately; heartbeat/route updates in the
  -- same session never inflate the cumulative visit count.
  if coalesce(p_heartbeat, false) is false then
    insert into public.kitty_website_visitor_sessions (
      visitor_fingerprint, session_id, page_path, created_at
    ) values (
      p_fingerprint, p_session_id, p_path, now()
    )
    on conflict (session_id) do nothing;

    -- Keep page-view event tracking separate from the cumulative visit count.
    insert into public.kitty_website_page_view_events (
      event_id, visitor_fingerprint, page_path, created_at
    ) values (
      gen_random_uuid(), p_fingerprint, p_path, now()
    );
  end if;

  select count(distinct visitor_fingerprint)
  into active_count
  from public.kitty_website_active_presence
  where last_seen > now() - interval '60 seconds';

  select 10000 + count(*)
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

notify pgrst, 'reload schema';
