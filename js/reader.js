let currentStory = null;
let currentPage = 1;

function openReader(idx) {
  currentStory = stories[idx];
  currentPage = getProgress(currentStory.titolo);
  document.getElementById('reader-title').textContent = currentStory.titolo;
  document.getElementById('reader-body').style.display = 'flex';
  document.getElementById('completion-screen').classList.remove('visible');
  showView('reader');
  renderPage();
}

function closeReader() {
  currentStory = null;
  showView('home');
  renderHome();
}

function getPageData(num) {
  return currentStory.pagine.find(p => p.numeroPagina === num);
}

function renderPage() {
  const page = getPageData(currentPage);
  if (!page) { toast(t('reader.pageNotFound') + ' ' + currentPage); return; }

  setProgress(currentStory.titolo, currentPage);

  const maxNum = Math.max(...currentStory.pagine.map(p => p.numeroPagina));
  const pct = Math.min(100, Math.round((currentPage / maxNum) * 100));
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('page-badge').textContent = t('reader.pageLabel') + currentPage;

  const textEl = document.getElementById('page-text');
  textEl.style.animation = 'none';
  textEl.offsetHeight;
  textEl.style.animation = '';
  textEl.textContent = page.testo;

  const choicesEl = document.getElementById('choices-section');
  choicesEl.style.animation = 'none';
  choicesEl.offsetHeight;
  choicesEl.style.animation = '';
  choicesEl.innerHTML = '';

  const restartBtn = document.getElementById('restart-btn');
  restartBtn.style.display = 'none';

  const hasChoices = page.scelte && page.scelte.length > 0;

  if (hasChoices) {
    const label = document.createElement('div');
    label.className = 'choices-label';
    label.textContent = t('reader.whatDo');
    choicesEl.appendChild(label);

    page.scelte.forEach(scelta => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = scelta.testo;
      btn.onclick = () => {
        currentPage = scelta.vaiAllaPagina;
        renderPage();
      };
      choicesEl.appendChild(btn);
    });
  } else {
    document.getElementById('reader-body').style.display = 'none';
    document.getElementById('completion-screen').classList.add('visible');
  }
}

function restartStory() {
  clearProgress(currentStory.titolo);
  currentPage = 1;
  document.getElementById('reader-body').style.display = 'flex';
  document.getElementById('completion-screen').classList.remove('visible');
  renderPage();
}