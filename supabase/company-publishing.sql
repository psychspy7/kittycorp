-- Website-only content. Reuses the existing live Studio administrator check.
alter table public.kitty_website_launches add column icon_path text check (icon_path is null or icon_path ~ '^icons/[0-9a-f-]{36}\.webp$');
create table public.kitty_website_products (
  slug text primary key check (slug in ('kitty-ai','sentinel','lisa-ai')),
  name text not null check (char_length(name) between 2 and 80),
  label text not null check (char_length(label) between 2 and 100),
  status text not null check (char_length(status) between 2 and 60),
  description text not null check (char_length(description) between 10 and 1000),
  intro text not null check (char_length(intro) between 10 and 2000),
  category text not null check (category in ('AI','Robotics','Engineering','Research','Company')),
  media text not null check (char_length(media) between 3 and 120),
  principles jsonb not null check (jsonb_typeof(principles)='array' and jsonb_array_length(principles)=3),
  icon_path text check (icon_path is null or icon_path ~ '^icons/[0-9a-f-]{36}\.webp$'),
  sort_order integer not null default 0 check (sort_order between 0 and 1000),
  published boolean not null default false,
  updated_at timestamptz not null default now()
);
create table public.kitty_website_team (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  role text not null check (char_length(role) between 2 and 100),
  bio text not null default '' check (char_length(bio)<=1200),
  photo_path text check (photo_path is null or photo_path ~ '^portraits/[0-9a-f-]{36}\.webp$'),
  links jsonb not null default '{}' check (jsonb_typeof(links)='object'),
  sort_order integer not null default 0 check (sort_order between 0 and 1000),
  published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.kitty_website_company (
  id text primary key check (id='company'),
  socials jsonb not null default '{}' check (jsonb_typeof(socials)='object'),
  team_heading text not null check (char_length(team_heading) between 3 and 140),
  team_intro text not null check (char_length(team_intro) between 10 and 1000),
  team_body text not null check (char_length(team_body) between 10 and 2000),
  updated_at timestamptz not null default now()
);
alter table public.kitty_website_products enable row level security;
alter table public.kitty_website_team enable row level security;
alter table public.kitty_website_company enable row level security;
revoke all on public.kitty_website_products, public.kitty_website_team, public.kitty_website_company from anon,authenticated;
grant select on public.kitty_website_products, public.kitty_website_team, public.kitty_website_company to anon,authenticated;
grant update on public.kitty_website_products, public.kitty_website_company to authenticated;
grant insert, update, delete on public.kitty_website_team to authenticated;
create policy "Public product content" on public.kitty_website_products for select to anon using(published);
create policy "Published products or website admin" on public.kitty_website_products for select to authenticated using(published or (select kitty_website_private.is_admin()));
create policy "Website admins edit products" on public.kitty_website_products for update to authenticated using((select kitty_website_private.is_admin())) with check((select kitty_website_private.is_admin()));
create policy "Public team profiles" on public.kitty_website_team for select to anon using(published);
create policy "Published team or website admin" on public.kitty_website_team for select to authenticated using(published or (select kitty_website_private.is_admin()));
create policy "Website admins add team" on public.kitty_website_team for insert to authenticated with check((select kitty_website_private.is_admin()));
create policy "Website admins edit team" on public.kitty_website_team for update to authenticated using((select kitty_website_private.is_admin())) with check((select kitty_website_private.is_admin()));
create policy "Website admins remove team" on public.kitty_website_team for delete to authenticated using((select kitty_website_private.is_admin()));
create policy "Public company links" on public.kitty_website_company for select to anon,authenticated using(true);
create policy "Website admins edit company" on public.kitty_website_company for update to authenticated using((select kitty_website_private.is_admin())) with check((select kitty_website_private.is_admin()));

-- Only images deliberately uploaded for the public website live in this bucket.
-- New UUID filenames make replacements immediately visible, with immutable caching.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('kitty-website-media','kitty-website-media',true,3145728,array['image/webp']);
create policy "Website admins upload public media" on storage.objects for insert to authenticated with check(bucket_id='kitty-website-media' and name ~ '^(icons|portraits)/[0-9a-f-]{36}\.webp$' and (select kitty_website_private.is_admin()));
create policy "Website admins inspect public media" on storage.objects for select to authenticated using(bucket_id='kitty-website-media' and (select kitty_website_private.is_admin()));
create policy "Website admins remove public media" on storage.objects for delete to authenticated using(bucket_id='kitty-website-media' and (select kitty_website_private.is_admin()));

insert into public.kitty_website_products(slug,name,label,status,description,intro,category,media,principles,sort_order,published) values('kitty-ai','KITTY AI','PERSONAL ARTIFICIAL INTELLIGENCE','IN ACTIVE DEVELOPMENT','Personal AI built around memory, voice, privacy and user control.','We want an assistant that can keep context without taking control away from you. Memory that you can understand. Voice that feels natural. Privacy that is considered from the start.','AI','Application screenshots & voice demos','[["Memory you can manage","We’re exploring how an assistant can remember useful context, while letting you review, change and remove it."],["A more natural conversation","Continuous voice interaction is part of the direction. We want talking to an assistant to feel less like operating a form."],["Your context, your choice","We’re considering local processing and explicit user controls. These are design goals, not promises about an unreleased product."]]',0,true);
insert into public.kitty_website_products(slug,name,label,status,description,intro,category,media,principles,sort_order,published) values('sentinel','KITTY Sentinel','ROBOTICS & COMPUTER VISION','PROTOTYPE V1','An experimental autonomous robotics and computer-vision platform built to understand and interact with the physical world.','Sentinel is our workbench for systems that see, move and respond. It’s an early prototype, with a lot of testing ahead. We’ll share what works and what needs another attempt.','Robotics','Prototype photographs & test footage','[["Understanding a scene","Computer vision is one part of the experiment: how a system notices objects, distances and changes around it."],["Useful autonomy","We’re interested in small, bounded tasks before broad claims. Predictable behavior matters more than an impressive demo."],["Learning in the physical world","Real tests have constraints that software alone doesn’t reveal. Our build log will make room for those lessons."]]',1,true);
insert into public.kitty_website_products(slug,name,label,status,description,intro,category,media,principles,sort_order,published) values('lisa-ai','LISA AI','INTERACTIVE AI','UPCOMING · EARLY EXPLORATION','An on-screen interactive anime AI. A more expressive way to spend time with personal software.','LISA is an exploration of character, presence and interaction on your screen. We’re figuring out how an AI companion could feel expressive while keeping the person using it in control.','AI','On-screen interaction demos','[["A visible presence","An interactive anime character is the starting point. We’ll test how visual responses can complement conversation."],["Interaction with intention","We want the experience to feel responsive without becoming distracting. How much presence is useful is part of the experiment."],["An honest beginning","There isn’t a public demo or release date yet. We’ll share the work when there’s something meaningful to try."]]',2,true);
insert into public.kitty_website_team(name,role,sort_order,published) values ('Virat','Founder & CEO',0,true),('Sarthak','Co-Founder',1,true);
insert into public.kitty_website_company(id,socials,team_heading,team_intro,team_body) values ('company','{"github":"https://github.com/psychspy7"}','A small team. Plenty to figure out.','We’re a small team interested in AI, robotics, cybersecurity and building things from scratch.','KITTY CORP started from experiments, prototypes and a lot of curiosity. We’re still early, and we’re building the company alongside the technology.');