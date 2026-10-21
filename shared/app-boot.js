// =============================================================================
// app-boot.js — bootstrap da página do jogador (index.html)
// Roda ANTES de app.js: valida auth, pré-carrega personagens do Supabase,
// pluga o save-remoto via janela global que app.js lê.
// =============================================================================
import { supabase } from './supabase-client.js';
import { requireAuth, signOut, getProfile, updateRole } from './auth.js';
import { loadCharacters, scheduleSave, flushAllSaves, deleteCharacter } from './character-store.js';

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

  // Flush ao sair da aba
  window.addEventListener('beforeunload', () => flushAllSaves());

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
