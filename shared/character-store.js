// =============================================================================
// character-store.js — persistência de personagens com Supabase + cache local
// =============================================================================
import { supabase } from './supabase-client.js';
import { getSession } from './auth.js';

// Chaves antigas (pré-auth), mantidas só como fallback de leitura única para
// quem já tinha personagens 100% locais antes de existir login. NUNCA mais
// escritas — ver nota abaixo sobre por que o cache precisa ser por usuário.
const LS_KEY_LEGACY = 'dnd5e_characters';
const LS_ACTIVE_LEGACY = 'dnd5e_active_character_id';

// O cache local é isolado por user_id (chave muda conforme quem está logado).
// Antes disso, uma única chave global era compartilhada por QUALQUER conta
// logada nesse navegador — e como getSession() é sincronizado entre abas da
// mesma origem (GoTrue propaga login/logout via evento `storage`), bastava
// uma aba trocar de conta pra outra aba, já aberta, silenciosamente herdar
// a sessão nova e tentar "subir" pro Supabase o personagem cacheado de outra
// conta como se fosse seu — confirmado na prática: só não virou corrupção de
// dados porque a trigger characters_restrict_dm_update rejeitou a escrita.
let currentUserId = null;
function nsKey(base) { return `${base}:${currentUserId || 'anon'}`; }

// --- Cache local -------------------------------------------------------------
function readLocal() {
  try { return JSON.parse(localStorage.getItem(nsKey(LS_KEY_LEGACY)) || '{}'); }
  catch { return {}; }
}
function writeLocal(all, activeId) {
  localStorage.setItem(nsKey(LS_KEY_LEGACY), JSON.stringify(all));
  if (activeId) localStorage.setItem(nsKey(LS_ACTIVE_LEGACY), activeId);
}
function readLocalActiveId() {
  return localStorage.getItem(nsKey(LS_ACTIVE_LEGACY));
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function genUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// Migra IDs antigos (ex: "char_1234") para UUID antes de qualquer upsert remoto
function migrateLocalIds() {
  const all = readLocal();
  const activeOld = readLocalActiveId();
  let migrated = false;
  const next = {};
  let newActive = activeOld;
  for (const [oldId, char] of Object.entries(all)) {
    if (UUID_RE.test(oldId)) {
      next[oldId] = char;
    } else {
      const newId = genUUID();
      char.id = newId;
      next[newId] = char;
      if (activeOld === oldId) newActive = newId;
      migrated = true;
    }
  }
  if (migrated) writeLocal(next, newActive);
  return migrated;
}

// --- API pública -------------------------------------------------------------

/**
 * Carrega personagens do usuário logado.
 * Retorna { characters: {id: char}, activeId: string | null, offline: bool }
 * Se não logado ou offline, cai no localStorage.
 */
export async function loadCharacters() {
  // Define o namespace do cache ANTES de tocar em qualquer coisa no
  // localStorage — é o que garante que o cache de uma conta nunca seja lido
  // nem sobrescrito por outra (ver comentário em cima de `nsKey`).
  const session = await getSession();
  currentUserId = session?.user?.id || null;

  // Normaliza IDs antigos (char_NNN) para UUID antes de qualquer sync remota
  migrateLocalIds();

  if (!session) {
    const all = readLocal();
    const activeId = readLocalActiveId();
    return { characters: all, activeId, offline: true };
  }

  try {
    // A primeira query logo após um login seguido de navegação (ex.:
    // redirectToRoleHome) pode disparar antes do cliente Supabase terminar
    // de validar/anexar o token da sessão recém-restaurada do localStorage
    // — confirmado na prática: a 1ª tentativa falha com 400 e cai no cache
    // local (possivelmente desatualizado); uma 2ª tentativa logo depois já
    // funciona. Uma retentativa curta cobre essa corrida sem mascarar erros
    // de verdade (RLS, rede caída etc., que falham nas duas tentativas).
    let data, error;
    const retryDelaysMs = [400, 1000, 1500];
    for (let attempt = 0; attempt <= retryDelaysMs.length; attempt++) {
      ({ data, error } = await supabase
        .from('characters')
        .select('id, name, sheet_json, portrait_url, updated_at')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false }));
      if (!error) break;
      if (attempt < retryDelaysMs.length) await new Promise(r => setTimeout(r, retryDelaysMs[attempt]));
    }
    if (error) throw error;

    const map = {};
    for (const row of data) {
      const sheet = row.sheet_json || {};
      sheet.id = row.id;
      sheet.name = sheet.name || row.name;
      if (row.portrait_url) sheet.portrait = sheet.portrait || row.portrait_url;
      map[row.id] = sheet;
    }

    // Se o banco está vazio mas o localStorage tem personagens (recém migrado
    // ou primeiro login), sobe-os para o Supabase mantendo os UUIDs já locais.
    if (Object.keys(map).length === 0) {
      const local = readLocal();
      const localIds = Object.keys(local);
      if (localIds.length > 0) {
        const rows = localIds.map(id => ({
          id,
          user_id: session.user.id,
          name: local[id].name || 'Sem nome',
          sheet_json: local[id],
          portrait_url: local[id].portrait || null,
        }));
        const { error: upErr } = await supabase.from('characters').upsert(rows);
        if (upErr) console.warn('[character-store] falha ao subir chars locais:', upErr);
        else {
          for (const r of rows) {
            const sheet = r.sheet_json;
            sheet.id = r.id;
            map[r.id] = sheet;
          }
        }
      }
    }

    const activeOld = readLocalActiveId();
    const activeId = (activeOld && map[activeOld]) ? activeOld : (Object.keys(map)[0] || null);
    if (activeId) writeLocal(map, activeId);
    return { characters: map, activeId, offline: false };
  } catch (err) {
    console.warn('[character-store] falha ao buscar do Supabase, usando cache local:', err);
    const all = readLocal();
    const activeId = readLocalActiveId();
    return { characters: all, activeId, offline: true };
  }
}

/**
 * Chaves de localStorage do cache do usuário atualmente carregado (definidas
 * só depois de loadCharacters() rodar). Usado por app.js/app-boot.js — que
 * não são módulos ES e não importam este arquivo diretamente — via a ponte
 * window.__characterStorageKeys montada em shared/app-boot.js.
 */
export function getCharacterStorageKeys() {
  return { charactersKey: nsKey(LS_KEY_LEGACY), activeIdKey: nsKey(LS_ACTIVE_LEGACY) };
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
