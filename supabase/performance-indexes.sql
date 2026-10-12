-- Verified additive migration: website_studio_foreign_key_indexes (11 Oct 2026).
-- Website Supabase only: mgkghnblbisubympudaa. No rows or RLS policies changed.
-- Existing feeds, slugs, inbox, rate-limit and outbox indexes are retained.
begin;
set local lock_timeout = '3s';
set local statement_timeout = '15s';
create index if not exists kitty_studio_challenges_user_idx
  on kitty_website_private.studio_login_challenges (user_id);
create index if not exists kitty_studio_challenges_session_idx
  on kitty_website_private.studio_login_challenges (password_session_id);
create index if not exists kitty_studio_sessions_user_idx
  on kitty_website_private.studio_sessions (user_id);
commit;
