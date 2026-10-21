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
    .single();
  if (error && error.code !== 'PGRST116') throw error;
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
