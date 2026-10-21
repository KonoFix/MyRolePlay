// =============================================================================
// dm.js — Página do Mestre
// =============================================================================
import { supabase } from './shared/supabase-client.js';
import { requireAuth } from './shared/auth.js';

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
};

// ---------- Boot ----------
await loadCampaigns();
setupUI();

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
  const { data, error } = await supabase
    .from('campaign_members')
    .select(`
      user_id,
      character_id,
      profiles:profiles!campaign_members_user_id_fkey (display_name, avatar_url),
      characters:characters!campaign_members_character_id_fkey (id, name, sheet_json, portrait_url)
    `)
    .eq('campaign_id', campaignId);
  if (error) { console.warn(error); state.players = []; renderPlayers(); return; }

  state.players = (data || []).map(row => ({
    user_id: row.user_id,
    display_name: row.profiles?.display_name || '—',
    character: row.characters || null,
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
  document.getElementById('dmPresenceSummary').textContent = `${state.players.length} jogador(es)`;
}

function renderPlayerCard(p) {
  const char = p.character;
  if (!char) {
    return `<div class="dm-player-card">
      <div class="dm-player-head">
        <div class="dm-player-portrait" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted);">?</div>
        <div>
          <div class="dm-player-name">${escapeHtml(p.display_name)}</div>
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
    <div class="dm-player-card">
      <div class="dm-player-head">
        ${portrait
          ? `<img class="dm-player-portrait" src="${escapeAttr(portrait)}" alt="">`
          : `<div class="dm-player-portrait" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted);">🎭</div>`}
        <div>
          <div class="dm-player-name">${escapeHtml(sheet.name || char.name)}</div>
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
  renderArcs();
}

function clearArcEditor() {
  document.getElementById('dmArcTitle').value = '';
  document.getElementById('dmArcBody').value = '';
  document.getElementById('dmArcVisible').checked = false;
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
    .select('*, profiles:profiles!dice_rolls_user_id_fkey(display_name)')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) { console.warn(error); state.rolls = []; }
  else state.rolls = data || [];
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
    const who = r.profiles?.display_name || '?';
    const hidden = r.is_hidden ? 'hidden' : '';
    return `<li class="${nat} ${hidden}">
      <span><strong>${escapeHtml(who)}</strong> rolou <em>${escapeHtml(r.label)}</em> (${escapeHtml(r.formula)})</span>
      <span class="roll-total">${r.result_total}</span>
    </li>`;
  }).join('');
}

// =============================================================================
// Realtime
// =============================================================================
function subscribeRealtime(campaignId) {
  if (state.liveChannel) supabase.removeChannel(state.liveChannel);

  state.liveChannel = supabase
    .channel(`campaign:${campaignId}`)
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
    .subscribe();
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
  document.getElementById('btnDmSignOut').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });
  document.getElementById('btnSaveArc').addEventListener('click', saveArc);
  document.getElementById('btnDeleteArc').addEventListener('click', deleteActiveArc);
  document.getElementById('btnNewArc').addEventListener('click', () => {
    state.activeArcId = null;
    clearArcEditor();
    document.getElementById('dmArcTitle').focus();
  });
}
