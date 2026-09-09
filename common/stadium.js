/* Flamingo Stadium shared library. Vanilla JS, no deps. Load before the game script.
   Provides: STADIUM.palette, drawFlamingo, Game shell (start/countdown/play/end), input, sfx, rivals.
   Every game: 960x540 canvas, id="game". Shell handles overlays; game implements update(dt)/draw(ctx). */
(function () {
  const palette = {
    pink: '#FF7BAC', pinkDark: '#E2558C', pinkLight: '#FFC1DA', cream: '#FFF6EA', sand: '#F5D9A6',
    sky: '#BDEFFF', water: '#7FD3F2', grass: '#9BE38D', ink: '#3A2430', beak: '#2B2B2B', beakTip: '#111',
    leg: '#F2A3C0', white: '#FFFFFF', gold: '#FFD166', red: '#FF5A5F', blue: '#5AA9FF', green: '#4FD37A', purple: '#B388FF',
    rivals: ['#5AA9FF', '#FFD166', '#4FD37A']
  };

  // pose: 'idle' | 'jump' | 'run' | 'sleep' | 'dig' | 'eat' | 'dizzy' | 'harden'; t = time for animation; color overrides body
  function drawFlamingo(ctx, x, y, s, pose = 'idle', t = 0, color = palette.pink, opts = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (opts.flip) ctx.scale(-1, 1);
    const bob = pose === 'run' ? Math.sin(t * 20) * 2 : pose === 'idle' ? Math.sin(t * 3) * 1.5 : 0;
    ctx.translate(0, bob);
    // legs
    ctx.strokeStyle = palette.leg; ctx.lineWidth = 3; ctx.lineCap = 'round';
    const legSwing = pose === 'run' ? Math.sin(t * 20) * 10 : 0;
    if (pose === 'sleep' || pose === 'harden') {
      // tucked
    } else {
      ctx.beginPath(); ctx.moveTo(-4, 8); ctx.lineTo(-4 + legSwing * 0.3, 30); ctx.lineTo(-10 + legSwing, 34); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, 8); ctx.lineTo(4 - legSwing * 0.3, pose === 'idle' ? 18 : 30); if (pose !== 'idle') ctx.lineTo(10 - legSwing, 34); ctx.stroke();
    }
    // body
    ctx.fillStyle = pose === 'harden' ? '#9C8AA5' : color;
    ctx.beginPath(); ctx.ellipse(0, 0, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
    // wing
    ctx.fillStyle = pose === 'harden' ? '#7E6C88' : shade(color, -18);
    const flap = pose === 'jump' ? -0.6 : pose === 'dig' ? Math.sin(t * 25) * 0.5 : 0;
    ctx.save(); ctx.translate(-2, -2); ctx.rotate(flap); ctx.beginPath(); ctx.ellipse(0, 4, 13, 7, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // tail
    ctx.fillStyle = shade(color, -25); ctx.beginPath(); ctx.moveTo(-18, -4); ctx.lineTo(-30, -12); ctx.lineTo(-24, 2); ctx.closePath(); ctx.fill();
    // neck
    ctx.strokeStyle = pose === 'harden' ? '#9C8AA5' : color; ctx.lineWidth = 7;
    const neckLean = pose === 'eat' ? 18 : pose === 'dig' ? 22 : pose === 'sleep' ? -10 : 0;
    const headY = pose === 'eat' || pose === 'dig' ? -8 : pose === 'sleep' ? -14 : -34;
    ctx.beginPath(); ctx.moveTo(12, -4); ctx.quadraticCurveTo(24, -20, 18 + neckLean, headY + 2); ctx.stroke();
    // head
    const hx = 18 + neckLean, hy = headY;
    ctx.fillStyle = pose === 'harden' ? '#9C8AA5' : color; ctx.beginPath(); ctx.arc(hx, hy, 8, 0, Math.PI * 2); ctx.fill();
    // beak
    ctx.fillStyle = palette.beak; ctx.beginPath(); ctx.moveTo(hx + 5, hy - 2); ctx.lineTo(hx + 18, hy + 4); ctx.lineTo(hx + 6, hy + 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = palette.beakTip; ctx.beginPath(); ctx.moveTo(hx + 13, hy + 1.5); ctx.lineTo(hx + 18, hy + 4); ctx.lineTo(hx + 12, hy + 5.5); ctx.closePath(); ctx.fill();
    // eye
    ctx.fillStyle = palette.white; ctx.beginPath(); ctx.arc(hx + 1, hy - 2, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = palette.ink;
    if (pose === 'sleep') { ctx.lineWidth = 1.5; ctx.strokeStyle = palette.ink; ctx.beginPath(); ctx.moveTo(hx - 2, hy - 2); ctx.lineTo(hx + 4, hy - 2); ctx.stroke(); }
    else if (pose === 'dizzy') { ctx.lineWidth = 1.5; ctx.strokeStyle = palette.ink; ctx.beginPath(); ctx.moveTo(hx - 1, hy - 4); ctx.lineTo(hx + 3, hy); ctx.moveTo(hx + 3, hy - 4); ctx.lineTo(hx - 1, hy); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(hx + 1.5, hy - 2, 1.5, 0, Math.PI * 2); ctx.fill(); }
    if (pose === 'sleep') { ctx.fillStyle = palette.ink; ctx.font = 'bold 10px sans-serif'; ctx.fillText('z', hx + 10, hy - 12 - (t * 20 % 10)); }
    ctx.restore();
  }
  function shade(hex, amt) { const n = parseInt(hex.slice(1), 16); let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt; r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b)); return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0'); }

  // --- sfx (WebAudio beeps) ---
  let actx = null;
  function beep(freq = 440, dur = 0.08, type = 'square', vol = 0.05) {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(); const g = actx.createGain(); o.type = type; o.frequency.value = freq; g.gain.value = vol; o.connect(g); g.connect(actx.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur); o.stop(actx.currentTime + dur); } catch (e) { }
  }
  const sfx = { tap: () => beep(660, 0.05), good: () => { beep(880, 0.08); setTimeout(() => beep(1320, 0.1), 60); }, bad: () => beep(160, 0.2, 'sawtooth'), win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.15), i * 90)), lose: () => [400, 300, 200].forEach((f, i) => setTimeout(() => beep(f, 0.2, 'triangle'), i * 120)), tick: () => beep(1000, 0.03, 'sine', 0.03) };

  // --- input ---
  const keys = {}; const pressed = {};
  window.addEventListener('keydown', e => { if (!keys[e.code]) pressed[e.code] = true; keys[e.code] = true; if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault(); });
  window.addEventListener('keyup', e => { keys[e.code] = false; });
  const input = { down: c => !!keys[c], hit: c => { const v = !!pressed[c]; return v; }, _flush: () => { for (const k in pressed) delete pressed[k]; } };

  // --- Game shell ---
  // cfg: { title, howto (string[]), duration (s, 0 = untimed), init(), update(dt), draw(ctx), result() -> {score, text, win} }
  function Game(cfg) {
    const canvas = document.getElementById('game'); const ctx = canvas.getContext('2d');
    const W = canvas.width = 960, H = canvas.height = 540;
    let state = 'title', t = 0, timeLeft = cfg.duration || 0, last = performance.now(), countdown = 0, result = null;
    const hsKey = 'flamingo-stadium:' + cfg.id; let best = +(localStorage.getItem(hsKey) || 0);
    function start() { state = 'count'; countdown = 3; cfg.init(); sfx.tick(); }
    function finish() { state = 'end'; result = cfg.result(); if (result.score > best) { best = result.score; try { localStorage.setItem(hsKey, best); } catch (e) { } } result.win ? sfx.win() : sfx.lose(); }
    const api = { W, H, ctx, get time() { return t; }, get timeLeft() { return timeLeft; }, finish, get best() { return best; }, state: () => state };
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      if (state === 'title' && (input.hit('Space') || input.hit('Enter'))) start();
      else if (state === 'count') { const before = Math.ceil(countdown); countdown -= dt; if (Math.ceil(countdown) < before && countdown > 0) sfx.tick(); if (countdown <= 0) { state = 'play'; timeLeft = cfg.duration || 0; sfx.good(); } }
      else if (state === 'play') { cfg.update(dt); if (cfg.duration) { timeLeft -= dt; if (timeLeft <= 0) { timeLeft = 0; finish(); } } }
      else if (state === 'end' && (input.hit('Space') || input.hit('Enter'))) start();
      // draw
      ctx.clearRect(0, 0, W, H);
      cfg.draw(ctx);
      if (state === 'play' && cfg.duration) hud(ctx, `${timeLeft.toFixed(1)}s`, `BEST ${best}`);
      if (state === 'title') overlay(ctx, cfg.title, cfg.howto, 'SPACE 로 시작');
      if (state === 'count') { overlayDim(ctx, 0.25); big(ctx, String(Math.ceil(countdown))); }
      if (state === 'end') overlay(ctx, result.win ? '승리!' : '종료', [result.text, `최고 기록 ${best}`], 'SPACE 로 다시');
      input._flush();
      requestAnimationFrame(loop);
    }
    function hud(ctx, l, r) { ctx.save(); ctx.font = 'bold 22px sans-serif'; ctx.fillStyle = palette.ink; ctx.textAlign = 'left'; ctx.fillText(l, 16, 32); ctx.textAlign = 'right'; ctx.fillText(r, W - 16, 32); ctx.restore(); }
    function overlayDim(ctx, a) { ctx.save(); ctx.fillStyle = `rgba(58,36,48,${a})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    function big(ctx, s) { ctx.save(); ctx.font = 'bold 120px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = palette.white; ctx.strokeStyle = palette.pinkDark; ctx.lineWidth = 8; ctx.strokeText(s, W / 2, H / 2 + 40); ctx.fillText(s, W / 2, H / 2 + 40); ctx.restore(); }
    function overlay(ctx, title, lines, foot) {
      overlayDim(ctx, 0.55); ctx.save(); ctx.textAlign = 'center';
      ctx.fillStyle = palette.cream; ctx.strokeStyle = palette.pinkDark; ctx.lineWidth = 6; ctx.font = 'bold 54px sans-serif'; ctx.strokeText(title, W / 2, 170); ctx.fillText(title, W / 2, 170);
      ctx.font = '24px sans-serif'; ctx.fillStyle = palette.white; (lines || []).forEach((l, i) => ctx.fillText(l, W / 2, 230 + i * 36));
      ctx.font = 'bold 26px sans-serif'; ctx.fillStyle = palette.gold; ctx.fillText(foot, W / 2, H - 70);
      drawFlamingo(ctx, W / 2 - 300, H - 90, 1.6, 'idle', t); drawFlamingo(ctx, W / 2 + 300, H - 90, 1.6, 'idle', t + 1, palette.rivals[0], { flip: true });
      ctx.restore();
    }
    requestAnimationFrame(loop);
    return api;
  }

  // --- helpers ---
  function bg(ctx, W, H, top = palette.sky, bottom = palette.cream) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bottom); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  function text(ctx, s, x, y, size = 22, color = palette.ink, align = 'center', weight = 'bold') { ctx.save(); ctx.font = `${weight} ${size}px sans-serif`; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(s, x, y); ctx.restore(); }
  function rr(ctx, x, y, w, h, r, fill) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); }
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  window.STADIUM = { palette, drawFlamingo, Game, input, sfx, bg, text, rr, rand, clamp, shade };
})();
