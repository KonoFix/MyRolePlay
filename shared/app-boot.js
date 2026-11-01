// =============================================================================
// app-boot.js — bootstrap da página do jogador (index.html)
// Roda ANTES de app.js: valida auth, pré-carrega personagens do Supabase,
// pluga o save-remoto via janela global que app.js lê.
// =============================================================================
import { supabase } from './supabase-client.js';
import { requireAuth, signOut, getProfile, updateRole } from './auth.js';
import { loadCharacters, scheduleSave, flushAllSaves, deleteCharacter, getCharacterStorageKeys } from './character-store.js';
import { mountChatWidget } from './chat-widget.js';
import { mountInitiativeWidget } from './initiative-widget.js';
import { mountHandoutsWidget } from './handouts-widget.js';

const authed = await requireAuth();
if (!authed) {
  // requireAuth já redirecionou pra login.html
} else {
  // Pré-carrega personagens antes do app.js montar
  const { characters, activeId, offline } = await loadCharacters();
  window.__PRELOADED_CHARACTERS__ = { characters, activeId, offline };
  window.__CURRENT_PROFILE__ = authed.profile;
  // Ponte pra app.js (script clássico, não importa módulos ES): chaves de
  // localStorage namespaced pela conta logada — ver character-store.js.
  window.__characterStorageKeys = getCharacterStorageKeys();

  // Hook que app.js vai chamar a cada mudança
  window.__persistCharacter = (char) => scheduleSave(char);
  window.__deleteCharacter  = (id) => deleteCharacter(id);
  window.__signOut          = async () => { await flushAllSaves(); await signOut(); };

  // Sobe uma rolagem de dado pro log compartilhado (tabela dice_rolls — RLS
  // e assinatura realtime do mestre já existiam, só faltava o jogador
  // inserir). Chamado por addDiceLog() em app.js. Insere em toda campanha em
  // que o jogador está (normalmente só uma); falha silenciosa — nunca deve
  // travar a UI de dados por causa de uma rolagem que não subiu.
  window.__logDiceRoll = async ({ label, formula, total, isNat20, isNat1 }) => {
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      if (!s) return;
      const { data: memberships } = await supabase
        .from('campaign_members')
        .select('campaign_id')
        .eq('user_id', s.user.id);
      if (!memberships?.length) return;
      const rows = memberships.map(m => ({
        campaign_id: m.campaign_id,
        user_id: s.user.id,
        label,
        formula: formula || '',
        result_total: Math.trunc(total),
        result_detail: { nat20: !!isNat20, nat1: !!isNat1 },
        is_hidden: false,
      }));
      const { error } = await supabase.from('dice_rolls').insert(rows);
      if (error) console.warn('[dice_rolls] falha ao logar rolagem:', error);
    } catch (err) {
      console.warn('[dice_rolls] falha ao logar rolagem:', err);
    }
  };

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

  // Sinaliza pra app.js (script clássico, carregado depois mas SEM `defer`)
  // que os dados acima já estão prontos. app-boot.js é módulo ES — módulos
  // só rodam depois que o parsing termina (equivalente a `defer`), mas
  // app.js roda inline assim que o parser chega nele, bem antes disso. Sem
  // esse sinal, app.js já tinha chamado loadStoredCharacters() e caído no
  // fallback de localStorage cru (sem namespace, possivelmente desatualizado
  // em relação ao Supabase) antes de window.__PRELOADED_CHARACTERS__ sequer
  // existir — confirmado em QA: o preload chegava certo, mas tarde demais
  // pra ser usado, e nada re-sincronizava depois.
  window.__BOOT_READY__ = true;
  window.dispatchEvent(new CustomEvent('mrp:boot-ready'));

  // Presença: para cada campanha em que o jogador é membro, anuncia online
  // via canal realtime da campanha. O DM vê o indicador atualizar.
  // A primeira campanha também ganha o widget de chat flutuante (evita
  // empilhar vários balões na tela se o jogador estiver em múltiplas mesas).
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: memberships } = await supabase
        .from('campaign_members')
        .select('campaign_id, character_id')
        .eq('user_id', session.user.id);

      if (memberships?.length) {
        const campaignIds = memberships.map(m => m.campaign_id);
        const { data: camps } = await supabase.from('campaigns').select('id, title').in('id', campaignIds);
        const titleById = Object.fromEntries((camps || []).map(c => [c.id, c.title]));

        memberships.forEach(({ campaign_id, character_id }, idx) => {
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
            mountInitiativeWidget({ supabase, channel: chan, campaignId: campaign_id });
            mountHandoutsWidget({ supabase, campaignId: campaign_id });
          }

          // O mestre pode marcar/desmarcar condições remotamente
          // (characters.sheet_json.activeConditions — única coisa que a
          // trigger characters_restrict_dm_update deixa ele escrever). Sem
          // isso, o jogador só saberia que está envenenado/caído/etc. se
          // recarregasse a página — o update acontecia só na tela do mestre.
          if (character_id) {
            chan.on('postgres_changes',
              { event: 'UPDATE', schema: 'public', table: 'characters', filter: `id=eq.${character_id}` },
              (payload) => window.__applyRemoteConditions?.(payload.new?.sheet_json?.activeConditions));
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

  // Lê o personagem ativo ATUAL do localStorage (sempre em dia, atualizado
  // pelo app.js a cada troca/criação/exclusão) em vez do snapshot capturado
  // uma única vez no boot da página (window.__PRELOADED_CHARACTERS__.activeId),
  // que fica stale e pode apontar pra um personagem já excluído — causando
  // violação da FK campaign_members_character_id_fkey.
  const activeChar = localStorage.getItem(window.__characterStorageKeys?.activeIdKey) || null;

  // Garante que o personagem ativo já foi persistido no Supabase antes de
  // vinculá-lo (o save remoto tem debounce de 600ms e pode não ter rodado
  // ainda se o personagem acabou de ser criado/trocado).
  if (activeChar) {
    try { await flushAllSaves(); } catch (err) { console.warn('[join] flush falhou:', err); }
  }

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
  // Chat e presença só são montados no boot da página (acima), a partir das
  // campanhas em que o jogador já era membro no carregamento — sem reload,
  // quem acabou de entrar fica "mudo" (sem chat, sem indicador online) até
  // sair e voltar à página. Recarrega pra ativar tudo de uma vez.
  window.location.reload();
}
