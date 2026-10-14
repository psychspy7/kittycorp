-- Website only. Extends the existing queue; never backfills customer emails or deletes legacy submissions.
begin;
set local lock_timeout='5s';
alter table public.kitty_website_feedback add column if not exists communication_kind text not null default 'legacy' check(communication_kind in('legacy','message','project','review'));
alter table public.kitty_website_feedback add column if not exists communication_subject text not null default '' check(length(communication_subject)<=120);
alter table public.kitty_website_early_access add column if not exists status text not null default 'legacy' check(status in('legacy','pending','active','unsubscribed'));
alter table public.kitty_website_early_access add column if not exists verification_nonce uuid;
alter table public.kitty_website_early_access add column if not exists confirm_expires timestamptz;
alter table public.kitty_website_early_access add column if not exists confirmed_at timestamptz;
alter table public.kitty_website_early_access add column if not exists unsubscribed_at timestamptz;
alter table public.kitty_website_early_access add column if not exists requested_at timestamptz;
alter table kitty_website_private.project_quotes add column if not exists feedback_id uuid references public.kitty_website_feedback(id) on delete set null;
create table if not exists kitty_website_private.automation_state(
 id boolean primary key default true check(id),last_event bigint not null default 0,last_report_at timestamptz,last_cleanup_at timestamptz,last_cleanup_count integer not null default 0,last_error text,
 accepted_total bigint not null default 0,failed_total bigint not null default 0,reported_accepted bigint not null default 0,reported_failed bigint not null default 0
);
insert into kitty_website_private.automation_state(id)values(true)on conflict do nothing;
create table if not exists kitty_website_private.automation_reports(
 id uuid primary key default gen_random_uuid(),report_day date not null unique,created_at timestamptz not null default clock_timestamp(),accepted_at timestamptz,
 first_event bigint not null,last_event bigint not null,payload jsonb,totals jsonb not null,accepted_snapshot bigint not null,failed_snapshot bigint not null
);
create table if not exists kitty_website_private.communication_events(
 id bigint generated always as identity primary key,kind text not null check(kind in('message','project','review','newsletter_requested','subscribed','unsubscribed')),
 feedback_id uuid references public.kitty_website_feedback(id)on delete cascade,signup_id uuid references public.kitty_website_early_access(id)on delete cascade,
 occurred_at timestamptz not null default clock_timestamp(),reported_at timestamptz
);
create index if not exists kitty_events_unreported_idx on kitty_website_private.communication_events(id)where reported_at is null;
create index if not exists kitty_events_feedback_idx on kitty_website_private.communication_events(feedback_id)where feedback_id is not null;
create table if not exists kitty_website_private.automation_budget(day date primary key,attempts integer not null default 0);
create table if not exists kitty_website_private.newsletter_rate(bucket text primary key,hour timestamptz not null,hour_count integer not null,day date not null,day_count integer not null);
do $$declare t text;begin foreach t in array array['automation_state','automation_reports','communication_events','automation_budget','newsletter_rate']loop execute format('alter table kitty_website_private.%I enable row level security',t);execute format('revoke all on kitty_website_private.%I from public,anon,authenticated',t);end loop;end;$$;
alter table kitty_website_private.email_outbox drop constraint if exists email_outbox_feedback_id_key;
alter table kitty_website_private.email_outbox drop constraint if exists email_outbox_signup_id_key;
alter table kitty_website_private.email_outbox drop constraint if exists email_outbox_status_check;
alter table kitty_website_private.email_outbox drop constraint if exists email_outbox_last_error_check;
alter table kitty_website_private.email_outbox drop constraint if exists email_outbox_check;
alter table kitty_website_private.email_outbox add column if not exists template text not null default 'admin' check(template in('admin','ack','review_thanks','confirm','welcome','report'));
alter table kitty_website_private.email_outbox add column if not exists generation uuid not null default '00000000-0000-0000-0000-000000000000';
alter table kitty_website_private.email_outbox add column if not exists report_id uuid references kitty_website_private.automation_reports(id)on delete cascade;
alter table kitty_website_private.email_outbox add column if not exists attempt_day date;
alter table kitty_website_private.email_outbox add constraint email_outbox_status_check check(status in('pending','sending','sent','retry','failed','uncertain','skipped'));
alter table kitty_website_private.email_outbox add constraint email_outbox_error_check check(last_error is null or last_error in('mail_failed','delivery_failed','smtp_transient','smtp_rejected','smtp_uncertain','receipt_uncertain'));
alter table kitty_website_private.email_outbox add constraint email_outbox_source_check check(num_nonnulls(feedback_id,signup_id,report_id)=1);
create unique index if not exists kitty_email_feedback_template_idx on kitty_website_private.email_outbox(feedback_id,template)where feedback_id is not null;
create unique index if not exists kitty_email_signup_template_idx on kitty_website_private.email_outbox(signup_id,template,generation)where signup_id is not null;
create unique index if not exists kitty_email_report_idx on kitty_website_private.email_outbox(report_id)where report_id is not null;
create index if not exists kitty_email_claim_idx on kitty_website_private.email_outbox(next_attempt,created_at)where status in('pending','retry');
create or replace function kitty_website_private.enqueue_website_email()returns trigger language plpgsql security definer set search_path=''as $$
declare k text;begin
 perform pg_catalog.pg_advisory_xact_lock(761230);
 if tg_table_name='kitty_website_feedback'then
  k=current_setting('kitty.communication_kind',true);
  if k is null or k not in('message','project','review')then k=case when new.message like E'PROJECT ENQUIRY\n%'then 'project'when new.message like E'REVIEW\n%'then 'review'else 'message'end;end if;
  update public.kitty_website_feedback set communication_kind=k,communication_subject=left(coalesce(current_setting('kitty.communication_subject',true),''),120)where id=new.id;
  insert into kitty_website_private.communication_events(kind,feedback_id)values(k,new.id);
  insert into kitty_website_private.email_outbox(feedback_id,template)values(new.id,'admin'),(new.id,case when k='review'then 'review_thanks'else 'ack'end);
 elsif tg_table_name='kitty_website_early_access'then
  if new.status='pending'then
   insert into kitty_website_private.communication_events(kind,signup_id)values('newsletter_requested',new.id);
   insert into kitty_website_private.email_outbox(signup_id,template,generation)values(new.id,'confirm',new.verification_nonce);
  else insert into kitty_website_private.email_outbox(signup_id,template)values(new.id,'admin');end if;
 end if;return new;
end;$$;
create or replace function kitty_website_private.submit_communication(p_kind text,p_subject text,p_name text,p_email text,p_message text,p_fingerprint text,p_gateway_token text)returns uuid language plpgsql security definer set search_path=''as $$
declare result uuid;begin
 if p_kind not in('message','review')or length(p_subject)>120 then raise exception 'Invalid submission';end if;
 perform set_config('kitty.communication_kind',p_kind,true);perform set_config('kitty.communication_subject',p_subject,true);
 result=public.kitty_website_submit_feedback(p_name,p_email,case when p_kind='review'then E'REVIEW\n'||p_message else p_message end,p_fingerprint,p_gateway_token);return result;
end;$$;
create or replace function public.kitty_website_submit_communication(p_kind text,p_subject text,p_name text,p_email text,p_message text,p_fingerprint text,p_gateway_token text)returns uuid language sql security invoker set search_path=''as $$select kitty_website_private.submit_communication(p_kind,p_subject,p_name,p_email,p_message,p_fingerprint,p_gateway_token);$$;
revoke all on function kitty_website_private.submit_communication(text,text,text,text,text,text,text),public.kitty_website_submit_communication(text,text,text,text,text,text,text)from public;
grant execute on function kitty_website_private.submit_communication(text,text,text,text,text,text,text),public.kitty_website_submit_communication(text,text,text,text,text,text,text)to anon,authenticated;

create or replace function kitty_website_private.newsletter_action(p_gateway_token text,p_action text,p_value jsonb)returns jsonb language plpgsql security definer set search_path=''as $$
declare s public.kitty_website_early_access%rowtype;rate_bucket text;h timestamptz;d date;begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash'and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex'))then raise exception 'Unauthorized'using errcode='42501';end if;
 perform pg_catalog.pg_advisory_xact_lock(761230);
 if p_action='request'then
  if length(p_value->>'email')>254 or(p_value->>'email')!~'^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'or(p_value->>'fingerprint')!~'^[a-f0-9]{64}$'then raise exception 'Invalid subscription';end if;
  h=date_trunc('hour',clock_timestamp());d=(clock_timestamp()at time zone'UTC')::date;
  foreach rate_bucket in array array['finger:'||(p_value->>'fingerprint'),'email:'||encode(extensions.digest(lower(p_value->>'email'),'sha256'),'hex'),'global']loop
   insert into kitty_website_private.newsletter_rate values(rate_bucket,h,1,d,1)on conflict(bucket)do update set hour_count=case when newsletter_rate.hour=excluded.hour then newsletter_rate.hour_count+1 else 1 end,day_count=case when newsletter_rate.day=excluded.day then newsletter_rate.day_count+1 else 1 end,hour=excluded.hour,day=excluded.day;
   if exists(select 1 from kitty_website_private.newsletter_rate r where r.bucket=rate_bucket and ((r.hour_count>3 and rate_bucket<>'global')or(r.day_count>10 and rate_bucket<>'global')or(r.day_count>200 and rate_bucket='global')))then raise exception 'Rate limit';end if;
  end loop;
  select *into s from public.kitty_website_early_access where email=lower(trim(p_value->>'email'))for update;
  if s.id is null then
   insert into public.kitty_website_early_access(email,interests,fingerprint,status,verification_nonce,confirm_expires,requested_at)values(lower(trim(p_value->>'email')),array(select jsonb_array_elements_text(p_value->'interests')),p_value->>'fingerprint','pending',gen_random_uuid(),clock_timestamp()+interval'48 hours',clock_timestamp())returning *into s;
  elsif s.status<>'active'and(s.requested_at is null or s.requested_at<clock_timestamp()-interval'24 hours')then
   update kitty_website_private.email_outbox set status='skipped',locked_until=null,claim_token=null where signup_id=s.id and template in('confirm','welcome')and status in('pending','retry','failed','uncertain');
   update public.kitty_website_early_access set status='pending',verification_nonce=gen_random_uuid(),confirm_expires=clock_timestamp()+interval'48 hours',requested_at=clock_timestamp(),fingerprint=p_value->>'fingerprint',interests=array(select jsonb_array_elements_text(p_value->'interests'))where id=s.id returning *into s;
   insert into kitty_website_private.communication_events(kind,signup_id)values('newsletter_requested',s.id);
   insert into kitty_website_private.email_outbox(signup_id,template,generation)values(s.id,'confirm',s.verification_nonce);
  end if;
  return jsonb_build_object('id',s.id);
 elsif p_action in('confirm','unsubscribe')then
  select *into s from public.kitty_website_early_access where id=(p_value->>'id')::uuid and verification_nonce=(p_value->>'nonce')::uuid for update;
  if s.id is null then raise exception 'Invalid or expired link';end if;
  if p_action='confirm'then
   if s.status='active'then return jsonb_build_object('ok',true);end if;
   if s.status<>'pending'or s.confirm_expires<clock_timestamp()then raise exception 'Invalid or expired link';end if;
   update public.kitty_website_early_access set status='active',confirmed_at=clock_timestamp(),confirm_expires=null,unsubscribed_at=null where id=s.id;
   insert into kitty_website_private.communication_events(kind,signup_id)values('subscribed',s.id);
   insert into kitty_website_private.email_outbox(signup_id,template,generation)values(s.id,'welcome',s.verification_nonce)on conflict do nothing;
  elsif s.status<>'unsubscribed'then
   update public.kitty_website_early_access set status='unsubscribed',unsubscribed_at=clock_timestamp(),confirm_expires=null where id=s.id;
   update kitty_website_private.email_outbox set status='skipped',claim_token=null,locked_until=null where signup_id=s.id and template in('confirm','welcome')and status in('pending','retry','failed','uncertain');
   insert into kitty_website_private.communication_events(kind,signup_id)values('unsubscribed',s.id);
  end if;
  return jsonb_build_object('ok',true,'id',s.id);
 else raise exception 'Invalid action';end if;
end;$$;
create or replace function public.kitty_website_newsletter_action(p_gateway_token text,p_action text,p_value jsonb)returns jsonb language sql security invoker set search_path=''as $$select kitty_website_private.newsletter_action(p_gateway_token,p_action,p_value);$$;
revoke all on function kitty_website_private.newsletter_action(text,text,jsonb),public.kitty_website_newsletter_action(text,text,jsonb)from public;
grant execute on function kitty_website_private.newsletter_action(text,text,jsonb),public.kitty_website_newsletter_action(text,text,jsonb)to anon,authenticated;

create or replace function kitty_website_private.email_worker(p_gateway_token text,p_action text,p_value jsonb default'{}')returns jsonb language plpgsql security definer set search_path=''as $$
declare j kitty_website_private.email_outbox%rowtype;r kitty_website_private.automation_reports%rowtype;s public.kitty_website_early_access%rowtype;state kitty_website_private.automation_state%rowtype;payload jsonb;end_id bigint;items jsonb;totals jsonb;daily_limit integer;recipient_count integer;removed integer;hours integer;begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash'and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex'))then raise exception 'Unauthorized'using errcode='42501';end if;
 perform pg_catalog.pg_advisory_xact_lock(761230);
 if p_action='claim'then
  update kitty_website_private.email_outbox set status='uncertain',last_error='receipt_uncertain',claim_token=null,locked_until=null where status='sending'and locked_until<clock_timestamp();
  daily_limit=least(greatest(coalesce((p_value->>'daily_limit')::integer,200),1),400);
  if coalesce((select attempts from kitty_website_private.automation_budget where day=(clock_timestamp()at time zone'UTC')::date),0)>=daily_limit then return null;end if;
  select *into j from kitty_website_private.email_outbox where status in('pending','retry')and attempts<6 and next_attempt<=clock_timestamp()
   and(not(p_value?'feedback_id')or feedback_id=(p_value->>'feedback_id')::uuid)and(not(p_value?'signup_id')or signup_id=(p_value->>'signup_id')::uuid)and(not(p_value?'report_id')or report_id=(p_value->>'report_id')::uuid)
   order by case when template='admin'then 0 when template='report'then 2 else 1 end,created_at limit 1 for update skip locked;
  if j.id is null then return null;end if;
  if j.feedback_id is not null then
   select jsonb_build_object('name',f.name,'email',f.email,'message',f.message,'subject',f.communication_subject,'created_at',f.created_at,'kind',case when f.communication_kind='legacy'then case when f.message like E'PROJECT ENQUIRY\n%'then'project'when f.message like E'REVIEW\n%'then'review'else'message'end else f.communication_kind end,'reference','KC-'||f.id::text)into payload from public.kitty_website_feedback f where f.id=j.feedback_id;
  elsif j.signup_id is not null then
   select *into s from public.kitty_website_early_access where id=j.signup_id;
   if j.template in('confirm','welcome')and(s.verification_nonce is distinct from j.generation or(j.template='confirm'and(s.status<>'pending'or s.confirm_expires<clock_timestamp()))or(j.template='welcome'and s.status<>'active'))then update kitty_website_private.email_outbox set status='skipped'where id=j.id;return jsonb_build_object('skipped',true);end if;
   payload=jsonb_build_object('name','Subscriber','email',s.email,'interests',s.interests,'nonce',s.verification_nonce,'created_at',s.created_at,'kind','newsletter');
  else select *into r from kitty_website_private.automation_reports where id=j.report_id;payload=r.payload||jsonb_build_object('kind','report','name','KITTY CORP','report_day',r.report_day);end if;
  if j.template not in('admin','report')then
   select count(*)into recipient_count from kitty_website_private.email_outbox o left join public.kitty_website_feedback f on f.id=o.feedback_id left join public.kitty_website_early_access a on a.id=o.signup_id where o.template not in('admin','report')and o.attempt_day=(clock_timestamp()at time zone'UTC')::date and lower(coalesce(f.email,a.email))=lower(payload->>'email')and o.attempts>0;
   if recipient_count>=5 then update kitty_website_private.email_outbox set next_attempt=(date_trunc('day',clock_timestamp()at time zone'UTC')at time zone'UTC')+interval'1 day'where id=j.id;return jsonb_build_object('skipped',true);end if;
  end if;
  update kitty_website_private.email_outbox set status='sending',attempts=attempts+1,attempt_day=(clock_timestamp()at time zone'UTC')::date,claim_token=gen_random_uuid(),locked_until=clock_timestamp()+interval'5 minutes'where id=j.id returning *into j;
  insert into kitty_website_private.automation_budget(day,attempts)values(j.attempt_day,1)on conflict(day)do update set attempts=automation_budget.attempts+1;
  return payload||jsonb_build_object('id',j.id,'claim_token',j.claim_token,'template',j.template,'signup_id',j.signup_id,'generation',j.generation,'attempts',j.attempts);
 elsif p_action='finish'then
  select *into j from kitty_website_private.email_outbox where id=(p_value->>'id')::uuid and claim_token=(p_value->>'claim_token')::uuid and status='sending'for update;
  if j.id is null then return jsonb_build_object('ok',false);end if;
  if p_value->>'result'='accepted'then
   update kitty_website_private.email_outbox set status='sent',sent_at=clock_timestamp(),last_error=null,claim_token=null,locked_until=null where id=j.id;
   update kitty_website_private.automation_state set accepted_total=accepted_total+1 where id;
   if j.report_id is not null then
    select *into r from kitty_website_private.automation_reports where id=j.report_id for update;
    update kitty_website_private.automation_reports set accepted_at=clock_timestamp(),payload=null where id=r.id;
    update kitty_website_private.communication_events set reported_at=clock_timestamp()where id>r.first_event and id<=r.last_event and reported_at is null;
    update kitty_website_private.automation_state set last_event=r.last_event,last_report_at=clock_timestamp(),reported_accepted=r.accepted_snapshot,reported_failed=r.failed_snapshot,last_error=null where id;
   end if;
  else
   if p_value->>'result'not in('transient','rejected','uncertain')then raise exception 'Invalid result';end if;
   update kitty_website_private.email_outbox set status=case when p_value->>'result'='uncertain'then'uncertain'when p_value->>'result'='rejected'or attempts>=6 then'failed'else'retry'end,last_error='smtp_'||case when p_value->>'result'='rejected'then'rejected'when p_value->>'result'='uncertain'then'uncertain'else'transient'end,next_attempt=clock_timestamp()+make_interval(mins=>least(2880,(10*power(3,least(attempts-1,5)))::integer)),claim_token=null,locked_until=null where id=j.id;
   update kitty_website_private.automation_state set failed_total=failed_total+1,last_error='email_needs_attention'where id;
  end if;return jsonb_build_object('ok',true);
 elsif p_action='report'then
  select *into r from kitty_website_private.automation_reports where accepted_at is null order by created_at limit 1;
  if r.id is not null then return jsonb_build_object('id',r.id);end if;
  select *into r from kitty_website_private.automation_reports where report_day=(p_value->>'day')::date;
  if r.id is not null then return null;end if;
  select *into state from kitty_website_private.automation_state where id for update;
  select max(id)into end_id from(select id from kitty_website_private.communication_events where id>state.last_event order by id limit 200)x;end_id=coalesce(end_id,state.last_event);
  select coalesce(jsonb_agg(jsonb_build_object('kind',e.kind,'name',f.name,'email',case when e.kind in('subscribed','unsubscribed')then s.email else null end,'message',case when e.kind='review'then regexp_replace(f.message,E'^REVIEW\n','')else null end,'service',case when e.kind='project'then substring(f.message from E'Service: ([^\n]*)')else null end,'budget',case when e.kind='project'then substring(f.message from E'Budget: ([^\n]*)')else null end,'reference',case when f.id is not null then'KC-'||f.id::text else null end,'occurred_at',e.occurred_at,'moderation',case when e.kind='review'then'Private; not automatically published'else null end)order by e.id),'[]')into items from kitty_website_private.communication_events e left join public.kitty_website_feedback f on f.id=e.feedback_id left join public.kitty_website_early_access s on s.id=e.signup_id where e.id>state.last_event and e.id<=end_id;
  select jsonb_build_object('project',count(*)filter(where kind='project'),'message',count(*)filter(where kind='message'),'review',count(*)filter(where kind='review'),'subscribed',count(*)filter(where kind='subscribed'),'unsubscribed',count(*)filter(where kind='unsubscribed'),'newsletter_requested',count(*)filter(where kind='newsletter_requested'))into totals from kitty_website_private.communication_events where id>state.last_event and id<=end_id;
  payload=jsonb_build_object('items',items,'totals',totals,'active_subscribers',(select count(*)from public.kitty_website_early_access where status='active'),'health',jsonb_build_object('accepted',state.accepted_total-state.reported_accepted,'failed_attempts',state.failed_total-state.reported_failed,'pending',(select count(*)from kitty_website_private.email_outbox where status in('pending','retry','sending')),'unresolved',(select count(*)from kitty_website_private.email_outbox where status in('uncertain','failed')),'last_report',state.last_report_at),'from',state.last_report_at,'as_of',clock_timestamp(),'more_pending',exists(select 1 from kitty_website_private.communication_events where id>end_id),'likes',null,'analytics',null);
  insert into kitty_website_private.automation_reports(report_day,first_event,last_event,payload,totals,accepted_snapshot,failed_snapshot)values((p_value->>'day')::date,state.last_event,end_id,payload,totals,state.accepted_total,state.failed_total)returning *into r;
  insert into kitty_website_private.email_outbox(report_id,template)values(r.id,'report');return jsonb_build_object('id',r.id);
 elsif p_action='cleanup'then
  hours=least(greatest(coalesce((p_value->>'retention_hours')::integer,72),72),2160);
  with eligible as(select f.id from public.kitty_website_feedback f where f.communication_kind in('message','project')and f.created_at<clock_timestamp()-make_interval(hours=>hours)and exists(select 1 from kitty_website_private.communication_events e where e.feedback_id=f.id and e.reported_at is not null)and not exists(select 1 from kitty_website_private.communication_events e where e.feedback_id=f.id and e.reported_at is null)and exists(select 1 from kitty_website_private.email_outbox o where o.feedback_id=f.id and o.template='admin'and o.status='sent')and exists(select 1 from kitty_website_private.email_outbox o where o.feedback_id=f.id and o.template='ack'and o.status='sent')and not exists(select 1 from kitty_website_private.email_outbox o where o.feedback_id=f.id and o.status not in('sent','skipped'))limit 500)
  select count(*)into removed from eligible;
  if coalesce((p_value->>'dry_run')::boolean,false)then return jsonb_build_object('eligible_submissions',removed,'retention_hours',hours);end if;
  with eligible as(select f.id from public.kitty_website_feedback f where f.communication_kind in('message','project')and f.created_at<clock_timestamp()-make_interval(hours=>hours)and exists(select 1 from kitty_website_private.communication_events e where e.feedback_id=f.id and e.reported_at is not null)and not exists(select 1 from kitty_website_private.communication_events e where e.feedback_id=f.id and e.reported_at is null)and exists(select 1 from kitty_website_private.email_outbox o where o.feedback_id=f.id and o.template='admin'and o.status='sent')and exists(select 1 from kitty_website_private.email_outbox o where o.feedback_id=f.id and o.template='ack'and o.status='sent')and not exists(select 1 from kitty_website_private.email_outbox o where o.feedback_id=f.id and o.status not in('sent','skipped'))limit 500)delete from public.kitty_website_feedback where id in(select id from eligible);
  -- Reviews remain moderation records. Active and legacy subscribers are never deleted.
  delete from public.kitty_website_early_access s where s.status='pending'and s.confirm_expires<clock_timestamp()-make_interval(hours=>hours)and not exists(select 1 from kitty_website_private.email_outbox o where o.signup_id=s.id and o.status not in('sent','skipped'))and exists(select 1 from kitty_website_private.communication_events e where e.signup_id=s.id and e.reported_at is not null)and not exists(select 1 from kitty_website_private.communication_events e where e.signup_id=s.id and e.reported_at is null);
  delete from kitty_website_private.email_outbox o where o.status in('sent','skipped')and o.created_at<clock_timestamp()-make_interval(hours=>hours)and o.report_id is null and(o.feedback_id is null or not exists(select 1 from kitty_website_private.communication_events e where e.feedback_id=o.feedback_id and e.reported_at is null))and(o.signup_id is null or not exists(select 1 from kitty_website_private.communication_events e where e.signup_id=o.signup_id and e.reported_at is null))and o.signup_id is not null and o.template not in('confirm','welcome'); -- Required feedback receipts and subscription uniqueness survive until safe source cleanup.
  update public.kitty_website_early_access set confirm_expires=null where status in('active','unsubscribed')and confirm_expires is not null;
  delete from kitty_website_private.communication_events where reported_at is not null and occurred_at<clock_timestamp()-interval'90 days'and(feedback_id is null or kind='review');
  delete from kitty_website_private.automation_reports where accepted_at<clock_timestamp()-interval'90 days';
  delete from kitty_website_private.automation_budget where day<current_date-7;
  delete from kitty_website_private.newsletter_rate where day<current_date-2;
  update kitty_website_private.automation_state set last_cleanup_at=clock_timestamp(),last_cleanup_count=removed where id;
  return jsonb_build_object('removed_submissions',removed,'retention_hours',hours);
 else raise exception 'Invalid worker action';end if;
end;$$;
create or replace function public.kitty_website_email_worker(p_gateway_token text,p_action text,p_value jsonb default'{}')returns jsonb language sql security invoker set search_path=''as $$select kitty_website_private.email_worker(p_gateway_token,p_action,p_value);$$;
revoke all on function kitty_website_private.email_worker(text,text,jsonb),public.kitty_website_email_worker(text,text,jsonb)from public;
grant execute on function kitty_website_private.email_worker(text,text,jsonb),public.kitty_website_email_worker(text,text,jsonb)to anon,authenticated;

create or replace function kitty_website_private.website_email_status(p_retry boolean)returns jsonb language plpgsql security definer set search_path=''as $$
begin
 if not kitty_website_private.is_admin()then raise exception 'Unauthorized'using errcode='42501';end if;
 if p_retry then update kitty_website_private.email_outbox set status='pending',attempts=0,next_attempt=clock_timestamp(),last_error=null where status in('retry','failed');end if;
 return jsonb_build_object('pending',(select count(*)from kitty_website_private.email_outbox where status in('pending','retry')),'sending',(select count(*)from kitty_website_private.email_outbox where status='sending'),'sent',(select accepted_total from kitty_website_private.automation_state where id),'needs_retry',(select count(*)from kitty_website_private.email_outbox where status in('failed','uncertain')),'uncertain',(select count(*)from kitty_website_private.email_outbox where status='uncertain'),'failed',(select count(*)from kitty_website_private.email_outbox where status='failed'),'active_subscribers',(select count(*)from public.kitty_website_early_access where status='active'),'pending_subscribers',(select count(*)from public.kitty_website_early_access where status='pending'),'legacy_subscribers',(select count(*)from public.kitty_website_early_access where status='legacy'),'last_report',(select last_report_at from kitty_website_private.automation_state where id),'last_cleanup',(select last_cleanup_at from kitty_website_private.automation_state where id),'last_cleanup_count',(select last_cleanup_count from kitty_website_private.automation_state where id),'unresolved_error',(select last_error from kitty_website_private.automation_state where id),'database_bytes',pg_database_size(current_database()),'recent_activity',(select coalesce(jsonb_agg(x),'[]')from(select kind,occurred_at from kitty_website_private.communication_events order by id desc limit 10)x));
end;$$;
create or replace function kitty_website_private.project_quote_action(p_gateway_token text,p_action text,p_hash text,p_value jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare q kitty_website_private.project_quotes%rowtype; paid bigint; total bigint; advance bigint; due bigint; chosen text; feedback_uuid uuid;
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then raise exception 'Unauthorized' using errcode='42501';end if;
 if p_hash!~'^[a-f0-9]{64}$' then raise exception 'Invalid quote';end if;
 if p_action='submit' then
  perform set_config('kitty.communication_kind','project',true);
  perform set_config('kitty.communication_subject','',true);
  feedback_uuid:=public.kitty_website_submit_feedback(p_value->>'name',p_value->>'email','PROJECT ENQUIRY'||chr(10)||'Service: '||(p_value->>'service')||chr(10)||'Payment preference: '||(p_value->>'preference')||chr(10)||'Business: '||coalesce(p_value->>'organization','')||chr(10)||'Budget: '||coalesce(p_value->>'budget','')||chr(10)||'Timeline: '||coalesce(p_value->>'timeline','')||chr(10)||chr(10)||(p_value->>'scope'),p_value->>'fingerprint',p_gateway_token);
  insert into kitty_website_private.project_quotes(access_hash,name,email,service,scope,feedback_id) values(p_hash,p_value->>'name',p_value->>'email',p_value->>'service',p_value->>'scope',feedback_uuid) returning * into q;
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

-- Retire the old sender while keeping its RPC compatible during rolling deployment.
create or replace function kitty_website_private.claim_website_email(p_gateway_token text)returns jsonb language plpgsql security definer set search_path=''as $$begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash'and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex'))then raise exception 'Unauthorized'using errcode='42501';end if;return null;end;$$;
create or replace function kitty_website_private.retry_uncertain_email(p_confirm_duplicates boolean)returns integer language plpgsql security definer set search_path=''as $$declare changed integer;begin
 if not kitty_website_private.is_admin()or not p_confirm_duplicates then raise exception 'Unauthorized'using errcode='42501';end if;
 update kitty_website_private.email_outbox set status='pending',attempts=0,next_attempt=clock_timestamp(),last_error=null where status='uncertain';get diagnostics changed=row_count;return changed;
end;$$;
create or replace function public.kitty_website_retry_uncertain_email(p_confirm_duplicates boolean)returns integer language sql security invoker set search_path=''as $$select kitty_website_private.retry_uncertain_email(p_confirm_duplicates);$$;
revoke all on function kitty_website_private.retry_uncertain_email(boolean),public.kitty_website_retry_uncertain_email(boolean)from public,anon;
grant execute on function kitty_website_private.retry_uncertain_email(boolean),public.kitty_website_retry_uncertain_email(boolean)to authenticated;

commit;
