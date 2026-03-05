// ================================================================
//  external-links.js — Gestione link esterni su browser package dedicato
// ================================================================

(function setupExternalLinkRouting() {
  const ua = (navigator.userAgent || '').toLowerCase();
  const isQcStuBrowser = ua.includes('com.qc17.stu');
  if (!isQcStuBrowser) return;

  function isRepoUrl(url) {
    if (url.origin === window.location.origin) return true;

    if (url.hostname === 'qc-17.github.io' && url.pathname.startsWith('/Sceglitu')) {
      return true;
    }

    if (url.hostname === 'github.com' && url.pathname.startsWith('/Qc-17/Sceglitu')) {
      return true;
    }

    if (url.hostname === 'raw.githubusercontent.com' && url.pathname.startsWith('/Qc-17/Sceglitu/')) {
      return true;
    }

    return false;
  }

  function openInPreferredBrowser(targetUrl) {
    const scheme = targetUrl.protocol.replace(':', '') || 'https';
    const intentUrl = `intent://${targetUrl.host}${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}#Intent;scheme=${scheme};action=android.intent.action.VIEW;end`;

    try {
      window.location.href = intentUrl;
    } catch {
      window.open(targetUrl.href, '_blank', 'noopener,noreferrer');
    }
  }

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;

    let url;
    try {
      url = new URL(anchor.getAttribute('href'), window.location.href);
    } catch {
      return;
    }

    if (!['http:', 'https:'].includes(url.protocol)) return;
    if (isRepoUrl(url)) return;

    event.preventDefault();
    openInPreferredBrowser(url);
  }, true);
})();
