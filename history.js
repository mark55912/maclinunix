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
