let stories = [];
let currentLang = localStorage.getItem('sceglitu_lang') || 'it';

document.addEventListener('DOMContentLoaded', () => {
  loadStories();
  setLanguage(currentLang);
  renderHome();
  updateAllTranslations();
});