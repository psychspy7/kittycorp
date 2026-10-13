-- Verified Firebase customer identity is passed only by the existing private website gateway.
begin;
set local lock_timeout='3s';
create table kitty_website_private.customer_records(
 kind text not null check(kind in ('project','preorder','payment')),
 record_id text not null check(length(record_id) between 3 and 150),
 customer_uid text not null check(length(customer_uid) between 1 and 128),
 customer_email text not null check(length(customer_email) between 3 and 254),
 created_at timestamptz not null default now(),primary key(kind,record_id)
);
alter table kitty_website_private.customer_records enable row level security;
revoke all on kitty_website_private.customer_records from public,anon,authenticated;
create index kitty_customer_records_owner_idx on kitty_website_private.customer_records(customer_uid,kind,created_at desc);
create or replace function kitty_website_private.customer_attach(p_uid text,p_email text,p_kind text,p_id text)returns void language plpgsql security definer set search_path='' as $$
declare owner_uid text;
begin
 if p_uid is null or length(p_uid)not between 1 and 128 or p_email is null or length(p_email)not between 3 and 254 then raise exception 'Customer access';end if;
 insert into kitty_website_private.customer_records(kind,record_id,customer_uid,customer_email)values(p_kind,p_id,p_uid,lower(trim(p_email)))on conflict(kind,record_id)do nothing;
 select customer_uid into owner_uid from kitty_website_private.customer_records where kind=p_kind and record_id=p_id for update;
 if owner_uid is distinct from p_uid then raise exception 'Customer access' using errcode='42501';end if;
end;$$;
revoke all on function kitty_website_private.customer_attach(text,text,text,text)from public,anon,authenticated;
create or replace function kitty_website_private.customer_action(p_gateway_token text,p_uid text,p_email text,p_action text,p_value jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare record_hash text;record_email text;record_id text;record_kind text;projects jsonb;preorders jsonb;payments jsonb;parent_owner text;
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash'and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex'))then raise exception 'Unauthorized'using errcode='42501';end if;
 if p_uid is null or length(p_uid)not between 1 and 128 or p_email is null or length(p_email)not between 3 and 254 then raise exception 'Customer access';end if;
 if p_action='claim' then
  record_kind=p_value->>'kind';if (p_value->>'hash')!~'^[a-f0-9]{64}$'then raise exception 'Customer access';end if;
  if record_kind='project'then select q.id::text,q.email into record_id,record_email from kitty_website_private.project_quotes q where q.access_hash=p_value->>'hash'for update;
  elsif record_kind='preorder'then select p.id::text,p.email into record_id,record_email from kitty_website_private.lisa_preorders p where p.access_hash=p_value->>'hash'for update;
  else raise exception 'Customer access';end if;
  if record_id is null or lower(trim(record_email))<>lower(trim(p_email))then raise exception 'Customer access'using errcode='42501';end if;
  perform kitty_website_private.customer_attach(p_uid,p_email,record_kind,record_id);
  return jsonb_build_object('id',record_id,'kind',record_kind);
 elsif p_action in ('project','preorder')then
  record_kind=case p_action when 'project'then 'project'else 'preorder'end;
  if not exists(select 1 from kitty_website_private.customer_records c where c.customer_uid=p_uid and c.kind=record_kind and c.record_id=p_value->>'id')then return null;end if;
  if record_kind='project'then
   if p_value->>'action'not in ('read','reserve','attach','release')then raise exception 'Customer access';end if;
   select q.access_hash into record_hash from kitty_website_private.project_quotes q where q.id::text=p_value->>'id';
   if record_hash is null then return null;end if;
   return kitty_website_private.project_quote_action(p_gateway_token,p_value->>'action',record_hash,p_value);
  else
   if p_value->>'action'not in ('read','reserve','attach','release','refund_request')then raise exception 'Customer access';end if;
   select p.access_hash into record_hash from kitty_website_private.lisa_preorders p where p.id::text=p_value->>'id';
   if record_hash is null then return null;end if;
   return kitty_website_private.lisa_preorder_action(p_gateway_token,p_value->>'action',record_hash,p_value);
  end if;
 elsif p_action='payment'then
  if p_value->>'status'<>'created'then raise exception 'Customer access';end if;
  perform kitty_website_private.payment_record(p_gateway_token,p_value->>'provider',p_value->>'order_id',p_value->>'environment',p_value->>'purpose',p_value->>'reference',(p_value->>'amount_minor')::bigint,p_value->>'currency','created',null);
  if p_value->>'purpose'='project'then select c.customer_uid into parent_owner from kitty_website_private.customer_records c where c.kind='project'and c.record_id=substring(p_value->>'reference'from '^Q-([a-f0-9-]{36})-');
  elsif p_value->>'purpose'='lisa_preorder'then select c.customer_uid into parent_owner from kitty_website_private.customer_records c where c.kind='preorder'and c.record_id=substring(p_value->>'reference'from '^LISA-([a-f0-9-]{36})$');end if;
  if parent_owner is null or parent_owner=p_uid then perform kitty_website_private.customer_attach(p_uid,p_email,'payment',(p_value->>'provider')||':'||(p_value->>'order_id'));end if;
  return jsonb_build_object('ok',true);
 elsif p_action='list'then
  select coalesce(jsonb_agg(x.data order by x.created_at desc),'[]'::jsonb)into projects from(select q.created_at,(to_jsonb(q)-'access_hash'-'name'-'email')||jsonb_build_object('paid_minor',coalesce((select sum(o.amount_minor)from kitty_website_private.payment_orders o where o.provider='razorpay'and o.environment='live'and o.status='paid'and o.purpose='project'and o.currency='INR'and o.reference='Q-'||q.id::text||'-'||q.choice),0))data from kitty_website_private.customer_records c join kitty_website_private.project_quotes q on c.kind='project'and c.record_id=q.id::text where c.customer_uid=p_uid order by q.created_at desc limit 100)x;
  select coalesce(jsonb_agg(x.data order by x.created_at desc),'[]'::jsonb)into preorders from(select p.created_at,(to_jsonb(p)-'access_hash'-'fingerprint'-'name'-'email')||jsonb_build_object('status',coalesce(o.status,'created'),'payment_id',o.payment_id)data from kitty_website_private.customer_records c join kitty_website_private.lisa_preorders p on c.kind='preorder'and c.record_id=p.id::text left join kitty_website_private.payment_orders o on o.provider='razorpay'and o.order_id=p.order_id and o.purpose='lisa_preorder'and o.environment='live'and o.currency='INR'and o.amount_minor=p.amount_minor and o.reference='LISA-'||p.id::text where c.customer_uid=p_uid order by p.created_at desc limit 100)x;
  select coalesce(jsonb_agg(to_jsonb(x)order by x.created_at desc),'[]'::jsonb)into payments from(select o.*from kitty_website_private.payment_orders o where exists(select 1 from kitty_website_private.customer_records c where c.customer_uid=p_uid and ((c.kind='payment'and c.record_id=o.provider||':'||o.order_id)or(c.kind='project'and o.purpose='project'and o.reference~('^Q-'||c.record_id||'-(full|split|after_review)$'))or(c.kind='preorder'and o.purpose='lisa_preorder'and o.reference='LISA-'||c.record_id)))order by o.created_at desc limit 100)x;
  return jsonb_build_object('projects',projects,'preorders',preorders,'payments',payments);
 else raise exception 'Customer access';end if;
end;$$;
create or replace function public.kitty_website_customer_action(p_gateway_token text,p_uid text,p_email text,p_action text,p_value jsonb)returns jsonb language sql security invoker set search_path=''as $$select kitty_website_private.customer_action(p_gateway_token,p_uid,p_email,p_action,p_value);$$;
revoke all on function kitty_website_private.customer_action(text,text,text,text,jsonb),public.kitty_website_customer_action(text,text,text,text,jsonb)from public;
grant execute on function kitty_website_private.customer_action(text,text,text,text,jsonb),public.kitty_website_customer_action(text,text,text,text,jsonb)to anon,authenticated;

create or replace function kitty_website_private.project_quote_action(p_gateway_token text,p_action text,p_hash text,p_value jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare q kitty_website_private.project_quotes%rowtype; paid bigint; total bigint; advance bigint; due bigint; chosen text;
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then raise exception 'Unauthorized' using errcode='42501';end if;
 if p_hash!~'^[a-f0-9]{64}$' then raise exception 'Invalid quote';end if;
 if p_action='submit' then
  perform public.kitty_website_submit_feedback(p_value->>'name',p_value->>'email','PROJECT ENQUIRY'||chr(10)||'Service: '||(p_value->>'service')||chr(10)||'Payment preference: '||(p_value->>'preference')||chr(10)||'Business: '||coalesce(p_value->>'organization','')||chr(10)||'Budget: '||coalesce(p_value->>'budget','')||chr(10)||'Timeline: '||coalesce(p_value->>'timeline','')||chr(10)||chr(10)||(p_value->>'scope'),p_value->>'fingerprint',p_gateway_token);
  insert into kitty_website_private.project_quotes(access_hash,name,email,service,scope) values(p_hash,p_value->>'name',p_value->>'email',p_value->>'service',p_value->>'scope') returning * into q;
  if coalesce(p_value->>'customer_uid','')<>''then perform kitty_website_private.customer_attach(p_value->>'customer_uid',p_value->>'customer_email','project',q.id::text);end if;
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
  if coalesce(p_value->>'customer_uid','')<>''then perform kitty_website_private.customer_attach(p_value->>'customer_uid',p_value->>'customer_email','preorder',p.id::text);end if;
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
notify pgrst,'reload schema';
commit;
