-- Apply once to the website project. Existing Studio authorization is reused.
create table public.kitty_website_journal (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 90),
  title text not null check (char_length(title) between 3 and 140),
  summary text not null check (char_length(summary) between 10 and 500),
  body text not null check (char_length(body) between 10 and 20000),
  category text not null check (category in ('AI','Robotics','Engineering','Research','Company')),
  kind text not null check (kind in ('article','update')),
  status text not null default 'In progress' check (char_length(status) between 2 and 40),
  cover_url text not null default '' check (cover_url = '' or (cover_url ~ '^https://[^[:space:]]+$' and char_length(cover_url) <= 1000)),
  cover_alt text not null default '' check (char_length(cover_alt) <= 200),
  entry_date date not null default current_date,
  published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (cover_url = '' or char_length(cover_alt) > 0)
);
alter table public.kitty_website_journal enable row level security;
revoke all on public.kitty_website_journal from anon, authenticated;
grant select on public.kitty_website_journal to anon, authenticated;
grant insert, update, delete on public.kitty_website_journal to authenticated;
create policy "Visitors read published journal" on public.kitty_website_journal for select to anon using (published and entry_date <= current_date);
create policy "Members read published journal and admins read drafts" on public.kitty_website_journal for select to authenticated using ((published and entry_date <= current_date) or (select kitty_website_private.is_admin()));
create policy "Website admins insert journal" on public.kitty_website_journal for insert to authenticated with check ((select kitty_website_private.is_admin()));
create policy "Website admins update journal" on public.kitty_website_journal for update to authenticated using ((select kitty_website_private.is_admin())) with check ((select kitty_website_private.is_admin()));
create policy "Website admins delete journal" on public.kitty_website_journal for delete to authenticated using ((select kitty_website_private.is_admin()));
create index kitty_website_journal_public_idx on public.kitty_website_journal (entry_date desc, created_at desc) where published;

create table public.kitty_website_early_access (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  interests text[] not null default array['KITTY CORP updates'] check (interests <@ array['KITTY AI','KITTY Sentinel','LISA AI','KITTY CORP updates'] and cardinality(interests) between 1 and 4),
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);
alter table public.kitty_website_early_access enable row level security;
revoke all on public.kitty_website_early_access from anon, authenticated;
grant select, delete on public.kitty_website_early_access to authenticated;
create policy "Only website admins read early access" on public.kitty_website_early_access for select to authenticated using ((select kitty_website_private.is_admin()));
create policy "Only website admins delete early access" on public.kitty_website_early_access for delete to authenticated using ((select kitty_website_private.is_admin()));
create index kitty_website_early_access_fingerprint_idx on public.kitty_website_early_access (fingerprint, created_at desc);
create index kitty_website_early_access_created_idx on public.kitty_website_early_access (created_at desc);

-- Anonymous signups are authorized by the existing server-only gateway secret,
-- not by user-editable JWT metadata. The elevated insert lives in a private schema.
create function kitty_website_private.submit_early_access(p_email text, p_interests text[], p_fingerprint text, p_gateway_token text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then
    raise exception 'Unauthorized' using errcode='42501';
  end if;
  if char_length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' or p_fingerprint !~ '^[a-f0-9]{64}$'
    or p_interests is null or cardinality(p_interests) not between 1 and 4 or not (p_interests <@ array['KITTY AI','KITTY Sentinel','LISA AI','KITTY CORP updates']) then
    raise exception 'Invalid submission' using errcode='22023';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(761210);
  if (select count(*) from public.kitty_website_early_access where created_at > now()-interval '1 hour' and fingerprint=p_fingerprint)>=3
    or (select count(*) from public.kitty_website_early_access where created_at > now()-interval '24 hours')>=1000 then
    raise exception 'Rate limit exceeded' using errcode='P0001';
  end if;
  insert into public.kitty_website_early_access(email,interests,fingerprint) values(lower(trim(p_email)),p_interests,p_fingerprint) on conflict(email) do nothing;
  return true;
end;
$$;
revoke all on function kitty_website_private.submit_early_access(text,text[],text,text) from public;
grant execute on function kitty_website_private.submit_early_access(text,text[],text,text) to anon;
grant usage on schema kitty_website_private to anon;
create function public.kitty_website_join_early_access(p_email text,p_interests text[],p_fingerprint text,p_gateway_token text)
returns boolean language sql security invoker set search_path = '' as $$
  select kitty_website_private.submit_early_access(p_email,p_interests,p_fingerprint,p_gateway_token);
$$;
revoke all on function public.kitty_website_join_early_access(text,text[],text,text) from public;
grant execute on function public.kitty_website_join_early_access(text,text[],text,text) to anon;
