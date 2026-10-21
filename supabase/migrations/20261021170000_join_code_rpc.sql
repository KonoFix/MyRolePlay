-- =============================================================================
-- RPC: entrar em campanha via join_code
-- =============================================================================
-- Problema: a policy campaigns_select_member exige ser dm ou já estar em
-- campaign_members. Um jogador novo tentando "join by code" não é nenhum
-- dos dois → RLS retorna 0 linhas → código parece inválido.
--
-- Solução: função security definer que:
--   1) procura a campanha pelo code (bypassa RLS)
--   2) insere o usuário autenticado em campaign_members
--   3) retorna o id/título da campanha
-- =============================================================================

create or replace function public.join_campaign_by_code(
  _code text,
  _character_id uuid default null
)
returns table (campaign_id uuid, title text)
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _c   record;
begin
  if _uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select c.id, c.title into _c
  from public.campaigns c
  where c.join_code = upper(trim(_code))
  limit 1;

  if _c.id is null then
    raise exception 'invalid join code' using errcode = 'P0001';
  end if;

  -- Upsert em campaign_members (chave composta campaign_id + user_id)
  insert into public.campaign_members (campaign_id, user_id, character_id)
  values (_c.id, _uid, _character_id)
  on conflict (campaign_id, user_id) do update
    set character_id = excluded.character_id;

  campaign_id := _c.id;
  title := _c.title;
  return next;
end;
$$;

-- Permite usuários autenticados chamarem a função
grant execute on function public.join_campaign_by_code(text, uuid) to authenticated;
