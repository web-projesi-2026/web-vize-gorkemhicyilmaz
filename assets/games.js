
(function(){
const canvas = document.getElementById('gameCanvas');
if(!canvas) return;
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const scoreBox = document.getElementById('scoreBox');
const game = document.body.dataset.game;
let running=false, paused=false, raf=null;
const W=canvas.width, H=canvas.height;
function score(t){ if(scoreBox) scoreBox.textContent=t; }
function show(msg, sub){ if(overlay){ overlay.classList.remove('hide'); overlay.innerHTML='<strong>'+msg+'</strong><span>'+(sub||'')+'</span>'; }}
function hide(){ overlay&&overlay.classList.add('hide'); }
function clear(){ ctx.fillStyle='#050a12'; ctx.fillRect(0,0,W,H); }
function neonRect(x,y,w,h,c){ ctx.strokeStyle=c||'#00d9ff'; ctx.lineWidth=3; ctx.strokeRect(x,y,w,h); }
function circle(x,y,r,c){ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); }
function bindDirs(cb){ document.addEventListener('keydown',e=>{ const k=e.key.toLowerCase(); if(k==='arrowup'||k==='w')cb('up'); if(k==='arrowdown'||k==='s')cb('down'); if(k==='arrowleft'||k==='a')cb('left'); if(k==='arrowright'||k==='d')cb('right'); }); document.querySelectorAll('.touch-controls button').forEach(b=>b.addEventListener('click',()=>cb(b.dataset.dir))); }
window.copyGamePrompt=function(btn){
 const holder=btn.closest('.prompt-copy-card, li, .game-lesson')||btn.parentElement;
 const txt=holder?.querySelector('textarea')?.value||'';
 const done=()=>{const o=btn.textContent;btn.textContent='Kopyalandı ✓';setTimeout(()=>btn.textContent=o,1200);};
 if(navigator.clipboard && window.isSecureContext){ navigator.clipboard.writeText(txt).then(done).catch(()=>fallbackCopy(txt,done)); }
 else fallbackCopy(txt,done);
};
function fallbackCopy(txt,done){
 const ta=document.createElement('textarea'); ta.value=txt; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.left='-9999px'; document.body.appendChild(ta); ta.select();
 try{ document.execCommand('copy'); done&&done(); }catch(e){ alert('Kopyalama desteklenmiyor, promptu manuel seçebilirsin.'); }
 document.body.removeChild(ta);
}


const fullscreenBtn = document.getElementById('fullscreenBtn');
fullscreenBtn?.addEventListener('click', async () => {
 const target = document.querySelector('.game-stage') || document.querySelector('.game-board-wrap') || document.documentElement;
 try {
  if(!document.fullscreenElement && target.requestFullscreen) await target.requestFullscreen();
  if(screen.orientation && screen.orientation.lock) { try { await screen.orientation.lock('landscape'); } catch(e) {} }
 } catch(e) {
  show('Tam ekran desteklenmedi', 'Tarayıcı izin vermediyse cihazı manuel yatay çevirebilirsin.');
 }
});
document.addEventListener('fullscreenchange', () => {
 if(!document.fullscreenElement && screen.orientation && screen.orientation.unlock) { try { screen.orientation.unlock(); } catch(e) {} }
});
overlay?.addEventListener('click', () => { if(!running) start(); });

document.getElementById('startBtn')?.addEventListener('click',()=>start());
document.getElementById('restartBtn')?.addEventListener('click',()=>start(true));
document.getElementById('pauseBtn')?.addEventListener('click',()=>{paused=!paused; if(!paused) loop();});

let impl={};
function start(reset){ cancelAnimationFrame(raf); running=true; paused=false; hide(); impl.init(); loop(); }
function loop(){ if(!running||paused) return; impl.update(); impl.draw(); raf=requestAnimationFrame(loop); }

if(game==='snake'){
 let snake,food,dir,nextDir,tick,last,points,cell=24;
 bindDirs(d=>{ if(d==='up'&&dir.y!==1)nextDir={x:0,y:-1}; if(d==='down'&&dir.y!==-1)nextDir={x:0,y:1}; if(d==='left'&&dir.x!==1)nextDir={x:-1,y:0}; if(d==='right'&&dir.x!==-1)nextDir={x:1,y:0}; });
 function placeFood(){ do{ food={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)}; }while(snake&&snake.some(s=>s.x===food.x&&s.y===food.y)); }
 impl.init=()=>{snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];dir={x:1,y:0};nextDir=dir;points=0;tick=0;last=0;placeFood();score('Skor: 0');};
 impl.update=()=>{tick++; if(tick%13!==0)return; dir=nextDir; const h={x:(snake[0].x+dir.x+20)%20,y:(snake[0].y+dir.y+20)%20}; if(snake.some(s=>s.x===h.x&&s.y===h.y)){running=false;show('Oyun Bitti','Sadece kendine çarparsan oyun biter. Skor: '+points);return;} snake.unshift(h); if(h.x===food.x&&h.y===food.y){points++;score('Skor: '+points);placeFood();} else snake.pop();};
 impl.draw=()=>{clear(); for(let i=0;i<=20;i++){ctx.strokeStyle='rgba(0,217,255,.08)';ctx.beginPath();ctx.moveTo(i*cell,0);ctx.lineTo(i*cell,H);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*cell);ctx.lineTo(W,i*cell);ctx.stroke();} circle(food.x*cell+12,food.y*cell+12,9,'#ff4f70'); snake.forEach((s,i)=>{ctx.fillStyle=i?'#00d9ff':'#7c5cff';ctx.fillRect(s.x*cell+3,s.y*cell+3,18,18);});};
}
if(game==='pacman'){
 const map=['111111111111','100000100001','101110101101','100000000001','101011101101','100010000001','111111111111']; let px,py,ghost,dots,dir={x:0,y:0},points;
 const cw=40,ch=68;
 bindDirs(d=>{ if(d==='up')dir={x:0,y:-1}; if(d==='down')dir={x:0,y:1}; if(d==='left')dir={x:-1,y:0}; if(d==='right')dir={x:1,y:0}; });
 function wall(x,y){ const gx=Math.floor(x/cw), gy=Math.floor(y/ch); return map[gy]?.[gx]==='1'; }
 impl.init=()=>{px=60;py=70;ghost={x:410,y:350};dots=[];points=0; for(let y=0;y<map.length;y++)for(let x=0;x<map[y].length;x++)if(map[y][x]==='0')dots.push({x:x*cw+20,y:y*ch+34});score('Skor: 0');};
 impl.update=()=>{let nx=px+dir.x*2,ny=py+dir.y*2;if(!wall(nx,ny)){px=nx;py=ny;} dots=dots.filter(d=>{const hit=Math.hypot(d.x-px,d.y-py)<18;if(hit){points++;score('Skor: '+points);}return !hit;}); const a=Math.atan2(py-ghost.y,px-ghost.x);ghost.x+=Math.cos(a)*0.95;ghost.y+=Math.sin(a)*0.95;if(Math.hypot(px-ghost.x,py-ghost.y)<22){running=false;show('Yakalandın','Skor: '+points);} if(!dots.length){running=false;show('Kazandın','Tüm noktaları topladın.');}};
 impl.draw=()=>{clear(); for(let y=0;y<map.length;y++)for(let x=0;x<map[y].length;x++)if(map[y][x]==='1'){ctx.fillStyle='rgba(0,217,255,.16)';ctx.fillRect(x*cw,y*ch,cw,ch);ctx.strokeStyle='#00d9ff';ctx.strokeRect(x*cw,y*ch,cw,ch);} dots.forEach(d=>circle(d.x,d.y,5,'#fff')); circle(px,py,16,'#ffd43b'); circle(ghost.x,ghost.y,16,'#ff4f70');};
}
if(game==='hockey'){
 let puck,player,ai,ps,as,serveDir=1;
 const radius=14, maxPuckSpeed=5.2, minVy=1.65;
 function resetPuck(dir){
  const angle=(Math.random()*0.7-0.35);
  serveDir=dir||serveDir*-1;
  puck={x:240,y:240,vx:Math.sin(angle)*2.1,vy:serveDir*2.35};
 }
 function limitPuck(){
  const sp=Math.hypot(puck.vx,puck.vy)||1;
  if(sp>maxPuckSpeed){puck.vx=puck.vx/sp*maxPuckSpeed;puck.vy=puck.vy/sp*maxPuckSpeed;}
  if(Math.abs(puck.vy)<minVy){puck.vy=(puck.vy<0?-minVy:minVy);}
  if(Math.abs(puck.vx)<0.22){puck.vx+=(Math.random()-.5)*0.55;}
 }
 impl.init=()=>{player={x:240,y:430};ai={x:240,y:50};ps=0;as=0;serveDir=1;resetPuck(1);score('Oyuncu 0 - Rakip 0');};
 canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();player.x=Math.max(70,Math.min(W-70,(e.clientX-r.left)/r.width*W));});
 function paddleHit(p,topSide){
  const py=topSide?64:416;
  const movingToward=topSide?puck.vy<0:puck.vy>0;
  if(movingToward && Math.abs(puck.y-py)<22 && Math.abs(puck.x-p.x)<64){
   const offset=(puck.x-p.x)/64;
   const speed=Math.min(maxPuckSpeed,Math.max(3.4,Math.hypot(puck.vx,puck.vy)+0.15));
   puck.vx=offset*speed*0.95;
   puck.vy=(topSide?1:-1)*Math.max(minVy,speed*(0.72+Math.abs(offset)*0.18));
   puck.y=topSide?py+23:py-23;
   limitPuck();
  }
 }
 impl.update=()=>{
  ai.x+=(puck.x-ai.x)*0.028; ai.x=Math.max(70,Math.min(W-70,ai.x));
  puck.x+=puck.vx; puck.y+=puck.vy;
  if(puck.x<radius){puck.x=radius;puck.vx=Math.abs(puck.vx);}
  if(puck.x>W-radius){puck.x=W-radius;puck.vx=-Math.abs(puck.vx);}
  paddleHit(player,false); paddleHit(ai,true); limitPuck();
  if(puck.y<-radius){ps++;resetPuck(1);}
  if(puck.y>H+radius){as++;resetPuck(-1);}
  score('Oyuncu '+ps+' - Rakip '+as);
  if(ps>=5||as>=5){running=false;show(ps>as?'Kazandın':'Kaybettin','Skor '+ps+' - '+as);}
 };
 impl.draw=()=>{clear();neonRect(20,20,440,440,'rgba(0,217,255,.5)');ctx.strokeStyle='rgba(255,255,255,.2)';ctx.beginPath();ctx.moveTo(20,240);ctx.lineTo(460,240);ctx.stroke();ctx.fillStyle='rgba(0,217,255,.08)';ctx.fillRect(160,20,160,34);ctx.fillRect(160,426,160,34);ctx.fillStyle='#00d9ff';ctx.fillRect(player.x-55,420,110,14);ctx.fillStyle='#7c5cff';ctx.fillRect(ai.x-55,45,110,14);circle(puck.x,puck.y,14,'#fff');};
}
if(game==='football'){
 let shots,goals,ball,keeper,anim;
 impl.init=()=>{shots=0;goals=0;ball={x:240,y:430,tx:240,ty:120};keeper=1;anim=0;score('Gol: 0 / 5');};
 canvas.addEventListener('pointerdown',e=>{if(!running)return; const r=canvas.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width*W; const zones=[120,240,360]; const target=x<180?0:x>300?2:1; keeper=Math.floor(Math.random()*3); ball={x:240,y:430,tx:zones[target],ty:130,target}; anim=1; shots++; if(target!==keeper)goals++; score('Gol: '+goals+' / 5'); if(shots>=5)setTimeout(()=>{running=false;show('Seri Bitti','Gol: '+goals+' / 5');},900);});
 impl.update=()=>{if(anim>0){ball.x+=(ball.tx-ball.x)*0.075;ball.y+=(ball.ty-ball.y)*0.075;anim++; if(anim>72){anim=0;ball.x=240;ball.y=430;}}};
 impl.draw=()=>{clear();ctx.strokeStyle='#00d9ff';ctx.lineWidth=4;ctx.strokeRect(90,70,300,120);ctx.fillStyle='rgba(0,217,255,.08)';ctx.fillRect(90,70,300,120);ctx.fillStyle='#7c5cff';const kx=[120,240,360][keeper];ctx.fillRect(kx-38,115,76,22);ctx.fillStyle='#fff';circle(ball.x,ball.y,14,'#fff');ctx.fillStyle='rgba(0,217,255,.18)';ctx.fillRect(0,420,W,60);ctx.fillStyle='#dce7ff';ctx.font='18px Manrope';ctx.fillText('Kalede bir noktaya tıkla / dokun',130,460);};
}

show('Oyuna Hazır','Başlatmak için Başlat butonuna bas.');
})();
