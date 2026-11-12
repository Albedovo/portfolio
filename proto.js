// Shared shell for the clickable prototype pages: screen routing, hints, language, the folded case study.
// Each page marks up its screens as <section class="screen" data-screen="id" data-title="…" data-note-en="…" data-note-zh="…">
// and wires its own behaviour through window.Proto.
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let lang='en';
const t=(en,zh)=>lang==='en'?en:(zh||en);
const phone=$('.phone'),device=$('.device');
const screens=new Map($$('.screen',phone).map(s=>[s.dataset.screen,s]));
const first=phone.dataset.start||screens.keys().next().value;
let stack=[],current=null;
const listeners=[];

function fit(){ // scale the 390×844 phone to the space available
  const narrow=innerWidth<=1020;
  const byH=(innerHeight-(narrow?40:56))/868,byW=(Math.min(innerWidth,document.documentElement.clientWidth)-24)/414;
  document.documentElement.style.setProperty('--s',Math.max(.5,Math.min(1,byH,byW)).toFixed(3));
}
fit();addEventListener('resize',fit);

function describe(){
  const s=screens.get(current);if(!s)return;
  $('#now-title').textContent=t(s.dataset.title,s.dataset.titleZh);
  $('#now-note').textContent=t(s.dataset.noteEn||'',s.dataset.noteZh);
  phone.style.setProperty('--status',s.dataset.status||'#fff');
  $$('.tasks button').forEach(b=>b.classList.toggle('active',(b.dataset.screens||b.dataset.go).split(',').includes(current)));
}
function show(id,dir){
  const next=screens.get(id);if(!next){console.warn('No screen',id);return}
  const from=current;
  screens.forEach(s=>s.classList.remove('on','fwd','bwd','fade'));
  current=id;next.classList.add('on',dir);
  const sc=$('.scroll',next);if(sc&&dir!=='bwd')sc.scrollTop=0;
  describe();
  listeners.forEach(f=>f(id,from));
}
function go(id,opt={}){
  if(id===current)return;
  if(opt.root)stack=[];else if(current&&!opt.replace)stack.push(current);
  show(id,opt.root?'fade':'fwd');
}
function back(){if(stack.length)show(stack.pop(),'bwd')}
let toastTimer;
function toast(msg,ms=2200){const el=$('.ptoast',phone);el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),ms)}
function done(task){$(`.tasks [data-task="${task}"]`)?.classList.add('done')}

// Taps: data-go navigates, data-back returns, data-root switches tab. A tap on nothing flashes what is tappable.
phone.addEventListener('click',e=>{
  const el=e.target.closest('[data-go],[data-back],[data-act]');
  if(!el||!phone.contains(el)){phone.classList.add('flash');setTimeout(()=>phone.classList.remove('flash'),450);return}
  if(el.dataset.back!==undefined)back();
  else if(el.dataset.go)go(el.dataset.go,{root:el.dataset.root!==undefined,replace:el.dataset.replace!==undefined});
});
$$('.tasks button').forEach(b=>b.addEventListener('click',()=>{go(b.dataset.go,{root:true});if(innerWidth<=1020)device.scrollIntoView({block:'start'})}));
$('#hints')?.addEventListener('click',e=>{const on=phone.classList.toggle('hints');e.currentTarget.setAttribute('aria-pressed',on)});
$('#restart')?.addEventListener('click',()=>{window.Proto.reset?.();stack=[];current=null;show(first,'fade')});

// Language
function applyLang(){
  document.documentElement.lang=lang==='en'?'en':'zh-CN';
  $$('[data-en]').forEach(el=>el.innerHTML=el.dataset[lang]);
  const b=$('#language');b.textContent=lang==='en'?'中 / EN':'中文 / EN';b.setAttribute('aria-label',t('Switch to Chinese','切换至英文'));
  describe();
}
$('#language').addEventListener('click',()=>{lang=lang==='en'?'zh':'en';applyLang()});

// Case study boards load only when the fold is opened
const caseEl=$('.case');
caseEl?.addEventListener('toggle',()=>{
  const g=$('.boards',caseEl);if(!caseEl.open||g.childElementCount)return;
  g.innerHTML=g.dataset.pages.split(',').map(n=>`<a href="assets/original-${n.padStart(2,'0')}.webp" target="_blank" rel="noopener"><img src="assets/board-${n.padStart(2,'0')}.webp" alt="${g.dataset.name} — project board ${n}" loading="lazy"></a>`).join('');
});
if(location.hash==='#case-study'&&caseEl){caseEl.open=true}

window.Proto={go,back,toast,done,t,get current(){return current},get lang(){return lang},on:f=>listeners.push(f),start(){show(first,'fade')},$,$$};
})();
