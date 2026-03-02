// ================================================================
//  modal.js — Modal JSON della storia (invariato)
// ================================================================

function showJsonModal() {
  if (!currentStory) return;
  document.getElementById('modal-json-content').textContent = JSON.stringify(currentStory, null, 2);
  document.getElementById('json-modal').classList.add('visible');
}

function closeJsonModal() {
  document.getElementById('json-modal').classList.remove('visible');
}

function maybeCloseModal(e) {
  if (e.target === document.getElementById('json-modal')) closeJsonModal();
}

function copyJson() {
  const text = document.getElementById('modal-json-content').textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => { toast(t('modal.copySuccess')); closeJsonModal(); });
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    toast(t('modal.copySuccess')); closeJsonModal();
  }
}
