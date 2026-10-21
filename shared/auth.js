// =============================================================================
// Autenticação — wrappers em cima do supabase.auth
// =============================================================================
import { supabase } from './supabase-client.js';

// Paths relativos à raiz do app — funcionam em file://, dev server e Vercel.
const PLAYER_HOME = 'index.html';
const DM_HOME     = 'dm.html';
const LOGIN_PAGE  = 'login.html';

export async function signUp({ email, password, displayName, role }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, role },
      emailRedirectTo: window.location.origin + LOGIN_PAGE,
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = LOGIN_PAGE;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getProfile() {
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle();
  if (error) {
    console.warn('[auth] falha getProfile:', error.message);
    return null;
  }
  // Fallback: trigger pode ter falhado — cria profile sob demanda
  if (!data) {
    const meta = session.user.user_metadata || {};
    const role = meta.role === 'dm' ? 'dm' : 'player';
    const display_name = meta.display_name || (session.user.email || 'Jogador').split('@')[0];
    const { data: created, error: insErr } = await supabase
      .from('profiles')
      .insert({ user_id: session.user.id, display_name, role })
      .select()
      .maybeSingle();
    if (insErr) {
      console.warn('[auth] falha ao criar profile fallback:', insErr.message);
      return { user_id: session.user.id, display_name, role };
    }
    return created;
  }
  return data;
}

/** Atualiza o role do usuário logado (usado pelo botão "Alternar visão"). */
export async function updateRole(nextRole) {
  const session = await getSession();
  if (!session) return null;
  if (!['player', 'dm'].includes(nextRole)) throw new Error('role inválido');
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: nextRole })
    .eq('user_id', session.user.id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Redireciona páginas protegidas para login se não houver sessão.
 * Em páginas de DM, exige role 'dm'.
 */
export async function requireAuth({ requireRole } = {}) {
  const session = await getSession();
  if (!session) {
    window.location.href = LOGIN_PAGE;
    return null;
  }
  if (requireRole) {
    const profile = await getProfile();
    if (!profile || profile.role !== requireRole) {
      window.location.href = profile?.role === 'dm' ? DM_HOME : PLAYER_HOME;
      return null;
    }
    return { session, profile };
  }
  return { session, profile: await getProfile() };
}

/** Redireciona a home correta baseada no role (chamado após login). */
export async function redirectToRoleHome() {
  const profile = await getProfile();
  window.location.href = profile?.role === 'dm' ? DM_HOME : PLAYER_HOME;
}
