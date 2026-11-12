const $=s=>document.querySelector(s);
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;setTimeout(()=>t.hidden=true,3500)}
function dl(n,c,t){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:t}));a.download=n;a.click()}
const done={};
function go(t,sub){document.querySelectorAll('#nav button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t==t));document.querySelectorAll('main section').forEach(s=>s.hidden=s.id!=t);
if(t=='build')mountBuilder($('#build'));if(t=='calc')mountCalcs($('#calc'),sub);if(t=='gloss'&&!done.g){mountGlossary($('#gloss'));done.g=1}if(t=='brief')mountBrief($('#brief'));history.replaceState(null,'','#'+t)}
function mountBrief(el){const F=[['pitch','One-sentence agent pitch'],['user','Target user & problem'],['bound','Autonomy boundary (agent alone vs. person)'],['log','Validation log (who you spoke to, what they did)']];let s={};try{s=JSON.parse(localStorage.getItem('ac_brief')||'{}')}catch(e){}
el.innerHTML=`<h2>Agent canvas & pitch readiness</h2><div class=grid><div class=card>${F.map(f=>`<label for=b_${f[0]}>${f[1]}</label><textarea id=b_${f[0]}>${s[f[0]]||''}</textarea>`).join('')}<div class=row><button class=btn id=bs>Export pre-build brief</button><button class="btn ghost" onclick=print()>Print</button></div></div><div class=card><h3>Latest calculator numbers</h3><pre class=mono style="white-space:pre-wrap">${window.LAST||'Run a calculator to pair numbers with your pitch.'}</pre></div></div>`;
const get=()=>Object.fromEntries(F.map(f=>[f[0],$('#b_'+f[0]).value]));el.oninput=()=>localStorage.setItem('ac_brief',JSON.stringify(get()));
$('#bs').onclick=()=>{const v=get();dl('pre-build-brief.md',`# Pre-Build Brief\n\n## Pitch\n${v.pitch}\n\n## Target user & problem\n${v.user}\n\n## Autonomy boundary\n${v.bound}\n\n## Validation log\n${v.log}\n\n## Numbers\n${window.LAST||'—'}\n`,'text/markdown')}}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>go(b.dataset.t));
$('#nav').addEventListener('keydown',e=>{const b=[...document.querySelectorAll('#nav button')],i=b.indexOf(document.activeElement);if(e.key=='ArrowRight'||e.key=='ArrowLeft'){const n=b[(i+(e.key=='ArrowRight'?1:b.length-1))%b.length];n.focus();n.click()}});
$('#theme').onclick=()=>{const r=document.documentElement,d=r.dataset.theme=='dark'||(!r.dataset.theme&&matchMedia('(prefers-color-scheme:dark)').matches);r.dataset.theme=d?'light':'dark';localStorage.setItem('ac_theme',r.dataset.theme)};
{const t=localStorage.getItem('ac_theme');if(t)document.documentElement.dataset.theme=t}
$('#partner').onclick=()=>{dlgb.innerHTML='<h3>Championship & partner alignment</h3><p>AgentCalc supports the pre-build validation method behind <b>Design an Agent That Matters</b> and <b>Turn Your Idea Into Impact</b>: know what businesses use today, what it costs, what the agent does alone and what stays with a person.</p><p>Built in partnership with the Create AI Agents Championship, an initiative by Dubai Chamber Digital.</p>';dlg.showModal()};
const on=()=>$('#off').hidden=navigator.onLine;addEventListener('online',on);addEventListener('offline',on);on();
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#install').hidden=false});
$('#install').onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;$('#install').hidden=true}};
$('#export').onclick=()=>{const S=[72,96,128,144,152,180,192,384,512,16,32];S.forEach((n,i)=>setTimeout(()=>{const c=document.createElement('canvas');c.width=c.height=n;const x=c.getContext('2d');x.fillStyle='#1A0B3B';x.fillRect(0,0,n,n);x.fillStyle='#6E359E';x.beginPath();x.arc(n/2,n/2,n*.36,0,7);x.fill();x.fillStyle='#F27A6B';x.beginPath();x.arc(n/2,n/2,n*.18,0,7);x.fill();c.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='icon-'+n+'.png';a.click()})},i*300))};
go(['build','calc','gloss','brief'].includes(location.hash.slice(1))?location.hash.slice(1):'build');
