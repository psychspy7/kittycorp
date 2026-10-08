-- One-time extension for the dedicated Kitty Corp Website project.
-- No sample reviews are inserted. Studio supplies real attributed quotes.
create table public.kitty_website_testimonials (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null check (char_length(btrim(reviewer_name)) between 2 and 100),
  reviewer_role text not null default '' check (char_length(reviewer_role) <= 120),
  company text not null default '' check (char_length(company) <= 160),
  quote text not null check (char_length(btrim(quote)) between 20 and 1500),
  source_url text not null default '' check (source_url = '' or (char_length(source_url) <= 1000 and source_url ~ '^https://[^/@[:space:]]+([/?#]|$)')),
  permission_confirmed boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0 check (sort_order between 0 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint kitty_testimonials_publish_permission check (not published or permission_confirmed)
);
alter table public.kitty_website_testimonials enable row level security;
revoke all on public.kitty_website_testimonials from anon, authenticated;
grant select on public.kitty_website_testimonials to anon;
grant select, insert, update, delete on public.kitty_website_testimonials to authenticated;
grant all on public.kitty_website_testimonials to service_role;
create policy "Public approved website reviews" on public.kitty_website_testimonials
  for select to anon using (published and permission_confirmed);
create policy "Approved reviews or website admin" on public.kitty_website_testimonials
  for select to authenticated using ((published and permission_confirmed) or (select kitty_website_private.is_admin()));
create policy "Website admins add reviews" on public.kitty_website_testimonials
  for insert to authenticated with check ((select kitty_website_private.is_admin()));
create policy "Website admins edit reviews" on public.kitty_website_testimonials
  for update to authenticated using ((select kitty_website_private.is_admin())) with check ((select kitty_website_private.is_admin()));
create policy "Website admins remove reviews" on public.kitty_website_testimonials
  for delete to authenticated using ((select kitty_website_private.is_admin()));
create index kitty_testimonials_public_order on public.kitty_website_testimonials (sort_order, created_at desc)
  where published and permission_confirmed;
comment on table public.kitty_website_testimonials is 'Attributed genuine reviews. Only published permission-confirmed rows are public; live website admins manage drafts.';
