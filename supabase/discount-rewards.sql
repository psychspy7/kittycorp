-- Website only. Server-verified skill rewards; no customer or payment rows deleted.
begin;
set local lock_timeout='3s';
alter table kitty_website_private.project_quotes add column if not exists reward_discount_bps integer not null default 0 check(reward_discount_bps in (0,500,700));
-- Preserve compatibility with the old website during deployment. Activate 100 only after it is READY.
alter table kitty_website_private.project_quotes add column if not exists split_discount_bps integer not null default 120 check(split_discount_bps in (100,120));
create table kitty_website_private.reward_codes(
 id uuid primary key default gen_random_uuid(),
 code_hash text unique not null check(code_hash ~ '^[a-f0-9]{64}$'),
 attempt text unique not null check(attempt ~ '^[a-f0-9]{32}$'),
 fingerprint text not null check(fingerprint ~ '^[a-f0-9]{64}$'),
 percent integer not null check(percent in (5,7)),
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '30 days',
 redeemed_at timestamptz,
 redeemed_note text not null default '' check(length(redeemed_note)<=300),
 quote_id uuid references kitty_website_private.project_quotes(id)
);
alter table kitty_website_private.reward_codes enable row level security;
revoke all on kitty_website_private.reward_codes from public,anon,authenticated;
create index kitty_reward_recent_visitor on kitty_website_private.reward_codes(fingerprint,created_at desc);

create function kitty_website_private.project_quote_total(p_amount bigint,p_choice text,p_split integer,p_reward integer)
returns bigint language sql immutable set search_path='' as $$
 select round(p_amount*(10000-greatest(case p_choice when 'full' then 250 when 'split' then p_split else 0 end,p_reward))/10000.0)::bigint;
$$;
revoke all on function kitty_website_private.project_quote_total(bigint,text,integer,integer) from public,anon,authenticated;
do $migration$
declare definition text; old_fragment text := 'total=round(q.amount_minor*(case chosen when ''full'' then 0.975 when ''split'' then 0.988 else 1 end));';
begin
 definition:=pg_get_functiondef('kitty_website_private.project_quote_action(text,text,text,jsonb)'::regprocedure);
 if position(old_fragment in definition)=0 then raise exception 'Expected quote total rule not found; review before changing';end if;
 execute replace(definition,old_fragment,'total=kitty_website_private.project_quote_total(q.amount_minor,chosen,q.split_discount_bps,q.reward_discount_bps);');
end $migration$;

create function kitty_website_private.claim_reward(p_gateway_token text,p_value jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r kitty_website_private.reward_codes%rowtype; fp text:=p_value->>'fingerprint';
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex'))then raise exception 'Unauthorized' using errcode='42501';end if;
 if fp!~'^[a-f0-9]{64}$' or (p_value->>'attempt')!~'^[a-f0-9]{32}$' or (p_value->>'code_hash')!~'^[a-f0-9]{64}$' or (p_value->>'percent')::integer not in (5,7) then raise exception 'Invalid reward';end if;
 perform pg_advisory_xact_lock(hashtextextended(fp,8914));
 select * into r from kitty_website_private.reward_codes where fingerprint=fp and expires_at>now() order by created_at desc limit 1;
 if found and r.percent=5 and (p_value->>'percent')::integer=7 and r.redeemed_at is null then
  update kitty_website_private.reward_codes set percent=7,attempt=p_value->>'attempt',code_hash=p_value->>'code_hash' where id=r.id returning * into r;
 elsif not found then
  insert into kitty_website_private.reward_codes(code_hash,attempt,fingerprint,percent)values(p_value->>'code_hash',p_value->>'attempt',fp,(p_value->>'percent')::integer)returning * into r;
 end if;
 return jsonb_build_object('attempt',r.attempt,'percent',r.percent,'expires_at',r.expires_at,'redeemed_at',r.redeemed_at);
end;$$;
create function public.kitty_website_claim_reward(p_gateway_token text,p_value jsonb)
returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.claim_reward(p_gateway_token,p_value);$$;

create function kitty_website_private.reward_admin(p_hash text,p_value jsonb default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r kitty_website_private.reward_codes%rowtype; q kitty_website_private.project_quotes%rowtype;
begin
 if not kitty_website_private.is_admin()then raise exception 'Unauthorized' using errcode='42501';end if;
 select * into r from kitty_website_private.reward_codes where code_hash=p_hash for update;
 if not found then return null;end if;
 if p_value is not null then
  if r.redeemed_at is not null or r.expires_at<=now()then raise exception 'This code is used or expired';end if;
  if length(btrim(coalesce(p_value->>'note','')))<5 or length(p_value->>'note')>300 then raise exception 'Record a short order or redemption note';end if;
  if coalesce(p_value->>'quote_id','')<>''then
   select * into q from kitty_website_private.project_quotes where id=(p_value->>'quote_id')::uuid for update;
   if not found or q.status='closed' or q.reservation_id is not null or q.order_id is not null or q.reward_discount_bps<>0 then raise exception 'Quote already locked or has a reward';end if;
   update kitty_website_private.project_quotes set reward_discount_bps=r.percent*100,updated_at=now()where id=q.id;
  end if;
  update kitty_website_private.reward_codes set redeemed_at=now(),redeemed_note=p_value->>'note',quote_id=q.id where id=r.id returning * into r;
 end if;
 return to_jsonb(r)-'fingerprint'-'attempt'-'code_hash';
end;$$;
create function public.kitty_website_reward_admin(p_hash text,p_value jsonb default null)
returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.reward_admin(p_hash,p_value);$$;
revoke all on function kitty_website_private.claim_reward(text,jsonb),public.kitty_website_claim_reward(text,jsonb),kitty_website_private.reward_admin(text,jsonb),public.kitty_website_reward_admin(text,jsonb) from public,anon,authenticated;
grant execute on function kitty_website_private.claim_reward(text,jsonb),public.kitty_website_claim_reward(text,jsonb)to anon,authenticated;
grant execute on function kitty_website_private.reward_admin(text,jsonb),public.kitty_website_reward_admin(text,jsonb)to authenticated;
notify pgrst,'reload schema';
commit;
