// =============================================================================
// Cliente Supabase singleton — carregado via ESM (sem build no primeiro momento)
// =============================================================================
// Usado por: index.html (jogador), dm.html (mestre), login.html
//
// Lê SUPABASE_URL e SUPABASE_ANON_KEY injetadas em window.__SUPABASE_CONFIG__
// pelo config.js (ignorado pelo git — ver config.sample.js).
// =============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const cfg = window.__SUPABASE_CONFIG__;
if (!cfg || !cfg.url || !cfg.anonKey) {
  const msg = 'Config do Supabase ausente. Crie config.js a partir de config.sample.js.';
  console.error(msg);
  document.body && (document.body.innerHTML = `<pre style="color:#f55;padding:24px;font-family:monospace;">${msg}</pre>`);
  throw new Error(msg);
}

export const supabase = createClient(cfg.url, cfg.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'myroleplay.auth',
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

// Helper exposto globalmente para debug no console do browser
window.__supabase = supabase;
