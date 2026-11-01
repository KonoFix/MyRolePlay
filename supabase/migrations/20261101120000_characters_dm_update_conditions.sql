-- =============================================================================
-- Permite que o mestre da campanha marque/desmarque condições remotamente
-- (characters.sheet_json.activeConditions) nas fichas dos seus jogadores.
-- Um trigger restringe essa via de escrita: quando quem atualiza não é o
-- dono da ficha, só a chave activeConditions pode mudar — nome, dono,
-- retrato e o resto de sheet_json seguem protegidos.
-- =============================================================================

create or replace function public.characters_restrict_dm_update()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() = old.user_id then
    return new; -- dono da ficha: sem restrição extra
  end if;

  if new.name is distinct from old.name
     or new.user_id is distinct from old.user_id
     or new.portrait_url is distinct from old.portrait_url
     or (new.sheet_json - 'activeConditions') is distinct from (old.sheet_json - 'activeConditions') then
    raise exception 'Mestre só pode alterar activeConditions remotamente';
  end if;

  return new;
end;
$$;

drop trigger if exists t_characters_restrict_dm_update on public.characters;
create trigger t_characters_restrict_dm_update
  before update on public.characters
  for each row execute function public.characters_restrict_dm_update();

create policy "characters_update_dm_conditions"
  on public.characters for update
  to authenticated
  using (
    exists (
      select 1 from public.campaign_members m
      join public.campaigns c on c.id = m.campaign_id
      where m.character_id = characters.id and c.dm_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.campaign_members m
      join public.campaigns c on c.id = m.campaign_id
      where m.character_id = characters.id and c.dm_id = auth.uid()
    )
  );
