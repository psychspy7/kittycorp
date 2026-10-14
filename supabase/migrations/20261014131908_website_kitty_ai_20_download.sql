-- Website only: permits the verified bundled KITTY AI 2.0 APK.
-- Older URLs, uploaded releases, RLS and customer records remain unchanged.
alter table public.kitty_website_launches drop constraint kitty_website_launches_apk_path_check;
alter table public.kitty_website_launches add constraint kitty_website_launches_apk_path_check check (
  apk_path in ('/downloads/SecretChat-1.5.0-build6.apk', '/downloads/kitty-ai-1.8.0.apk', '/downloads/kitty-ai-2.0.0.apk')
  or apk_path ~ '^releases/[0-9a-f-]{36}/[0-9a-f-]{36}[.]apk$'
);
