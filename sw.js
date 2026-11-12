const V='agentcalc-v1.2.1',A=['./','./index.html','./offline.html','./manifest.webmanifest','./css/styles.css','./js/app.js','./js/calculators.js','./js/visual-builder.js','./js/glossary.js','./images/logo-championship.svg','./images/logo-dubai-chamber.svg','./favicon.svg','./favicon.ico','./apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/og-image.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(A.map(u=>c.add(u)))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
const put=x=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x};
if(r.mode==='navigate'){e.respondWith(fetch(r).then(put).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html')).then(m=>m||caches.match('./offline.html'))));return}
e.respondWith(caches.match(r).then(m=>m||fetch(r).then(put).catch(()=>caches.match('./offline.html'))))});
