// Zero-dependency PNG/ICO generator. Run: node generate-assets.js
const fs=require('fs'),z=require('zlib');
const T=[...Array(256)].map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;return c>>>0});
const crc=b=>{let c=~0;for(const x of b)c=T[(c^x)&255]^(c>>>8);return ~c>>>0};
const chunk=(t,d)=>{const b=Buffer.concat([Buffer.from(t),d]),o=Buffer.alloc(4),e=Buffer.alloc(4);o.writeUInt32BE(d.length);e.writeUInt32BE(crc(b));return Buffer.concat([o,b,e])};
function png(w,h,px){const raw=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++){raw[y*(w*4+1)]=0;for(let x=0;x<w;x++){const p=px(x,y,w,h);raw.set(p,y*(w*4+1)+1+x*4)}}
const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',z.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))])}
const BG=[26,11,59,255],PU=[110,53,158,255],CO=[242,122,107,255];
const icon=s=>(x,y,w,h)=>{const d=Math.hypot(x-w/2,y-h/2)/w;return d<s*.5?CO:d<s?PU:BG};
const wide=(x,y,w,h)=>{const d=Math.hypot(x-w*.78,y-h/2)/h;return d<.2?CO:d<.4?PU:BG};
const out=(f,b)=>{fs.mkdirSync(require('path').dirname(f),{recursive:true});fs.writeFileSync(f,b)};
[72,96,128,144,152,192,384,512].forEach(n=>out(`icons/icon-${n}.png`,png(n,n,icon(.36))));
[192,512].forEach(n=>out(`icons/icon-maskable-${n}.png`,png(n,n,icon(.28))));
out('apple-touch-icon.png',png(180,180,icon(.36)));
[16,32].forEach(n=>out(`icons/favicon-${n}x${n}.png`,png(n,n,icon(.4))));
const f32=png(32,32,icon(.4)),hd=Buffer.alloc(22);hd.writeUInt16LE(1,2);hd.writeUInt16LE(1,4);hd[6]=32;hd[7]=32;hd.writeUInt16LE(1,10);hd.writeUInt16LE(32,12);hd.writeUInt32LE(f32.length,14);hd.writeUInt32LE(22,18);
out('favicon.ico',Buffer.concat([hd,f32]));
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const rr=(x,y,a,b,c,d,r)=>x>=a&&x<=c&&y>=b&&y<=d&&!(((x<a+r||x>c-r)&&(y<b+r||y>d-r))&&Math.hypot(x-(x<a+r?a+r:c-r),y-(y<b+r?b+r:d-r))>r);
const banner=(x,y,w,h)=>{let c=mix(BG,PU,Math.min(1,(x/w*.6+y/h*.4)*.9));const g=Math.hypot(x-w*.85,y-h*.1)/w;if(g<.4)c=mix(c,CO,(.4-g)*1.4);const P=h>w,u=Math.min(w,h)/630,r=18*u;
for(let i=0;i<3;i++){const a=P?.08*w:(.05+i*.3)*w,b=P?(.3+i*.2)*h:.38*h,e=P?.92*w:a+.27*w,d=P?b+.17*h:.72*h;if(rr(x,y,a,b,e,d,r)){c=[246,244,250,255];const H=d-b;for(let k=0;k<2;k++){const yb=b+H*(.45+k*.25);if(Math.abs(y-yb)<H*.05&&x>a+.08*(e-a)&&x<a+(.85-.3*k-.1*i)*(e-a))c=k?PU:CO}}}
if(rr(x,y,.05*w,P?.9*h:.8*h,.95*w,P?.96*h:.94*h,r))c=[255,255,255,255];if(rr(x,y,.06*w,P?.905*h:.81*h,.06*w+(P?.05*h:.11*h),P?.955*h:.93*h,r/2))c=PU;return c};
out('icons/og-image.png',png(1200,630,banner));
out('screenshots/mobile-narrow.png',png(750,1334,banner));
out('screenshots/desktop-wide.png',png(1920,1080,banner));
console.log('Assets written.');
