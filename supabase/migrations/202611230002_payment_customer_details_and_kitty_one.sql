-- Record payer identity and allow KITTY ONE payment purpose in the private ledger.
begin;
alter table kitty_website_private.payment_orders
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists customer_message text;
alter table kitty_website_private.payment_orders drop constraint if exists payment_orders_purpose_check;
alter table kitty_website_private.payment_orders add constraint payment_orders_purpose_check check(purpose in ('project','donation','checkout','subscription','lisa_preorder'));
drop function if exists kitty_website_private.payment_record(text,text,text,text,text,text,bigint,text,text,text);
drop function if exists public.kitty_website_payment_record(text,text,text,text,text,text,bigint,text,text,text);
create or replace function kitty_website_private.payment_record(p_gateway_token text,p_provider text,p_order_id text,p_environment text,p_purpose text,p_reference text,p_amount_minor bigint,p_currency text,p_status text,p_payment_id text,p_customer_name text default null,p_customer_email text default null,p_customer_message text default null) returns void language plpgsql security definer set search_path='' as $$
declare existing kitty_website_private.payment_orders%rowtype;
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then raise exception 'Unauthorized' using errcode='42501';end if;
 if p_status='created' then
  insert into kitty_website_private.payment_orders(provider,order_id,environment,purpose,reference,amount_minor,currency,customer_name,customer_email,customer_message)
  values(p_provider,p_order_id,p_environment,p_purpose,p_reference,p_amount_minor,p_currency,nullif(trim(p_customer_name),''),nullif(lower(trim(p_customer_email)),''),nullif(trim(p_customer_message),''))
  on conflict(provider,order_id)do update set customer_name=coalesce(kitty_website_private.payment_orders.customer_name,excluded.customer_name),customer_email=coalesce(kitty_website_private.payment_orders.customer_email,excluded.customer_email),customer_message=coalesce(kitty_website_private.payment_orders.customer_message,excluded.customer_message);
 end if;
 select * into existing from kitty_website_private.payment_orders where provider=p_provider and order_id=p_order_id for update;
 if not found or existing.environment<>p_environment or existing.purpose<>p_purpose or existing.reference<>p_reference or existing.amount_minor<>p_amount_minor or existing.currency<>p_currency then raise exception 'Order mismatch' using errcode='22023';end if;
 if p_status in ('paid','refunded') then
  if p_payment_id is null or length(p_payment_id)<3 or length(p_payment_id)>100 then raise exception 'Invalid payment' using errcode='22023';end if;
  if existing.payment_id is not null and existing.payment_id<>p_payment_id then raise exception 'Payment mismatch' using errcode='22023';end if;
  if p_status='paid' and existing.status='refunded' then return;end if;
  update kitty_website_private.payment_orders set status=p_status,payment_id=p_payment_id,paid_at=coalesce(paid_at,now()),updated_at=now(),customer_name=coalesce(customer_name,nullif(trim(p_customer_name),'')),customer_email=coalesce(customer_email,nullif(lower(trim(p_customer_email)),'')),customer_message=coalesce(customer_message,nullif(trim(p_customer_message),'')) where provider=p_provider and order_id=p_order_id;
 elsif p_status<>'created' then raise exception 'Invalid status' using errcode='22023';end if;
end;$$;
create or replace function public.kitty_website_payment_record(p_gateway_token text,p_provider text,p_order_id text,p_environment text,p_purpose text,p_reference text,p_amount_minor bigint,p_currency text,p_status text,p_payment_id text,p_customer_name text default null,p_customer_email text default null,p_customer_message text default null)returns void language sql security invoker set search_path='' as $$select kitty_website_private.payment_record(p_gateway_token,p_provider,p_order_id,p_environment,p_purpose,p_reference,p_amount_minor,p_currency,p_status,p_payment_id,p_customer_name,p_customer_email,p_customer_message);$$;
revoke all on function kitty_website_private.payment_record(text,text,text,text,text,text,bigint,text,text,text,text,text,text),public.kitty_website_payment_record(text,text,text,text,text,text,bigint,text,text,text,text,text,text) from public;
grant execute on function kitty_website_private.payment_record(text,text,text,text,text,text,bigint,text,text,text,text,text,text),public.kitty_website_payment_record(text,text,text,text,text,text,bigint,text,text,text,text,text,text) to anon,authenticated;
notify pgrst,'reload schema';
commit;