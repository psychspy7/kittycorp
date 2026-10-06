-- One-time extension for an existing Kitty Corp Website database.
-- Adds website launches without changing existing Android app rows.
alter table public.kitty_website_launches
  add column if not exists launch_type text not null default 'app',
  add column if not exists website_url text,
  add column if not exists screenshot_path text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid='public.kitty_website_launches'::regclass
      and conname='kitty_website_launches_launch_type_check'
  ) then
    alter table public.kitty_website_launches
      add constraint kitty_website_launches_launch_type_check
      check (launch_type in ('app','website'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid='public.kitty_website_launches'::regclass
      and conname='kitty_website_launches_website_url_check'
  ) then
    alter table public.kitty_website_launches
      add constraint kitty_website_launches_website_url_check
      check (website_url is null or website_url ~ '^https://[^[:space:]]+$');
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid='public.kitty_website_launches'::regclass
      and conname='kitty_website_launches_screenshot_path_check'
  ) then
    alter table public.kitty_website_launches
      add constraint kitty_website_launches_screenshot_path_check
      check (screenshot_path is null or screenshot_path ~ '^screenshots/[0-9a-f-]{36}\.webp$');
  end if;
end $$;

alter table public.kitty_website_launches drop constraint if exists published_launch_has_apk;
alter table public.kitty_website_launches drop constraint if exists published_launch_requirements;
alter table public.kitty_website_launches
  add constraint published_launch_requirements check (
    not published or (
      published_at is not null and (
        (launch_type='app' and apk_path is not null and apk_sha256 is not null and apk_bytes is not null)
        or
        (launch_type='website' and website_url is not null and screenshot_path is not null)
      )
    )
  );

drop policy if exists "Website admins upload public media" on storage.objects;
create policy "Website admins upload public media" on storage.objects
for insert to authenticated
with check (
  bucket_id='kitty-website-media'
  and name ~ '^(icons|portraits|screenshots)/[0-9a-f-]{36}\.webp$'
  and (select kitty_website_private.is_admin())
);
