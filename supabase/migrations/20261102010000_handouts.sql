-- =============================================================================
-- HANDOUTS — mestre envia texto/imagem pra jogadores selecionados (ou todos)
-- =============================================================================
create table public.handouts (
  id            uuid primary key default gen_random_uuid(),
  campaign_id   uuid not null references public.campaigns(id) on delete cascade,
  title         text,
  body          text,
  image_url     text,
  -- vazio = todos os jogadores da campanha; senão, só quem está na lista
  recipient_ids uuid[] not null default '{}'::uuid[],
  created_at    timestamptz not null default now()
);

create index on public.handouts(campaign_id, created_at desc);

alter table public.handouts enable row level security;

-- ---------- handouts: mestre vê e escreve tudo da sua campanha; jogador só
-- vê o que foi endereçado a ele (lista vazia = endereçado a todos) ----------
create policy "handouts_select_dm_or_recipient"
  on public.handouts for select
  to authenticated using (
    public.is_campaign_dm(campaign_id)
    or (
      public.is_campaign_member(campaign_id)
      and (array_length(recipient_ids, 1) is null or auth.uid() = any(recipient_ids))
    )
  );

create policy "handouts_write_dm"
  on public.handouts for all
  to authenticated
  using (public.is_campaign_dm(campaign_id))
  with check (public.is_campaign_dm(campaign_id));

alter publication supabase_realtime add table public.handouts;

-- =============================================================================
-- Storage bucket "handouts" (imagem opcional) — mesmo padrão do bucket "maps":
-- caminho handouts/<campaign_id>/<timestamp>-<filename>
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('handouts', 'handouts', true)
on conflict (id) do update set public = true;

drop policy if exists "handouts_bucket_read" on storage.objects;
create policy "handouts_bucket_read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'handouts');

drop policy if exists "handouts_bucket_insert_dm" on storage.objects;
create policy "handouts_bucket_insert_dm"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'handouts'
    and public.is_campaign_dm((storage.foldername(name))[1]::uuid)
  );

drop policy if exists "handouts_bucket_delete_dm" on storage.objects;
create policy "handouts_bucket_delete_dm"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'handouts'
    and public.is_campaign_dm((storage.foldername(name))[1]::uuid)
  );
