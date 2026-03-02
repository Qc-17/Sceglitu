function showJsonModal() {
  const json = JSON.stringify(currentStory, null, 2);
  document.getElementById('modal-json-content').textContent = json;
  document.getElementById('json-modal').classList.add('visible');
}

function closeJsonModal() {
  document.getElementById('json-modal').classList.remove('visible');
}

function maybeCloseModal(e) {
  if (e.target.id === 'json-modal') closeJsonModal();
}

function copyJson() {
  const json = JSON.stringify(currentStory, null, 2);
  navigator.clipboard.writeText(json).then(() => {
    toast(t('modal.copySuccess'));
  });
}