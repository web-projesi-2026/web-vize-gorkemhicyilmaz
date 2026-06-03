
(() => {
  const page = document.body;
  const gameType = page?.dataset?.arcadeGame;
  if (!gameType) return;

  const stage = document.getElementById('arcadeStage');
  const shell = document.querySelector('.arcade-canvas-shell');
  const canvas = document.getElementById('arcadeCanvas');
  const overlay = document.getElementById('arcadeOverlay');
  const bigStartBtn = document.getElementById('arcadeBigStart');
  const startBtn = document.getElementById('arcadeStart');
  const pauseBtn = document.getElementById('arcadePause');
  const restartBtn = document.getElementById('arcadeRestart');
  const fullBtn = document.getElementById('arcadeFullscreen');
  const scoreEl = document.getElementById('arcadeScore');
  const highEl = document.getElementById('arcadeHigh');
  const statusEl = document.getElementById('arcadeStatus');
  const speedEl = document.getElementById('arcadeSpeed');
  const readouts = Array.from(document.querySelectorAll('[data-readout]'));
  const ctx = canvas.getContext('2d');
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  let W = 1280, H = 720, raf = 0, lastTime = 0;
  let running = false, paused = false;
  let score = 0;
  const storageKey = 'promptla_arcade_' + gameType + '_high';
  let highScore = Number(localStorage.getItem(storageKey) || 0);

  const stateActions = { left:false, right:false, up:false, down:false, gas:false, brake:false, fire:false };
  const pointer = { x:0, y:0, down:false, active:false };

  setHigh(highScore);

  function rand(min,max){ return Math.random()*(max-min)+min; }
  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
  function lerp(a,b,t){ return a+(b-a)*t; }
  function easeOut(t){ return 1 - Math.pow(1-t, 3); }
  function safeText(value){ return String(value ?? '').replace(/[<>]/g, ''); }

  function resize(){
    const rect = shell.getBoundingClientRect();
    W = Math.max(320, rect.width);
    H = Math.max(220, rect.height);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', () => setTimeout(resize, 120), { passive:true });

  function setScore(v, label){
    score = Math.max(0, Math.floor(v));
    if(scoreEl) scoreEl.textContent = label || String(score);
    if(score > highScore){
      highScore = score;
      setHigh(highScore);
      try { localStorage.setItem(storageKey, String(highScore)); } catch(e) {}
    }
  }
  function setHigh(v){ if(highEl) highEl.textContent = String(Math.floor(v || 0)); }
  function setSpeed(v, suffix){ if(speedEl) speedEl.textContent = String(v) + (suffix || ''); }
  function setStatus(v){ if(statusEl) statusEl.textContent = safeText(v); }
  function setReadout(name, value){ readouts.forEach(el => { if(el.dataset.readout === name) el.textContent = safeText(value); }); }

  function showOverlay(title, sub, playText){
    if(!overlay) return;
    overlay.classList.remove('hide');
    overlay.querySelector('strong') && (overlay.querySelector('strong').textContent = title || 'Hazır');
    overlay.querySelector('span') && (overlay.querySelector('span').textContent = sub || 'Başlatmak için büyük oynat simgesine bas.');
    overlay.querySelector('.arcade-big-play')?.setAttribute('aria-label', playText || 'Oyunu başlat');
  }
  function hideOverlay(){ overlay && overlay.classList.add('hide'); }

  function clearScreen(color){ ctx.fillStyle = color || '#060a12'; ctx.fillRect(0,0,W,H); }
  function grad(x0,y0,x1,y1, stops){ const g = ctx.createLinearGradient(x0,y0,x1,y1); stops.forEach(s => g.addColorStop(s[0], s[1])); return g; }
  function circle(x,y,r,fill,stroke,lw){ ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); if(fill){ ctx.fillStyle = fill; ctx.fill(); } if(stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 2; ctx.stroke(); } }
  function roundedRect(x,y,w,h,r,fill,stroke,lw){
    r = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r);
    if(fill){ ctx.fillStyle = fill; ctx.fill(); }
    if(stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  }
  function poly(points, fill, stroke, lw){
    if(!points.length) return;
    ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
    for(let i=1;i<points.length;i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    if(fill){ ctx.fillStyle = fill; ctx.fill(); }
    if(stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  }
  function text(str,x,y,size,align,color,weight){ ctx.font = (weight || 800)+' '+size+'px Manrope, Arial, sans-serif'; ctx.textAlign = align || 'left'; ctx.fillStyle = color || '#fff'; ctx.fillText(str,x,y); }

  const mobileFireButtons = document.querySelectorAll('[data-action="fire"]');
  document.querySelectorAll('[data-action]').forEach(btn => {
    const name = btn.dataset.action;
    const down = ev => { ev.preventDefault(); stateActions[name] = true; };
    const up = ev => { ev.preventDefault(); stateActions[name] = false; };
    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('pointerleave', up);
  });

  function getKeyMap(){
    if(gameType === 'space-dodge') return { arrowleft:'left', a:'left', arrowright:'right', d:'right', arrowup:'up', w:'up', arrowdown:'down', s:'down' };
    if(gameType === 'aim-reflex') return { arrowleft:'left', a:'left', arrowright:'right', d:'right', arrowup:'up', w:'up', arrowdown:'down', s:'down', ' ':'fire', enter:'fire' };
    return { arrowleft:'left', a:'left', arrowright:'right', d:'right', arrowup:'up', w:'up', arrowdown:'down', s:'down', ' ':'brake', shift:'gas' };
  }
  document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    const km = getKeyMap();
    if(km[key]){ e.preventDefault(); stateActions[km[key]] = true; }
    if(key === 'enter' && !running) start();
    if(key === 'p') togglePause();
  });
  document.addEventListener('keyup', e => {
    const key = e.key.toLowerCase();
    const km = getKeyMap();
    if(km[key]){ e.preventDefault(); stateActions[km[key]] = false; }
  });

  function handlePointerMove(ev){
    const rect = canvas.getBoundingClientRect();
    pointer.x = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
    pointer.y = clamp((ev.clientY - rect.top) / rect.height, 0, 1);
    pointer.active = true;
  }
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerdown', ev => { handlePointerMove(ev); pointer.down = true; stateActions.fire = true; });
  window.addEventListener('pointerup', () => { pointer.down = false; stateActions.fire = false; });

  async function requestLandscapeFullscreen(){
    const target = stage || canvas;
    try {
      if(!document.fullscreenElement && target.requestFullscreen) await target.requestFullscreen();
      if(screen.orientation?.lock){ try { await screen.orientation.lock('landscape'); } catch(e) {} }
      setStatus('Tam ekran');
    } catch(e) { setStatus('Tam ekran desteklenmedi'); }
    setTimeout(resize, 120);
  }
  fullBtn && fullBtn.addEventListener('click', requestLandscapeFullscreen);
  document.addEventListener('fullscreenchange', () => { setTimeout(resize,120); if(!document.fullscreenElement && screen.orientation?.unlock){ try { screen.orientation.unlock(); } catch(e) {} } });

  window.copyArcadePrompt = function(btn){
    const holder = btn.closest('.arcade-info-panel') || document;
    const txt = holder.querySelector('textarea')?.value || '';
    const done = () => { const old = btn.textContent; btn.textContent = 'Kopyalandı ✓'; setTimeout(()=>btn.textContent=old, 1200); };
    if(navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done).catch(() => fallbackCopy(txt, done));
    else fallbackCopy(txt, done);
  };
  function fallbackCopy(txt, done){
    const ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.left = '-9999px'; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done && done(); } catch(e) {}
    document.body.removeChild(ta);
  }

  function makeEndlessDrive(){
    const st = {
      groundY:0,
      y:0,
      vy:0,
      duck:false,
      lockJump:false,
      speed:305,
      score:0,
      distance:0,
      t:0,
      groundOffset:0,
      nextSpawn:0,
      obstacles:[],
      clouds:[],
      ended:false
    };
    const DINO_X = 92;
    const PX = 4;

    function init(){
      st.groundY = Math.round(H * 0.68);
      st.y = 0;
      st.vy = 0;
      st.duck = false;
      st.lockJump = false;
      st.speed = 305;
      st.score = 0;
      st.distance = 0;
      st.t = 0;
      st.groundOffset = 0;
      st.ended = false;
      st.obstacles = [];
      st.nextSpawn = W + 360;
      st.clouds = Array.from({length:4}, (_,i)=>({x:W*(i*.32)+rand(90,260), y:rand(55,145), s:rand(.85,1.15)}));
      setScore(0, '00000');
      setSpeed('0', '');
      setStatus('Hazır');
      setReadout('speed','Koşu hazır');
      setReadout('distance','0');
      setReadout('steer','Zıpla');
      setReadout('road','Dino modu');
    }

    function jump(){
      if(st.y === 0 && !st.lockJump){
        st.vy = -660;
        st.lockJump = true;
      }
    }
    function rectsHit(a,b){
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }
    function spawnObstacle(){
      const canBird = st.score > 700;
      const bird = canBird && Math.random() < .24;
      if(bird){
        const level = Math.random() < .55 ? 84 : 126;
        st.obstacles.push({type:'bird', x:W+40, y:st.groundY-level, w:46, h:28, flap:0});
      } else {
        const r = Math.random();
        if(r < .48) st.obstacles.push({type:'cactus1', x:W+40, y:st.groundY-52, w:24, h:52});
        else if(r < .78) st.obstacles.push({type:'cactus2', x:W+40, y:st.groundY-66, w:38, h:66});
        else st.obstacles.push({type:'cactus3', x:W+40, y:st.groundY-48, w:58, h:48});
      }
      const baseGap = rand(390, 660);
      const speedBonus = clamp((st.speed-305) * .78, 0, 250);
      st.nextSpawn = W + baseGap + speedBonus;
    }
    function update(dt){
      st.t += dt;
      st.groundY = Math.round(H * 0.68);
      if(st.ended) return;

      const wantsJump = stateActions.up || stateActions.gas || stateActions.brake;
      if(wantsJump) jump();
      if(!wantsJump) st.lockJump = false;
      st.duck = !!(stateActions.down && st.y === 0);

      st.vy += 1850 * dt;
      st.y += st.vy * dt;
      if(st.y > 0){ st.y = 0; st.vy = 0; }

      st.speed = Math.min(685, st.speed + dt * 8.8);
      st.score += dt * st.speed * .105;
      st.distance += dt * st.speed * .055;
      st.groundOffset += dt * st.speed;

      st.clouds.forEach(c=>{
        c.x -= dt * st.speed * .18;
        if(c.x < -90){ c.x = W + rand(60,240); c.y = rand(55,145); c.s = rand(.85,1.15); }
      });
      st.obstacles.forEach(o=>{
        o.x -= dt * st.speed;
        if(o.type === 'bird') o.flap += dt * 11;
      });
      st.obstacles = st.obstacles.filter(o=>o.x + o.w > -80);
      st.nextSpawn -= dt * st.speed;
      if(st.nextSpawn <= W) spawnObstacle();

      const dinoBox = st.duck
        ? {x:DINO_X-18, y:st.groundY-34+st.y, w:68, h:30}
        : {x:DINO_X-16, y:st.groundY-82+st.y, w:48, h:74};
      const hit = st.obstacles.some(o=>{
        const box = o.type === 'bird'
          ? {x:o.x+4, y:o.y+5, w:o.w-8, h:o.h-8}
          : {x:o.x+3, y:o.y+4, w:o.w-6, h:o.h-4};
        return rectsHit(dinoBox, box);
      });
      if(hit){
        st.ended = true;
        running = false;
        setStatus('Oyun bitti');
        showOverlay('GAME OVER', 'Skor: ' + String(Math.floor(st.score)).padStart(5,'0') + ' • Tekrar başlatmak için oynat.', 'Tekrar');
      }

      setScore(st.score, String(Math.floor(st.score)).padStart(5,'0'));
      setSpeed(String(Math.round(st.speed/10)), '');
      setReadout('speed', Math.round(st.speed/10));
      setReadout('distance', Math.floor(st.distance));
      setReadout('steer', st.duck ? 'Eğil' : st.y < 0 ? 'Zıplıyor' : 'Koşuyor');
      setReadout('road', 'Sonsuz');
      setStatus(st.duck ? 'Eğil' : 'Koşu aktif');
    }

    function p(x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
    function drawCloud(c){
      const s = c.s;
      ctx.strokeStyle = '#b8b8b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y+12*s);
      ctx.lineTo(c.x+18*s, c.y+12*s);
      ctx.quadraticCurveTo(c.x+20*s,c.y+4*s,c.x+30*s,c.y+8*s);
      ctx.quadraticCurveTo(c.x+34*s,c.y-4*s,c.x+47*s,c.y+7*s);
      ctx.lineTo(c.x+68*s,c.y+7*s);
      ctx.stroke();
    }
    function drawGround(){
      p(0,0,W,H,'#ffffff');
      p(0,st.groundY,W,2,'#535353');
      ctx.strokeStyle = '#7b7b7b';
      ctx.lineWidth = 2;
      for(let i=0;i<48;i++){
        const x = ((i*84 - st.groundOffset) % (W+120)) - 80;
        const y = st.groundY + 17 + ((i*37)%28);
        const len = 10 + ((i*11)%22);
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+len,y); ctx.stroke();
      }
    }
    function drawDino(){
      const x = DINO_X;
      const y = st.groundY + st.y;
      const s = PX;
      const leg = Math.floor(st.t*12) % 2;
      const C = '#535353';
      if(st.duck){
        p(x-5*s,y-11*s,18*s,7*s,C);
        p(x+8*s,y-15*s,9*s,6*s,C);
        p(x+15*s,y-13*s,3*s,2*s,'#fff');
        p(x-7*s,y-8*s,4*s,3*s,C);
        p(x+1*s,y-4*s,5*s,4*s,C);
        p(x+10*s,y-4*s,6*s,4*s,C);
        return;
      }
      // Body and neck
      p(x-4*s,y-16*s,10*s,12*s,C);
      p(x+2*s,y-20*s,7*s,5*s,C);
      // Head and snout
      p(x+7*s,y-27*s,12*s,8*s,C);
      p(x+17*s,y-24*s,5*s,4*s,C);
      p(x+13*s,y-25*s,2*s,2*s,'#fff');
      // Tail and arm
      p(x-10*s,y-15*s,7*s,4*s,C);
      p(x+7*s,y-14*s,4*s,3*s,C);
      // Legs
      if(st.y < 0){
        p(x-2*s,y-5*s,4*s,6*s,C);
        p(x+6*s,y-5*s,4*s,6*s,C);
      } else if(leg === 0){
        p(x-2*s,y-5*s,4*s,8*s,C);
        p(x+7*s,y-5*s,4*s,5*s,C);
      } else {
        p(x-2*s,y-5*s,4*s,5*s,C);
        p(x+7*s,y-5*s,4*s,8*s,C);
      }
      p(x-2*s,y+2*s,7*s,2*s,C);
      p(x+7*s,y+2*s,7*s,2*s,C);
    }
    function drawCactus(o){
      const s=PX, C='#535353';
      if(o.type==='cactus1'){
        p(o.x+8,o.y,12,o.h,C); p(o.x+2,o.y+22,8,6,C); p(o.x+2,o.y+12,5,14,C); p(o.x+18,o.y+28,8,6,C); p(o.x+25,o.y+18,5,16,C);
      } else if(o.type==='cactus2'){
        p(o.x+12,o.y,13,o.h,C); p(o.x+2,o.y+26,12,6,C); p(o.x+2,o.y+12,6,20,C); p(o.x+24,o.y+34,12,6,C); p(o.x+33,o.y+20,6,20,C);
      } else {
        p(o.x+4,o.y+8,11,40,C); p(o.x+22,o.y,12,48,C); p(o.x+42,o.y+12,10,36,C);
      }
    }
    function drawBird(o){
      const C='#535353';
      const up = Math.sin(o.flap) > 0;
      p(o.x+14,o.y+10,20,6,C);
      p(o.x+31,o.y+8,9,5,C);
      if(up){ p(o.x+6,o.y+1,14,5,C); p(o.x+25,o.y+1,16,5,C); }
      else { p(o.x+6,o.y+19,14,5,C); p(o.x+25,o.y+19,16,5,C); }
    }
    function drawHud(){
      text('HI ' + String(Math.floor(highScore)).padStart(5,'0') + '  ' + String(Math.floor(st.score)).padStart(5,'0'), W-230, 34, 16, 'left', '#535353', 900);
      if(!running && !st.ended){
        text('PRESS SPACE TO START', W/2, st.groundY-130, 18, 'center', '#535353', 900);
      }
    }
    function draw(){
      drawGround();
      st.clouds.forEach(drawCloud);
      st.obstacles.forEach(o => o.type === 'bird' ? drawBird(o) : drawCactus(o));
      drawDino();
      drawHud();
    }
    return { init, update, draw };
  }

  function makeSpaceDodge(){
    const st = { x:0, y:0, speed:190, t:0, meters:0, shield:3, asteroids:[] };
    const makeAst = z => ({ x:rand(-1.15,1.15), y:rand(-.74,.74), z:z||rand(360,980), r:rand(.09,.24), rot:rand(0,6.28), vr:rand(-1,1) });
    function init(){
      st.x=0; st.y=0; st.speed=190; st.t=0; st.meters=0; st.shield=3;
      st.asteroids = Array.from({length:26}, (_,i)=>makeAst(150+i*36));
      setScore(0,'0 m'); setSpeed(st.shield+' kalkan',''); setStatus('Uzay kaçış');
      setReadout('distance','0 m'); setReadout('shield', st.shield); setReadout('speed', Math.round(st.speed));
    }
    function update(dt){
      st.t += dt; st.speed = lerp(st.speed, 190 + st.meters*.012, dt*.18); st.meters += st.speed * dt * .58;
      const ax=(stateActions.right?1:0)-(stateActions.left?1:0), ay=(stateActions.down?1:0)-(stateActions.up?1:0);
      st.x = clamp(st.x + ax*dt*1.28, -1, 1); st.y = clamp(st.y + ay*dt*1.08, -.78, .78);
      st.x = lerp(st.x, 0, dt*.05); st.y = lerp(st.y, 0, dt*.05);
      st.asteroids.forEach(a => {
        a.z -= st.speed * dt; a.rot += a.vr * dt;
        if(a.z < 18){
          const hit = Math.hypot(a.x-st.x, a.y-st.y) < a.r + .18;
          if(hit) st.shield--;
          Object.assign(a, makeAst(rand(820,1060)));
        }
      });
      setScore(st.meters, Math.floor(st.meters)+' m'); setSpeed(st.shield+' kalkan',''); setStatus('Uzay kaçış');
      setReadout('distance', Math.floor(st.meters)+' m'); setReadout('shield', st.shield); setReadout('speed', Math.round(st.speed));
      if(st.shield <= 0){ running = false; showOverlay('Gemi Hasar Aldı', 'Mesafe: ' + Math.floor(st.meters) + ' m. Asteroitlerden kaçarak devam et.', 'Tekrar'); }
    }
    function proj(o){ const s = 280/(o.z+60); return { x:W/2 + (o.x-st.x) * W*.44*s, y:H/2 + (o.y-st.y)*H*.42*s, s }; }
    function drawRocket(cx, cy){
      ctx.fillStyle='rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(cx, cy+48, 78, 20, 0,0,Math.PI*2); ctx.fill();
      poly([[cx,cy-76],[cx+34,cy+18],[cx+16,cy+44],[cx-16,cy+44],[cx-34,cy+18]], '#f2f5fa', '#6b7280', 2);
      poly([[cx-16,cy-10],[cx+16,cy-10],[cx+10,cy+18],[cx-10,cy+18]], '#89b6ff');
      poly([[cx-34,cy+18],[cx-70,cy+54],[cx-12,cy+36]], '#cf3f4a');
      poly([[cx+34,cy+18],[cx+70,cy+54],[cx+12,cy+36]], '#cf3f4a');
      poly([[cx-18,cy+44],[cx,cy+78],[cx+18,cy+44]], '#e3e8ef');
      poly([[cx-12,cy+62],[cx,cy+96],[cx+12,cy+62]], '#ff8c35');
      circle(cx,cy-36,10,'#f04444');
    }
    function draw(){
      clearScreen('#050714'); ctx.fillStyle = grad(0,0,0,H, [[0,'#04081d'],[.55,'#091126'],[1,'#04050d']]); ctx.fillRect(0,0,W,H);
      for(let i=0;i<120;i++){
        const x = (Math.sin(i*42.1+st.t*.14)*.5+.5)*W; const y = ((Math.cos(i*17.7)*.5+.5)*H + st.t*90*(.12+(i%5)/4))%H; const a=.12+(i%7)*.04; circle(x,y,1+(i%3)*.4,'rgba(255,255,255,'+a+')');
      }
      ctx.strokeStyle = 'rgba(77,132,255,.12)'; for(let i=0;i<10;i++){ ctx.beginPath(); ctx.moveTo(W/2,H/2); ctx.lineTo((i/9)*W,H); ctx.stroke(); }
      st.asteroids.slice().sort((a,b)=>b.z-a.z).forEach(a => {
        const p = proj(a); if(p.s < .1 || p.s > 4.8) return; const r = Math.max(6, a.r * W*.15 * p.s);
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(a.rot);
        const pts=[]; for(let i=0;i<9;i++){ const ang = i/9*Math.PI*2; const rr = r*(.72+Math.sin(i*2.8+a.rot)*.16); pts.push([Math.cos(ang)*rr, Math.sin(ang)*rr]); }
        poly(pts, '#786660', 'rgba(255,255,255,.14)', 1); ctx.restore();
      });
      drawRocket(W/2 + st.x*54, H*.76 + st.y*36);
    }
    return { init, update, draw };
  }

  function makeNeonTunnel(){
    const st = { x:0, y:0, speed:175, t:0, rings:[], heat:0, passed:0 };
    const makeRing = z => ({ z:z||rand(260,900), x:rand(-.52,.52), y:rand(-.42,.42), gap:rand(.33,.44), rot:rand(0,6.28) });
    function init(){ st.x=0; st.y=0; st.speed=175; st.t=0; st.heat=0; st.passed=0; st.rings=Array.from({length:13},(_,i)=>makeRing(160+i*72)); setScore(0,'0 kapı'); setSpeed('Isı 0',''); setStatus('Neon tünel'); setReadout('passed',0); setReadout('heat',0); setReadout('gap','Aktif'); }
    function update(dt){
      st.t+=dt; st.speed=lerp(st.speed,175+st.passed*2.5,dt*.2);
      const ax=(stateActions.right?1:0)-(stateActions.left?1:0), ay=(stateActions.down?1:0)-(stateActions.up?1:0);
      st.x=clamp(st.x+ax*dt*1.22,-1,1); st.y=clamp(st.y+ay*dt*1.1,-1,1); st.x=lerp(st.x,0,dt*.04); st.y=lerp(st.y,0,dt*.04);
      st.rings.forEach(r=>{ r.z-=st.speed*dt; r.rot+=dt*.45; if(r.z<16){ const ok=Math.hypot(r.x-st.x,r.y-st.y)<r.gap; if(ok) st.passed++; else st.heat+=26; Object.assign(r,makeRing(rand(820,1020))); } });
      st.heat=Math.max(0, st.heat-dt*4.5); setScore(st.passed, st.passed+' kapı'); setSpeed('Isı '+Math.round(st.heat),''); setReadout('passed',st.passed); setReadout('heat',Math.round(st.heat)); setReadout('gap','Aktif');
      if(st.heat>=100){ running=false; showOverlay('Tünel Aşırı Isındı','Geçilen kapı: '+st.passed+'. Tekrar deneyebilirsin.'); }
    }
    function proj(r){ const s=255/(r.z+45); return { x:W/2+(r.x-st.x)*W*.52*s, y:H/2+(r.y-st.y)*H*.46*s, s }; }
    function draw(){
      clearScreen('#020612'); ctx.fillStyle=grad(0,0,0,H,[[0,'#050315'],[.5,'#091029'],[1,'#02040a']]); ctx.fillRect(0,0,W,H);
      for(let i=0;i<16;i++){ const rr=(i/16)*Math.max(W,H)*.78 + (st.t*90)%60; ctx.strokeStyle='rgba(0,217,255,'+(.035+i*.004)+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(W/2,H/2,rr,rr*.56,0,0,Math.PI*2); ctx.stroke(); }
      st.rings.slice().sort((a,b)=>b.z-a.z).forEach(r=>{ const p=proj(r); if(p.s<.1||p.s>4.8)return; const rw=Math.max(40,W*.25*p.s), rh=rw*.56; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(r.rot*.18); ctx.strokeStyle='rgba(124,92,255,.78)'; ctx.lineWidth=Math.max(2,8*p.s); ctx.strokeRect(-rw*.5,-rh*.5,rw,rh); const gx=(r.x-st.x)*rw*.55, gy=(r.y-st.y)*rh*.55; circle(gx,gy,Math.max(18,r.gap*rw*.52),'rgba(0,217,255,.09)','rgba(0,217,255,.8)',Math.max(2,5*p.s)); ctx.restore(); });
      const cx=W/2+st.x*44, cy=H*.76+st.y*30; ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(cx,cy+28,92,18,0,0,Math.PI*2); ctx.fill(); roundedRect(cx-46,cy-20,92,40,18,'#101d39','rgba(0,217,255,.5)'); circle(cx-22,cy,8,'#00d9ff'); circle(cx+22,cy,8,'#7c5cff'); ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.beginPath(); ctx.moveTo(cx-72,cy+12); ctx.lineTo(cx+72,cy+12); ctx.stroke();
    }
    return { init, update, draw };
  }

  function makeAimReflex(){
    const st = { targets:[], t:0, time:45, score:0, shots:0, hits:0, cooldown:0, cursorX:.5, cursorY:.5, moving:false, combo:0 };
    function spawnTarget(){ st.targets.push({ x:rand(.18,.82), y:rand(.18,.78), z:rand(.28,.95), ttl:rand(1.2,2.1), pulse:rand(0,6.28) }); }
    function init(){ st.targets=[]; st.t=0; st.time=45; st.score=0; st.shots=0; st.hits=0; st.cooldown=0; st.cursorX=.5; st.cursorY=.5; st.combo=0; for(let i=0;i<5;i++) spawnTarget(); setScore(0,'0 puan'); setSpeed('45 sn',''); setStatus('Reflex testi'); setReadout('accuracy','100%'); setReadout('combo',0); setReadout('targets',5); }
    function update(dt){
      st.t += dt; st.time = Math.max(0, st.time - dt); st.cooldown = Math.max(0, st.cooldown - dt);
      if(pointer.active){ st.cursorX = pointer.x; st.cursorY = pointer.y; }
      else {
        const ax = (stateActions.right?1:0) - (stateActions.left?1:0), ay = (stateActions.down?1:0) - (stateActions.up?1:0);
        st.cursorX = clamp(st.cursorX + ax*dt*.55, .06, .94); st.cursorY = clamp(st.cursorY + ay*dt*.55, .08, .92);
      }
      st.targets.forEach(t => { t.ttl -= dt; t.pulse += dt * 4; });
      st.targets = st.targets.filter(t => t.ttl > 0);
      while(st.targets.length < 5) spawnTarget();
      if(stateActions.fire && st.cooldown <= 0){
        st.cooldown = .16; st.shots++;
        let hitIndex = -1;
        for(let i=st.targets.length-1;i>=0;i--){
          const t = st.targets[i];
          const rr = .045 + (1-t.z)*.04;
          if(Math.hypot(st.cursorX - t.x, st.cursorY - t.y) < rr){ hitIndex = i; break; }
        }
        if(hitIndex >= 0){
          const t = st.targets[hitIndex]; st.targets.splice(hitIndex, 1); st.hits++; st.combo++; st.score += 100 + st.combo*10; spawnTarget();
        } else { st.combo = 0; }
      }
      setScore(st.score, st.score+' puan'); setSpeed(Math.ceil(st.time)+' sn',''); setReadout('accuracy', (st.shots ? Math.round((st.hits/st.shots)*100) : 100) + '%'); setReadout('combo', st.combo); setReadout('targets', st.targets.length); setStatus('Reflex testi');
      if(st.time <= 0){ running = false; showOverlay('Seans Tamamlandı', 'Skor: ' + st.score + ' | İsabet: ' + (st.shots ? Math.round((st.hits/st.shots)*100) : 100) + '%.', 'Tekrar'); }
    }
    function draw(){
      clearScreen('#08101c');
      ctx.fillStyle = grad(0,0,0,H,[[0,'#0b1328'],[.5,'#091d2d'],[1,'#05070f']]); ctx.fillRect(0,0,W,H);
      // room perspective
      poly([[W*.12,H*.2],[W*.88,H*.2],[W*.72,H*.86],[W*.28,H*.86]], '#0d1f2f', 'rgba(255,255,255,.08)', 1);
      for(let i=0;i<8;i++){
        const t=i/8; const x1=lerp(W*.12,W*.28,t), x2=lerp(W*.88,W*.72,t), y=lerp(H*.2,H*.86,t);
        ctx.strokeStyle='rgba(0,217,255,'+(.03+t*.08)+')'; ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(x2,y); ctx.stroke();
      }
      for(let i=0;i<7;i++){ const x=lerp(W*.12,W*.5,i/6); ctx.strokeStyle='rgba(255,255,255,.04)'; ctx.beginPath(); ctx.moveTo(x,H*.2); ctx.lineTo(W*.5,H*.86); ctx.stroke(); ctx.beginPath(); ctx.moveTo(W-x,H*.2); ctx.lineTo(W*.5,H*.86); ctx.stroke(); }
      st.targets.forEach(t => {
        const sx = t.x*W; const sy = t.y*H; const r = (1.05 - t.z) * 42 + 14;
        circle(sx,sy,r,'rgba(0,217,255,.18)','rgba(255,255,255,.6)',2);
        circle(sx,sy,r*.7,'rgba(255,82,111,.34)','rgba(255,255,255,.75)',2);
        circle(sx,sy,r*.34,'rgba(255,255,255,.9)');
        circle(sx,sy,r*(1+.12*Math.sin(t.pulse)),null,'rgba(0,217,255,.28)',1);
      });
      const cx = st.cursorX * W, cy = st.cursorY * H;
      ctx.strokeStyle='rgba(255,255,255,.88)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(cx,cy,16,0,Math.PI*2); ctx.moveTo(cx-26,cy); ctx.lineTo(cx+26,cy); ctx.moveTo(cx,cy-26); ctx.lineTo(cx,cy+26); ctx.stroke();
      text('AIMLAB STİLİ REFLEX', 18, 28, 14, 'left', 'rgba(255,255,255,.8)', 800);
    }
    return { init, update, draw };
  }

  const factories = {
    'endless-drive': makeEndlessDrive,
    'space-dodge': makeSpaceDodge,
    'neon-tunnel': makeNeonTunnel,
    'aim-reflex': makeAimReflex
  };
  const game = (factories[gameType] || makeEndlessDrive)();

  function start(){
    resize(); Object.keys(stateActions).forEach(k => stateActions[k] = false); game.init(); running = true; paused = false; lastTime = performance.now(); hideOverlay(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function restart(){ start(); }
  function togglePause(){ if(!running){ start(); return; } paused = !paused; if(paused){ showOverlay('Duraklatıldı','Devam etmek için oynat simgesine veya Duraklat butonuna bas.'); } else { hideOverlay(); lastTime = performance.now(); raf = requestAnimationFrame(loop); } }
  function loop(now){ if(!running || paused) return; const dt = Math.min(.033, Math.max(.001,(now-lastTime)/1000)); lastTime = now; game.update(dt); game.draw(); if(running) raf = requestAnimationFrame(loop); }

  startBtn && startBtn.addEventListener('click', start);
  bigStartBtn && bigStartBtn.addEventListener('click', () => { if(paused) togglePause(); else start(); });
  restartBtn && restartBtn.addEventListener('click', restart);
  pauseBtn && pauseBtn.addEventListener('click', togglePause);

  game.init(); game.draw(); showOverlay('Oyuna Hazır', 'Tam ekran düğmesine basıp telefonu yatay çevirerek daha rahat oynayabilirsin.');
})();
