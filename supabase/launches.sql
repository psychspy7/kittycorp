-- Website launches and private release files. Apply once with the Supabase migration tool.
create table public.kitty_website_launches (
  id uuid primary key default gen_random_uuid(),
  launch_type text not null default 'app' check (launch_type in ('app','website')),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 60),
  name text not null check (char_length(name) between 2 and 80),
  tagline text not null check (char_length(tagline) between 3 and 140),
  description text not null check (char_length(description) between 10 and 2000),
  release_notes text not null default '' check (char_length(release_notes) <= 4000),
  version text not null check (char_length(version) between 1 and 40),
  android text not null default 'Android 7.0+' check (char_length(android) between 3 and 60),
  website_url text check (website_url is null or website_url ~ '^https://[^[:space:]]+$'),
  screenshot_path text check (screenshot_path is null or screenshot_path ~ '^screenshots/[0-9a-f-]{36}\.webp$'),
  apk_path text check (apk_path = '/downloads/SecretChat-1.5.0-build6.apk' or apk_path ~ '^releases/[0-9a-f-]{36}/[0-9a-f-]{36}\.apk$'),
  apk_sha256 text check (apk_sha256 ~ '^[a-f0-9]{64}$'),
  apk_bytes bigint check (apk_bytes between 1 and 52428800),
  published boolean not null default false,
  show_popup boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_launch_requirements check (
    not published or (
      published_at is not null and (
        (launch_type='app' and apk_path is not null and apk_sha256 is not null and apk_bytes is not null)
        or
        (launch_type='website' and website_url is not null and screenshot_path is not null)
      )
    )
  )
);
alter table public.kitty_website_launches enable row level security;
grant select on public.kitty_website_launches to anon, authenticated;
grant insert, update, delete on public.kitty_website_launches to authenticated;
create policy "Visitors see published launches" on public.kitty_website_launches for select to anon using (published and published_at <= now());
create policy "Members see published launches and admins see drafts" on public.kitty_website_launches for select to authenticated using ((published and published_at <= now()) or (select kitty_website_private.is_admin()));
create policy "Website admins insert launches" on public.kitty_website_launches for insert to authenticated with check ((select kitty_website_private.is_admin()));
create policy "Website admins update launches" on public.kitty_website_launches for update to authenticated using ((select kitty_website_private.is_admin())) with check ((select kitty_website_private.is_admin()));
create policy "Website admins delete launches" on public.kitty_website_launches for delete to authenticated using ((select kitty_website_private.is_admin()));
create index kitty_website_launches_published_idx on public.kitty_website_launches (published_at desc) where published;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('kitty-website-releases', 'kitty-website-releases', false, 52428800, array['application/vnd.android.package-archive']);
create policy "Visitors download published website APKs" on storage.objects for select to anon using (
  bucket_id = 'kitty-website-releases' and exists (select 1 from public.kitty_website_launches l where l.apk_path = storage.objects.name and l.published and l.published_at <= now())
);
create policy "Members download published APKs and admins access drafts" on storage.objects for select to authenticated using (
  bucket_id = 'kitty-website-releases' and ((select kitty_website_private.is_admin()) or exists (select 1 from public.kitty_website_launches l where l.apk_path = storage.objects.name and l.published and l.published_at <= now()))
);
create policy "Website admins upload release APKs" on storage.objects for insert to authenticated with check (
  bucket_id = 'kitty-website-releases' and name ~ '^releases/[0-9a-f-]{36}/[0-9a-f-]{36}\.apk$' and (select kitty_website_private.is_admin())
);
create policy "Website admins remove release APKs" on storage.objects for delete to authenticated using (
  bucket_id = 'kitty-website-releases' and (select kitty_website_private.is_admin())
);
