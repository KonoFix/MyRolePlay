-- =============================================================================
-- MyRolePlay v2 — Schema inicial
-- =============================================================================
-- Fluxo:
--   auth.users (nativo Supabase, criado no signup)
--     └── profiles (1:1)   ← role player | dm, display_name
--     └── characters (1:N) ← fichas do jogador (sheet_json)
--     └── campaigns (1:N)  ← campanhas do mestre
--          ├── arcs                 ← narrativa em markdown
--          ├── campaign_members     ← jogadores da campanha + personagem usado
--          ├── maps                 ← mapas da campanha
--          │    └── tokens          ← tokens no mapa
--          ├── npcs                 ← NPCs/monstros
--          └── dice_rolls           ← log de rolagens compartilhado
-- =============================================================================

-- ---------- Extensões necessárias ----------
create extension if not exists "pgcrypto" with schema public;  -- gen_random_uuid()

-- =============================================================================
-- 1. PROFILES — espelho público de auth.users com role
-- =============================================================================
create table public.profiles (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null check (char_length(display_name) between 2 and 60),
  role          text not null default 'player' check (role in ('player','dm')),
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Trigger: cria profile automaticamente ao criar usuário em auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role', 'player')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- 2. CHARACTERS — fichas do jogador (sheet_json tem shape de createDefaultCharacter em app.js)
-- =============================================================================
create table public.characters (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  sheet_json    jsonb not null,
  portrait_url  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index on public.characters(user_id);

-- =============================================================================
-- 3. CAMPAIGNS — campanha do mestre
-- =============================================================================
create table public.campaigns (
  id              uuid primary key default gen_random_uuid(),
  dm_id           uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  description     text,
  current_arc_id  uuid,  -- FK adicionada abaixo após arcs existir
  join_code       text unique default upper(substring(replace(gen_random_uuid()::text,'-',''), 1, 8)),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index on public.campaigns(dm_id);

-- =============================================================================
-- 4. ARCS — arcos/capítulos narrativos (markdown)
-- =============================================================================
create table public.arcs (
  id                 uuid primary key default gen_random_uuid(),
  campaign_id        uuid not null references public.campaigns(id) on delete cascade,
  title              text not null,
  body_md            text not null default '',
  order_idx          integer not null default 0,
  visible_to_players boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index on public.arcs(campaign_id, order_idx);

-- FK circular: current_arc_id de campaigns referencia arcs
alter table public.campaigns
  add constraint campaigns_current_arc_fkey
  foreign key (current_arc_id) references public.arcs(id) on delete set null;

-- =============================================================================
-- 5. CAMPAIGN_MEMBERS — jogadores participantes da campanha
-- =============================================================================
create table public.campaign_members (
  campaign_id   uuid not null references public.campaigns(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  character_id  uuid references public.characters(id) on delete set null,
  joined_at     timestamptz not null default now(),
  primary key (campaign_id, user_id)
);

create index on public.campaign_members(user_id);

-- =============================================================================
-- 6. MAPS — mapas interativos (uma campanha pode ter vários)
-- =============================================================================
create table public.maps (
  id              uuid primary key default gen_random_uuid(),
  campaign_id     uuid not null references public.campaigns(id) on delete cascade,
  title           text not null default 'Mapa',
  image_url       text,
  grid_px         integer not null default 64 check (grid_px between 8 and 256),
  width_px        integer not null default 1200,
  height_px       integer not null default 800,
  fog_mask_json   jsonb not null default '{"revealed":[]}'::jsonb,
  is_active       boolean not null default false,  -- apenas um mapa ativo por campanha
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index on public.maps(campaign_id);

-- =============================================================================
-- 7. NPCS — NPCs/monstros da campanha
-- =============================================================================
create table public.npcs (
  id                uuid primary key default gen_random_uuid(),
  campaign_id       uuid not null references public.campaigns(id) on delete cascade,
  name              text not null,
  stat_block_json   jsonb not null default '{}'::jsonb,
  avatar_url        text,
  is_hostile        boolean not null default true,
  created_at        timestamptz not null default now()
);

create index on public.npcs(campaign_id);

-- =============================================================================
-- 8. TOKENS — tokens no mapa (vinculados a character OU npc, nunca ambos)
-- =============================================================================
create table public.tokens (
  id            uuid primary key default gen_random_uuid(),
  map_id        uuid not null references public.maps(id) on delete cascade,
  character_id  uuid references public.characters(id) on delete cascade,
  npc_id        uuid references public.npcs(id) on delete cascade,
  label         text,
  x             integer not null default 0,
  y             integer not null default 0,
  color         text default '#c89b3c',
  size_cells    integer not null default 1 check (size_cells between 1 and 10),
  hp_current    integer,
  hp_max        integer,
  conditions    text[] not null default array[]::text[],
  updated_at    timestamptz not null default now(),
  constraint tokens_exactly_one_owner check (
    (character_id is not null and npc_id is null) or
    (character_id is null and npc_id is not null) or
    (character_id is null and npc_id is null)  -- token "neutro" (iluminação, marcador)
  )
);

create index on public.tokens(map_id);

-- =============================================================================
-- 9. DICE_ROLLS — log de rolagens compartilhado (realtime)
-- =============================================================================
create table public.dice_rolls (
  id             uuid primary key default gen_random_uuid(),
  campaign_id    uuid not null references public.campaigns(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  label          text not null,
  formula        text not null,       -- ex: "d20+5"
  result_total   integer not null,
  result_detail  jsonb not null,      -- {dice:[...], mod:5, nat20:false, nat1:false}
  is_hidden      boolean not null default false,  -- rolagem oculta do mestre
  created_at     timestamptz not null default now()
);

create index on public.dice_rolls(campaign_id, created_at desc);

-- =============================================================================
-- Trigger de updated_at para tabelas que precisam
-- =============================================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger t_profiles_touch   before update on public.profiles   for each row execute function public.touch_updated_at();
create trigger t_characters_touch before update on public.characters for each row execute function public.touch_updated_at();
create trigger t_campaigns_touch  before update on public.campaigns  for each row execute function public.touch_updated_at();
create trigger t_arcs_touch       before update on public.arcs       for each row execute function public.touch_updated_at();
create trigger t_maps_touch       before update on public.maps       for each row execute function public.touch_updated_at();
create trigger t_tokens_touch     before update on public.tokens     for each row execute function public.touch_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table public.profiles         enable row level security;
alter table public.characters       enable row level security;
alter table public.campaigns        enable row level security;
alter table public.arcs             enable row level security;
alter table public.campaign_members enable row level security;
alter table public.maps             enable row level security;
alter table public.npcs             enable row level security;
alter table public.tokens           enable row level security;
alter table public.dice_rolls       enable row level security;

-- -------- Helper: é mestre da campanha? --------
create or replace function public.is_campaign_dm(_campaign_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.campaigns c
    where c.id = _campaign_id and c.dm_id = auth.uid()
  );
$$;

-- -------- Helper: é membro (dm ou jogador) da campanha? --------
create or replace function public.is_campaign_member(_campaign_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select
    public.is_campaign_dm(_campaign_id)
    or exists (
      select 1 from public.campaign_members m
      where m.campaign_id = _campaign_id and m.user_id = auth.uid()
    );
$$;

-- ---------- profiles: todos autenticados podem ler, só o dono edita ----------
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- characters: dono + mestres das campanhas em que o char participa ----------
create policy "characters_select_own_or_dm"
  on public.characters for select
  to authenticated using (
    user_id = auth.uid()
    or exists (
      select 1 from public.campaign_members m
      join public.campaigns c on c.id = m.campaign_id
      where m.character_id = characters.id and c.dm_id = auth.uid()
    )
  );

create policy "characters_insert_own"
  on public.characters for insert
  to authenticated with check (user_id = auth.uid());

create policy "characters_update_own"
  on public.characters for update
  to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "characters_delete_own"
  on public.characters for delete
  to authenticated using (user_id = auth.uid());

-- ---------- campaigns: dm vê suas; jogadores veem campanhas em que são membros ----------
create policy "campaigns_select_member"
  on public.campaigns for select
  to authenticated using (
    dm_id = auth.uid()
    or exists (select 1 from public.campaign_members m where m.campaign_id = id and m.user_id = auth.uid())
  );

create policy "campaigns_insert_dm"
  on public.campaigns for insert
  to authenticated with check (dm_id = auth.uid());

create policy "campaigns_update_dm"
  on public.campaigns for update
  to authenticated using (dm_id = auth.uid()) with check (dm_id = auth.uid());

create policy "campaigns_delete_dm"
  on public.campaigns for delete
  to authenticated using (dm_id = auth.uid());

-- ---------- arcs: mestre edita; jogador vê apenas os visíveis ----------
create policy "arcs_select_member_visible"
  on public.arcs for select
  to authenticated using (
    public.is_campaign_dm(campaign_id)
    or (visible_to_players and public.is_campaign_member(campaign_id))
  );

create policy "arcs_write_dm"
  on public.arcs for all
  to authenticated using (public.is_campaign_dm(campaign_id))
  with check (public.is_campaign_dm(campaign_id));

-- ---------- campaign_members: dm gerencia; jogador vê sua participação ----------
create policy "members_select_dm_or_self"
  on public.campaign_members for select
  to authenticated using (
    user_id = auth.uid() or public.is_campaign_dm(campaign_id)
  );

create policy "members_insert_dm_or_self"
  on public.campaign_members for insert
  to authenticated with check (
    public.is_campaign_dm(campaign_id)
    or user_id = auth.uid()   -- joga via join_code: validado no app
  );

create policy "members_update_dm_or_self"
  on public.campaign_members for update
  to authenticated using (
    user_id = auth.uid() or public.is_campaign_dm(campaign_id)
  );

create policy "members_delete_dm_or_self"
  on public.campaign_members for delete
  to authenticated using (
    user_id = auth.uid() or public.is_campaign_dm(campaign_id)
  );

-- ---------- maps: mestre edita; jogador vê (fog_mask é renderizado client-side) ----------
create policy "maps_select_member"
  on public.maps for select
  to authenticated using (public.is_campaign_member(campaign_id));

create policy "maps_write_dm"
  on public.maps for all
  to authenticated using (public.is_campaign_dm(campaign_id))
  with check (public.is_campaign_dm(campaign_id));

-- ---------- npcs: mestre tudo; jogador vê (sem stat block oculto por enquanto) ----------
create policy "npcs_select_member"
  on public.npcs for select
  to authenticated using (public.is_campaign_member(campaign_id));

create policy "npcs_write_dm"
  on public.npcs for all
  to authenticated using (public.is_campaign_dm(campaign_id))
  with check (public.is_campaign_dm(campaign_id));

-- ---------- tokens: mestre tudo; jogador move só o próprio token ----------
create policy "tokens_select_member"
  on public.tokens for select
  to authenticated using (
    exists (select 1 from public.maps m where m.id = tokens.map_id and public.is_campaign_member(m.campaign_id))
  );

create policy "tokens_insert_dm"
  on public.tokens for insert
  to authenticated with check (
    exists (select 1 from public.maps m where m.id = tokens.map_id and public.is_campaign_dm(m.campaign_id))
  );

create policy "tokens_update_dm_or_own_character"
  on public.tokens for update
  to authenticated using (
    exists (select 1 from public.maps m where m.id = tokens.map_id and public.is_campaign_dm(m.campaign_id))
    or exists (
      select 1 from public.characters c
      where c.id = tokens.character_id and c.user_id = auth.uid()
    )
  );

create policy "tokens_delete_dm"
  on public.tokens for delete
  to authenticated using (
    exists (select 1 from public.maps m where m.id = tokens.map_id and public.is_campaign_dm(m.campaign_id))
  );

-- ---------- dice_rolls: membro vê públicas da campanha + suas próprias ocultas ----------
create policy "dice_rolls_select"
  on public.dice_rolls for select
  to authenticated using (
    public.is_campaign_member(campaign_id)
    and (not is_hidden or user_id = auth.uid())
  );

create policy "dice_rolls_insert_member"
  on public.dice_rolls for insert
  to authenticated with check (
    public.is_campaign_member(campaign_id) and user_id = auth.uid()
  );

-- =============================================================================
-- REALTIME — habilita broadcast de mudanças
-- =============================================================================
alter publication supabase_realtime add table public.characters;
alter publication supabase_realtime add table public.tokens;
alter publication supabase_realtime add table public.maps;
alter publication supabase_realtime add table public.arcs;
alter publication supabase_realtime add table public.dice_rolls;
alter publication supabase_realtime add table public.campaign_members;
