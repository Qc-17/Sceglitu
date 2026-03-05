// ================================================================
//  storage.js — Persistenza localStorage + sync Supabase progresso
// ================================================================

const SUPABASE_URL = 'https://kwytluxudzevpmrunxzx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eXRsdXh1ZHpldnBtcnVueHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MTI4MzUsImV4cCI6MjA4ODA4ODgzNX0.xHJXX7OzABwJZFcEZnJWj_IaFydH9y5N0fW8drkNswg';

let supabaseClient = null;

/*
// ── Utente cachato ────────────────────────────────────────────
// Viene aggiornato da onAuthStateChange non appena il client
// e' pronto, senza chiamate di rete aggiuntive.
let _cachedUser = null;
*/

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (!window.supabase || typeof window.supabase.createClient !== 'function') return null;

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /*
  // onAuthStateChange viene chiamato SUBITO con la sessione corrente
  // letta dal localStorage (zero rete). E' il modo corretto per
  // sapere se l'utente e' loggato gia' al caricamento della pagina.
  supabaseClient.auth.onAuthStateChange((event, session) => {
    _cachedUser = session?.user ?? null;
    console.log('[Sceglitu] auth:', event, _cachedUser?.email ?? 'guest');
  });
  */

  return supabaseClient;
}

// Restituisce l'utente corrente usando solo la cache + getSession().
// getSession() legge dal localStorage, nessuna chiamata di rete.
/*
async function getSupabaseUser() {
  const client = getSupabaseClient();
  if (!client) return null;

  // onAuthStateChange potrebbe non aver ancora sparato al primo tick.
  // getSession() e' sincrona rispetto al localStorage: nessuna rete.
  if (_cachedUser === null) {
    const { data } = await client.auth.getSession();
    _cachedUser = data?.session?.user ?? null;
  }

  return _cachedUser;
}
*/

async function getSupabaseUser() {
  return null;
}

// ── Stories ───────────────────────────────────────────────────

function loadStories() {
  try { stories = JSON.parse(localStorage.getItem(STORAGE_STORIES)) || []; }
  catch { stories = []; }
}

function saveStories() {
  localStorage.setItem(STORAGE_STORIES, JSON.stringify(stories));
}

// ── Progress (localStorage) ────────────────────────────────────

function getProgress(title) {
  try { return (JSON.parse(localStorage.getItem(STORAGE_PROGRESS)) || {})[title] || 1; }
  catch { return 1; }
}

function setProgress(title, page) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_PROGRESS)) || {};
    all[title] = page;
    localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(all));
    return all[title];
  } catch {}
  return page;
}

// ── Progress (Supabase) ────────────────────────────────────────

async function salvaProgresso(storiaId, dati) {
  // 1. Salva sempre in locale (immediato, zero rete)
  const paginaLocale = setProgress(storiaId, dati);

  // 2. Se c'e' un utente loggato, sincronizza su Supabase
  const client = getSupabaseClient();
  if (!client) return;

  const user = await getSupabaseUser();
  if (!user) return; // guest: solo localStorage, nessun errore

  const { error } = await client
    .from('progressi')
    .upsert(
      {
        user_id:    user.id,
        storia_id:  storiaId,
        dati:       paginaLocale,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,storia_id' }
    );

  if (error) {
    console.error('[Sceglitu] salvaProgresso error:', error.message, error.details);
  }
}

async function caricaProgresso(storiaId) {
  const localProgress = getProgress(storiaId);

  const client = getSupabaseClient();
  if (!client) return localProgress;

  const user = await getSupabaseUser();
  if (!user) return localProgress; // guest: usa localStorage

  const { data, error } = await client
    .from('progressi')
    .select('dati')
    .eq('user_id',   user.id)
    .eq('storia_id', storiaId)
    .maybeSingle();

  if (error) {
    console.error('[Sceglitu] caricaProgresso error:', error.message);
    return localProgress;
  }

  if (!data) return localProgress; // nessun record remoto

  const progress = data.dati ?? localProgress;
  setProgress(storiaId, progress); // aggiorna locale per coerenza offline
  return progress;
}

function clearProgress(title) {
  setProgress(title, 1);
  salvaProgresso(title, 1);
}

/*
// ── Avvia subito il client per popolare la cache ───────────────
// Cosi' onAuthStateChange viene registrato appena lo script
// e' caricato, prima di qualsiasi interazione utente.
getSupabaseClient();
*/
