-- Server credentials are encrypted before insertion using a key derived from
-- the existing private deployment gateway. This file contains no credentials.
create table public.kitty_website_runtime (
 id text primary key default 'runtime' check(id='runtime'),
 ciphertext text not null check(char_length(ciphertext) between 30 and 25000),
 updated_at timestamptz not null default now()
);
alter table public.kitty_website_runtime enable row level security;
revoke all on public.kitty_website_runtime from public,anon,authenticated;
grant select,insert,update on public.kitty_website_runtime to authenticated;
create policy "Studio reads encrypted integration configuration" on public.kitty_website_runtime for select to authenticated using((select kitty_website_private.is_admin()));
create policy "Studio provisions encrypted integration configuration" on public.kitty_website_runtime for insert to authenticated with check((select kitty_website_private.is_admin()));
create policy "Studio updates encrypted integration configuration" on public.kitty_website_runtime for update to authenticated using((select kitty_website_private.is_admin())) with check((select kitty_website_private.is_admin()));
create function kitty_website_private.runtime_configuration(p_gateway_token text) returns text language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from kitty_website_private.settings where key='feedback_gateway_hash' and value=encode(extensions.digest(p_gateway_token,'sha256'),'hex')) then raise exception 'Unauthorized' using errcode='42501'; end if;
 return (select ciphertext from public.kitty_website_runtime where id='runtime');
end;$$;
revoke all on function kitty_website_private.runtime_configuration(text) from public;
grant execute on function kitty_website_private.runtime_configuration(text) to anon,authenticated;
create function public.kitty_website_runtime_configuration(p_gateway_token text) returns text language sql security invoker set search_path='' as $$select kitty_website_private.runtime_configuration(p_gateway_token);$$;
revoke all on function public.kitty_website_runtime_configuration(text) from public;
grant execute on function public.kitty_website_runtime_configuration(text) to anon,authenticated;
notify pgrst,'reload schema';
