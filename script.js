/* Command data uses conservative examples. Unix / BSD is represented by FreeBSD,
   because historical Unix and the BSD family do not share one universal toolset. */
const commands = [
 ['ls','List files','ls -lah'],['cd','Change directory','cd /usr'],['pwd','Print working directory','pwd'],['cp','Copy a file','cp notes.txt notes-backup.txt'],['mv','Move or rename a file','mv draft.txt final.txt'],['rm','Remove a file (asks first)','rm -i old-notes.txt'],['mkdir','Create a directory','mkdir -p projects/demo'],['grep','Search text','grep -n "hello" notes.txt'],['find','Find files','find . -name "*.txt"'],['chmod','Change permissions','chmod 644 notes.txt'],['chown','Change owner (may need privileges)','chown username notes.txt'],['ps','List processes','ps -ef'],['kill','Request a process to stop','kill -TERM 1234'],['ssh','Connect to a remote machine','ssh user@hostname'],['scp','Copy to a remote machine','scp notes.txt user@hostname:'],['curl','Fetch response headers','curl -I https://example.com'],['tar','Create an archive','tar -cf notes.tar notes.txt'],['top','Monitor processes','top'],['df','Show filesystem space','df -h'],['du','Show directory size','du -sh .'],['whoami','Print your username','whoami'],['uname','Show system information','uname -s'],['cat','Read a file','cat notes.txt'],['less','Read one screen at a time','less notes.txt'],['head','Read the first lines','head -n 5 notes.txt'],['tail','Read the last lines','tail -n 5 notes.txt'],['man','Read the local manual','man ls'],
 ['ls (color)','Colorize the file listing',{macos:'ls -G',linux:'ls --color=auto',bsd:'ls -G'},'Options differ','BSD color flags differ from GNU.'],
 ['stat','Inspect file metadata',{macos:'stat -f "%z" notes.txt',linux:'stat -c "%s" notes.txt',bsd:'stat -f "%z" notes.txt'},'Options differ','Example prints file size in bytes.'],
 ['date','Parse a date',{macos:'date -j -f "%Y-%m-%d" "2026-10-04" "+%A"',linux:'date -d "2026-10-04" "+%A"',bsd:'date -j -f "%Y-%m-%d" "2026-10-04" "+%A"'},'Options differ','Different parsing flags; local timezone applies.']
];
const contexts={macos:'macOS · Commonly BSD-derived utilities, alongside Apple tools. Additional options vary by release.',linux:'Linux · Examples assume common GNU utilities. Distribution, installed packages, and tool versions can differ.',bsd:'Unix / BSD · These examples use FreeBSD conventions. Other BSD systems and commercial Unix variants may differ.'};
const rows=document.getElementById('command-rows');
// Reference widgets initialize only on the page that contains them.
if(rows){
let selectedOS='macos';
function renderCommands(){
 const query=document.getElementById('command-search').value.trim().toLowerCase();
 const filtered=commands.filter(c=>`${c[0]} ${c[1]}`.toLowerCase().includes(query));
 rows.replaceChildren();
 for(const [name,purpose,examples,status,note] of filtered){
  const example=typeof examples==='string'?examples:examples[selectedOS];
  const row=document.createElement('div');row.className='command-row';
  const identity=document.createElement('div');identity.className='command-name';
  const title=document.createElement('strong');title.textContent=name;const subtitle=document.createElement('small');subtitle.textContent=purpose;identity.append(title,subtitle);
  const sample=document.createElement('div');sample.className='command-example';const code=document.createElement('code');code.textContent=example;const copy=document.createElement('button');copy.className='copy';copy.textContent='Copy';copy.dataset.copy=example;copy.setAttribute('aria-label',`Copy ${name} example`);sample.append(code,copy);
  const compatibility=document.createElement('div');compatibility.className=`compat${status?' different':''}`;compatibility.textContent=status||'↔ Shared basics';if(note){const detail=document.createElement('small');detail.textContent=note;compatibility.append(detail);}else if(name==='top'||name==='ps'){const detail=document.createElement('small');detail.textContent='Output and advanced flags vary.';compatibility.append(detail);}
  row.append(identity,sample,compatibility);rows.append(row);
 }
 if(!filtered.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='No commands found. Try “files”, “ssh”, or “permissions”.';rows.append(empty);}
 document.getElementById('command-context').textContent=contexts[selectedOS];
 document.getElementById('command-count').textContent=`${filtered.length} / ${commands.length} commands`;
}
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selectTab(tab){selectedOS=tab.dataset.os;tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});document.getElementById('command-results').setAttribute('aria-labelledby',tab.id);renderCommands();}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();tabs[next].focus();selectTab(tabs[next]);}});});
document.getElementById('command-search').addEventListener('input',renderCommands);
renderCommands();
}
let toastTimer;
function announce(message){const toast=document.getElementById('copy-status');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3200);}
document.addEventListener('click',async event=>{const button=event.target.closest('[data-copy]');if(!button)return;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(button.dataset.copy);}else{const field=document.createElement('textarea');field.value=button.dataset.copy;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();const copied=document.execCommand('copy');field.remove();button.focus();if(!copied)throw new Error('Clipboard unavailable');}announce('Command copied to clipboard');}catch{announce('Copy unavailable. Select the command text to copy it.');}});
const menu=document.querySelector('.menu');const nav=document.getElementById('navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
// Page links retain their current-page marker; section links update while reading.
if('IntersectionObserver' in window){
 const sectionLinks=[...nav.querySelectorAll('a')].filter(link=>{
  const target=new URL(link.href,window.location.href);
  return target.pathname===window.location.pathname && target.hash;
 });
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){if(entry.isIntersecting){sectionLinks.forEach(link=>{
   const active=link.hash===`#${entry.target.id}`;
   link.classList.toggle('active',active);
   if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
  });}}
 },{rootMargin:'-15% 0px -65% 0px',threshold:0});
 document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));
}

/* Permission sandbox: calculate the three octal digits from native checkboxes.
   Preview only: no files are created and no commands are executed. */
if(document.getElementById('permission-command')){
const permissionGroups=['owner','group','others'];
const permissionInputs=[...document.querySelectorAll('[data-permission]')];
const permissionPresets=[...document.querySelectorAll('[data-mode]')];
let permissionFilename='script.sh';
function updatePermissions(){
 const digits=[];
 const symbolic=[];
 const descriptions=[];
 for(const group of permissionGroups){
  const inputs=permissionInputs.filter(input=>input.dataset.permission===group);
  const digit=inputs.reduce((sum,input)=>sum+(input.checked?Number(input.value):0),0);
  const letters=inputs.map((input,index)=>input.checked?'rwx'[index]:'-').join('');
  const names=inputs.filter(input=>input.checked).map(input=>({4:'read',2:'write',1:'execute'})[input.value]);
  digits.push(digit);symbolic.push(letters);
  document.getElementById(`${group}-digit`).textContent=String(digit);
  document.getElementById(`${group}-letters`).textContent=letters;
  descriptions.push(`${group[0].toUpperCase()+group.slice(1)}: ${names.length?names.join(', '):'no permissions'}.`);
 }
 const mode=digits.join('');
 const command=`chmod ${mode} ${permissionFilename}`;
 document.getElementById('permission-command').textContent=command;
 document.getElementById('permission-copy').dataset.copy=command;
 document.getElementById('permission-symbolic').textContent=`-${symbolic.join('')}`;
 document.getElementById('permission-summary').textContent=descriptions.join(' ');
 permissionPresets.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===mode)));
}
permissionInputs.forEach(input=>input.addEventListener('change',updatePermissions));
permissionPresets.forEach(button=>button.addEventListener('click',()=>{
 const mode=button.dataset.mode;
 permissionFilename=mode==='644'?'notes.txt':'script.sh';
 permissionInputs.forEach(input=>{
  const digit=Number(mode[permissionGroups.indexOf(input.dataset.permission)]);
  input.checked=(digit&Number(input.value))!==0;
 });
 updatePermissions();
}));
updatePermissions();

}
