// =============================================================================
// player-map-widget.js — mapa interativo na ficha do jogador (aba "Mapa")
// =============================================================================
// Mostra o mapa ativo (maps.is_active) da campanha renderizado com
// map/konva-board.js em modo isDM:false — a mesmíssima lógica de névoa opaca
// e tokens sem pincel que o botão "Visualizar como jogador" do mestre já usa
// pra pré-visualizar, só que de verdade na tela do jogador (antes disso só
// existia como preview pro próprio mestre olhar sozinho).
//
// Mestre move qualquer token pela aba Mapa do dm.js; aqui o jogador só move
// o(s) token(s) vinculados ao seu character_id (RLS: tokens_update_dm_or_
// own_character já cobre isso, sem precisar de migration nova).
//
// Uso:
//   mountPlayerMapWidget({ supabase, channel, campaignId, characterId, tabBtnEl, boardHostEl });
//   // channel: ainda NÃO subscrito (o .on precisa ser registrado antes do
//   //          .subscribe() ser chamado por quem criou o canal)
// =============================================================================
import { createBoard } from '../map/konva-board.js';

export function mountPlayerMapWidget({ supabase, channel, campaignId, characterId, tabBtnEl, boardHostEl }) {
  let board = null;
  let activeMap = null;

  function destroyBoard() {
    if (board) { board.destroy(); board = null; }
  }

  async function loadActiveMap() {
    const { data: maps, error } = await supabase
      .from('maps')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('is_active', true)
      .limit(1);
    if (error) { console.warn('[player-map-widget] loadActiveMap', error); return; }

    const nextMap = maps?.[0] || null;
    if (!nextMap) {
      activeMap = null;
      tabBtnEl.hidden = true;
      destroyBoard();
      return;
    }
    tabBtnEl.hidden = false;
    // Mapa trocado (ou primeira carga): reconstrói o board do zero. Mudança
    // só na névoa/posição de um mesmo mapa é tratada à parte (sem recriar).
    const mapChanged = !activeMap || activeMap.id !== nextMap.id;
    activeMap = nextMap;
    if (mapChanged) {
      await loadTokensAndRender();
    } else {
      board?.setRevealed(activeMap.fog_mask_json?.revealed);
    }
  }

  async function loadTokensAndRender() {
    if (!activeMap) return;
    const { data: tokens, error } = await supabase.from('tokens').select('*').eq('map_id', activeMap.id);
    if (error) { console.warn('[player-map-widget] loadTokens', error); return; }

    destroyBoard();
    boardHostEl.innerHTML = '';
    board = createBoard({
      container: boardHostEl,
      map: activeMap,
      tokens: (tokens || []).map(t => ({
        id: t.id,
        x: t.x,
        y: t.y,
        color: t.color,
        label: t.label || '',
        size_cells: t.size_cells || 1,
        ownedByMe: !!characterId && t.character_id === characterId,
      })),
      isDM: false,
      callbacks: {
        onTokenMove: async (id, x, y) => {
          await supabase.from('tokens').update({ x, y, updated_at: new Date().toISOString() }).eq('id', id);
        },
      },
    });
  }

  // Precisam ser registrados ANTES do .subscribe() do canal (convenção
  // Supabase Realtime).
  channel.on('postgres_changes',
    { event: '*', schema: 'public', table: 'maps', filter: `campaign_id=eq.${campaignId}` },
    () => loadActiveMap());
  channel.on('postgres_changes',
    { event: '*', schema: 'public', table: 'tokens' },
    (payload) => {
      const t = payload.new || payload.old;
      if (!activeMap || t?.map_id !== activeMap.id) return;
      if (payload.eventType === 'UPDATE' && board) {
        board.updateToken(t.id, { x: payload.new.x, y: payload.new.y, label: payload.new.label });
      } else {
        // INSERT/DELETE de token: recarrega (poucos tokens por mapa, custo baixo).
        loadTokensAndRender();
      }
    });

  loadActiveMap();

  return {
    destroy() { destroyBoard(); tabBtnEl.hidden = true; },
  };
}
