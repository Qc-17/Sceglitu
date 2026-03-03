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
const STORAGE_TUTORIAL = 'sceglitu_tutorial_seen_v1';

if (!localStorage.getItem(STORAGE_TUTORIAL)) {
  window.location.href = 'tutorial.html?first=1';
}

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

function openTutorial() {
  window.location.href = 'tutorial.html?manual=1';
}

function applyTheme(theme) {
  const darkCss = document.getElementById('dark-theme-link');
  if (darkCss) {
    darkCss.disabled = theme !== 'dark';
  }
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    const isDark = theme === 'dark';
    toggle.textContent = isDark ? '☀' : '☾';
    toggle.title = isDark ? 'Tema chiaro' : 'Tema scuro';
  }
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('sceglitu_theme') || 'dark';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('sceglitu_theme', nextTheme);
  applyTheme(nextTheme);
}

// ── Init ────────────────────────────────────────────────────
loadStories();
document.documentElement.lang = currentLang;

const savedTheme = localStorage.getItem('sceglitu_theme') || 'dark';
applyTheme(savedTheme);

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

setLanguage(currentLang);
syncFromGitHub();
