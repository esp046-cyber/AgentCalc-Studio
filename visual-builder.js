const TPL={'Agent run cost':{name:'Agent run cost',inputs:[{key:'runs',label:'Runs / month',value:5000},{key:'tokens',label:'Tokens per run',value:6000},{key:'price_m',label:'Price $ per M tokens',value:5}],formulas:[{key:'cost',expr:'runs*tokens/1e6*price_m'}],outputs:[{label:'Monthly cost',key:'cost',fmt:'$'}]},
'Time saved':{name:'Time saved',inputs:[{key:'tasks',label:'Tasks / week',value:200},{key:'minutes',label:'Minutes / task',value:10},{key:'hourly_wage',label:'Hourly wage',value:20},{key:'auto',label:'Automation rate (0–1)',value:0.7}],formulas:[{key:'hours',expr:'Math.round(tasks*minutes/60*auto*52)'},{key:'saved',expr:'hours*hourly_wage'}],outputs:[{label:'Hours saved / year',key:'hours',fmt:'#'},{label:'Savings / year',key:'saved',fmt:'$'}]}};
let VB=JSON.parse(JSON.stringify(TPL['Agent run cost'])),focusF=0;
const ST=()=>{try{return JSON.parse(localStorage.getItem('ac_saved')||'{}')}catch(e){return {}}};
function vbEval(){const sc={},errs={};VB.inputs.forEach(i=>sc[i.key]=+i.value||0);VB.formulas.forEach((f,n)=>{try{if(!/^[\w\s+\-*\/().,<>=?:%]*$/.test(f.expr))throw Error('Unsupported character');const r=Function(...Object.keys(sc),'return ('+f.expr+')')(...Object.values(sc));if(!isFinite(r))throw Error('Result is not a number');sc[f.key]=r}catch(e){errs[n]=e.message;sc[f.key]=NaN}});return{sc,errs}}
function vbOut(){const {sc,errs}=vbEval();VB.formulas.forEach((f,n)=>{const e=document.getElementById('fe'+n);if(e)e.innerHTML=errs[n]?`<span class=err>${errs[n]}</span>`:`= <b class=mono>${nf(sc[f.key],4)}</b>`});
const o=document.getElementById('vout');if(!o)return;const rows=VB.outputs.map(x=>[x.label,x.fmt=='$'?fmt(sc[x.key]):x.fmt=='%'?nf(sc[x.key])+'%':nf(sc[x.key])]);
const nums=VB.outputs.map(x=>[x.label,+sc[x.key]||0]);o.innerHTML=rows.map(r=>`<div class=kpi><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')+(nums.length?bars(nums):'')}
function mountBuilder(el){const sv=ST(),names=Object.keys(sv),keys=()=>VB.inputs.concat(VB.formulas).map(x=>x.key);
el.innerHTML=`<h2>Visual calculator builder</h2><div class=grid><div>
<div class=card><label for=vn>Calculator name</label><input id=vn value="${VB.name}"><div class=row><button class=btn data-a=save>Save</button><button class="btn ghost" data-a=json>Export JSON</button><button class="btn ghost" data-a=md>Export report</button><button class="btn ghost" data-a=print>Print</button></div></div>
<div class=card><h3>Input blocks</h3>${VB.inputs.map((i,n)=>`<div class=row><input aria-label="Label" data-i=${n} data-p=label value="${i.label}"><input aria-label="Variable key" data-i=${n} data-p=key value="${i.key}"><input aria-label="Value" type=number step=any data-i=${n} data-p=value value="${i.value}"><button class="btn ghost" data-a=deli data-n=${n} aria-label="Remove">✕</button></div>`).join('')}<button class="btn ghost" data-a=addi>Add number input</button></div>
<div class=card><h3>Formula blocks</h3>${VB.formulas.map((f,n)=>`<div class=row><input aria-label="Key" data-f=${n} data-p=key value="${f.key}"><input aria-label="Expression" data-f=${n} data-p=expr class=mono value="${f.expr}"><button class="btn ghost" data-a=delf data-n=${n} aria-label="Remove">✕</button></div><div id=fe${n}></div>`).join('')}
<div>${keys().map(k=>`<button class=chip data-chip="${k}">${k}</button>`).join('')}${['+','-','*','/','(',')','Math.max(','Math.round('].map(k=>`<button class=chip data-chip="${k}">${k}</button>`).join('')}</div><button class="btn ghost" data-a=addf>Add formula</button></div></div>
<div><div class=card><h3>Output blocks</h3>${VB.outputs.map((o,n)=>`<div class=row><input aria-label="Output label" data-o=${n} data-p=label value="${o.label}"><select aria-label="Variable" data-o=${n} data-p=key>${keys().map(k=>`<option ${k==o.key?'selected':''}>${k}</option>`).join('')}</select><select aria-label="Format" data-o=${n} data-p=fmt>${['$','%','#'].map(k=>`<option ${k==o.fmt?'selected':''}>${k}</option>`).join('')}</select><button class="btn ghost" data-a=delo data-n=${n} aria-label="Remove">✕</button></div>`).join('')}<button class="btn ghost" data-a=addo>Add KPI / chart output</button></div>
<div class=card><h3>Live result</h3><div id=vout></div></div>
<div class=card><h3>Templates & saved</h3>${Object.keys(TPL).map(t=>`<button class=chip data-tpl="${t}">${t}</button>`).join('')}${names.length?names.map(n=>`<button class=chip data-load="${n}">${n}</button> <button class="chip" data-dup="${n}" aria-label="Duplicate ${n}">⧉</button>`).join(''):'<p class=empty>Nothing saved yet. Start from a template above.</p>'}</div></div></div>`;
el.oninput=e=>{const t=e.target,d=t.dataset;if(t.id=='vn'){VB.name=t.value;return}const arr=d.i!=null?VB.inputs[d.i]:d.f!=null?VB.formulas[d.f]:d.o!=null?VB.outputs[d.o]:null;if(!arr)return;arr[d.p]=t.value;if(d.p=='key'&&d.o==null)return vbOut();vbOut()};
el.onfocusin=e=>{if(e.target.dataset.f!=null&&e.target.dataset.p=='expr')focusF=+e.target.dataset.f};
el.onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset,re=()=>mountBuilder(el);
if(d.chip){const f=VB.formulas[focusF]||VB.formulas[0];if(f){f.expr+=d.chip;re()}}
else if(d.tpl){VB=JSON.parse(JSON.stringify(TPL[d.tpl]));re()}
else if(d.load){VB=JSON.parse(JSON.stringify(ST()[d.load]));re()}
else if(d.dup){const s=ST();s[d.dup+' copy']=JSON.parse(JSON.stringify(s[d.dup]));s[d.dup+' copy'].name=d.dup+' copy';localStorage.setItem('ac_saved',JSON.stringify(s));re()}
else if(d.a=='save'){const s=ST();s[VB.name]=VB;localStorage.setItem('ac_saved',JSON.stringify(s));toast('Saved');re()}
else if(d.a=='addi'){VB.inputs.push({key:'var'+VB.inputs.length,label:'New input',value:0});re()}
else if(d.a=='addf'){VB.formulas.push({key:'calc'+VB.formulas.length,expr:'0'});re()}
else if(d.a=='addo'){VB.outputs.push({label:'Output',key:keys()[0],fmt:'#'});re()}
else if(d.a=='deli'){VB.inputs.splice(d.n,1);re()}else if(d.a=='delf'){VB.formulas.splice(d.n,1);re()}else if(d.a=='delo'){VB.outputs.splice(d.n,1);re()}
else if(d.a=='json')dl(VB.name+'.json',JSON.stringify(VB,null,2),'application/json');
else if(d.a=='md'){const {sc}=vbEval();dl(VB.name+'-feasibility.md',`# ${VB.name} — Feasibility summary\n\n## Inputs\n${VB.inputs.map(i=>`- ${i.label} (${i.key}): ${i.value}`).join('\n')}\n\n## Results\n${VB.outputs.map(o=>`- ${o.label}: ${nf(sc[o.key],2)}`).join('\n')}\n`,'text/markdown')}
else if(d.a=='print')print()};vbOut()}
