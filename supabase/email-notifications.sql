-- Apply after schema.sql, security-hardening.sql and journal-and-early-access.sql.
-- New submissions only. No historical messages are emailed retroactively.
begin;
create table if not exists kitty_website_private.email_outbox (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid unique references public.kitty_website_feedback(id) on delete cascade,
  signup_id uuid unique references public.kitty_website_early_access(id) on delete cascade,
  status text not null default 'pending' check(status in ('pending','sending','sent')),
  attempts integer not null default 0 check(attempts>=0),
  next_attempt timestamptz not null default now(), locked_until timestamptz, claim_token uuid, sent_at timestamptz,
  last_error text check(last_error is null or last_error in ('mail_failed','delivery_failed')),
  created_at timestamptz not null default now(), check(num_nonnulls(feedback_id,signup_id)=1)
);
alter table kitty_website_private.email_outbox enable row level security;
revoke all on kitty_website_private.email_outbox from public,anon,authenticated;
drop policy if exists "No direct client access to email queue" on kitty_website_private.email_outbox;
create policy "No direct client access to email queue" on kitty_website_private.email_outbox for all to anon,authenticated using(false) with check(false);
create index if not exists kitty_email_due_idx on kitty_website_private.email_outbox(next_attempt,created_at) where status<>'sent';

create or replace function kitty_website_private.enqueue_website_email() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if tg_table_name='kitty_website_feedback' then
    insert into kitty_website_private.email_outbox(feedback_id) values(new.id) on conflict(feedback_id) do nothing;
  elsif tg_table_name='kitty_website_early_access' then
    insert into kitty_website_private.email_outbox(signup_id) values(new.id) on conflict(signup_id) do nothing;
  end if;
  return new;
end;$$;
revoke all on function kitty_website_private.enqueue_website_email() from public,anon,authenticated;
drop trigger if exists kitty_feedback_email on public.kitty_website_feedback;
create trigger kitty_feedback_email after insert on public.kitty_website_feedback for each row execute function kitty_website_private.enqueue_website_email();
drop trigger if exists kitty_signup_email on public.kitty_website_early_access;
create trigger kitty_signup_email after insert on public.kitty_website_early_access for each row execute function kitty_website_private.enqueue_website_email();

-- Elevated queue access stays private and uses the existing server gateway.
-- Public wrappers are SECURITY INVOKER. Browser sessions cannot claim emails.
create or replace function kitty_website_private.claim_website_email(p_gateway_token text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare job kitty_website_private.email_outbox; payload jsonb;
begin
  if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then raise exception 'Unauthorized' using errcode='42501'; end if;
  select * into job from kitty_website_private.email_outbox
    where attempts<6 and ((status='pending' and next_attempt<=now()) or (status='sending' and locked_until<now()))
    order by created_at limit 1 for update skip locked;
  if job.id is null then return null; end if;
  update kitty_website_private.email_outbox set status='sending',attempts=attempts+1,locked_until=now()+interval '2 minutes',claim_token=gen_random_uuid() where id=job.id returning * into job;
  if job.feedback_id is not null then
    select jsonb_build_object('name',f.name,'email',f.email,'message',f.message,'created_at',f.created_at,
      'kind',case when f.message like E'PROJECT ENQUIRY\n%' then 'project' when f.message like E'REVIEW\n%' then 'review' else 'message' end)
      into payload from public.kitty_website_feedback f where f.id=job.feedback_id;
  else
    select jsonb_build_object('name','Early-access subscriber','email',s.email,'message','Interests: '||array_to_string(s.interests,', '),'created_at',s.created_at,'kind','early-access')
      into payload from public.kitty_website_early_access s where s.id=job.signup_id;
  end if;
  return payload||jsonb_build_object('id',job.id,'claim_token',job.claim_token);
end;$$;
revoke all on function kitty_website_private.claim_website_email(text) from public;
grant execute on function kitty_website_private.claim_website_email(text) to anon,authenticated;
create or replace function public.kitty_website_claim_email(p_gateway_token text)
returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.claim_website_email(p_gateway_token);$$;
revoke all on function public.kitty_website_claim_email(text) from public;
grant execute on function public.kitty_website_claim_email(text) to anon,authenticated;

create or replace function kitty_website_private.finish_website_email(p_id uuid,p_claim_token uuid,p_error text,p_gateway_token text)
returns boolean language plpgsql security definer set search_path='' as $$
begin
  if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then raise exception 'Unauthorized' using errcode='42501'; end if;
  if p_error is not null and p_error not in ('mail_failed','delivery_failed') then raise exception 'Invalid error code'; end if;
  update kitty_website_private.email_outbox set status=case when p_error is null then 'sent' else 'pending' end,
    sent_at=case when p_error is null then now() else null end,last_error=p_error,
    next_attempt=now()+interval '10 minutes',locked_until=null,claim_token=null
    where id=p_id and claim_token=p_claim_token and status='sending';
  return found;
end;$$;
revoke all on function kitty_website_private.finish_website_email(uuid,uuid,text,text) from public;
grant execute on function kitty_website_private.finish_website_email(uuid,uuid,text,text) to anon,authenticated;
create or replace function public.kitty_website_finish_email(p_id uuid,p_claim_token uuid,p_error text,p_gateway_token text)
returns boolean language sql security invoker set search_path='' as $$select kitty_website_private.finish_website_email(p_id,p_claim_token,p_error,p_gateway_token);$$;
revoke all on function public.kitty_website_finish_email(uuid,uuid,text,text) from public;
grant execute on function public.kitty_website_finish_email(uuid,uuid,text,text) to anon,authenticated;

create or replace function kitty_website_private.website_email_status(p_retry boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
begin
  if not kitty_website_private.is_admin() then raise exception 'Unauthorized' using errcode='42501'; end if;
  if p_retry then
    update kitty_website_private.email_outbox set attempts=0,next_attempt=now(),status='pending',locked_until=null,claim_token=null
      where status='pending' or (status='sending' and locked_until<now());
  end if;
  return (select jsonb_build_object('pending',count(*) filter(where status='pending'),'sending',count(*) filter(where status='sending'),
    'sent',count(*) filter(where status='sent'),'needs_retry',count(*) filter(where status<>'sent' and attempts>=6)) from kitty_website_private.email_outbox);
end;$$;
revoke all on function kitty_website_private.website_email_status(boolean) from public,anon;
grant execute on function kitty_website_private.website_email_status(boolean) to authenticated;
create or replace function public.kitty_website_email_status(p_retry boolean default false)
returns jsonb language sql security invoker set search_path='' as $$select kitty_website_private.website_email_status(p_retry);$$;
revoke all on function public.kitty_website_email_status(boolean) from public,anon;
grant execute on function public.kitty_website_email_status(boolean) to authenticated;
commit;
