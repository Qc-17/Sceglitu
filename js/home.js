// ================================================================
//  home.js — Lista storie: filtro lingua + tag metadata
// ================================================================

/**
 * Ritorna true se la storia deve essere mostrata nella lingua UI corrente.
 * Logica:
 *  - Se la storia non ha campo "lingua" → visibile sempre (retrocompatibilità).
 *  - currentLang 'it' → mostra storie con lingua che contiene "ital" oppure "it".
 *  - currentLang 'en' → mostra storie con lingua che contiene "engl" / "ingl" / "en".
 */
function storyMatchesCurrentLang(story) {
  const l = (story.lingua || '').toLowerCase().trim();
  if (!l) return true; // nessuna lingua dichiarata → mostra sempre
  if (currentLang === 'it') return l.startsWith('it') || l.includes('ital');
  if (currentLang === 'en') return l.startsWith('en') || l.includes('engl') || l.includes('ingl');
  return true;
}

function renderHome() {
  const c = document.getElementById('stories-container');
  const visible = stories.filter(storyMatchesCurrentLang);

  if (!visible.length) {
    const filtered = stories.length > 0; // ci sono storie ma nessuna nella lingua
    c.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h2>${t('home.emptyTitle')}</h2>
        <p>${filtered ? t('home.emptyDescFiltered') : t('home.emptyDesc')}</p>
      </div>`;
    return;
  }

  c.innerHTML = '';
  visible.forEach((story, visIdx) => {
    // Indice reale in stories[] (serve per deleteStory e openReader)
    const realIdx = stories.indexOf(story);

    const prog = getProgress(story.titolo);
    const pages = story.pagine ? story.pagine.length : 0;
    const inProgress = prog > 1;

    // ── Tag metadata ──────────────────────────────────────────
    let tagsHtml = '';
    if (story.autore || story.anno) {
      const parts = [];
      if (story.autore) parts.push(esc(story.autore));
      if (story.anno)   parts.push(esc(String(story.anno)));
      tagsHtml += `<span class="meta-tag">${parts.join(' · ')}</span>`;
    }
    if (story.genere) {
      tagsHtml += `<span class="meta-tag genre">${esc(story.genere)}</span>`;
    }
    if (story.lingua) {
      tagsHtml += `<span class="meta-tag lang">${esc(story.lingua)}</span>`;
    }
    const tagsBlock = tagsHtml ? `<div class="story-card-tags">${tagsHtml}</div>` : '';

    const card = document.createElement('div');
    card.className = 'story-card';
    card.style.animationDelay = (visIdx * 0.06) + 's';
    card.innerHTML = `
      <div class="story-card-icon">📖</div>
      <div class="story-card-body">
        <div class="story-card-title">${esc(story.titolo)}</div>
        <div class="story-card-meta">${pages} ${t('home.metaPages')}${inProgress ? ' · ' + t('home.metaReading') + prog + ')' : ''}</div>
        ${tagsBlock}
      </div>
      <div class="story-card-progress ${inProgress ? 'active' : ''}">${inProgress ? 'p.' + prog : '–'}</div>
      <button class="story-card-delete" title="Elimina storia" onclick="deleteStory(event,${realIdx})">🗑</button>
    `;
    card.addEventListener('click', e => {
      if (e.target.closest('.story-card-delete')) return;
      openReader(realIdx);
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
