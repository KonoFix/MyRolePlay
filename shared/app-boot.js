// =============================================================================
// app-boot.js — bootstrap da página do jogador (index.html)
// Roda ANTES de app.js: valida auth, pré-carrega personagens do Supabase,
// pluga o save-remoto via janela global que app.js lê.
// =============================================================================
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
}
