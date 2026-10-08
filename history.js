/* Highlight selected relationships without hiding the diagram or the story.
   Native buttons work with keyboard, touch, and pointer input. */
const pathButtons=[...document.querySelectorAll('[data-path]')];
const mapParts=[...document.querySelectorAll('[data-branches]')];
const pathNotes={
 all:'All connections: solid lines follow technical lineage, blue dashed lines show influence or compatibility, and amber lines converge where components are combined.',
 bsd:'Unix & BSD: Berkeley extended licensed Unix. Later redistributable BSD releases, including Net/2 and 4.4BSD-Lite, contributed to distinct modern BSD projects. System V is another Unix branch.',
 apple:'Mach, NeXT & Apple: Mach and BSD components combined at NeXT. Apple developed that inheritance through Rhapsody and Darwin, with continued BSD contributions and Apple technologies. XNU is Darwin’s kernel; macOS is the larger product.',
 linux:'GNU & Linux: Unix inspired independent implementations. GNU software and the Linux kernel are separate projects, combined with other software in many distributions. The dashed connections do not mean Unix source-code descent.'
};
function highlightPath(path){
 pathButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.path===path)));
 mapParts.forEach(part=>part.classList.toggle('map-muted',path!=='all'&&!part.dataset.branches.split(' ').includes(path)));
 document.getElementById('map-reading').textContent=pathNotes[path];
}
pathButtons.forEach(button=>button.addEventListener('click',()=>highlightPath(button.dataset.path)));

/* Mobile era disclosures. Without JS, every paragraph stays visible.
   Anchor links open their target era before the browser scrolls to it. */
const eraSections = [...document.querySelectorAll('.history-era')];
const mobileEras = window.matchMedia('(max-width: 800px)');
const eraStates = new Map(eraSections.map(era => [era.id, false]));
function setEraOpen(era, open) {
  const button = era.querySelector('.era-toggle');
  const content = era.querySelector('.era-content');
  // Keep focus out of a region that is about to become hidden.
  if (!open && content.contains(document.activeElement)) button.focus();
  button.setAttribute('aria-expanded', String(open));
  button.querySelector('.era-indicator').textContent = open ? '−' : '+';
  content.hidden = !open;
}
function openLinkedEra(hash) {
  if (!hash) return;
  let target;
  try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
  const era = target && target.closest('.history-era');
  if (era) {
    eraStates.set(era.id, true);
    setEraOpen(era, true);
  }
}
function syncEraLayout() {
  document.documentElement.classList.toggle('mobile-eras', mobileEras.matches);
  eraSections.forEach(era => {
    const button = era.querySelector('.era-toggle');
    // Desktop headings remain text; the button is enabled only on mobile.
    button.disabled = !mobileEras.matches;
    setEraOpen(era, !mobileEras.matches || eraStates.get(era.id));
  });
  openLinkedEra(window.location.hash);
}
eraSections.forEach(era => era.querySelector('.era-toggle').addEventListener('click', () => {
  if (!mobileEras.matches) return;
  const open = era.querySelector('.era-toggle').getAttribute('aria-expanded') !== 'true';
  eraStates.set(era.id, open);
  setEraOpen(era, open);
}));
function setAllEras(open) {
  if (!mobileEras.matches) return;
  eraSections.forEach(era => { eraStates.set(era.id, open); setEraOpen(era, open); });
}
document.getElementById('expand-eras').addEventListener('click', () => setAllEras(true));
document.getElementById('collapse-eras').addEventListener('click', () => setAllEras(false));
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link) return;
  const url = new URL(link.href, window.location.href);
  if (url.pathname === window.location.pathname && url.hash) openLinkedEra(url.hash);
});
window.addEventListener('hashchange', () => openLinkedEra(window.location.hash));
if (mobileEras.addEventListener) mobileEras.addEventListener('change', syncEraLayout);
syncEraLayout();
