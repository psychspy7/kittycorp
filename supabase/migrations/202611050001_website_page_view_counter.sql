-- Persistent public website page-view counter.
-- The first 90 views are the existing baseline; only new verified page views
-- are added after this migration. Raw IP addresses and user agents are not stored.

create table if not exists public.kitty_website_page_view_events (
  event_id uuid primary key,
  visitor_fingerprint text not null
    check (visitor_fingerprint ~ '^[a-f0-9]{64}$'),
  page_path text not null
    check (
      char_length(page_path) between 1 and 300
      and left(page_path, 1) = '/'
      and position('?' in page_path) = 0
      and position('#' in page_path) = 0
    ),
  created_at timestamptz not null default now()
);

alter table public.kitty_website_page_view_events enable row level security;
revoke all on public.kitty_website_page_view_events from public, anon, authenticated;

create index if not exists kitty_website_page_view_events_fingerprint_created_idx
  on public.kitty_website_page_view_events(visitor_fingerprint, created_at desc);

create or replace function public.kitty_website_record_page_view(
  p_event_id uuid,
  p_path text,
  p_fingerprint text,
  p_gateway_token text
) returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  total_views bigint;
begin
  if p_event_id is null
    or p_fingerprint !~ '^[a-f0-9]{64}$'
    or p_path is null
    or char_length(p_path) not between 1 and 300
    or left(p_path, 1) <> '/'
    or position('?' in p_path) > 0
    or position('#' in p_path) > 0
  then
    raise exception 'Invalid page view' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from kitty_website_private.settings
    where key = 'feedback_gateway_hash'
      and value = encode(extensions.digest(p_gateway_token, 'sha256'), 'hex')
  ) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  -- Serialize writes so retries and rate limits cannot race.
  perform pg_catalog.pg_advisory_xact_lock(761211);

  -- Idempotency: a retried request with the same event id is counted once.
  if exists (
    select 1 from public.kitty_website_page_view_events
    where event_id = p_event_id
  ) then
    select 90 + count(*) into total_views
    from public.kitty_website_page_view_events;
    return total_views;
  end if;

  -- Conservative abuse guard: no more than 60 counted page views per
  -- fingerprint in ten minutes.
  if (
    select count(*)
    from public.kitty_website_page_view_events
    where visitor_fingerprint = p_fingerprint
      and created_at > now() - interval '10 minutes'
  ) >= 60 then
    select 90 + count(*) into total_views
    from public.kitty_website_page_view_events;
    return total_views;
  end if;

  insert into public.kitty_website_page_view_events (
    event_id, visitor_fingerprint, page_path
  ) values (
    p_event_id, p_fingerprint, p_path
  );

  select 90 + count(*) into total_views
  from public.kitty_website_page_view_events;

  return total_views;
end;
$$;

revoke all on function public.kitty_website_record_page_view(uuid, text, text, text)
  from public;
grant execute on function public.kitty_website_record_page_view(uuid, text, text, text)
  to anon, authenticated;

notify pgrst, 'reload schema';
