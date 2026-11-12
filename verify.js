// Run: node verify.js
const fs=require('fs'),vm=require('vm');let bad=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)bad++};
const ex=p=>fs.existsSync(p.split('#')[0].split('?')[0]);
const J=f=>{try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch(e){return null}};
const m=J('manifest.webmanifest');ok(!!m,'manifest.webmanifest is valid JSON');ok(!!J('.well-known/assetlinks.json'),'assetlinks.json is valid JSON');
for(const f of [...fs.readdirSync('js').map(x=>'js/'+x),'sw.js','generate-assets.js']){try{new vm.Script(fs.readFileSync(f,'utf8'),{filename:f});ok(true,'syntax '+f)}catch(e){ok(false,'syntax '+f+' '+e.message)}}
const h=fs.readFileSync('index.html','utf8');for(const x of new Set([...h.matchAll(/(?:href|src)="([^"]+)"/g)].map(a=>a[1])))if(!/^(https?:|data:|#|mailto:)/.test(x))ok(ex(x),'index.html ref '+x);
if(m){for(const x of [...m.icons,...m.screenshots].map(i=>i.src).concat(m.shortcuts.map(s=>s.url),[m.start_url]))ok(ex(x),'manifest ref '+x);
for(const i of m.icons.concat(m.screenshots)){const b=fs.readFileSync(i.src),w=b.readUInt32BE(16),hh=b.readUInt32BE(20);ok(i.sizes==w+'x'+hh,`size ${i.src} = ${w}x${hh}`)}}
const og=fs.readFileSync('icons/og-image.png');ok(og.readUInt32BE(16)==1200&&og.readUInt32BE(20)==630,'og-image 1200x630');
const sw=fs.readFileSync('sw.js','utf8'),a=sw.match(/A=\[([^\]]+)\]/);ok(!!a,'sw precache list found');if(a)for(const x of a[1].split(',').map(s=>s.trim().replace(/'/g,'')))if(x!='./')ok(ex(x),'sw cache '+x);
for(const f of ['favicon.ico','apple-touch-icon.png','offline.html','robots.txt','.nojekyll'])ok(ex(f),'exists '+f);
console.log(bad?bad+' FAILURES':'ALL CHECKS PASSED');process.exit(bad?1:0);
