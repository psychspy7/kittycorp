-- Add public copy records for the core website pages.
-- This is a one-time additive migration for the existing Kitty Corp Website database.
create table public.kitty_website_pages (
  slug text primary key check (slug in ('home','services','company','contact')),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.kitty_website_pages enable row level security;
revoke all on public.kitty_website_pages from public, anon, authenticated;
grant select on public.kitty_website_pages to anon, authenticated;
grant insert, update on public.kitty_website_pages to authenticated;

create policy "Public reads published page content"
  on public.kitty_website_pages for select to anon using (true);
create policy "Studio reads page content"
  on public.kitty_website_pages for select to authenticated
  using ((select kitty_website_private.is_admin()));
create policy "Studio creates page content"
  on public.kitty_website_pages for insert to authenticated
  with check ((select kitty_website_private.is_admin()));
create policy "Studio edits page content"
  on public.kitty_website_pages for update to authenticated
  using ((select kitty_website_private.is_admin()))
  with check ((select kitty_website_private.is_admin()));

notify pgrst, 'reload schema';
