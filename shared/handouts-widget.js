// =============================================================================
// handouts-widget.js — FAB + painel de handouts recebidos (jogador)
// =============================================================================
// Somente leitura: o mestre envia pela aba "Painel Ao Vivo" do dm.js (botão
// "Enviar Handout"). Busca o histórico ao montar (RLS já filtra pra só
// mostrar handouts endereçados a este jogador ou a "todos") e escuta novos
// via postgres_changes.
//
// Canal PRÓPRIO (não o canal compartilhado campaign:<id> de chat/iniciativa/
// mapa/condições) — de propósito. Confirmado em QA: um postgres_changes
// filtrado numa tabela que ainda não existe no banco (ex.: handouts antes da
// migration ser aplicada) derruba silenciosamente TODOS os outros bindings
// do mesmo canal multiplexado, mesmo o canal reportando status "SUBSCRIBED"
// — sem esse isolamento, um problema aqui quebraria chat/iniciativa/mapa/
// condições remotas junto, sem erro visível.
//
// Uso:
//   mountHandoutsWidget({ supabase, campaignId });
// =============================================================================

let widgetSeq = 0;
let stylesInjected = false;

export function mountHandoutsWidget({ supabase, campaignId }) {
  widgetSeq += 1;
  const id = `mrpHandouts${widgetSeq}`;
  injectStylesOnce();

  const wrap = document.createElement('div');
  wrap.className = 'mrp-handouts-wrap';
  wrap.innerHTML = `
    <div class="mrp-handouts-panel" id="${id}Panel">
      <div class="mrp-handouts-header">
        <span>${window.svgIcon ? window.svgIcon('scroll', { size: 16 }) : '📜'} Handouts</span>
        <button type="button" class="mrp-handouts-close" aria-label="Fechar">&times;</button>
      </div>
      <div class="mrp-handouts-list" id="${id}List">
        <p class="mrp-handouts-empty">Nenhum handout recebido ainda.</p>
      </div>
    </div>
    <button type="button" class="mrp-handouts-fab" id="${id}Fab" title="Handouts do mestre">
      ${window.svgIcon ? window.svgIcon('scroll', { size: 24 }) : '📜'}<span class="mrp-handouts-badge" id="${id}Badge" hidden></span>
    </button>`;
  document.body.appendChild(wrap);

  const panel = wrap.querySelector(`#${id}Panel`);
  const fab = wrap.querySelector(`#${id}Fab`);
  const closeBtn = wrap.querySelector('.mrp-handouts-close');
  const listEl = wrap.querySelector(`#${id}List`);
  const badge = wrap.querySelector(`#${id}Badge`);

  let open = false;
  let unseen = 0;
  let handouts = [];

  function setOpen(next) {
    open = next;
    panel.classList.toggle('open', open);
    if (open) { unseen = 0; badge.hidden = true; }
  }
  fab.addEventListener('click', () => setOpen(!open));
  closeBtn.addEventListener('click', () => setOpen(false));

  function render() {
    if (handouts.length === 0) {
      listEl.innerHTML = '<p class="mrp-handouts-empty">Nenhum handout recebido ainda.</p>';
      return;
    }
    listEl.innerHTML = handouts.map(h => {
      const time = new Date(h.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      return `
        <div class="mrp-handout-card">
          ${h.title ? `<div class="mrp-handout-title">${escapeHtml(h.title)}</div>` : ''}
          ${h.image_url ? `<img class="mrp-handout-img" src="${escapeAttr(h.image_url)}" alt="">` : ''}
          ${h.body ? `<div class="mrp-handout-body">${escapeHtml(h.body)}</div>` : ''}
          <div class="mrp-handout-time">${time}</div>
        </div>`;
    }).join('');
  }

  async function refetch() {
    const { data, error } = await supabase
      .from('handouts')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) { console.warn('[handouts-widget]', error); return; }
    const isNew = handouts.length > 0 && data?.length > handouts.length;
    handouts = data || [];
    render();
    if (isNew && !open) {
      unseen += 1;
      badge.textContent = String(unseen);
      badge.hidden = false;
    }
  }

  // Canal próprio — ver nota no topo do arquivo sobre isolamento.
  const channel = supabase.channel(`campaign:${campaignId}:handouts`);
  channel.on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'handouts', filter: `campaign_id=eq.${campaignId}` },
    () => refetch());
  channel.subscribe();

  refetch();

  return { destroy() { supabase.removeChannel(channel); wrap.remove(); } };
}

function escapeHtml(s) {
  return (s ?? '').toString().replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

function injectStylesOnce() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .mrp-handouts-wrap { position: fixed; bottom: 90px; left: 24px; z-index: 945; }
    .mrp-handouts-fab {
      width: 44px; height: 44px; border-radius: 50%; position: relative;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #8b5cf6, #5b3a9e);
      border: 2px solid #c4b1f0;
      color: #fff; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.8);
      transition: var(--transition);
    }
    .mrp-handouts-fab svg { filter: drop-shadow(0 1px 1px rgba(0,0,0,0.4)); width: 20px; height: 20px; }
    .mrp-handouts-fab:hover { transform: scale(1.08); }
    .mrp-handouts-badge {
      position: absolute; top: -2px; right: -2px;
      min-width: 16px; height: 16px; border-radius: 8px; padding: 0 3px;
      background: var(--accent-red); color: #fff; font-size: 0.62rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 0 2px var(--bg-primary);
    }
    /* inline style sempre vence o atributo hidden — sem isso o badge fica
       visível mesmo com hidden="true" (mesmo bug já corrigido no banner de
       "visualizar como jogador" do dm.js). */
    .mrp-handouts-badge[hidden] { display: none; }
    .mrp-handouts-panel {
      position: fixed; bottom: 142px; left: 24px;
      width: 320px; max-width: calc(100vw - 48px); max-height: 60vh;
      background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
      display: none; flex-direction: column; overflow: hidden;
      backdrop-filter: blur(16px);
    }
    .mrp-handouts-panel.open { display: flex; animation: mrpHandoutsSlideUp 0.2s ease; }
    @keyframes mrpHandoutsSlideUp { from { opacity:0; transform:translateY(10px);} to { opacity:1; transform:translateY(0);} }
    .mrp-handouts-header {
      padding: 10px 14px; background: var(--bg-secondary);
      display: flex; justify-content: space-between; align-items: center;
      font-family: var(--font-title); font-weight: 700; font-size: 0.85rem;
      color: var(--text-gold); border-bottom: 1px solid var(--border-color);
    }
    .mrp-handouts-close { background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; line-height: 1; }
    .mrp-handouts-close:hover { color: var(--text-primary); }
    .mrp-handouts-list { flex: 1; overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 10px; min-height: 80px; }
    .mrp-handouts-empty { color: var(--text-muted); font-size: 0.8rem; margin: 0; }
    .mrp-handout-card {
      background: rgba(0,0,0,0.25); border: 1px solid var(--border-color);
      border-radius: var(--radius-sm); padding: 8px 10px;
    }
    .mrp-handout-title { font-family: var(--font-title); font-weight: 700; color: var(--text-gold); font-size: 0.85rem; margin-bottom: 4px; }
    .mrp-handout-img { width: 100%; border-radius: var(--radius-sm); margin-bottom: 6px; display: block; }
    .mrp-handout-body { font-size: 0.82rem; color: var(--text-secondary); white-space: pre-wrap; }
    .mrp-handout-time { font-size: 0.68rem; color: var(--text-muted); margin-top: 6px; }
    @media (max-width: 500px) {
      .mrp-handouts-wrap { bottom: 68px; left: 14px; }
      .mrp-handouts-fab { width: 38px; height: 38px; }
      .mrp-handouts-fab svg { width: 18px; height: 18px; }
      .mrp-handouts-panel { left: 10px; bottom: 112px; width: calc(100vw - 20px); }
    }
  `;
  document.head.appendChild(style);
}
