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
out('icons/og-image.png',png(1200,630,wide));
out('screenshots/mobile-narrow.png',png(540,960,icon(.3)));
out('screenshots/desktop-wide.png',png(1280,720,wide));
console.log('Assets written.');
