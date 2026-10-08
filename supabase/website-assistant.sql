create table public.kitty_website_assistant (
 id text primary key default 'assistant' check(id='assistant'),
 enabled boolean not null default false,
 title text not null check(char_length(title) between 2 and 40),
 greeting text not null check(char_length(greeting) between 10 and 400),
 guidance text not null default '' check(char_length(guidance)<=2500),
 max_messages integer not null default 8 check(max_messages between 3 and 20),
 max_output_tokens integer not null default 384 check(max_output_tokens between 128 and 600),
 temperature numeric not null default .4 check(temperature between .1 and .8),
 updated_at timestamptz not null default now()
);
alter table public.kitty_website_assistant enable row level security;
revoke all on public.kitty_website_assistant from public,anon,authenticated;
grant select,update on public.kitty_website_assistant to authenticated;
create policy "Studio reads assistant settings" on public.kitty_website_assistant for select to authenticated using((select kitty_website_private.is_admin()));
create policy "Studio edits assistant settings" on public.kitty_website_assistant for update to authenticated using((select kitty_website_private.is_admin())) with check((select kitty_website_private.is_admin()));
insert into public.kitty_website_assistant(id,title,greeting,guidance) values('assistant','KITTY AI','Hi, I’m KITTY. Ask me about our work, our products or what you’d like us to build.','Be clear, warm and concise. Use published KITTY CORP information. Help visitors find pages or start a project. Never invent customers, results, prices, qualifications or partnerships. Six months of maintenance covers agreed maintenance after launch; new features and third-party costs are separate. Do not ask for private information.');

create function kitty_website_private.assistant_settings(p_gateway_token text) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then raise exception 'Unauthorized' using errcode='42501'; end if;
 return (select to_jsonb(a) from public.kitty_website_assistant a where id='assistant');
end;$$;
revoke all on function kitty_website_private.assistant_settings(text) from public;
grant execute on function kitty_website_private.assistant_settings(text) to anon,authenticated;
create function public.kitty_website_assistant_settings(p_gateway_token text) returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.assistant_settings(p_gateway_token);$$;
revoke all on function public.kitty_website_assistant_settings(text) from public;
grant execute on function public.kitty_website_assistant_settings(text) to anon,authenticated;

create table kitty_website_private.assistant_requests (
 id bigint generated always as identity primary key,
 fingerprint text not null check(fingerprint ~ '^[a-f0-9]{64}$'),
 created_at timestamptz not null default now()
);
alter table kitty_website_private.assistant_requests enable row level security;
revoke all on kitty_website_private.assistant_requests from public,anon,authenticated;
create index kitty_assistant_request_time_idx on kitty_website_private.assistant_requests(created_at);
create index kitty_assistant_request_visitor_idx on kitty_website_private.assistant_requests(fingerprint,created_at);
create function kitty_website_private.reserve_assistant(p_fingerprint text,p_gateway_token text) returns boolean language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then raise exception 'Unauthorized' using errcode='42501'; end if;
 if p_fingerprint is null or p_fingerprint !~ '^[a-f0-9]{64}$' then raise exception 'Invalid fingerprint'; end if;
 if not exists(select 1 from public.kitty_website_assistant where id='assistant' and enabled) then return false; end if;
 perform pg_catalog.pg_advisory_xact_lock(897642);
 delete from kitty_website_private.assistant_requests where created_at<now()-interval '1 day';
 if (select count(*) from kitty_website_private.assistant_requests where fingerprint=p_fingerprint and created_at>now()-interval '1 hour')>=12
 or (select count(*) from kitty_website_private.assistant_requests where fingerprint=p_fingerprint)>=30
 or (select count(*) from kitty_website_private.assistant_requests)>=150 then raise exception 'Rate limit exceeded'; end if;
 insert into kitty_website_private.assistant_requests(fingerprint) values(p_fingerprint); return true;
end;$$;
revoke all on function kitty_website_private.reserve_assistant(text,text) from public;
grant execute on function kitty_website_private.reserve_assistant(text,text) to anon,authenticated;
create function public.kitty_website_reserve_assistant(p_fingerprint text,p_gateway_token text) returns boolean language sql security invoker set search_path='' as $$select kitty_website_private.reserve_assistant(p_fingerprint,p_gateway_token);$$;
revoke all on function public.kitty_website_reserve_assistant(text,text) from public;
grant execute on function public.kitty_website_reserve_assistant(text,text) to anon,authenticated;
notify pgrst,'reload schema';
