-- =============================================================================
-- Storage bucket "maps" + policies
-- =============================================================================
-- Para o upload de imagem de mapa no dm.js funcionar, precisamos de um bucket
-- público "maps" com policies:
--  - Insert: apenas DM da campanha (checa map_id → campaign_id → campaigns.dm_id)
--  - Select: qualquer autenticado (os jogadores precisam baixar a imagem)
-- Caminho das keys: maps/<map_id>/<timestamp>-<filename>
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('maps', 'maps', true)
on conflict (id) do update set public = true;

-- Policy de SELECT: qualquer autenticado pode baixar
drop policy if exists "maps_bucket_read" on storage.objects;
create policy "maps_bucket_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'maps');

-- Policy de INSERT: dm da campanha correspondente
-- Extraímos o map_id da pasta (segunda parte do path "maps/<map_id>/...")
drop policy if exists "maps_bucket_insert_dm" on storage.objects;
create policy "maps_bucket_insert_dm"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'maps'
    and exists (
      select 1 from public.maps m
      join public.campaigns c on c.id = m.campaign_id
      where m.id::text = (storage.foldername(name))[1]
        and c.dm_id = auth.uid()
    )
  );

drop policy if exists "maps_bucket_update_dm" on storage.objects;
create policy "maps_bucket_update_dm"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'maps'
    and exists (
      select 1 from public.maps m
      join public.campaigns c on c.id = m.campaign_id
      where m.id::text = (storage.foldername(name))[1]
        and c.dm_id = auth.uid()
    )
  );

drop policy if exists "maps_bucket_delete_dm" on storage.objects;
create policy "maps_bucket_delete_dm"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'maps'
    and exists (
      select 1 from public.maps m
      join public.campaigns c on c.id = m.campaign_id
      where m.id::text = (storage.foldername(name))[1]
        and c.dm_id = auth.uid()
    )
  );
