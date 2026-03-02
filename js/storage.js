const STORAGE_STORIES = 'sceglitu_stories_v1';
const STORAGE_PROGRESS = 'sceglitu_progress_v1';

function loadStories() {
  try { 
    stories = JSON.parse(localStorage.getItem(STORAGE_STORIES)) || []; 
  }
  catch { 
    stories = []; 
  }
}

function saveStories() { 
  localStorage.setItem(STORAGE_STORIES, JSON.stringify(stories)); 
}

function getProgress(title) {
  try { 
    return (JSON.parse(localStorage.getItem(STORAGE_PROGRESS)) || {})[title] || 1; 
  }
  catch { 
    return 1; 
  }
}

function setProgress(title, page) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_PROGRESS)) || {};
    all[title] = page;
    localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(all));
  } catch {}
}

function clearProgress(title) { 
  setProgress(title, 1); 
}