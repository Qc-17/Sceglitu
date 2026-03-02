// ================================================================
//  github.js — Sincronizzazione automatica da GitHub (invariato)
// ================================================================

const GITHUB_REPO   = 'Qc-17/Sceglitu';
const GITHUB_BRANCH = 'main';
const GITHUB_API    = `https://api.github.com/repos/${GITHUB_REPO}/contents/`;
const GITHUB_RAW    = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/`;
const SYNCED_KEY    = 'sceglitu_github_synced_v1';

async function fetchRepoJsonList() {
  try {
    const res = await fetch(GITHUB_API, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    const items = await res.json();
    return items
      .filter(f => f.type === 'file' && f.name.endsWith('.json'))
      .map(f => ({ name: f.name, sha: f.sha }));
  } catch (e) {
    console.warn('[Sceglitu] GitHub non raggiungibile:', e.message);
    return [];
  }
}

async function fetchRawJson(filename) {
  const res = await fetch(GITHUB_RAW + encodeURIComponent(filename));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function syncFromGitHub() {
  const indicator = document.getElementById('sync-indicator');
  if (indicator) indicator.textContent = '⟳ sync…';

  let synced = {};
  try { synced = JSON.parse(localStorage.getItem(SYNCED_KEY)) || {}; } catch {}

  const files = await fetchRepoJsonList();
  if (!files.length) { if (indicator) indicator.textContent = ''; return; }

  let importedCount = 0;

  for (const { name, sha } of files) {
    if (synced[name] === sha) continue;
    try {
      const data = await fetchRawJson(name);
      if (!data.titolo || !Array.isArray(data.pagine) || !data.pagine.length) {
        console.warn(`[Sceglitu] ${name}: struttura non valida, ignorato.`);
        continue;
      }
      const idx = stories.findIndex(s => s.titolo === data.titolo);
      if (idx >= 0) stories[idx] = data;
      else stories.push(data);
      synced[name] = sha;
      importedCount++;
    } catch (e) {
      console.warn(`[Sceglitu] Errore nel caricare ${name}:`, e.message);
    }
  }

  if (importedCount > 0) {
    saveStories();
    localStorage.setItem(SYNCED_KEY, JSON.stringify(synced));
    renderHome();
    const suffix = importedCount !== 1 ? t('toast.importedPlural') : t('toast.imported');
    toast(`📥 ${importedCount} ${suffix}`);
  }

  if (indicator) indicator.textContent = '';
}
