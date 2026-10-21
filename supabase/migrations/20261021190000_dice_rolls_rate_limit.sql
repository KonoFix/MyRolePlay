-- =============================================================================
-- Rate limit em dice_rolls: max 20 inserts por minuto por usuário.
-- Protege contra scripts abusivos / loops acidentais no frontend.
-- =============================================================================

create or replace function public.dice_rolls_rate_check()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from public.dice_rolls
  where user_id = new.user_id
    and created_at >= (now() - interval '1 minute');

  if recent_count >= 20 then
    raise exception 'rate limit: máximo 20 rolagens por minuto'
      using errcode = 'P0002';
  end if;

  return new;
end;
$$;

drop trigger if exists dice_rolls_rate_limit on public.dice_rolls;
create trigger dice_rolls_rate_limit
  before insert on public.dice_rolls
  for each row execute function public.dice_rolls_rate_check();
