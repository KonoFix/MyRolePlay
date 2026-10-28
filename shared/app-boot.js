// =============================================================================
// app-boot.js — bootstrap da página do jogador (index.html)
// Roda ANTES de app.js: valida auth, pré-carrega personagens do Supabase,
// pluga o save-remoto via janela global que app.js lê.
// =============================================================================
import { supabase } from './supabase-client.js';
import { requireAuth, signOut, getProfile, updateRole } from './auth.js';
import { loadCharacters, scheduleSave, flushAllSaves, deleteCharacter } from './character-store.js';
import { mountChatWidget } from './chat-widget.js';

const authed = await requireAuth();
if (!authed) {
  // requireAuth já redirecionou pra login.html
} else {
  // Pré-carrega personagens antes do app.js montar
  const { characters, activeId, offline } = await loadCharacters();
  window.__PRELOADED_CHARACTERS__ = { characters, activeId, offline };
  window.__CURRENT_PROFILE__ = authed.profile;

  // Hook que app.js vai chamar a cada mudança
  window.__persistCharacter = (char) => scheduleSave(char);
  window.__deleteCharacter  = (id) => deleteCharacter(id);
  window.__signOut          = async () => { await flushAllSaves(); await signOut(); };

  // Mesas em que o jogador está (campanha + mestre + personagem vinculado)
  window.__loadMyCampaigns = async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) return [];

    const { data: memberships } = await supabase
      .from('campaign_members')
      .select('campaign_id, character_id')
      .eq('user_id', s.user.id);
    if (!memberships?.length) return [];

    const campaignIds = memberships.map(m => m.campaign_id);
    const { data: camps } = await supabase.from('campaigns').select('id, title, dm_id').in('id', campaignIds);
    const campById = Object.fromEntries((camps || []).map(c => [c.id, c]));

    const dmIds = [...new Set((camps || []).map(c => c.dm_id))];
    const { data: dmProfiles } = dmIds.length
      ? await supabase.from('profiles').select('user_id, display_name').in('user_id', dmIds)
      : { data: [] };
    const dmNameById = Object.fromEntries((dmProfiles || []).map(p => [p.user_id, p.display_name]));

    return memberships.map(m => {
      const camp = campById[m.campaign_id];
      return {
        campaignId: m.campaign_id,
        title: camp?.title || '—',
        dmName: camp ? (dmNameById[camp.dm_id] || '—') : '—',
        characterId: m.character_id,
      };
    });
  };

  // Jogador sai voluntariamente de uma mesa (RLS: members_delete_dm_or_self)
  window.__leaveCampaign = async (campaignId) => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) return;
    const { error } = await supabase
      .from('campaign_members')
      .delete()
      .eq('campaign_id', campaignId)
      .eq('user_id', s.user.id);
    if (error) throw error;
  };

  // Flush ao sair da aba
  window.addEventListener('beforeunload', () => flushAllSaves());

  // Presença: para cada campanha em que o jogador é membro, anuncia online
  // via canal realtime da campanha. O DM vê o indicador atualizar.
  // A primeira campanha também ganha o widget de chat flutuante (evita
  // empilhar vários balões na tela se o jogador estiver em múltiplas mesas).
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: memberships } = await supabase
        .from('campaign_members')
        .select('campaign_id')
        .eq('user_id', session.user.id);

      if (memberships?.length) {
        const campaignIds = memberships.map(m => m.campaign_id);
        const { data: camps } = await supabase.from('campaigns').select('id, title').in('id', campaignIds);
        const titleById = Object.fromEntries((camps || []).map(c => [c.id, c.title]));

        memberships.forEach(({ campaign_id }, idx) => {
          const chan = supabase.channel(`campaign:${campaign_id}`, {
            config: { presence: { key: session.user.id } },
          });

          if (idx === 0) {
            mountChatWidget({
              channel: chan,
              displayName: authed.profile?.display_name || 'Jogador',
              isDM: false,
              campaignLabel: titleById[campaign_id] || 'Mesa',
            });
          }

          chan.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              await chan.track({ since: Date.now(), role: 'player' });
            }
          });
        });
      }
    }
  } catch (err) {
    console.warn('[presence] falhou:', err);
  }

  // DOM-ready-safe: módulo ES pode carregar depois do DOMContentLoaded
  const setupButtons = () => {
    document.getElementById('btnPlayerSignOut')?.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!confirm('Deseja sair?')) return;
      try { await window.__signOut(); }
      catch (err) { alert('Falha ao sair: ' + (err?.message || err)); }
    });

    document.getElementById('btnJoinCampaign')?.addEventListener('click', () => {
      const modal = document.getElementById('joinCampaignModal');
      modal.classList.add('open');
      document.getElementById('joinCampaignError').style.display = 'none';
      document.getElementById('joinCodeInput').value = '';
      document.getElementById('joinCodeInput').focus();
    });

    document.getElementById('btnJoinCampaignConfirm')?.addEventListener('click', joinCampaign);
    document.getElementById('joinCodeInput')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') joinCampaign();
    });

    // Botão de alternar para visão do mestre (visível se o profile.role !== 'dm')
    const btnSwitchDM = document.getElementById('btnSwitchToDM');
    if (btnSwitchDM) {
      btnSwitchDM.addEventListener('click', async () => {
        if (!confirm('Alternar sua conta para Mestre? Você poderá voltar depois.')) return;
        try {
          await updateRole('dm');
          window.location.href = 'dm.html';
        } catch (err) { alert('Falha: ' + err.message); }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupButtons);
  } else {
    setupButtons();
  }
}

async function joinCampaign() {
  const code = document.getElementById('joinCodeInput').value.trim().toUpperCase();
  const errBox = document.getElementById('joinCampaignError');
  const showErr = (m) => { errBox.textContent = m; errBox.style.display = 'block'; };
  errBox.style.display = 'none';

  if (!code || code.length < 4) return showErr('Digite o código recebido do mestre.');

  const activeChar = window.__PRELOADED_CHARACTERS__?.activeId || null;

  // Chama a RPC security-definer que resolve code → campaign + insert em members
  const { data, error } = await supabase.rpc('join_campaign_by_code', {
    _code: code,
    _character_id: activeChar,
  });

  if (error) {
    const msg = /invalid join code/i.test(error.message)
      ? 'Código não encontrado ou inválido.'
      : 'Falha ao entrar: ' + error.message;
    return showErr(msg);
  }

  const row = Array.isArray(data) ? data[0] : data;
  const title = row?.out_title || row?.title || 'campanha';
  document.getElementById('joinCampaignModal').classList.remove('open');
  alert(`Entrou em "${title}"! O mestre já pode ver sua ficha.`);
}
