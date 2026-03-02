let currentTab = 'paste';
let pendingFileJson = null;

function openEditor() {
  document.getElementById('json-input').value = '';
  document.getElementById('error-msg').classList.remove('visible');
  pendingFileJson = null;
  resetDropZone();
  switchTab('paste');
  showView('editor');
}

function closeEditor() { 
  showView('home'); 
  renderHome(); 
}

function switchTab(tab) {
  currentTab = tab;
  const btns = document.querySelectorAll('.tab-btn');
  btns[0].classList.toggle('active', tab === 'paste');
  btns[1].classList.toggle('active', tab === 'file');
  document.getElementById('json-input').style.display = tab === 'paste' ? 'block' : 'none';
  const dz = document.getElementById('drop-zone');
  dz.classList.toggle('shown', tab === 'file');
  document.getElementById('error-msg').classList.remove('visible');
}

function resetDropZone() {
  document.getElementById('drop-label').textContent = t('editor.dropLabel');
  document.getElementById('drop-sub').innerHTML = t('editor.dropSub');
}

function showErr(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.add('visible');
}

function saveStory() {
  let json = currentTab === 'paste'
    ? document.getElementById('json-input').value.trim()
    : (pendingFileJson || '');

  if (!json) { showErr(t('editor.errorNoJson')); return; }

  let data;
  try { data = JSON.parse(json); }
  catch (e) { showErr(t('editor.errorInvalidJson') + e.message); return; }

  if (!data.titolo || typeof data.titolo !== 'string') { showErr(t('editor.errorMissingTitle')); return; }
  if (!Array.isArray(data.pagine) || !data.pagine.length) { showErr(t('editor.errorMissingPages')); return; }
  if (!data.lingua || (data.lingua !== 'it' && data.lingua !== 'en')) { showErr(t('editor.errorMissingLang')); return; }

  // Check if language matches current language
  if (data.lingua !== currentLang) {
    if (!confirm(t('editor.errorWrongLang') + ' (' + data.lingua + '). ' + (data.lingua === 'it' ? 'Italiano' : 'English') + '?')) return;
  }

  const dupIdx = stories.findIndex(s => s.titolo === data.titolo);
  if (dupIdx >= 0) {
    if (!confirm(t('editor.errorDuplicate') + data.titolo + t('editor.errorDuplicateQuestion'))) return;
    stories[dupIdx] = data;
  } else {
    stories.push(data);
  }

  saveStories();
  pendingFileJson = null;
  toast(t('editor.saveSuccess'));
  closeEditor();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('file-input').addEventListener('change', function() {
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
});

function readFile(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    pendingFileJson = ev.target.result;
    document.getElementById('drop-label').textContent = '✓ ' + file.name;
    document.getElementById('drop-sub').textContent = t('toast.fileLoaded');
    document.getElementById('error-msg').classList.remove('visible');
  };
  reader.readAsText(file);
}