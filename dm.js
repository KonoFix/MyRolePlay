// =============================================================================
// dm.js — Página do Mestre
// =============================================================================
import { supabase } from './shared/supabase-client.js';
import { requireAuth, updateRole } from './shared/auth.js';
import { createBoard } from './map/konva-board.js';
import { marked } from 'https://esm.sh/marked@12.0.2';
import DOMPurify from 'https://esm.sh/dompurify@3.1.6';

marked.setOptions({ gfm: true, breaks: true });
function renderMarkdown(md) {
  return DOMPurify.sanitize(marked.parse(md || ''));
}

const authed = await requireAuth({ requireRole: 'dm' });
if (!authed) throw new Error('redirecting');

const dmProfile = authed.profile;
const dmUserId = authed.session.user.id;

// ---------- Estado da página ----------
const state = {
  campaigns: [],
  activeCampaignId: null,
  arcs: [],
  activeArcId: null,
  players: [],       // [{ user_id, display_name, character }]
  rolls: [],
  liveChannel: null,
  maps: [],
  activeMapId: null,
  tokens: [],
  board: null,
  onlineUserIds: new Set(),
};

// ---------- Boot ----------
renderDmAvatar();
await loadCampaigns();
setupUI();

function renderDmAvatar() {
  const img = document.getElementById('dmAvatarImg');
  const ph = document.getElementById('dmAvatarPlaceholder');
  if (!img || !ph) return;
  const src = dmProfile?.avatar_url;
  if (src) { img.src = src; img.hidden = false; ph.style.display = 'none'; }
  else { img.hidden = true; ph.style.display = ''; }
}

async function handleDmAvatarUpload(file) {
  if (!file || !file.type.startsWith('image/')) return alert('Selecione uma imagem.');
  if (file.size > 1.5 * 1024 * 1024) return alert('Imagem muito grande (máx 1.5 MB).');
  const path = `${dmUserId}/${Date.now()}-${file.name}`;
  const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
  if (upErr) return alert('Falha no upload: ' + upErr.message);
  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
  const { error: pErr } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('user_id', dmUserId);
  if (pErr) return alert('Falha ao salvar: ' + pErr.message);
  dmProfile.avatar_url = publicUrl;
  renderDmAvatar();
}

// =============================================================================
// Campanhas
// =============================================================================
async function loadCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('dm_id', dmUserId)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return; }

  state.campaigns = data || [];
  const sel = document.getElementById('dmCampaignSelect');
  sel.innerHTML = state.campaigns.length === 0
    ? '<option value="">(sem campanhas ainda)</option>'
    : state.campaigns.map(c => `<option value="${c.id}">${escapeHtml(c.title)}</option>`).join('');

  if (state.campaigns.length > 0) {
    await setActiveCampaign(state.campaigns[0].id);
  } else {
    document.getElementById('dmCampaignTitle').textContent = 'Mesa do Mestre';
    document.getElementById('dmCampaignSubtitle').textContent = 'Clique em "Nova Campanha" para começar';
  }
}

async function setActiveCampaign(id) {
  state.activeCampaignId = id;
  const camp = state.campaigns.find(c => c.id === id);
  if (!camp) return;

  document.getElementById('dmCampaignTitle').textContent = camp.title;
  document.getElementById('dmCampaignSubtitle').textContent =
    `Código de convite: ${camp.join_code} • Mestre: ${dmProfile?.display_name || 'Você'}`;

  await Promise.all([
    loadPlayers(id),
    loadArcs(id),
    loadRolls(id),
    loadMaps(id),
  ]);

  subscribeRealtime(id);
}

async function createCampaign({ title, description }) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ dm_id: dmUserId, title, description })
    .select()
    .single();
  if (error) { alert('Falha ao criar: ' + error.message); return; }
  await loadCampaigns();
  await setActiveCampaign(data.id);
}

// =============================================================================
// Jogadores da campanha
// =============================================================================
async function loadPlayers(campaignId) {
  // Query 1: membros da campanha (sem embed porque a FK é indireta via auth.users)
  const { data: members, error: mErr } = await supabase
    .from('campaign_members')
    .select('user_id, character_id, joined_at')
    .eq('campaign_id', campaignId);
  if (mErr) { console.warn('[dm] loadPlayers members', mErr); state.players = []; renderPlayers(); return; }

  if (!members || members.length === 0) {
    state.players = [];
    renderPlayers();
    return;
  }

  const userIds = members.map(m => m.user_id);
  const charIds = members.map(m => m.character_id).filter(Boolean);

  // Query 2 e 3 em paralelo: profiles + characters
  const [profilesRes, charactersRes] = await Promise.all([
    supabase.from('profiles').select('user_id, display_name, avatar_url').in('user_id', userIds),
    charIds.length
      ? supabase.from('characters').select('id, name, sheet_json, portrait_url, user_id').in('id', charIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profilesByUid = Object.fromEntries((profilesRes.data || []).map(p => [p.user_id, p]));
  const charsById     = Object.fromEntries((charactersRes.data || []).map(c => [c.id, c]));

  state.players = members.map(m => ({
    user_id: m.user_id,
    display_name: profilesByUid[m.user_id]?.display_name || '—',
    avatar_url:   profilesByUid[m.user_id]?.avatar_url || null,
    character:    m.character_id ? charsById[m.character_id] : null,
  }));
  renderPlayers();
}

function renderPlayers() {
  const grid = document.getElementById('dmPlayersGrid');
  if (state.players.length === 0) {
    grid.innerHTML = `
      <div class="dm-empty-state">
        <p>Nenhum jogador na campanha ainda. Compartilhe o <strong>código de convite</strong> acima.</p>
      </div>`;
    document.getElementById('dmPresenceSummary').textContent = '0 jogadores';
    return;
  }

  grid.innerHTML = state.players.map(p => renderPlayerCard(p)).join('');
  const onlineCount = state.players.filter(p => state.onlineUserIds.has(p.user_id)).length;
  document.getElementById('dmPresenceSummary').textContent =
    `${onlineCount} / ${state.players.length} online`;

  // Clique no card abre modal de detalhes
  grid.querySelectorAll('.dm-player-card[data-uid]').forEach(card => {
    card.addEventListener('click', () => openPlayerDetail(card.dataset.uid));
  });
}

function renderPlayerCard(p) {
  const online = state.onlineUserIds.has(p.user_id);
  const dot = `<span class="dm-presence-dot ${online ? 'on' : 'off'}" title="${online ? 'Online' : 'Offline'}"></span>`;
  const char = p.character;
  if (!char) {
    return `<div class="dm-player-card ${online ? 'is-online' : ''}" data-uid="${escapeAttr(p.user_id)}">
      <div class="dm-player-head">
        <div class="dm-player-portrait" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted);">?</div>
        <div>
          <div class="dm-player-name">${dot}${escapeHtml(p.display_name)}</div>
          <div class="dm-player-class">(sem personagem vinculado)</div>
        </div>
      </div>
    </div>`;
  }
  const sheet = char.sheet_json || {};
  const hp = sheet.hp || { current: 0, max: 1, temp: 0 };
  const pct = Math.max(0, Math.min(100, (hp.current / Math.max(1, hp.max)) * 100));
  const hpClass = pct < 25 ? 'danger' : pct < 60 ? 'warn' : '';
  const conds = Array.isArray(sheet.activeConditions) ? sheet.activeConditions : [];
  const portrait = sheet.portrait || char.portrait_url || '';
  const classInfo = `${sheet.class || '—'} ${sheet.level ? '• Nv ' + sheet.level : ''}`;

  return `
    <div class="dm-player-card ${online ? 'is-online' : ''}" data-uid="${escapeAttr(p.user_id)}">
      <div class="dm-player-head">
        ${portrait
          ? `<img class="dm-player-portrait" src="${escapeAttr(portrait)}" alt="">`
          : `<div class="dm-player-portrait" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted);">🎭</div>`}
        <div>
          <div class="dm-player-name">${dot}${escapeHtml(sheet.name || char.name)}</div>
          <div class="dm-player-class">${escapeHtml(classInfo)}</div>
          <div class="dm-player-class" style="color:var(--text-secondary);">
            ${escapeHtml(p.display_name)}
          </div>
        </div>
      </div>
      <div class="dm-player-hp ${hpClass}">
        <div class="dm-player-hp-bar"><div class="dm-player-hp-fill" style="width:${pct}%"></div></div>
        <div class="dm-player-hp-text">
          <span>❤️ ${hp.current}/${hp.max}${hp.temp ? ' (+' + hp.temp + ' temp)' : ''}</span>
          <span>${pct.toFixed(0)}%</span>
        </div>
      </div>
      <div class="dm-player-stats">
        <div class="dm-player-stat"><span class="lbl">CA</span><span class="val">${sheet.armorClass ?? '—'}</span></div>
        <div class="dm-player-stat"><span class="lbl">Inic</span><span class="val">${formatMod(sheet.initiativeBonus)}</span></div>
        <div class="dm-player-stat"><span class="lbl">Vel</span><span class="val">${sheet.speed ?? '—'}m</span></div>
        <div class="dm-player-stat"><span class="lbl">Insp</span><span class="val">${sheet.inspiration ? '✨' : '—'}</span></div>
      </div>
      ${conds.length ? `<div class="dm-player-conditions">${conds.map(c => `<span class="dm-condition-pill">${escapeHtml(c)}</span>`).join('')}</div>` : ''}
    </div>`;
}

// =============================================================================
// Arcos narrativos
// =============================================================================
async function loadArcs(campaignId) {
  const { data, error } = await supabase
    .from('arcs')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('order_idx');
  if (error) { console.warn(error); state.arcs = []; }
  else state.arcs = data || [];
  renderArcs();
}

function renderArcs() {
  const ul = document.getElementById('dmArcsList');
  if (state.arcs.length === 0) {
    ul.innerHTML = `<li style="cursor:default;color:var(--text-muted);">Nenhum arco ainda</li>`;
    clearArcEditor();
    return;
  }
  ul.innerHTML = state.arcs.map(a => `
    <li data-id="${a.id}" class="${a.id === state.activeArcId ? 'active' : ''}">
      <span>${escapeHtml(a.title)}</span>
      <span class="arc-hidden-icon">${a.visible_to_players ? '👁' : '🔒'}</span>
    </li>`).join('');
  ul.querySelectorAll('li[data-id]').forEach(li => {
    li.addEventListener('click', () => selectArc(li.dataset.id));
  });
  if (!state.activeArcId && state.arcs[0]) selectArc(state.arcs[0].id);
}

function selectArc(id) {
  state.activeArcId = id;
  const a = state.arcs.find(x => x.id === id);
  if (!a) return clearArcEditor();
  document.getElementById('dmArcTitle').value = a.title;
  document.getElementById('dmArcBody').value = a.body_md || '';
  document.getElementById('dmArcVisible').checked = !!a.visible_to_players;
  refreshArcPreview();
  renderArcs();
}

function clearArcEditor() {
  const t = document.getElementById('dmArcTitle');
  const b = document.getElementById('dmArcBody');
  const v = document.getElementById('dmArcVisible');
  if (t) t.value = '';
  if (b) b.value = '';
  if (v) v.checked = false;
  refreshArcPreview();
}

function refreshArcPreview() {
  const body = document.getElementById('dmArcBody');
  const preview = document.getElementById('dmArcPreview');
  if (body && preview) preview.innerHTML = renderMarkdown(body.value);
}

async function saveArc() {
  if (!state.activeCampaignId) return alert('Selecione uma campanha.');
  const title = document.getElementById('dmArcTitle').value.trim() || 'Sem título';
  const body_md = document.getElementById('dmArcBody').value;
  const visible = document.getElementById('dmArcVisible').checked;

  if (state.activeArcId) {
    const { error } = await supabase.from('arcs')
      .update({ title, body_md, visible_to_players: visible })
      .eq('id', state.activeArcId);
    if (error) return alert('Erro: ' + error.message);
  } else {
    const { data, error } = await supabase.from('arcs')
      .insert({ campaign_id: state.activeCampaignId, title, body_md, visible_to_players: visible, order_idx: state.arcs.length })
      .select().single();
    if (error) return alert('Erro: ' + error.message);
    state.activeArcId = data.id;
  }
  await loadArcs(state.activeCampaignId);
}

async function deleteActiveArc() {
  if (!state.activeArcId) return;
  if (!confirm('Excluir este arco?')) return;
  await supabase.from('arcs').delete().eq('id', state.activeArcId);
  state.activeArcId = null;
  await loadArcs(state.activeCampaignId);
}

// =============================================================================
// Log de rolagens
// =============================================================================
async function loadRolls(campaignId) {
  const { data, error } = await supabase
    .from('dice_rolls')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) { console.warn('[dm] loadRolls', error); state.rolls = []; renderRolls(); return; }

  const rolls = data || [];
  const userIds = [...new Set(rolls.map(r => r.user_id))];
  if (userIds.length > 0) {
    const { data: profs } = await supabase.from('profiles')
      .select('user_id, display_name')
      .in('user_id', userIds);
    const byUid = Object.fromEntries((profs || []).map(p => [p.user_id, p]));
    for (const r of rolls) r.display_name = byUid[r.user_id]?.display_name || '—';
  }
  state.rolls = rolls;
  renderRolls();
}

function renderRolls() {
  const ol = document.getElementById('dmRollLog');
  if (!state.rolls.length) {
    ol.innerHTML = `<li style="cursor:default;color:var(--text-muted);">Nenhuma rolagem ainda</li>`;
    return;
  }
  ol.innerHTML = state.rolls.map(r => {
    const nat = r.result_detail?.nat20 ? 'nat20' : r.result_detail?.nat1 ? 'nat1' : '';
    const who = r.display_name || '?';
    const hidden = r.is_hidden ? 'hidden' : '';
    return `<li class="${nat} ${hidden}">
      <span><strong>${escapeHtml(who)}</strong> rolou <em>${escapeHtml(r.label)}</em> (${escapeHtml(r.formula)})</span>
      <span class="roll-total">${r.result_total}</span>
    </li>`;
  }).join('');
}

// =============================================================================
// Mapas & tokens
// =============================================================================
async function loadMaps(campaignId) {
  const { data, error } = await supabase
    .from('maps').select('*')
    .eq('campaign_id', campaignId)
    .order('created_at');
  if (error) { console.warn(error); state.maps = []; }
  else state.maps = data || [];
  renderMapSelect();
  const activeMap = state.maps.find(m => m.is_active) || state.maps[0];
  if (activeMap) await selectMap(activeMap.id);
  else destroyBoard();
}

function renderMapSelect() {
  const sel = document.getElementById('dmMapSelect');
  if (!sel) return;
  sel.innerHTML = state.maps.length === 0
    ? '<option value="">(sem mapas)</option>'
    : state.maps.map(m => `<option value="${m.id}" ${m.id===state.activeMapId?'selected':''}>${escapeHtml(m.title)}</option>`).join('');
}

async function selectMap(mapId) {
  state.activeMapId = mapId;
  renderMapSelect();
  await loadTokens(mapId);
  renderBoard();
}

async function createMap() {
  if (!state.activeCampaignId) return alert('Selecione uma campanha.');
  const title = prompt('Nome do mapa:', 'Novo Mapa');
  if (!title) return;
  const { data, error } = await supabase.from('maps').insert({
    campaign_id: state.activeCampaignId,
    title,
    is_active: state.maps.length === 0,
  }).select().single();
  if (error) return alert('Erro: ' + error.message);
  await loadMaps(state.activeCampaignId);
  await selectMap(data.id);
}

async function uploadMapImage(file) {
  if (!state.activeMapId) return alert('Selecione um mapa primeiro.');
  // Path dentro do bucket "maps": <mapId>/<timestamp>-<filename>
  // (sem "maps/" redundante — bucket já é "maps")
  const path = `${state.activeMapId}/${Date.now()}-${file.name}`;
  const { error: upErr } = await supabase.storage.from('maps').upload(path, file, { upsert: true });
  if (upErr) {
    // Bucket "maps" talvez não exista — avisa com instrução
    return alert('Falha no upload: ' + upErr.message + '\n\nCrie o bucket "maps" (público) em Supabase Dashboard → Storage.');
  }
  const { data: { publicUrl } } = supabase.storage.from('maps').getPublicUrl(path);
  const img = new Image();
  img.onload = async () => {
    await supabase.from('maps').update({
      image_url: publicUrl,
      width_px: img.naturalWidth,
      height_px: img.naturalHeight,
    }).eq('id', state.activeMapId);
    await loadMaps(state.activeCampaignId);
  };
  img.src = publicUrl;
}

async function loadTokens(mapId) {
  const { data, error } = await supabase.from('tokens').select('*').eq('map_id', mapId);
  if (error) { console.warn(error); state.tokens = []; }
  else state.tokens = data || [];
}

function destroyBoard() {
  if (state.board) { state.board.destroy(); state.board = null; }
  document.getElementById('dmBoardHost').innerHTML = '';
}

function renderBoard() {
  const map = state.maps.find(m => m.id === state.activeMapId);
  if (!map) return destroyBoard();
  destroyBoard();

  state.board = createBoard({
    container: 'dmBoardHost',
    map,
    tokens: state.tokens.map(t => ({
      id: t.id,
      x: t.x,
      y: t.y,
      color: t.color || '#c89b3c',
      label: t.label || '',
      size_cells: t.size_cells || 1,
    })),
    isDM: true,
    callbacks: {
      onTokenMove: async (id, x, y) => {
        await supabase.from('tokens').update({ x, y, updated_at: new Date().toISOString() }).eq('id', id);
      },
      onFogChange: async (revealedCells) => {
        await supabase.from('maps')
          .update({ fog_mask_json: { revealed: revealedCells } })
          .eq('id', map.id);
      },
    },
  });
}

async function addNpcToken() {
  if (!state.activeMapId) return alert('Selecione um mapa.');
  const label = prompt('Rótulo do token:', 'NPC');
  if (!label) return;
  const { data, error } = await supabase.from('tokens').insert({
    map_id: state.activeMapId,
    label,
    x: 0, y: 0,
    color: '#c0392b',
  }).select().single();
  if (error) return alert('Erro: ' + error.message);
  state.tokens.push(data);
  state.board?.addToken({ id: data.id, x: 0, y: 0, color: '#c0392b', label, size_cells: 1 });
}

// =============================================================================
// Palette Cmd+K
// =============================================================================
function setupPalette() {
  const palette = document.getElementById('dmPalette');
  const input = document.getElementById('dmPaletteInput');
  const ul = document.getElementById('dmPaletteResults');
  if (!palette || !input || !ul) return;

  let activeIdx = 0;

  const close = () => { palette.hidden = true; };
  const open  = () => { palette.hidden = false; input.value = ''; render(); setTimeout(() => input.focus(), 10); };

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.hidden ? open() : close();
    } else if (e.key === 'Escape' && !palette.hidden) {
      close();
    }
  });

  palette.addEventListener('click', (e) => { if (e.target === palette) close(); });

  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    const items = ul.querySelectorAll('li');
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(items.length - 1, activeIdx + 1); highlight(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(0, activeIdx - 1); highlight(); }
    else if (e.key === 'Enter') { e.preventDefault(); items[activeIdx]?.click(); }
  });

  function highlight() {
    ul.querySelectorAll('li').forEach((li, i) => li.classList.toggle('active', i === activeIdx));
    ul.querySelector('li.active')?.scrollIntoView({ block: 'nearest' });
  }

  function render() {
    const q = input.value.toLowerCase().trim();
    const items = [];
    state.campaigns.forEach(c => items.push({ kind: 'Campanha', label: c.title, action: () => setActiveCampaign(c.id) }));
    state.arcs.forEach(a => items.push({ kind: 'Arco', label: a.title, action: () => { switchTab('dm-tab-narrative'); selectArc(a.id); } }));
    state.players.forEach(p => items.push({ kind: 'Jogador', label: p.display_name + (p.character ? ` (${p.character.name})` : ''), action: () => switchTab('dm-tab-live') }));
    state.maps.forEach(m => items.push({ kind: 'Mapa', label: m.title, action: () => { switchTab('dm-tab-map'); selectMap(m.id); } }));

    const filtered = q ? items.filter(it => it.label.toLowerCase().includes(q) || it.kind.toLowerCase().includes(q)) : items.slice(0, 20);
    activeIdx = 0;
    ul.innerHTML = filtered.length === 0
      ? '<li style="cursor:default;color:var(--text-muted);">Nenhum resultado</li>'
      : filtered.map((it, i) => `<li class="${i===0?'active':''}" data-i="${i}">${escapeHtml(it.label)}<span class="kind">${it.kind}</span></li>`).join('');
    ul.querySelectorAll('li[data-i]').forEach(li => {
      li.addEventListener('mouseenter', () => { activeIdx = +li.dataset.i; highlight(); });
      li.addEventListener('click', () => { filtered[+li.dataset.i].action(); close(); });
    });
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');
  document.getElementById(tabId)?.classList.add('active');
}

// =============================================================================
// Export / Import de campanha
// =============================================================================
async function exportActiveCampaign() {
  const camp = state.campaigns.find(c => c.id === state.activeCampaignId);
  if (!camp) return alert('Selecione uma campanha primeiro.');

  const [arcs, npcs, maps, members, tokens] = await Promise.all([
    supabase.from('arcs').select('*').eq('campaign_id', camp.id),
    supabase.from('npcs').select('*').eq('campaign_id', camp.id),
    supabase.from('maps').select('*').eq('campaign_id', camp.id),
    supabase.from('campaign_members').select('*').eq('campaign_id', camp.id),
    (async () => {
      const { data: ms } = await supabase.from('maps').select('id').eq('campaign_id', camp.id);
      const ids = (ms || []).map(m => m.id);
      if (!ids.length) return { data: [] };
      return supabase.from('tokens').select('*').in('map_id', ids);
    })(),
  ]);

  const bundle = {
    version: 1,
    exported_at: new Date().toISOString(),
    campaign: { title: camp.title, description: camp.description || '' },
    arcs: (arcs.data || []).map(a => ({ title: a.title, body_md: a.body_md, order_idx: a.order_idx, visible_to_players: a.visible_to_players })),
    npcs: (npcs.data || []).map(n => ({ name: n.name, stat_block_json: n.stat_block_json, is_hostile: n.is_hostile })),
    maps: (maps.data || []).map(m => ({ title: m.title, grid_px: m.grid_px, width_px: m.width_px, height_px: m.height_px, fog_mask_json: m.fog_mask_json, is_active: m.is_active, image_url: m.image_url })),
    tokens: (tokens.data || []).map(t => ({ map_title: (maps.data || []).find(m => m.id === t.map_id)?.title, label: t.label, x: t.x, y: t.y, color: t.color, size_cells: t.size_cells, hp_current: t.hp_current, hp_max: t.hp_max, conditions: t.conditions })),
    members_count: (members.data || []).length,
  };

  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `campanha-${camp.title.replace(/\W+/g, '-').toLowerCase()}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

async function importCampaignJson(file) {
  let bundle;
  try { bundle = JSON.parse(await file.text()); }
  catch { return alert('Arquivo JSON inválido.'); }
  if (!bundle.campaign) return alert('Formato não reconhecido.');

  if (!confirm(`Importar "${bundle.campaign.title}" como nova campanha?`)) return;

  // 1. Cria a campanha
  const { data: camp, error: cErr } = await supabase.from('campaigns').insert({
    dm_id: dmUserId,
    title: bundle.campaign.title + ' (importada)',
    description: bundle.campaign.description || '',
  }).select().single();
  if (cErr) return alert('Erro ao criar campanha: ' + cErr.message);

  // 2. Arcos
  if (bundle.arcs?.length) {
    await supabase.from('arcs').insert(bundle.arcs.map(a => ({ ...a, campaign_id: camp.id })));
  }

  // 3. NPCs
  if (bundle.npcs?.length) {
    await supabase.from('npcs').insert(bundle.npcs.map(n => ({ ...n, campaign_id: camp.id })));
  }

  // 4. Mapas (sem tokens primeiro, pra obter os novos IDs)
  const mapIdByTitle = {};
  if (bundle.maps?.length) {
    const rows = bundle.maps.map(m => ({ ...m, campaign_id: camp.id }));
    const { data: newMaps } = await supabase.from('maps').insert(rows).select();
    (newMaps || []).forEach(nm => { mapIdByTitle[nm.title] = nm.id; });
  }

  // 5. Tokens
  if (bundle.tokens?.length) {
    const tokenRows = bundle.tokens
      .filter(t => mapIdByTitle[t.map_title])
      .map(t => ({
        map_id: mapIdByTitle[t.map_title],
        label: t.label, x: t.x, y: t.y, color: t.color,
        size_cells: t.size_cells, hp_current: t.hp_current, hp_max: t.hp_max,
        conditions: t.conditions,
      }));
    if (tokenRows.length) await supabase.from('tokens').insert(tokenRows);
  }

  alert(`Importada! Nova campanha "${camp.title}" com ${bundle.arcs?.length || 0} arcos, ${bundle.npcs?.length || 0} NPCs, ${bundle.maps?.length || 0} mapas.`);
  await loadCampaigns();
  await setActiveCampaign(camp.id);
}

// =============================================================================
// Realtime
// =============================================================================
function subscribeRealtime(campaignId) {
  if (state.liveChannel) supabase.removeChannel(state.liveChannel);

  state.liveChannel = supabase
    .channel(`campaign:${campaignId}`, { config: { presence: { key: dmUserId } } })
    .on('presence', { event: 'sync' }, () => {
      const presenceState = state.liveChannel.presenceState();
      state.onlineUserIds = new Set(Object.keys(presenceState));
      renderPlayers();
    })
    .on('presence', { event: 'join' }, () => {
      const presenceState = state.liveChannel.presenceState();
      state.onlineUserIds = new Set(Object.keys(presenceState));
      renderPlayers();
    })
    .on('presence', { event: 'leave' }, () => {
      const presenceState = state.liveChannel.presenceState();
      state.onlineUserIds = new Set(Object.keys(presenceState));
      renderPlayers();
    })
    .on('postgres_changes',
        { event: '*', schema: 'public', table: 'characters' },
        () => loadPlayers(campaignId))
    .on('postgres_changes',
        { event: '*', schema: 'public', table: 'campaign_members', filter: `campaign_id=eq.${campaignId}` },
        () => loadPlayers(campaignId))
    .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'dice_rolls', filter: `campaign_id=eq.${campaignId}` },
        () => loadRolls(campaignId))
    .on('postgres_changes',
        { event: '*', schema: 'public', table: 'arcs', filter: `campaign_id=eq.${campaignId}` },
        () => loadArcs(campaignId))
    .on('postgres_changes',
        { event: '*', schema: 'public', table: 'maps', filter: `campaign_id=eq.${campaignId}` },
        () => loadMaps(campaignId))
    .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tokens' },
        async (payload) => {
          if (!state.activeMapId) return;
          const t = payload.new;
          if (t.map_id !== state.activeMapId) return;
          const idx = state.tokens.findIndex(x => x.id === t.id);
          if (idx >= 0) state.tokens[idx] = t;
          state.board?.updateToken(t.id, { x: t.x, y: t.y });
        })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Anuncia a presença do mestre (ele também fica "online")
        await state.liveChannel.track({ since: Date.now(), role: 'dm' });
      }
    });
}

// =============================================================================
// Utilitários & UI
// =============================================================================
function escapeHtml(s)  { return (s ?? '').toString().replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[c])); }
function escapeAttr(s)  { return escapeHtml(s); }
function formatMod(n)   { if (n == null) return '—'; const v = +n; return (v >= 0 ? '+' : '') + v; }

function setupUI() {
  // Troca de abas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });

  document.getElementById('dmCampaignSelect').addEventListener('change', e => {
    setActiveCampaign(e.target.value);
  });
  document.getElementById('btnNewCampaign').addEventListener('click', () => {
    document.getElementById('newCampaignTitle').value = '';
    document.getElementById('newCampaignDesc').value = '';
    document.getElementById('newCampaignModal').classList.add('open');
  });
  document.getElementById('btnCreateCampaignConfirm').addEventListener('click', async () => {
    const title = document.getElementById('newCampaignTitle').value.trim();
    const description = document.getElementById('newCampaignDesc').value.trim();
    if (!title) return alert('Dê um título.');
    document.getElementById('newCampaignModal').classList.remove('open');
    await createCampaign({ title, description });
  });
  document.getElementById('btnCopyJoinCode').addEventListener('click', async () => {
    const camp = state.campaigns.find(c => c.id === state.activeCampaignId);
    if (!camp) return;
    try { await navigator.clipboard.writeText(camp.join_code); alert(`Código "${camp.join_code}" copiado!`); }
    catch { prompt('Código de convite:', camp.join_code); }
  });
  document.getElementById('btnDmSignOut').addEventListener('click', async (e) => {
    e.preventDefault();
    if (!confirm('Deseja sair?')) return;
    try {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    } catch (err) { alert('Falha ao sair: ' + (err?.message || err)); }
  });

  // Tema (compartilha a mesma preferência do jogador via dnd5e_theme)
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t === 'parchment' ? 'parchment' : 'dark');
    const icon = document.getElementById('dmThemeIcon');
    const label = document.getElementById('dmThemeLabel');
    if (icon)  icon.textContent  = t === 'parchment' ? '🌙' : '📜';
    if (label) label.textContent = t === 'parchment' ? 'Escuro' : 'Pergaminho';
  };
  applyTheme(localStorage.getItem('dnd5e_theme') || 'dark');
  document.getElementById('btnDmToggleTheme')?.addEventListener('click', () => {
    const next = (localStorage.getItem('dnd5e_theme') === 'parchment') ? 'dark' : 'parchment';
    localStorage.setItem('dnd5e_theme', next);
    applyTheme(next);
  });

  // Palette Cmd/Ctrl+K
  setupPalette();

  // Avatar do mestre
  document.getElementById('dmAvatarInput')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) handleDmAvatarUpload(file);
    e.target.value = '';
  });

  // Export / Import de campanha em JSON
  document.getElementById('btnExportCampaign')?.addEventListener('click', exportActiveCampaign);
  document.getElementById('importCampaignInput')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) importCampaignJson(file);
    e.target.value = '';
  });

  document.getElementById('btnSwitchToPlayer')?.addEventListener('click', async () => {
    if (!confirm('Alternar sua conta para Jogador?')) return;
    try {
      await updateRole('player');
      window.location.href = 'index.html';
    } catch (err) { alert('Falha: ' + err.message); }
  });
  document.getElementById('btnSaveArc').addEventListener('click', saveArc);
  document.getElementById('btnDeleteArc').addEventListener('click', deleteActiveArc);
  document.getElementById('btnNewArc').addEventListener('click', () => {
    state.activeArcId = null;
    clearArcEditor();
    document.getElementById('dmArcTitle').focus();
  });

  // Preview Markdown — tabs + update ao vivo
  const mdInput = document.getElementById('dmArcBody');
  const mdPreview = document.getElementById('dmArcPreview');
  const mdContainer = mdPreview?.closest('.dm-md-container');
  if (mdInput && mdPreview && mdContainer) {
    const updatePreview = () => { mdPreview.innerHTML = renderMarkdown(mdInput.value); };
    mdInput.addEventListener('input', updatePreview);
    updatePreview();
    document.querySelectorAll('.dm-md-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.dm-md-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mdContainer.dataset.mode = btn.dataset.mode;
      });
    });
  }

  // Compêndio GdM: Tesouros + Encontros
  document.getElementById('btnRollTreasure')?.addEventListener('click', () => {
    const cr = document.getElementById('treasureCR').value;
    const r = window.rollTreasureIndividual(cr);
    const totals = r.resolved;
    const coinRows = Object.entries(totals)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `<li><strong>${v}</strong> ${k.toUpperCase()}</li>`).join('');
    document.getElementById('treasureResult').innerHTML = `
      <div style="padding:10px 12px; background:rgba(0,0,0,0.25); border-radius:6px;">
        <div style="color:var(--text-muted); font-size:0.78rem;">d100 = ${r.roll} → ${escapeHtml(r.label)}</div>
        <ul style="margin:8px 0 0 16px;">${coinRows || '<li>Sem moedas</li>'}</ul>
      </div>`;
  });

  const addMonsterRow = (cr = '1', count = 1) => {
    const container = document.getElementById('encounterMonsters');
    const row = document.createElement('div');
    row.className = 'dm-monster-row';
    row.innerHTML = `
      <select class="field-select monster-cr" style="padding:4px 8px; font-size:0.85rem;">
        ${Object.keys(window.DM_DATA.xpByCR).map(c => `<option ${c===cr?'selected':''}>${c}</option>`).join('')}
      </select>
      <input class="field-input monster-count" type="number" min="1" value="${count}" style="width:70px; padding:4px 8px;">
      <button class="btn btn-accent monster-remove" type="button" style="padding:2px 10px; font-size:0.9rem;">×</button>`;
    row.querySelector('.monster-remove').addEventListener('click', () => row.remove());
    container.appendChild(row);
  };
  addMonsterRow('2', 2);  // seed inicial
  document.getElementById('btnAddMonster')?.addEventListener('click', () => addMonsterRow());

  document.getElementById('btnEvaluateEncounter')?.addEventListener('click', () => {
    const levels = document.getElementById('partyLevels').value
      .split(',').map(s => parseInt(s.trim(), 10)).filter(n => n >= 1 && n <= 20);
    if (levels.length === 0) return alert('Informe pelo menos 1 nível válido (1–20).');
    const monsters = Array.from(document.querySelectorAll('#encounterMonsters .dm-monster-row'))
      .map(r => ({
        cr: r.querySelector('.monster-cr').value,
        count: parseInt(r.querySelector('.monster-count').value, 10) || 1,
      }));
    if (monsters.length === 0) return alert('Adicione pelo menos 1 monstro.');
    const r = window.evaluateEncounter(levels, monsters);
    const colorByDiff = { trivial: 'var(--text-muted)', 'fácil': '#5a9a4e', moderado: '#c89b3c', 'difícil': '#e07845', mortal: '#c0392b' };
    document.getElementById('encounterResult').innerHTML = `
      <div style="padding:12px 14px; background:rgba(0,0,0,0.25); border-radius:6px;">
        <div style="font-family:var(--font-title); font-size:1.1rem; color:${colorByDiff[r.difficulty]}; text-transform:uppercase; font-weight:800;">
          Encontro ${r.difficulty}
        </div>
        <div style="margin-top:8px; font-size:0.85rem;">
          XP base: <strong>${r.baseXP}</strong> × ${r.mult} multiplicador
          (${r.totalCount} monstros) = <strong>${r.adjustedXP} XP ajustado</strong>
        </div>
        <div style="margin-top:6px; font-size:0.78rem; color:var(--text-muted);">
          Limiares do grupo — fácil: ${r.thresholds.easy} · moderado: ${r.thresholds.medium} ·
          difícil: ${r.thresholds.hard} · mortal: ${r.thresholds.deadly}
        </div>
      </div>`;
  });

  // Mapa
  document.getElementById('dmMapSelect')?.addEventListener('change', e => selectMap(e.target.value));
  document.getElementById('btnNewMap')?.addEventListener('click', createMap);
  document.getElementById('btnAddTokenNPC')?.addEventListener('click', addNpcToken);
  document.getElementById('dmMapImageInput')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) uploadMapImage(file);
    e.target.value = '';
  });
}
