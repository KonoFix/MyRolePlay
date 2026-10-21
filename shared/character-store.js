// =============================================================================
// character-store.js — persistência de personagens com Supabase + cache local
// =============================================================================
import { supabase } from './supabase-client.js';
import { getSession } from './auth.js';

const LS_KEY = 'dnd5e_characters';
const LS_ACTIVE = 'dnd5e_active_character_id';

// --- Cache local -------------------------------------------------------------
function readLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
  catch { return {}; }
}
function writeLocal(all, activeId) {
  localStorage.setItem(LS_KEY, JSON.stringify(all));
  if (activeId) localStorage.setItem(LS_ACTIVE, activeId);
}

// --- API pública -------------------------------------------------------------

/**
 * Carrega personagens do usuário logado.
 * Retorna { characters: {id: char}, activeId: string | null, offline: bool }
 * Se não logado ou offline, cai no localStorage.
 */
export async function loadCharacters() {
  const session = await getSession();
  if (!session) {
    const all = readLocal();
    const activeId = localStorage.getItem(LS_ACTIVE);
    return { characters: all, activeId, offline: true };
  }

  try {
    const { data, error } = await supabase
      .from('characters')
      .select('id, name, sheet_json, portrait_url, updated_at')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });
    if (error) throw error;

    const map = {};
    for (const row of data) {
      // sheet_json guarda o shape antigo (createDefaultCharacter)
      // Preservamos o id da linha para o UPSERT futuro.
      const sheet = row.sheet_json || {};
      sheet.id = row.id;
      sheet.name = sheet.name || row.name;
      if (row.portrait_url) sheet.portrait = sheet.portrait || row.portrait_url;
      map[row.id] = sheet;
    }

    // Guarda no localStorage como cache offline
    const activeId = Object.keys(map)[0] || null;
    if (activeId) writeLocal(map, activeId);
    return { characters: map, activeId, offline: false };
  } catch (err) {
    console.warn('[character-store] falha ao buscar do Supabase, usando cache local:', err);
    const all = readLocal();
    const activeId = localStorage.getItem(LS_ACTIVE);
    return { characters: all, activeId, offline: true };
  }
}

// --- Save com debounce -------------------------------------------------------

const pendingSaves = new Map();  // id → timeout handle
const DEBOUNCE_MS = 600;

/**
 * Agenda um save do personagem. Executa UPSERT no Supabase após debounce.
 * Sempre atualiza o cache local imediatamente.
 */
export function scheduleSave(character, { activeId } = {}) {
  if (!character || !character.id) return;

  // Cache local imediato
  const all = readLocal();
  all[character.id] = character;
  writeLocal(all, activeId || character.id);

  // Debounce o upload remoto
  if (pendingSaves.has(character.id)) {
    clearTimeout(pendingSaves.get(character.id));
  }
  const handle = setTimeout(() => {
    pendingSaves.delete(character.id);
    flushSave(character).catch(err =>
      console.warn('[character-store] save remoto falhou (ok, cache mantido):', err)
    );
  }, DEBOUNCE_MS);
  pendingSaves.set(character.id, handle);
}

async function flushSave(character) {
  const session = await getSession();
  if (!session) return;  // offline mode

  const row = {
    id: character.id,
    user_id: session.user.id,
    name: character.name || 'Sem nome',
    sheet_json: character,
    portrait_url: character.portrait || null,
  };
  const { error } = await supabase.from('characters').upsert(row);
  if (error) throw error;
}

/** Força flush imediato (ex: antes de signOut). */
export async function flushAllSaves() {
  const handles = Array.from(pendingSaves.values());
  pendingSaves.clear();
  handles.forEach(clearTimeout);
  const all = readLocal();
  await Promise.allSettled(Object.values(all).map(flushSave));
}

export async function deleteCharacter(id) {
  const all = readLocal();
  delete all[id];
  writeLocal(all);

  const session = await getSession();
  if (!session) return;
  const { error } = await supabase.from('characters').delete().eq('id', id);
  if (error) console.warn('[character-store] delete remoto falhou:', error);
}
