// Utility functions
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('sceglitu_lang', lang);
  document.documentElement.lang = lang;
  
  document.querySelectorAll('.lang-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', (idx === 0 && lang === 'it') || (idx === 1 && lang === 'en'));
  });
  
  renderHome();
  updateAllTranslations();
}