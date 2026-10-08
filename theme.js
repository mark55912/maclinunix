/* Run before CSS: prefer an explicit choice, otherwise follow the operating system.
   Storage may be unavailable for local files or private browsing; the toggle still works. */
(() => {
  const storageKey = 'maclinunix-theme';
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let manualChoice = null;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark' || saved === 'light') manualChoice = saved;
  } catch { /* Use the system preference when storage is blocked. */ }
  const root = document.documentElement;
  function applyTheme() {
    const theme = manualChoice || (preference.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const next = theme === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-label', `Switch to ${next} mode`);
      toggle.setAttribute('title', `Switch to ${next} mode`);
      toggle.setAttribute('aria-pressed', String(theme === 'light'));
      toggle.querySelector('[aria-hidden]').textContent = theme === 'dark' ? '☀' : '☾';
    }
  }
  applyTheme();
  if (preference.addEventListener) preference.addEventListener('change', () => {
    if (!manualChoice) applyTheme();
  });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    manualChoice = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null;
    applyTheme();
  });
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    root.classList.add('theme-ready');
    document.getElementById('theme-toggle').addEventListener('click', () => {
      manualChoice = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(storageKey, manualChoice); } catch { /* Keep the in-page choice. */ }
      applyTheme();
    });
  });
})();
