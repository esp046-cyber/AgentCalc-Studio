const V='agentcalc-v1.0.0',A=['./','index.html','offline.html','manifest.webmanifest','css/styles.css','js/app.js','js/calculators.js','js/visual-builder.js','js/glossary.js','images/logo-championship.svg','images/logo-dubai-chamber.svg','favicon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('offline.html'))));return}
e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x})))});
