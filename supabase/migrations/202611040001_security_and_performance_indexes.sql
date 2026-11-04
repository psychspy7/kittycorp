-- Migration: 202611040001_security_and_performance_indexes.sql
-- Description: Add covering indexes for unindexed foreign keys flagged by the Supabase database linter,
-- and consolidate permissive SELECT policies on public.kitty_website_notices.
--
-- Note: Do NOT execute on production without explicit administrative review and authorization.

-- 1. Covering indexes for unindexed foreign keys
CREATE INDEX IF NOT EXISTS communication_events_signup_id_idx
  ON kitty_website_private.communication_events(signup_id);

CREATE INDEX IF NOT EXISTS project_quotes_feedback_id_idx
  ON kitty_website_private.project_quotes(feedback_id);

CREATE INDEX IF NOT EXISTS reward_codes_quote_id_idx
  ON kitty_website_private.reward_codes(quote_id);

-- 2. Consolidate permissive policies on public.kitty_website_notices
-- Both anon and authenticated can read published notices where published_at <= now().
-- Admins can view all notices (drafts and published) for administration.
DROP POLICY IF EXISTS "Published website notices" ON public.kitty_website_notices;
DROP POLICY IF EXISTS "Website admins manage notices" ON public.kitty_website_notices;

CREATE POLICY "notices_select_policy"
  ON public.kitty_website_notices
  FOR SELECT
  TO anon, authenticated
  USING (
    ((published = true) AND (published_at <= clock_timestamp()))
    OR
    (auth.role() = 'authenticated' AND (SELECT kitty_website_private.is_admin()))
  );

CREATE POLICY "notices_admin_insert"
  ON public.kitty_website_notices
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT kitty_website_private.is_admin()));

CREATE POLICY "notices_admin_update"
  ON public.kitty_website_notices
  FOR UPDATE
  TO authenticated
  USING ((SELECT kitty_website_private.is_admin()))
  WITH CHECK ((SELECT kitty_website_private.is_admin()));

CREATE POLICY "notices_admin_delete"
  ON public.kitty_website_notices
  FOR DELETE
  TO authenticated
  USING ((SELECT kitty_website_private.is_admin()));

-- Reversible Rollback Directives:
-- DROP INDEX IF EXISTS kitty_website_private.communication_events_signup_id_idx;
-- DROP INDEX IF EXISTS kitty_website_private.project_quotes_feedback_id_idx;
-- DROP INDEX IF EXISTS kitty_website_private.reward_codes_quote_id_idx;
-- DROP POLICY IF EXISTS "notices_select_policy" ON public.kitty_website_notices;
-- DROP POLICY IF EXISTS "notices_admin_insert" ON public.kitty_website_notices;
-- DROP POLICY IF EXISTS "notices_admin_update" ON public.kitty_website_notices;
-- DROP POLICY IF EXISTS "notices_admin_delete" ON public.kitty_website_notices;
-- CREATE POLICY "Published website notices" ON public.kitty_website_notices FOR SELECT TO anon, authenticated USING (((published = true) AND (published_at <= now())));
-- CREATE POLICY "Website admins manage notices" ON public.kitty_website_notices FOR ALL TO authenticated USING ((SELECT kitty_website_private.is_admin()));
