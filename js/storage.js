// ================================================================
//  storage.js — Persistenza localStorage + sync Supabase progresso
// ================================================================

const SUPABASE_URL = 'https://kwytluxudzevpmrunxzx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3eXRsdXh1ZHpldnBtcnVueHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MTI4MzUsImV4cCI6MjA4ODA4ODgzNX0.xHJXX7OzABwJZFcEZnJWj_IaFydH9y5N0fW8drkNswg';

let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (!window.supabase || typeof window.supabase.createClient !== 'function') return null;

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

async function getSupabaseUser() {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data, error } = await client.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

function loadStories() {
  try { stories = JSON.parse(localStorage.getItem(STORAGE_STORIES)) || []; }
  catch { stories = []; }
}

function saveStories() {
  localStorage.setItem(STORAGE_STORIES, JSON.stringify(stories));
}

function getProgress(title) {
  try { return (JSON.parse(localStorage.getItem(STORAGE_PROGRESS)) || {})[title] || 1; }
  catch { return 1; }
}

function setProgress(title, page) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_PROGRESS)) || {};
    all[title] = page;
    localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(all));
  } catch {}
}

async function salvaProgresso(storiaId, dati) {
  setProgress(storiaId, dati);

  const client = getSupabaseClient();
  if (!client) return;

  const user = await getSupabaseUser();
  if (!user) return;

  await client
    .from('progressi')
    .upsert(
      {
        user_id: user.id,
        storia_id: storiaId,
        dati,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,storia_id' }
    );
}

async function caricaProgresso(storiaId) {
  const localProgress = getProgress(storiaId);
  const client = getSupabaseClient();
  if (!client) return localProgress;

  const user = await getSupabaseUser();
  if (!user) return localProgress;

  const { data, error } = await client
    .from('progressi')
    .select('dati')
    .eq('user_id', user.id)
    .eq('storia_id', storiaId)
    .maybeSingle();

  if (error || !data) return localProgress;
  return data.dati ?? localProgress;
}

function clearProgress(title) {
  setProgress(title, 1);
  salvaProgresso(title, 1);
}
