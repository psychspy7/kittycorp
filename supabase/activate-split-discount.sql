-- Run only after the matching website deployment is READY.
-- Existing quotes retain their stored 120/100 basis points.
alter table kitty_website_private.project_quotes alter column split_discount_bps set default 100;
