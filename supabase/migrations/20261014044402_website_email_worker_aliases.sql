-- Keep the subscriber record distinct from SQL table aliases in report and cleanup branches.
begin;
create or replace function kitty_website_private.email_worker(p_gateway_token text,p_action text,p_value jsonb default'{}')returns jsonb language plpgsql security definer set search_path=''as $$
declare j kitty_website_private.email_outbox%rowtype;r kitty_website_private.automation_reports%rowtype;subscriber public.kitty_website_early_access%rowtype;state kitty_website_private.automation_state%rowtype;payload jsonb;end_id bigint;items jsonb;totals jsonb;daily_limit integer;recipient_count integer;removed integer;hours integer;begin
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
   select *into subscriber from public.kitty_website_early_access where id=j.signup_id;
   if j.template in('confirm','welcome')and(subscriber.verification_nonce is distinct from j.generation or(j.template='confirm'and(subscriber.status<>'pending'or subscriber.confirm_expires<clock_timestamp()))or(j.template='welcome'and subscriber.status<>'active'))then update kitty_website_private.email_outbox set status='skipped'where id=j.id;return jsonb_build_object('skipped',true);end if;
   payload=jsonb_build_object('name','Subscriber','email',subscriber.email,'interests',subscriber.interests,'nonce',subscriber.verification_nonce,'created_at',subscriber.created_at,'kind','newsletter');
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
  select coalesce(jsonb_agg(jsonb_build_object('kind',e.kind,'name',f.name,'email',case when e.kind in('subscribed','unsubscribed')then signup_row.email else null end,'message',case when e.kind='review'then regexp_replace(f.message,E'^REVIEW\n','')else null end,'service',case when e.kind='project'then substring(f.message from E'Service: ([^\n]*)')else null end,'budget',case when e.kind='project'then substring(f.message from E'Budget: ([^\n]*)')else null end,'reference',case when f.id is not null then'KC-'||f.id::text else null end,'occurred_at',e.occurred_at,'moderation',case when e.kind='review'then'Private; not automatically published'else null end)order by e.id),'[]')into items from kitty_website_private.communication_events e left join public.kitty_website_feedback f on f.id=e.feedback_id left join public.kitty_website_early_access signup_row on signup_row.id=e.signup_id where e.id>state.last_event and e.id<=end_id;
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
  delete from public.kitty_website_early_access signup_row where signup_row.status='pending'and signup_row.confirm_expires<clock_timestamp()-make_interval(hours=>hours)and not exists(select 1 from kitty_website_private.email_outbox o where o.signup_id=signup_row.id and o.status not in('sent','skipped'))and exists(select 1 from kitty_website_private.communication_events e where e.signup_id=signup_row.id and e.reported_at is not null)and not exists(select 1 from kitty_website_private.communication_events e where e.signup_id=signup_row.id and e.reported_at is null);
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

commit;
