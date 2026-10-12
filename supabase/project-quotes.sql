-- Per-client quotes, atomic checkout reservations and private Studio controls.
begin;
set local lock_timeout='3s';
create table if not exists kitty_website_private.project_quotes(
 id uuid primary key default gen_random_uuid(), access_hash text unique not null check(access_hash~'^[a-f0-9]{64}$'),
 name text not null check(length(name) between 2 and 100), email text not null check(length(email)<=254),
 service text not null check(length(service)<=80), scope text not null check(length(scope) between 20 and 3500),
 amount_minor bigint not null default 0 check(amount_minor between 0 and 100000000),
 status text not null default 'draft' check(status in ('draft','approved','closed')),review_ready boolean not null default false,
 choice text check(choice in ('full','split','after_review')),reservation_id uuid,order_id text,order_amount bigint,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
alter table kitty_website_private.project_quotes enable row level security;
revoke all on kitty_website_private.project_quotes from public,anon,authenticated;
create index if not exists kitty_project_quotes_recent_idx on kitty_website_private.project_quotes(created_at desc);
create index if not exists kitty_project_payments_reference_idx on kitty_website_private.payment_orders(reference) where purpose='project';
create or replace function kitty_website_private.project_quote_action(p_gateway_token text,p_action text,p_hash text,p_value jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare q kitty_website_private.project_quotes%rowtype; paid bigint; total bigint; advance bigint; due bigint; chosen text;
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then raise exception 'Unauthorized' using errcode='42501';end if;
 if p_hash!~'^[a-f0-9]{64}$' then raise exception 'Invalid quote';end if;
 if p_action='submit' then
  perform public.kitty_website_submit_feedback(p_value->>'name',p_value->>'email','PROJECT ENQUIRY'||chr(10)||'Service: '||(p_value->>'service')||chr(10)||'Payment preference: '||(p_value->>'preference')||chr(10)||'Business: '||coalesce(p_value->>'organization','')||chr(10)||'Budget: '||coalesce(p_value->>'budget','')||chr(10)||'Timeline: '||coalesce(p_value->>'timeline','')||chr(10)||chr(10)||(p_value->>'scope'),p_value->>'fingerprint',p_gateway_token);
  insert into kitty_website_private.project_quotes(access_hash,name,email,service,scope) values(p_hash,p_value->>'name',p_value->>'email',p_value->>'service',p_value->>'scope') returning * into q;
 else
  select * into q from kitty_website_private.project_quotes where access_hash=p_hash for update;
  if not found then return null;end if;
 end if;
 select coalesce(sum(amount_minor),0) into paid from kitty_website_private.payment_orders where provider='razorpay' and currency='INR' and purpose='project' and environment='live' and status='paid' and reference='Q-'||q.id::text||'-'||q.choice;
 if p_action='reserve' then
  chosen=p_value->>'choice';
  if chosen not in ('full','split','after_review') or q.status<>'approved' or q.amount_minor<100 then raise exception 'Quote locked';end if;
  if q.choice is not null and q.choice<>chosen then raise exception 'Quote locked';end if;
  total=round(q.amount_minor*(case chosen when 'full' then 0.975 when 'split' then 0.988 else 1 end));advance=ceil(total/2.0);
  if paid>=total or (chosen='after_review' and not q.review_ready) or (chosen='split' and paid>=advance and not q.review_ready) then raise exception 'Quote locked';end if;
  due=case when chosen='split' and paid<advance then advance-paid else total-paid end;
  if due<100 or due<>(p_value->>'amount')::bigint then raise exception 'Quote locked';end if;
  if q.order_id is not null and exists(select 1 from kitty_website_private.payment_orders where provider='razorpay' and order_id=q.order_id and status='paid' and environment='live') then q.order_id=null;q.reservation_id=null;q.order_amount=null;end if;
  if q.reservation_id is not null and q.order_id is null then return (to_jsonb(q)-'access_hash'-'email'-'name')||jsonb_build_object('paid_minor',paid);end if;
  if q.order_id is not null and q.order_amount<>due then raise exception 'Quote locked';end if;
  if q.order_id is null then update kitty_website_private.project_quotes set choice=chosen,reservation_id=(p_value->>'reservation')::uuid,order_amount=due,order_id=null,updated_at=now()where id=q.id returning * into q;end if;
 elsif p_action='attach' then
  if q.reservation_id is distinct from (p_value->>'reservation')::uuid or (q.order_id is not null and q.order_id<>p_value->>'orderId') or (p_value->>'orderId')!~'^order_[A-Za-z0-9]{6,64}$' then raise exception 'Quote locked';end if;
  update kitty_website_private.project_quotes set order_id=p_value->>'orderId',updated_at=now()where id=q.id returning * into q;
 elsif p_action='release' then
  if q.reservation_id=(p_value->>'reservation')::uuid and q.order_id is null then update kitty_website_private.project_quotes set reservation_id=null,order_amount=null,choice=null,updated_at=now()where id=q.id returning * into q;end if;
 elsif p_action not in ('read','submit') then raise exception 'Invalid action';end if;
 return (to_jsonb(q)-'access_hash'-'email'-'name')||jsonb_build_object('paid_minor',paid);
end;$$;
create or replace function kitty_website_private.project_quote_admin(p_value jsonb default null)returns jsonb language plpgsql security definer set search_path='' as $$
declare q kitty_website_private.project_quotes%rowtype;
begin
 if not kitty_website_private.is_admin()then raise exception 'Unauthorized' using errcode='42501';end if;
 if p_value is not null then
  select * into q from kitty_website_private.project_quotes where id=(p_value->>'id')::uuid for update;
  if not found or q.updated_at is distinct from (p_value->>'version')::timestamptz then raise exception 'Quote changed';end if;
  if q.reservation_id is not null and ((p_value->>'amount_minor')::bigint<>q.amount_minor or p_value->>'scope'<>q.scope) then raise exception 'Quote locked';end if;
  update kitty_website_private.project_quotes set amount_minor=(p_value->>'amount_minor')::bigint,scope=p_value->>'scope',status=p_value->>'status',review_ready=(p_value->>'review_ready')::boolean,updated_at=now()where id=q.id;
 end if;
 return coalesce((select jsonb_agg(to_jsonb(x)-'access_hash' order by x.created_at desc)from(select * from kitty_website_private.project_quotes order by created_at desc limit 100)x),'[]'::jsonb);
end;$$;
create or replace function public.kitty_website_project_quote_action(p_gateway_token text,p_action text,p_hash text,p_value jsonb)returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.project_quote_action(p_gateway_token,p_action,p_hash,p_value);$$;
create or replace function public.kitty_website_project_quote_admin(p_value jsonb default null)returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.project_quote_admin(p_value);$$;
revoke all on function kitty_website_private.project_quote_action(text,text,text,jsonb),public.kitty_website_project_quote_action(text,text,text,jsonb),kitty_website_private.project_quote_admin(jsonb),public.kitty_website_project_quote_admin(jsonb) from public;
grant execute on function kitty_website_private.project_quote_action(text,text,text,jsonb),public.kitty_website_project_quote_action(text,text,text,jsonb)to anon,authenticated;
grant execute on function kitty_website_private.project_quote_admin(jsonb),public.kitty_website_project_quote_admin(jsonb)to authenticated;
notify pgrst,'reload schema';
commit;
