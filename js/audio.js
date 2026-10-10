// AUDIO — satu musik latar aktif (crossfade), satu suara latar (ambience), efek singkat.
// Browser memblokir suara sebelum ada interaksi; musik yang diminta ditunda lalu dimulai pada klik/tap/tombol pertama.
(function () {
  const SR = window.SR = window.SR || {};
  const D = () => SR.data.audio;
  const S = () => SR.Settings;
  const ch = { bgm: { el: null, id: null, gain: 0 }, amb: { el: null, id: null, gain: 0 } };
  let want = { bgm: null, amb: null }, unlocked = false;

  const kindVol = kind => kind === 'bgm'
    ? (S().get('musicMute') ? 0 : S().get('musicVol'))
    : (S().get('sfxMute') ? 0 : S().get('sfxVol') * D().ambientGain);
  const apply = c => { if (ch[c].el) ch[c].el.volume = Math.max(0, Math.min(1, ch[c].gain * kindVol(c))); };

  // Menaikkan gain saluran c (hanya untuk elemen yang sedang aktif)
  function ramp(c, el, to, ms) {
    const step = 40, n = Math.max(1, ms / step), from = ch[c].gain;
    let i = 0;
    const t = setInterval(() => {
      i++;
      if (el !== ch[c].el) return clearInterval(t);   // sudah diganti track lain
      ch[c].gain = from + (to - from) * Math.min(1, i / n); apply(c);
      if (i >= n) clearInterval(t);
    }, step);
  }

  function fileOf(c, id) { return c === 'bgm' ? (D().bgm[id] || {}).file : D().sfx[id]; }

  function sync(c) {
    const id = want[c], cur = ch[c];
    if (id === cur.id && (cur.el || !id)) return;
    const old = cur.el;
    if (old) { const t0 = old.volume; let i = 0; const t = setInterval(() => { i++; old.volume = Math.max(0, t0 * (1 - i / 12)); if (i >= 12) { clearInterval(t); old.pause(); } }, 40); }
    cur.el = null; cur.id = null; cur.gain = 0;
    if (!id) return;
    const file = fileOf(c, id);
    if (!file) { console.warn('[audio] id tidak dikenal:', id); return; }
    if (!unlocked) return;                       // tunggu interaksi pertama
    const el = new Audio(file); el.loop = true; el.volume = 0;
    cur.el = el; cur.id = id;
    el.play().then(() => ramp(c, el, 1, 700)).catch(() => { cur.el = null; cur.id = null; });
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    sync('bgm'); sync('amb');
    preload(Object.values(D().ui));
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(e => window.addEventListener(e, unlock, { once: false, passive: true }));

  // Efek suara: satu elemen Audio per id, dibuat sekali lalu dipakai ulang (tanpa unduh/dekode ulang).
  // Efek yang sama dimulai dari awal (tidak bertumpuk). Klik UI ditahan bila ada efek lain yang baru saja mulai.
  const pool = new Map();
  let lastAt = 0;
  function el(id) {
    let a = pool.get(id);
    if (!a) {
      const f = D().sfx[id];
      if (!f) { console.warn('[audio] sfx tidak dikenal:', id); return null; }
      a = new Audio(f); a.preload = 'auto'; pool.set(id, a);
    }
    return a;
  }
  function sfx(id, opt) {
    const v = S().get('sfxMute') ? 0 : S().get('sfxVol');
    if (!unlocked || v <= 0) return;
    const now = performance.now();
    if (opt && opt.soft && now - lastAt < 150) return;      // klik UI tidak menumpuk di atas efek lain
    const a = el(id); if (!a) return;
    lastAt = now; a.volume = v;
    try { a.currentTime = 0; } catch (e) { /* belum siap, abaikan */ }
    a.play().catch(() => {});
  }
  // Panaskan efek yang pasti dipakai (UI) agar klik pertama tidak terlambat.
  const preload = ids => ids.forEach(id => el(id));

  SR.Audio = {
    bgm(id) { want.bgm = id || null; sync('bgm'); },
    amb(id) { want.amb = id || null; sync('amb'); },
    sfx, preload,
    ui(name, opt) { const id = D().ui[name]; if (id) sfx(id, opt); },
    current: () => ({ bgm: ch.bgm.id, amb: ch.amb.id })
  };
  S().onChange(() => { apply('bgm'); apply('amb'); });
})();
