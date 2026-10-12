-- Additive website commerce ledger. No card data, provider secrets or app entitlements.
begin;
set local lock_timeout='3s';
create table if not exists kitty_website_private.payment_orders(
 provider text not null check(provider in ('razorpay','paypal','cashfree')),
 order_id text not null check(length(order_id) between 3 and 100),
 environment text not null check(environment in ('sandbox','live')),
 purpose text not null check(purpose in ('project','donation','checkout')),
 reference text not null default '' check(length(reference)<=80),
 amount_minor bigint not null check(amount_minor between 100 and 100000000),
 currency text not null check(currency in ('INR','USD')),
 status text not null default 'created' check(status in ('created','paid','refunded')),
 payment_id text,
 created_at timestamptz not null default now(),paid_at timestamptz,updated_at timestamptz not null default now(),
 primary key(provider,order_id),unique(provider,payment_id)
);
alter table kitty_website_private.payment_orders enable row level security;
revoke all on kitty_website_private.payment_orders from public,anon,authenticated;
create index if not exists kitty_payment_orders_recent_idx on kitty_website_private.payment_orders(created_at desc);
create or replace function kitty_website_private.payment_record(p_gateway_token text,p_provider text,p_order_id text,p_environment text,p_purpose text,p_reference text,p_amount_minor bigint,p_currency text,p_status text,p_payment_id text) returns void language plpgsql security definer set search_path='' as $$
declare existing kitty_website_private.payment_orders%rowtype;
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then raise exception 'Unauthorized' using errcode='42501';end if;
 if p_status='created' then
  insert into kitty_website_private.payment_orders(provider,order_id,environment,purpose,reference,amount_minor,currency)values(p_provider,p_order_id,p_environment,p_purpose,p_reference,p_amount_minor,p_currency)on conflict(provider,order_id)do nothing;
 end if;
 select * into existing from kitty_website_private.payment_orders where provider=p_provider and order_id=p_order_id for update;
 if not found or existing.environment<>p_environment or existing.purpose<>p_purpose or existing.reference<>p_reference or existing.amount_minor<>p_amount_minor or existing.currency<>p_currency then raise exception 'Order mismatch' using errcode='22023';end if;
 if p_status in ('paid','refunded') then
  if p_payment_id is null or length(p_payment_id)<3 or length(p_payment_id)>100 then raise exception 'Invalid payment' using errcode='22023';end if;
  if existing.payment_id is not null and existing.payment_id<>p_payment_id then raise exception 'Payment mismatch' using errcode='22023';end if;
  if p_status='paid' and existing.status='refunded' then return;end if;
  update kitty_website_private.payment_orders set status=p_status,payment_id=p_payment_id,paid_at=coalesce(paid_at,now()),updated_at=now()where provider=p_provider and order_id=p_order_id;
 elsif p_status<>'created' then raise exception 'Invalid status' using errcode='22023';end if;
end;$$;
create or replace function kitty_website_private.payment_lookup(p_gateway_token text,p_provider text,p_order_id text)returns jsonb language plpgsql security definer set search_path='' as $$begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex'))then raise exception 'Unauthorized' using errcode='42501';end if;
 return (select to_jsonb(o) from kitty_website_private.payment_orders o where provider=p_provider and order_id=p_order_id);
end;$$;
create or replace function kitty_website_private.payment_list()returns jsonb language plpgsql security definer set search_path='' as $$begin
 if not kitty_website_private.is_admin()then raise exception 'Unauthorized' using errcode='42501';end if;
 return coalesce((select jsonb_agg(to_jsonb(o)order by o.created_at desc)from(select * from kitty_website_private.payment_orders order by created_at desc limit 100)o),'[]'::jsonb);
end;$$;
create or replace function public.kitty_website_payment_record(p_gateway_token text,p_provider text,p_order_id text,p_environment text,p_purpose text,p_reference text,p_amount_minor bigint,p_currency text,p_status text,p_payment_id text)returns void language sql security invoker set search_path='' as $$select kitty_website_private.payment_record(p_gateway_token,p_provider,p_order_id,p_environment,p_purpose,p_reference,p_amount_minor,p_currency,p_status,p_payment_id);$$;
create or replace function public.kitty_website_payment_lookup(p_gateway_token text,p_provider text,p_order_id text)returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.payment_lookup(p_gateway_token,p_provider,p_order_id);$$;
create or replace function public.kitty_website_payment_list()returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.payment_list();$$;
revoke all on function kitty_website_private.payment_record(text,text,text,text,text,text,bigint,text,text,text),kitty_website_private.payment_lookup(text,text,text),kitty_website_private.payment_list(),public.kitty_website_payment_record(text,text,text,text,text,text,bigint,text,text,text),public.kitty_website_payment_lookup(text,text,text),public.kitty_website_payment_list() from public;
grant execute on function kitty_website_private.payment_record(text,text,text,text,text,text,bigint,text,text,text),kitty_website_private.payment_lookup(text,text,text),public.kitty_website_payment_record(text,text,text,text,text,text,bigint,text,text,text),public.kitty_website_payment_lookup(text,text,text)to anon,authenticated;
grant execute on function kitty_website_private.payment_list(),public.kitty_website_payment_list()to authenticated;
notify pgrst,'reload schema';
commit;
