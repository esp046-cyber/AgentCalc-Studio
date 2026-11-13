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
const GLY={A:[14,17,17,31,17,17,17],B:[30,17,17,30,17,17,30],C:[14,17,16,16,16,17,14],D:[30,17,17,17,17,17,30],E:[31,16,16,30,16,16,31],F:[31,16,16,30,16,16,16],G:[14,17,16,23,17,17,15],H:[17,17,17,31,17,17,17],I:[14,4,4,4,4,4,14],J:[7,2,2,2,2,18,12],K:[17,18,20,24,20,18,17],L:[16,16,16,16,16,16,31],M:[17,27,21,21,17,17,17],N:[17,17,25,21,19,17,17],O:[14,17,17,17,17,17,14],P:[30,17,17,30,16,16,16],Q:[14,17,17,17,21,18,13],R:[30,17,17,30,20,18,17],S:[15,16,16,14,1,1,30],T:[31,4,4,4,4,4,4],U:[17,17,17,17,17,17,14],V:[17,17,17,17,17,10,4],W:[17,17,17,21,21,27,17],X:[17,17,10,4,10,17,17],Y:[17,17,10,4,4,4,4],Z:[31,1,2,4,8,16,31],',':[0,0,0,0,4,4,8],'/':[1,1,2,4,8,16,16],'|':[4,4,4,4,4,4,4]};
function shot(w,h){const buf=Buffer.alloc(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++)buf.set(banner(x,y,w,h),(y*w+x)*4);
const P=h>w,u=Math.min(w,h)/630,W=[255,255,255,255],D=[26,11,59,255];
const tx=(s,x,y,sc,col,mw)=>{sc=Math.max(1,Math.min(Math.round(sc),Math.floor(mw/(s.length*6))));x=Math.round(x);y=Math.round(y);for(const ch of s){(GLY[ch]||[0,0,0,0,0,0,0]).forEach((row,r)=>{for(let b=0;b<5;b++)if(row>>(4-b)&1)for(let dy=0;dy<sc;dy++)for(let dx=0;dx<sc;dx++){const px=x+b*sc+dx,py=y+r*sc+dy;if(px<w&&py<h)buf.set(col,(py*w+px)*4)}});x+=6*sc}return sc};
tx('AGENTCALC STUDIO',.05*w,(P?.05:.1)*h,10*u,W,.9*w);
const sub=[196,181,253,255];if(P){const s=tx('COST, ROI AND MARKET SIZE',.05*w,.1*h,4*u,sub,.9*w);tx('BEFORE YOU BUILD',.05*w,.1*h+9*s,4*u,sub,.9*w)}else tx('COST, ROI AND MARKET SIZE BEFORE YOU BUILD',.05*w,.26*h,4*u,sub,.9*w);
['LLM COST','ROI','TAM / SAM / SOM'].forEach((n,i)=>tx(n,(P?.1:.07+i*.3)*w,(P?.3+i*.2:.38)*h+.03*h,3*u,D,(P?.7:.23)*w));
const tw=P?.05*h:.11*h,tt=P?.905*h:.81*h,th=P?.05*h:.12*h,x0=.06*w+tw+14*u,mw=.95*w-x0,sc0=Math.max(1,Math.min(Math.round(3*u),Math.floor(mw/174)));
tx('AI',.06*w+tw/2-5.5*Math.round(3*u),tt+th/2-3.5*Math.round(3*u),3*u,W,tw);
tx('CREATE AI AGENTS CHAMPIONSHIP',x0,tt+th/2-8*sc0,sc0,[91,44,131,255],mw);tx('DUBAI CHAMBER DIGITAL',x0,tt+th/2+2*sc0,sc0,[91,44,131,255],mw);
return png(w,h,(x,y)=>buf.subarray((y*w+x)*4,(y*w+x)*4+4))}
// Smooth anti-aliased typography: uses @napi-rs/canvas (or node-canvas) when installed (npm i @napi-rs/canvas); falls back to the zero-dependency bitmap renderer above.
let CV=null;try{CV=require('@napi-rs/canvas')}catch(e){try{CV=require('canvas')}catch(e2){}}
function smooth(w,h){const G=CV.GlobalFonts;if(G&&G.registerFromPath&&!G.done){G.done=1;[['/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf','ACB'],['/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf','ACM'],['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','ACA']].forEach(f=>{try{if(fs.existsSync(f[0]))G.registerFromPath(f[0],f[1])}catch(e){}})}
const c=CV.createCanvas(w,h),x=c.getContext('2d'),P=h>w,u=Math.min(w,h)/630,m=.06*w,B='ACB,"Plus Jakarta Sans",Poppins,"DejaVu Sans",sans-serif',M='ACM,Inter,Poppins,"DejaVu Sans",sans-serif';
const rr=(a,b,cw,ch,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+cw,b,a+cw,b+ch,r);x.arcTo(a+cw,b+ch,a,b+ch,r);x.arcTo(a,b+ch,a,b,r);x.arcTo(a,b,a+cw,b,r);x.closePath()};
const T=(t,a,b,sz,col,mw,al,f)=>{x.fillStyle=col;x.textAlign=al||'left';do{x.font=`${sz}px ${f||B}`;sz-=1}while(mw&&x.measureText(t).width>mw&&sz>8);x.fillText(t,a,b)};
let g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#13092D');g.addColorStop(.6,'#261154');g.addColorStop(1,'#5B2C83');x.fillStyle=g;x.fillRect(0,0,w,h);
g=x.createRadialGradient(w*.85,h*.08,0,w*.85,h*.08,w*.55);g.addColorStop(0,'rgba(242,122,107,.6)');g.addColorStop(1,'rgba(242,122,107,0)');x.fillStyle=g;x.fillRect(0,0,w,h);
g=x.createRadialGradient(w*.05,h*.95,0,w*.05,h*.95,w*.5);g.addColorStop(0,'rgba(124,58,237,.45)');g.addColorStop(1,'rgba(124,58,237,0)');x.fillStyle=g;x.fillRect(0,0,w,h);
const ty=P?.085*h:.16*h;T('AgentCalc Studio',m,ty,66*u,'#fff',w-2*m);
if(P){T('Cost, ROI and market size',m,ty+46*u,28*u,'#C4B5FD',w-2*m,'left',M);T('before you build',m,ty+82*u,28*u,'#C4B5FD',w-2*m,'left',M)}else T('Cost, ROI and market size before you build',m,ty+50*u,28*u,'#C4B5FD',w-2*m,'left',M);
const gap=24*u,cards=[['LLM cost per run','$0.0014',.8,.45],['ROI, year 1','+312%',.6,.3],['Market (SOM)','$450K',.7,.35]];
cards.forEach((k,i)=>{const cw=P?w-2*m:(w-2*m-2*gap)/3,ch=P?.16*h:.3*h,a=P?m:m+i*(cw+gap),b=P?.25*h+i*(.19*h):.4*h;x.save();x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=30*u;x.shadowOffsetY=12*u;rr(a,b,cw,ch,22*u);x.fillStyle='rgba(246,244,250,.97)';x.fill();x.restore();
T(k[0],a+24*u,b+40*u,19*u,'#4B3F6B',cw-48*u,'left',M);T(k[1],a+24*u,b+86*u,40*u,'#1A0B3B',cw-48*u);
[[k[2],'#F27A6B'],[k[3],'#6E359E']].forEach((r,j)=>{const by=b+ch-50*u+j*20*u;rr(a+24*u,by,cw-48*u,10*u,5*u);x.fillStyle='rgba(26,11,59,.1)';x.fill();rr(a+24*u,by,(cw-48*u)*r[0],10*u,5*u);x.fillStyle=r[1];x.fill()})});
const ph=P?.1*h:.18*h,py=P?.87*h:.78*h,pw=w-2*m;rr(m,py,pw,ph,22*u);x.fillStyle='rgba(255,255,255,.1)';x.fill();x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=1.5*u;x.stroke();
const s=ph*.56,a0=m+20*u,mid=py+ph/2;g=x.createLinearGradient(a0,mid-s/2,a0+s,mid+s/2);g.addColorStop(0,'#7C3AED');g.addColorStop(1,'#5B2C83');rr(a0,mid-s/2,s,s,s*.28);x.fillStyle=g;x.fill();T('ai',a0+s/2,mid+s*.18,s*.5,'#fff',s,'center');x.fillStyle='#F27A6B';rr(a0+s*.22,mid+s*.3,s*.56,3*u,1.5*u);x.fill();
const tx=a0+s+14*u,half=m+pw*.56;T('CREATE AI AGENTS CHAMPIONSHIP',tx,mid-2*u,(P?15:19)*u,'#fff',half-tx-16*u);T('تحدي الذكاء الاصطناعي المساعد',tx,mid+22*u,(P?14:17)*u,'#C4B5FD',half-tx-16*u,'left','ACA,"DejaVu Sans",sans-serif');
x.fillStyle='rgba(255,255,255,.35)';x.fillRect(half,py+ph*.2,1.5*u,ph*.6);
const ex=half+20*u,es=s*.8;x.strokeStyle='#fff';x.lineWidth=3*u;x.lineCap='round';x.beginPath();x.moveTo(ex,mid+es/2);x.lineTo(ex,mid);x.arc(ex+es*.2,mid,es*.2,Math.PI,0);x.lineTo(ex+es*.4,mid+es/2);x.moveTo(ex+es*.6,mid+es/2);x.lineTo(ex+es*.6,mid-es*.4);x.moveTo(ex+es*.8,mid+es/2);x.lineTo(ex+es*.8,mid-es*.1);x.stroke();x.strokeStyle='#F27A6B';x.beginPath();x.moveTo(ex-4*u,mid+es/2+6*u);x.lineTo(ex+es*.9,mid+es/2+6*u);x.stroke();
const dx=ex+es+16*u,dw=m+pw-dx-16*u;T('AN INITIATIVE BY',dx,mid-20*u,(P?9:11)*u,'#C4B5FD',dw,'left',M);T('DUBAI CHAMBER',dx,mid+4*u,(P?16:20)*u,'#fff',dw);T('DIGITAL',dx,mid+26*u,(P?12:15)*u,'#F27A6B',dw);
return c.toBuffer('image/png')}
const mk=(w,h)=>{try{if(CV)return smooth(w,h)}catch(e){console.warn('canvas render failed, using bitmap fallback:',e.message)}return shot(w,h)};
out('icons/og-image.png',mk(1200,630));
out('screenshots/mobile-narrow.png',mk(750,1334));
out('screenshots/desktop-wide.png',mk(1920,1080));
console.log('Assets written.');
