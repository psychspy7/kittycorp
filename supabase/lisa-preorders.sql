-- Additive, website-owned LISA reservations; never grants application access.
begin;
set local lock_timeout='3s';
alter table kitty_website_private.payment_orders drop constraint payment_orders_purpose_check;
alter table kitty_website_private.payment_orders add constraint payment_orders_purpose_check check(purpose in ('project','donation','checkout','lisa_preorder'));
create table kitty_website_private.lisa_preorders(
 id uuid primary key default gen_random_uuid(),access_hash text unique not null check(access_hash~'^[a-f0-9]{64}$'),
 name text not null check(length(name) between 2 and 100),email text not null check(length(email) between 3 and 254),
 amount_minor bigint not null check(amount_minor between 100 and 100000000),price_usd_minor bigint not null check(price_usd_minor between 100 and 100000000),
 rate_date date not null,terms_version text not null,terms text not null check(length(terms) between 100 and 2000),
 fingerprint text not null check(fingerprint~'^[a-f0-9]{64}$'),reservation_id uuid,order_id text unique,
 access_provided_at timestamptz,refund_requested_at timestamptz,created_at timestamptz not null default now()
);
alter table kitty_website_private.lisa_preorders enable row level security;
revoke all on kitty_website_private.lisa_preorders from public,anon,authenticated;
create index kitty_lisa_preorders_recent_idx on kitty_website_private.lisa_preorders(created_at desc);
create index kitty_lisa_preorders_rate_idx on kitty_website_private.lisa_preorders(fingerprint,created_at desc);
create or replace function kitty_website_private.lisa_preorder_action(p_gateway_token text,p_action text,p_hash text,p_value jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare p kitty_website_private.lisa_preorders%rowtype; payment kitty_website_private.payment_orders%rowtype;
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex'))then raise exception 'Unauthorized' using errcode='42501';end if;
 if p_hash!~'^[a-f0-9]{64}$'then raise exception 'Invalid reservation';end if;
 if p_action='submit' then
  if p_value->>'terms_version'<>'2026-10-12-v1' or (p_value->>'rate_date')::date<current_date-5 or (p_value->>'rate_date')::date>current_date then raise exception 'Invalid reservation terms';end if;
  perform pg_advisory_xact_lock(hashtextextended('lisa-preorder:'||(p_value->>'fingerprint'),0));
  if (select count(*)from kitty_website_private.lisa_preorders where fingerprint=p_value->>'fingerprint' and created_at>now()-interval '1 hour')>=5 then raise exception 'Rate limit';end if;
  insert into kitty_website_private.lisa_preorders(access_hash,name,email,amount_minor,price_usd_minor,rate_date,terms_version,terms,fingerprint)
  values(p_hash,p_value->>'name',p_value->>'email',(p_value->>'amount_minor')::bigint,(p_value->>'price_usd_minor')::bigint,(p_value->>'rate_date')::date,p_value->>'terms_version',p_value->>'terms',p_value->>'fingerprint')returning * into p;
 else
  select * into p from kitty_website_private.lisa_preorders where access_hash=p_hash for update;
  if not found then return null;end if;
 end if;
 select * into payment from kitty_website_private.payment_orders where provider='razorpay' and order_id=p.order_id and purpose='lisa_preorder' and environment='live' and currency='INR' and amount_minor=p.amount_minor and reference='LISA-'||p.id::text;
 if p_action='reserve' then
  if payment.status in ('paid','refunded') or p.refund_requested_at is not null or p.access_provided_at is not null or p.amount_minor<>(p_value->>'amount')::bigint then raise exception 'Preorder locked';end if;
  if p.reservation_id is null then update kitty_website_private.lisa_preorders set reservation_id=(p_value->>'reservation')::uuid where id=p.id returning * into p;end if;
 elsif p_action='attach' then
  if p.reservation_id is distinct from (p_value->>'reservation')::uuid or (p.order_id is not null and p.order_id<>p_value->>'orderId') or (p_value->>'orderId')!~'^order_[A-Za-z0-9]{6,64}$'then raise exception 'Preorder locked';end if;
  update kitty_website_private.lisa_preorders set order_id=p_value->>'orderId'where id=p.id returning * into p;
 elsif p_action='release' then
  if p.reservation_id=(p_value->>'reservation')::uuid and p.order_id is null then update kitty_website_private.lisa_preorders set reservation_id=null where id=p.id returning * into p;end if;
 elsif p_action='refund_request' then
  if payment.status<>'paid' or payment.status is null or p.access_provided_at is not null then raise exception 'Preorder locked';end if;
  update kitty_website_private.lisa_preorders set refund_requested_at=coalesce(refund_requested_at,now())where id=p.id returning * into p;
 elsif p_action not in ('read','submit')then raise exception 'Invalid action';end if;
 return (to_jsonb(p)-'access_hash'-'fingerprint'-'name'-'email')||jsonb_build_object('status',coalesce(payment.status,'created'),'payment_id',payment.payment_id);
end;$$;
create or replace function kitty_website_private.lisa_preorder_admin(p_value jsonb default null)returns jsonb language plpgsql security definer set search_path='' as $$
declare p kitty_website_private.lisa_preorders%rowtype;
begin
 if not kitty_website_private.is_admin()then raise exception 'Unauthorized' using errcode='42501';end if;
 if p_value is not null then
  select * into p from kitty_website_private.lisa_preorders where id=(p_value->>'id')::uuid for update;
  if not found or (p_value->>'accessProvided')::boolean is distinct from true or p.refund_requested_at is not null or not exists(select 1 from kitty_website_private.payment_orders o where o.provider='razorpay' and o.order_id=p.order_id and o.environment='live' and o.purpose='lisa_preorder' and o.currency='INR' and o.amount_minor=p.amount_minor and o.reference='LISA-'||p.id::text and o.status='paid')then raise exception 'Preorder locked';end if;
  update kitty_website_private.lisa_preorders set access_provided_at=coalesce(access_provided_at,now())where id=p.id;
 end if;
 return coalesce((select jsonb_agg(to_jsonb(x)order by x.created_at desc)from(select p.id,p.name,p.email,p.amount_minor,p.price_usd_minor,p.rate_date,p.terms_version,p.terms,p.order_id,p.created_at,p.access_provided_at,p.refund_requested_at,coalesce(o.status,'created')status,o.payment_id from kitty_website_private.lisa_preorders p left join kitty_website_private.payment_orders o on o.provider='razorpay' and o.order_id=p.order_id and o.purpose='lisa_preorder' and o.environment='live' and o.currency='INR' and o.amount_minor=p.amount_minor and o.reference='LISA-'||p.id::text order by p.created_at desc limit 100)x),'[]'::jsonb);
end;$$;
create or replace function public.kitty_website_lisa_preorder_action(p_gateway_token text,p_action text,p_hash text,p_value jsonb)returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.lisa_preorder_action(p_gateway_token,p_action,p_hash,p_value);$$;
create or replace function public.kitty_website_lisa_preorder_admin(p_value jsonb default null)returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.lisa_preorder_admin(p_value);$$;
revoke all on function kitty_website_private.lisa_preorder_action(text,text,text,jsonb),public.kitty_website_lisa_preorder_action(text,text,text,jsonb),kitty_website_private.lisa_preorder_admin(jsonb),public.kitty_website_lisa_preorder_admin(jsonb) from public;
grant execute on function kitty_website_private.lisa_preorder_action(text,text,text,jsonb),public.kitty_website_lisa_preorder_action(text,text,text,jsonb) to anon,authenticated;
grant execute on function kitty_website_private.lisa_preorder_admin(jsonb),public.kitty_website_lisa_preorder_admin(jsonb)to authenticated;
notify pgrst,'reload schema';
commit;
