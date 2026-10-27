// Feed the Beat case study: language toggle, the full-run video, and two small playable demos
// (call & response, and camera latency) that need only a keyboard or a tap.
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
let lang = 'en';
const t = (en, zh) => (lang === 'en' ? en : zh);

function setLang(next) {
  lang = next;
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  $$('[data-en]').forEach(el => { el.innerHTML = el.dataset[lang]; });
  $('#language').setAttribute('aria-label', t('Switch to Chinese', '切换至英文'));
  try { localStorage.setItem('echo-lang', lang); } catch {}
}
$('#language').addEventListener('click', () => setLang(lang === 'en' ? 'zh' : 'en'));
try { if (localStorage.getItem('echo-lang') === 'zh') setLang('zh'); } catch {}

// The hero loop autoplays muted (browsers require it); the button turns its sound on and off.
const heroVideo = $('#hero-video'), heroSound = $('#hero-sound');
const soundLabel = () => (heroVideo.muted ? ['🔈 Sound on', '🔈 打开声音'] : ['🔇 Mute', '🔇 静音']);
function syncSound() { const [en, zh] = soundLabel(); heroSound.dataset.en = en; heroSound.dataset.zh = zh; heroSound.textContent = t(en, zh); heroSound.setAttribute('aria-pressed', String(!heroVideo.muted)); }
heroSound.addEventListener('click', () => { heroVideo.muted = !heroVideo.muted; if (!heroVideo.muted) heroVideo.play().catch(() => {}); syncSound(); });

// The full run (with sound) opens in a dialog and only loads when asked for.
const runDialog = $('#run-dialog'), runVideo = $('#run-video');
$('#full-run').addEventListener('click', () => { heroVideo.muted = true; syncSound(); runDialog.showModal(); runVideo.play().catch(() => {}); });
runDialog.querySelector('.close').addEventListener('click', () => runDialog.close());
runDialog.addEventListener('close', () => runVideo.pause());
runDialog.addEventListener('click', e => { if (e.target === runDialog) runDialog.close(); });

// --- audio ---------------------------------------------------------------------------------
let ctx = null;
const audio = async () => { ctx ??= new AudioContext({ latencyHint: 'interactive' }); await ctx.resume(); return ctx; };
const heardLag = () => (ctx ? (ctx.outputLatency || ctx.baseLatency || 0) : 0);
function tone(at, freq, dur = .1, vol = .15, type = 'sine', endFreq) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, at);
  if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, at + dur);
  g.gain.setValueAtTime(.0001, at); g.gain.linearRampToValueAtTime(vol, at + .005); g.gain.exponentialRampToValueAtTime(.0001, at + dur);
  o.connect(g).connect(ctx.destination); o.start(at); o.stop(at + dur + .02);
}
const click = (at, accent) => tone(at, accent ? 1500 : 1000, .05, accent ? .16 : .1, 'triangle');
const hitSound = at => { tone(at, 150, .12, .32, 'sine', 50); tone(at, 620, .1, .08, 'square', 300); };
const callVoice = at => tone(at, 660, .14, .14, 'square', 330);
const confirm = () => tone(ctx.currentTime + .003, 1760, .08, .04);

// Space goes to whichever demo was started last.
let activeDemo = null;
document.addEventListener('keydown', e => {
  if (e.code !== 'Space' || e.repeat || !activeDemo || ['INPUT', 'BUTTON', 'A'].includes(e.target.tagName) && e.target.id !== activeDemo.padId) return;
  if (!activeDemo.running()) return;
  e.preventDefault(); activeDemo.tap();
});
const flash = pad => { pad.classList.add('hit'); setTimeout(() => pad.classList.remove('hit'), 90); };

// --- demo 1: hear it, then echo it -------------------------------------------------------------
{
  const PATTERNS = { easy: [0, 2], normal: [0, 1, 3], hard: [0, 1.5] }, BEAT = .6;
  const root = $('#echo-demo'), pad = $('#echo-pad'), out = $('#echo-result');
  const callMarks = root.querySelector('.call .marks'), echoMarks = root.querySelector('.echo .marks');
  const callCells = [...root.querySelectorAll('.call .cells i')], echoCells = [...root.querySelectorAll('.echo .cells i')];
  let pattern = 'easy', t0 = 0, targets = [], running = false, raf = 0;
  const name = b => (Number.isInteger(b) ? String(b + 1) : `${Math.floor(b) + 1}&`);
  const markHtml = (b, extra = '') => `<span class="mark ${Number.isInteger(b) ? '' : 'off'} ${extra}" style="left:${(b + .5) / 4 * 100}%">${name(b)}</span>`;
  function drawMarks() {
    callMarks.innerHTML = PATTERNS[pattern].map(b => markHtml(b)).join('');
    echoMarks.innerHTML = targets.length ? targets.map(x => markHtml(x.b, x.state || '') .replace('</span>', x.state ? `<small>${x.state.toUpperCase()}</small></span>` : '</span>')).join('') : PATTERNS[pattern].map(b => markHtml(b)).join('');
  }
  root.querySelectorAll('[data-pattern]').forEach(btn => btn.addEventListener('click', () => {
    if (running) return;
    pattern = btn.dataset.pattern; targets = [];
    root.querySelectorAll('[data-pattern]').forEach(b => b.classList.toggle('on', b === btn)); drawMarks();
  }));
  function frame() {
    const beats = (ctx.currentTime - heardLag() - t0) / BEAT;
    callCells.forEach((c, i) => c.classList.toggle('lit', Math.floor(beats) === i));
    echoCells.forEach((c, i) => c.classList.toggle('lit', Math.floor(beats) === i + 4));
    for (const x of targets) if (!x.state && ctx.currentTime - heardLag() > x.time + .2) { x.state = 'miss'; drawMarks(); }
    if (beats < 8.4) { raf = requestAnimationFrame(frame); return; }
    running = false; callCells.concat(echoCells).forEach(c => c.classList.remove('lit'));
    const n = s => targets.filter(x => x.state === s).length;
    const verdict = n('miss') ? t('Listen once more and try again.', '再听一遍，再试一次。') : n('good') ? t('Close — aim for the click itself.', '很接近了，试着正好踩在拍子上。') : t('Clean echo!', '完美跟上！');
    out.textContent = `PERFECT ${n('perfect')} · GOOD ${n('good')} · MISS ${n('miss')} — ${verdict}`;
  }
  $('#echo-start').addEventListener('click', async () => {
    if (running) return;
    await audio(); activeDemo = demo1; running = true;
    t0 = ctx.currentTime + .3;
    for (let i = 0; i < 8; i++) click(t0 + i * BEAT, i % 4 === 0);
    for (const b of PATTERNS[pattern]) callVoice(t0 + b * BEAT);
    targets = PATTERNS[pattern].map(b => ({ b, time: t0 + (4 + b) * BEAT, state: null }));
    drawMarks(); out.textContent = t('Listen to the call… then echo it.', '先听……再跟着做。');
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  });
  const demo1 = {
    padId: 'echo-pad', running: () => running,
    tap() {
      flash(pad); confirm();
      const now = ctx.currentTime - heardLag();
      const x = targets.filter(x => !x.state).sort((a, b) => Math.abs(now - a.time) - Math.abs(now - b.time))[0];
      if (!x) return;
      const d = now - x.time;
      if (Math.abs(d) <= .07) x.state = 'perfect'; else if (Math.abs(d) <= .15) x.state = 'good'; else return;
      drawMarks();
    }
  };
  pad.addEventListener('pointerdown', e => { e.preventDefault(); if (running) { activeDemo = demo1; demo1.tap(); } });
  drawMarks();
}

// --- demo 2: the camera is always late -----------------------------------------------------------
{
  const BEAT = 60 / 90, WINDOW = .3;
  const root = $('#lag-demo'), pad = $('#lag-pad'), out = $('#lag-result'), dots = $('#lag-dots'), slider = $('#lag-delay'), startBtn = $('#lag-start');
  let mode = 'detect', running = false, t0 = 0, next = 0, timer = 0;
  const delay = () => Number(slider.value) / 1000;
  slider.addEventListener('input', () => { $('#lag-value').textContent = `${slider.value} ms`; });
  root.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', () => {
    mode = btn.dataset.mode; root.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('on', b === btn));
  }));
  // On-the-beat mode plays each note's sound from the music clock, as the game does.
  function schedule() {
    while (t0 + next * BEAT < ctx.currentTime + .2) {
      const at = t0 + next * BEAT;
      click(at, next % 4 === 0);
      if (mode === 'beat') hitSound(at);
      next++;
    }
  }
  function stop() { running = false; clearInterval(timer); startBtn.innerHTML = t('▶ Start the beat', '▶ 开始节拍'); }
  startBtn.addEventListener('click', async () => {
    if (running) return stop();
    await audio(); activeDemo = demo2; running = true;
    t0 = ctx.currentTime + .25; next = 0; schedule(); timer = setInterval(schedule, 25);
    startBtn.innerHTML = t('■ Stop', '■ 停止');
    out.textContent = t('Tap on every click.', '每一下都跟着点。');
  });
  const place = (cls, offset) => {
    const d = document.createElement('span'); d.className = `tapdot ${cls}`;
    d.style.left = `${50 + Math.max(-1, Math.min(1, offset / WINDOW)) * 50}%`;
    dots.appendChild(d); setTimeout(() => { d.style.opacity = '0'; }, 50); setTimeout(() => d.remove(), 2200);
  };
  const ms = s => `${s >= 0 ? '+' : '−'}${Math.round(Math.abs(s) * 1000)} ms`;
  const demo2 = {
    padId: 'lag-pad', running: () => running,
    tap() {
      flash(pad);
      const now = ctx.currentTime, heard = now - heardLag(), nearest = t0 + Math.round((heard - t0) / BEAT) * BEAT;
      const raw = heard - nearest, seen = raw + delay();
      if (mode === 'detect') hitSound(now + delay()); else confirm();
      place('raw', raw); place('seen', seen);
      out.textContent = mode === 'detect'
        ? t(`You tapped ${ms(raw)}. The camera saw it ${ms(seen)}, and the sound waited for the camera — so it sounds late.`, `你点在 ${ms(raw)}。摄像头在 ${ms(seen)} 才看到，声音也等到那时才响，所以听起来是晚的。`)
        : t(`You tapped ${ms(raw)}. The camera still saw it ${ms(seen)}, but the sound stayed on the beat — the delay is only removed before judging.`, `你点在 ${ms(raw)}。摄像头仍然在 ${ms(seen)} 才看到，但声音一直在拍点上，延迟只在判定前扣除。`);
    }
  };
  pad.addEventListener('pointerdown', e => { e.preventDefault(); if (running) { activeDemo = demo2; demo2.tap(); } });
}
