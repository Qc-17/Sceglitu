// ================================================================
//  app.js — Stato globale, utilità condivise, inizializzazione
// ================================================================

// ── Stato globale ────────────────────────────────────────────
let stories        = [];
let currentStory   = null;
let currentPage    = 1;
let currentTab     = 'paste';
let pendingFileJson = null;
let currentLang    = localStorage.getItem('sceglitu_lang') || 'it';

const STORAGE_STORIES  = 'sceglitu_stories_v1';
const STORAGE_PROGRESS = 'sceglitu_progress_v1';

// ── Utilità condivise ────────────────────────────────────────
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2300);
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Init ────────────────────────────────────────────────────
loadStories();
document.documentElement.lang = currentLang;

document.querySelectorAll('.lang-btn').forEach((btn, idx) => {
  btn.classList.toggle('active',
    (idx === 0 && currentLang === 'it') || (idx === 1 && currentLang === 'en')
  );
});

// Wire up file input and drag-and-drop for editor
document.getElementById('file-input').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  readFile(file);
  this.value = '';
});
const dz = document.getElementById('drop-zone');
dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
dz.addEventListener('drop', e => {
  e.preventDefault();
  dz.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) readFile(file);
});

renderHome();
syncFromGitHub();
