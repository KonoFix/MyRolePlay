// =============================================================================
// initiative-widget.js — banner flutuante com a ordem de iniciativa (jogador)
// =============================================================================
// Somente leitura: o mestre gerencia tudo pela aba "Iniciativa" do dm.js.
// Busca o estado atual ao montar e escuta mudanças via postgres_changes no
// mesmo canal realtime da campanha (campaign:<id>) já aberto por quem chama.
//
// Uso:
//   mountInitiativeWidget({ supabase, channel, campaignId });
//   // channel: ainda NÃO subscrito (o .on precisa ser registrado antes do
//   //          .subscribe() ser chamado por quem criou o canal)
// =============================================================================

let stylesInjected = false;

export function mountInitiativeWidget({ supabase, channel, campaignId }) {
  injectStylesOnce();

  const wrap = document.createElement('div');
  wrap.className = 'mrp-initiative-banner';
  wrap.hidden = true;
  document.body.appendChild(wrap);

  async function refetch() {
    const { data, error } = await supabase
      .from('initiative_entries')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('initiative', { ascending: false })
      .order('created_at', { ascending: true });
    if (error) { console.warn('[initiative-widget]', error); return; }
    render(data || []);
  }

  function render(entries) {
    if (entries.length === 0) { wrap.hidden = true; return; }
    const current = entries.find(e => e.is_current);
    wrap.hidden = false;
    wrap.innerHTML = `
      <div class="mrp-initiative-title">${window.svgIcon ? window.svgIcon('dice', { size: 14 }) : '🎲'} Iniciativa</div>
      <ol class="mrp-initiative-order">
        ${entries.map(e => `<li class="${e.is_current ? 'is-current' : ''}">${escapeHtml(e.name)}</li>`).join('')}
      </ol>
      ${current ? `<div class="mrp-initiative-current">Turno de <strong>${escapeHtml(current.name)}</strong></div>` : ''}
    `;
  }

  // Precisa ser registrado ANTES do .subscribe() do canal (convenção Supabase Realtime).
  channel.on('postgres_changes',
    { event: '*', schema: 'public', table: 'initiative_entries', filter: `campaign_id=eq.${campaignId}` },
    () => refetch());

  refetch();

  return { destroy() { wrap.remove(); } };
}

function escapeHtml(s) {
  return (s ?? '').toString().replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function injectStylesOnce() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .mrp-initiative-banner {
      position: fixed; top: 14px; right: 24px; z-index: 940;
      background: var(--bg-card); border: 1px solid var(--border-accent);
      border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
      padding: 10px 14px; min-width: 180px; max-width: 260px;
      backdrop-filter: blur(16px);
    }
    .mrp-initiative-title {
      font-family: var(--font-title); font-weight: 700; font-size: 0.78rem;
      color: var(--text-gold); margin-bottom: 6px; display: flex; align-items: center; gap: 6px;
    }
    .mrp-initiative-order { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
    .mrp-initiative-order li { font-size: 0.78rem; color: var(--text-secondary); padding: 2px 6px; border-radius: var(--radius-sm); }
    .mrp-initiative-order li.is-current { background: var(--accent-gold); color: #12100a; font-weight: 700; }
    .mrp-initiative-current { margin-top: 6px; font-size: 0.76rem; color: var(--text-primary); border-top: 1px solid var(--border-color); padding-top: 6px; }
    @media (max-width: 500px) {
      .mrp-initiative-banner { top: auto; bottom: 86px; right: 14px; left: 14px; max-width: none; }
    }
  `;
  document.head.appendChild(style);
}
