function renderHome() {
  const c = document.getElementById('stories-container');
  
  // Filtra storie per lingua
  const visibleStories = stories.filter(s => s.lingua === currentLang);
  
  if (!visibleStories.length) {
    c.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h2>${t('home.emptyTitle')}</h2>
        <p>${t('home.emptyDesc')}</p>
      </div>`;
    return;
  }
  
  c.innerHTML = '';
  visibleStories.forEach((story, idx) => {
    const prog = getProgress(story.titolo);
    const pages = story.pagine ? story.pagine.length : 0;
    const inProgress = prog > 1;
    
    // Metadata: autore, anno, genere
    let meta = `${pages} ${t('home.metaPages')}`;
    if (story.autore) meta += ` ${t('home.metaAutore')} ${esc(story.autore)}`;
    if (story.genere) meta += `${t('home.metaGenere')}${esc(story.genere)}`;
    if (story.anno) meta += ` (${story.anno})`;
    if (inProgress) meta += ` · ${t('home.metaReading')} ${prog})`;

    const card = document.createElement('div');
    card.className = 'story-card';
    card.style.animationDelay = (idx * 0.06) + 's';
    card.innerHTML = `
      <div class="story-card-icon">📖</div>
      <div class="story-card-body">
        <div class="story-card-title">${esc(story.titolo)}</div>
        <div class="story-card-meta">${meta}</div>
      </div>
      <div class="story-card-progress ${inProgress ? 'active' : ''}">${inProgress ? 'p.' + prog : '–'}</div>
      <button class="story-card-delete" title="Elimina storia" onclick="deleteStory(event,${stories.indexOf(story)})">🗑</button>
    `;
    card.addEventListener('click', e => {
      if (e.target.closest('.story-card-delete')) return;
      openReader(stories.indexOf(story));
    });
    c.appendChild(card);
  });
}

function deleteStory(e, idx) {
  e.stopPropagation();
  if (!confirm(`${t('home.deleteConfirm')} "${stories[idx].titolo}"?`)) return;
  stories.splice(idx, 1);
  saveStories();
  renderHome();
  toast(t('toast.storyDeleted'));
}