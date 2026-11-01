-- =============================================================================
-- INITIATIVE_ENTRIES — tracker de iniciativa compartilhado (combate)
-- =============================================================================
create table public.initiative_entries (
  id            uuid primary key default gen_random_uuid(),
  campaign_id   uuid not null references public.campaigns(id) on delete cascade,
  character_id  uuid references public.characters(id) on delete cascade,
  name          text not null,
  initiative    integer not null default 0,
  is_npc        boolean not null default false,
  is_current    boolean not null default false,
  created_at    timestamptz not null default now()
);

create index on public.initiative_entries(campaign_id);

alter table public.initiative_entries enable row level security;

-- ---------- initiative_entries: mestre tudo; jogador só vê ----------
create policy "initiative_entries_select_member"
  on public.initiative_entries for select
  to authenticated using (public.is_campaign_member(campaign_id));

create policy "initiative_entries_write_dm"
  on public.initiative_entries for all
  to authenticated using (public.is_campaign_dm(campaign_id))
  with check (public.is_campaign_dm(campaign_id));

alter publication supabase_realtime add table public.initiative_entries;
