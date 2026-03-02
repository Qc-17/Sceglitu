// ================================================================
//  i18n.js — Traduzioni IT/EN e funzione di cambio lingua
// ================================================================

const translations = {
  it: {
    home: {
      subtitle: 'Storie interattive',
      emptyTitle: 'Nessuna storia',
      emptyDesc: 'Premi il pulsante + in basso per creare o importare una storia interattiva in formato JSON.',
      emptyDescFiltered: 'Nessuna storia in italiano. Importa nuove storie o cambia lingua.',
      deleteConfirm: 'Eliminare',
      metaPages: 'pagine',
      metaReading: 'In lettura (p.',
      tutorialBtn: 'Apri tutorial'
    },
    editor: {
      title: 'Nuova storia',
      guideTitle: '📖 Come creare una storia',
      guideP1: 'Una storia è composta da <strong>pagine</strong>. Ogni pagina ha un testo e delle <strong>scelte</strong> che portano ad altre pagine. Se una pagina non ha scelte, è la fine di quel percorso.',
      guideP2: 'Incolla il JSON nell\'area qui sotto oppure importa un file <code>.json</code>. Esempi e documentazione su <a href="https://github.com/Qc-17/Sceglitu" target="_blank">GitHub ↗</a>.',
      guideP3: 'È possibile usare un editor visuale<br>  -Per telefono clicca <a href="editor.html">qui</a><br>  -Per computer (più completo) clicca <a href="editorpc.html">qui</a>',
      importTitle: 'Importa storia',
      pasteTab: '📋 Incolla JSON',
      fileTab: '📂 File JSON',
      dropLabel: 'Clicca per scegliere un file',
      dropSub: 'oppure trascina qui un file <code>.json</code>',
      errorNoJson: 'Nessun JSON fornito. Incolla il contenuto o seleziona un file.',
      errorInvalidJson: 'JSON non valido: ',
      errorMissingTitle: 'Campo "titolo" mancante o non valido.',
      errorMissingPages: 'Campo "pagine" mancante o vuoto.',
      errorDuplicate: 'Esiste già una storia chiamata "',
      errorDuplicateQuestion: '". Sostituirla?',
      saveBtn: '💾 Salva storia',
      saveSuccess: 'Storia salvata!'
    },
    reader: {
      whatDo: 'Cosa fai?',
      pageLabel: 'Pag. ',
      jsonBtn: 'Mostra JSON',
      restartBtn: '&#8634; Ricomincia da capo',
      completionTitle: 'Storia completata!',
      completionText: 'Hai raggiunto la fine di questo percorso narrativo. Bravo!',
      backBtn: '&#8592; Torna all\'elenco',
      pageNotFound: 'Pagina'
    },
    modal: {
      title: 'JSON della storia',
      closeBtn: 'Chiudi',
      copyBtn: '📋 Copia JSON',
      copySuccess: 'JSON copiato!'
    },
    fab:    { tooltip: 'Crea o importa storia' },
    footer: { text: 'Sceglitu &mdash;', license: '&mdash; Licenza GPL&nbsp;3.0 &copy; Qc-17' },
    toast: {
      storyDeleted: 'Storia eliminata',
      fileLoaded: 'File caricato correttamente',
      imported: 'storia importata da GitHub',
      importedPlural: 'storie importate da GitHub'
    }
  },

  en: {
    home: {
      subtitle: 'Interactive stories',
      emptyTitle: 'No stories',
      emptyDesc: 'Press the + button below to create or import an interactive story in JSON format.',
      emptyDescFiltered: 'No stories in English. Import new stories or switch language.',
      deleteConfirm: 'Delete',
      metaPages: 'pages',
      metaReading: 'Reading (p.',
      tutorialBtn: 'Open tutorial'
    },
    editor: {
      title: 'New story',
      guideTitle: '📖 How to create a story',
      guideP1: 'A story is made of <strong>pages</strong>. Each page has text and <strong>choices</strong> that lead to other pages. If a page has no choices, it\'s the end of that path.',
      guideP2: 'Paste the JSON in the area below or import a <code>.json</code> file. Examples and documentation on <a href="https://github.com/Qc-17/Sceglitu" target="_blank">GitHub ↗</a>',
      guideP3: 'Click <a href="editor.html">here</a> for a visual editor for the smartphone, or click <a href="editorpc.html">here</a> for a more complete editor for the computer',
      importTitle: 'Import story',
      pasteTab: '📋 Paste JSON',
      fileTab: '📂 JSON File',
      dropLabel: 'Click to choose a file',
      dropSub: 'or drag a <code>.json</code> file here',
      errorNoJson: 'No JSON provided. Paste content or select a file.',
      errorInvalidJson: 'Invalid JSON: ',
      errorMissingTitle: 'Field "title" missing or invalid.',
      errorMissingPages: 'Field "pages" missing or empty.',
      errorDuplicate: 'A story named "',
      errorDuplicateQuestion: '" already exists. Replace it?',
      saveBtn: '💾 Save story',
      saveSuccess: 'Story saved!'
    },
    reader: {
      whatDo: 'What do you do?',
      pageLabel: 'Page ',
      jsonBtn: 'Show JSON',
      restartBtn: '&#8634; Start over',
      completionTitle: 'Story completed!',
      completionText: 'You\'ve reached the end of this narrative path. Well done!',
      backBtn: '&#8592; Back to list',
      pageNotFound: 'Page'
    },
    modal: {
      title: 'Story JSON',
      closeBtn: 'Close',
      copyBtn: '📋 Copy JSON',
      copySuccess: 'JSON copied!'
    },
    fab:    { tooltip: 'Create or import story' },
    footer: { text: 'Sceglitu &mdash;', license: '&mdash; GPL License 3.0 &copy; Qc-17' },
    toast: {
      storyDeleted: 'Story deleted',
      fileLoaded: 'File loaded successfully',
      imported: 'story imported from GitHub',
      importedPlural: 'stories imported from GitHub'
    }
  }
};

// Lookup helper
function t(key) {
  const keys = key.split('.');
  let obj = translations[currentLang];
  for (const k of keys) obj = obj && obj[k];
  return obj || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('sceglitu_lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', (idx === 0 && lang === 'it') || (idx === 1 && lang === 'en'));
  });

  // Re-render all data-i18n nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });

  renderHome();
}
