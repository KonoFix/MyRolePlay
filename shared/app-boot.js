// =============================================================================
// app-boot.js — bootstrap da página do jogador (index.html)
// Roda ANTES de app.js: valida auth, pré-carrega personagens do Supabase,
// pluga o save-remoto via janela global que app.js lê.
// =============================================================================
import { supabase } from './supabase-client.js';
import { requireAuth, signOut, getProfile } from './auth.js';
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

  // Depois do DOM pronto, instala listeners dos botões do header
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnPlayerSignOut')?.addEventListener('click', async () => {
      if (!confirm('Deseja sair?')) return;
      await window.__signOut();
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
  });
}

async function joinCampaign() {
  const code = document.getElementById('joinCodeInput').value.trim().toUpperCase();
  const errBox = document.getElementById('joinCampaignError');
  const showErr = (m) => { errBox.textContent = m; errBox.style.display = 'block'; };
  errBox.style.display = 'none';

  if (!code || code.length < 4) return showErr('Digite o código recebido do mestre.');

  // 1. busca campanha pelo código
  const { data: campaign, error: cErr } = await supabase
    .from('campaigns')
    .select('id, title')
    .eq('join_code', code)
    .maybeSingle();
  if (cErr || !campaign) return showErr('Código não encontrado ou inválido.');

  // 2. pega a sessão + ficha ativa
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return showErr('Faça login novamente.');
  const activeChar = window.__PRELOADED_CHARACTERS__?.activeId;

  // 3. upsert em campaign_members
  const { error: mErr } = await supabase.from('campaign_members').upsert({
    campaign_id: campaign.id,
    user_id: session.user.id,
    character_id: activeChar || null,
  });
  if (mErr) return showErr('Falha ao entrar: ' + mErr.message);

  document.getElementById('joinCampaignModal').classList.remove('open');
  alert(`Entrou em "${campaign.title}"! O mestre já pode ver sua ficha.`);
}
