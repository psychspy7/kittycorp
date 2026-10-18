-- Optional ratings supplied by real reviewers; existing unscored quotes stay unscored.
alter table public.kitty_website_testimonials add column if not exists rating smallint check(rating between 1 and 5);
