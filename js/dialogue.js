// MESIN DIALOG (visual novel). Hanya membaca data dari SR.data.story; tidak berisi cerita.
// Format baris & adegan dijelaskan di README.md (bagian "Mengedit dialog").
(function () {
  const SR = window.SR = window.SR || {};
  const { fmt, $, $$, wait } = SR.Util;
  const CH = id => SR.data.characters[id];
  const GUARD_MS = 160;
  const mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  const REDUCED = !!(mq && mq.matches);       // gerak dikurangi: tanpa idle & kedipan          // abaikan ketukan ganda yang terlalu cepat

  let host, el = {}, st = null, busy = false, askActive = false, waiting = false, typing = null, lastAdv = 0, bgFlip = false;

  function init(h) {
    host = h;
    el = { stage: $('#stage'), bgA: $('#bg-a'), bgB: $('#bg-b'), sprites: $('#sprites'), fade: $('#fade'), box: $('#dialogue'),
           name: $('#vn-name'), text: $('#vn-text'), next: $('#vn-next'), choices: $('#vn-choices'), chapter: $('#vn-chapter') };
    el.stage.addEventListener('click', e => { if (e.target.closest('button, #vn-choices, #pause, .vn-hud')) return; advance(); });
  }

  /* ---------- teks bertahap (typewriter) ---------- */
  function typeInto(node, html, cps) {
    node.innerHTML = html;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), texts = [];
    let n; while ((n = walker.nextNode())) texts.push(n);
    const parts = texts.map(t => {
      const full = t.nodeValue, vis = document.createTextNode(''), hid = document.createElement('span');
      hid.style.visibility = 'hidden'; hid.textContent = full; t.replaceWith(vis, hid);
      return { vis, hid, full };
    });
    const total = parts.reduce((a, p) => a + p.full.length, 0);
    let raf = 0, finished = false, resolve, last = -1;
    const done = new Promise(r => { resolve = r; });
    const paint = shown => { let left = shown; parts.forEach(p => { const k = Math.min(left, p.full.length); left -= k; p.vis.nodeValue = p.full.slice(0, k); p.hid.textContent = p.full.slice(k); }); };
    const finish = () => { if (finished) return; finished = true; cancelAnimationFrame(raf); parts.forEach(p => { p.vis.nodeValue = p.full; p.hid.remove(); }); resolve(); };
    const t0 = performance.now();
    if (!(cps > 0)) finish();
    else { const tick = now => { if (finished) return; const shown = Math.floor((now - t0) / 1000 * cps); if (shown >= total) finish(); else { if (shown !== last) { last = shown; paint(shown); } raf = requestAnimationFrame(tick); } }; raf = requestAnimationFrame(tick); }
    return { finish, done, cancel() { finished = true; cancelAnimationFrame(raf); } };
  }

  /* ---------- latar ---------- */
  function setBg(id, instant) {
    const url = SR.data.backgrounds[id];
    if (!url) { console.warn('[story] latar tidak dikenal:', id); return; }
    if (st.bg === id) return;
    st.bg = id;
    if (instant) { el.stage.classList.add('no-anim'); }
    bgFlip = !bgFlip;
    const on = bgFlip ? el.bgA : el.bgB, off = bgFlip ? el.bgB : el.bgA;
    on.style.backgroundImage = `url("${url}")`;
    on.classList.add('show'); off.classList.remove('show');
    if (instant) { void el.stage.offsetWidth; el.stage.classList.remove('no-anim'); }
  }

  /* ---------- sprite: state dulu, DOM dirender dari state ---------- */
  function setSpriteState(id, o) {
    const ch = CH(id);
    if (!ch || ch.sprite === false) return;
    const s = st.sprites[id] || (st.sprites[id] = { exp: ch.default, pos: 'center' });
    if (o.pos) s.pos = o.pos;
    if (o.exp) {
      if (ch.expressions.includes(o.exp)) s.exp = o.exp;
      else console.warn(`[story] ekspresi "${o.exp}" tidak ada untuk ${id}`);
    }
  }

  function makeSprite(id, instant) {
    const ch = CH(id), n = document.createElement('div');
    n.className = 'sprite' + (instant ? '' : ' enter'); n.dataset.id = id;
    n.style.setProperty('--ar', ch.ar); n.style.setProperty('--hf', ch.hf);
    n.addEventListener('animationend', e => { if (e.target === n) n.classList.remove('enter'); });
    // .fig = pembungkus gerak idle (napas + goyang, hanya transform) — gambar & kedipan ikut bergerak bersama
    const fig = document.createElement('div'); fig.className = 'fig';
    fig.style.setProperty('--b-dur', (5.2 + Math.random() * 1.8).toFixed(2) + 's');     // tempo tiap karakter berbeda
    fig.style.setProperty('--s-dur', (7 + Math.random() * 3.2).toFixed(2) + 's');
    fig.style.setProperty('--b-del', '-' + (Math.random() * 6).toFixed(2) + 's');        // fase acak: tidak serempak
    fig.style.setProperty('--s-del', '-' + (Math.random() * 9).toFixed(2) + 's');
    n.appendChild(fig);
    if (ch.blink && !REDUCED) {
      const b = new Image(); b.className = 'blink'; b.alt = ''; b.draggable = false; b.src = ch.dir + ch.blink.file;
      const [l, t, w, h] = ch.blink.box;
      b.style.cssText = `left:${l * 100}%;top:${t * 100}%;width:${w * 100}%;height:${h * 100}%`;
      b.addEventListener('animationend', () => n.classList.remove('blinking'));
      fig.appendChild(b); if (b.decode) b.decode().catch(() => {});
      scheduleBlink(n, id);
    }
    el.sprites.appendChild(n);
    return n;
  }

  /* ---------- kedipan: hanya menempelkan kelopak tertutup di area mata; gambar ekspresi TIDAK diganti ---------- */
  function scheduleBlink(n, id) {
    clearTimeout(n._bt);
    n._bt = setTimeout(() => {
      if (!n.isConnected || n.classList.contains('leaving')) return;          // sprite sudah dihapus: berhenti
      const cur = n.querySelector('img.cur'), ch = CH(id);
      if (!document.hidden && cur && ch.blink.exps.includes(cur.dataset.exp) && !n.classList.contains('enter')) {
        blinkOnce(n);
        if (Math.random() < 0.18) setTimeout(() => n.isConnected && blinkOnce(n), 260);   // sesekali kedip ganda
      }
      scheduleBlink(n, id);
    }, 2200 + Math.random() * 3800);                                              // interval 2,2–6 detik, tidak tetap
  }
  function blinkOnce(n) {
    n.classList.remove('blinking');
    requestAnimationFrame(() => n.classList.add('blinking'));
  }

  function setExpImg(n, id, exp, instant) {
    const cur = n.querySelector('img.cur');
    if (cur && cur.dataset.exp === exp) { n.dataset.want = exp; return; }
    n.dataset.want = exp;
    n.classList.remove('blinking');                    // ganti ekspresi: batalkan kedipan yang sedang berjalan
    const it = SR.Sprites.get(id, exp);           // dari cache bila sudah dipanaskan
    const attach = () => {
      if (n.dataset.want !== exp || !n.isConnected) return;   // sudah diganti ekspresi lain
      const prev = n.querySelector('img.cur');
      const img = it.img.cloneNode(false);
      img.className = 'cur'; img.alt = ''; img.draggable = false; img.dataset.exp = exp;
      if (prev) { prev.classList.remove('cur'); prev.classList.add('old'); }
      n.querySelector('.fig').insertBefore(img, n.querySelector('.blink'));   // gambar ekspresi selalu di bawah tempelan kedip
      requestAnimationFrame(() => img.classList.add('in'));
      setTimeout(() => $$('img.old', n).forEach(o => o.remove()), instant ? 0 : 180);
    };
    if (it.ready) attach(); else it.p.then(attach);
  }

  function renderSprites(instant) {
    $$('.sprite:not(.leaving)', el.sprites).forEach(n => {
      if (!st.sprites[n.dataset.id]) { clearTimeout(n._bt); n.classList.add('leaving'); setTimeout(() => n.remove(), instant ? 0 : 320); }
    });
    Object.keys(st.sprites).forEach(id => {
      const s = st.sprites[id];
      let n = el.sprites.querySelector(`.sprite[data-id="${id}"]:not(.leaving)`) || makeSprite(id, instant);
      n.classList.remove('pos-left', 'pos-center', 'pos-right'); n.classList.add('pos-' + s.pos);
      n.classList.toggle('dim', !!st.speaker && st.speaker !== id);
      setExpImg(n, id, s.exp, instant);
    });
  }

  /* ---------- menerapkan satu baris ke state ---------- */
  function applyLine(line, silent) {
    if (line.bg) setBg(line.bg, silent);
    if (line.bgm !== undefined) SR.Audio.bgm(line.bgm);
    if (line.amb !== undefined) SR.Audio.amb(line.amb);
    (line.hide || []).forEach(id => { delete st.sprites[id]; });
    (line.show || []).forEach(s => setSpriteState(s.id, s));
    if (line.who) setSpriteState(line.who, { exp: line.exp, pos: line.pos });
    st.speaker = line.who && CH(line.who) && CH(line.who).sprite !== false ? line.who : null;
    if (!silent && line.sfx) SR.Audio.sfx(line.sfx);
  }

  /* ---------- pemanasan (preload) sprite & latar yang segera dipakai ---------- */
  function warmLines(lines, from, count) {
    for (let j = from; j < Math.min(lines.length, from + count); j++) {
      const l = lines[j]; if (!l) break;
      if (l.who) SR.Sprites.preload(l.who, l.exp);
      (l.show || []).forEach(s => SR.Sprites.preload(s.id, s.exp));
      if (l.action === 'ask') { SR.Sprites.preload(l.who, l.right.exp); SR.Sprites.preload(l.who, l.wrong.exp); }
      if (l.bg) SR.Sprites.preloadBg(l.bg);
      if (l.action === 'material') {                       // potret halaman pertama materi yang akan dibuka
        const t = SR.data.materials.find(m => m.id === l.id), p = t && t.pages[0];
        if (p) SR.Sprites.preload(p.who || t.who, p.exp);
      }
    }
  }
  function warmNextScene(sc) {
    const nx = sc.next && SR.data.story.scenes[sc.next];
    if (!nx) return; SR.Sprites.preloadBg(nx.bg); warmLines(nx.lines, 0, 4);
  }

  /* ---------- tampilan teks ---------- */
  function showText(line) {
    const ch = line.who ? CH(line.who) : null;
    el.box.classList.toggle('narration', !line.who);
    el.name.hidden = !line.who;
    if (line.who) { el.name.textContent = ch ? ch.name : line.who; el.name.style.setProperty('--c', ch ? ch.color : '#ddd'); }
    el.next.classList.remove('show');
    waiting = false;
    if (typing) typing.cancel();
    const t = typing = typeInto(el.text, fmt(line.text), SR.Settings.get('textSpeed'));
    t.done.then(() => { if (typing === t) { typing = null; waiting = true; el.next.classList.add('show'); } });
  }

  function showLine() {
    const sc = st.scene, line = sc.lines[st.idx];
    if (!line) return endScene();
    host.onCheckpoint(st.sceneId, st.idx);
    warmLines(sc.lines, st.idx + 1, 4);
    if (line.action === 'ask') return runAsk(line);
    if (line.action) { busy = true; return host.runAction(line, () => { busy = false; st.idx++; showLine(); }); }
    applyLine(line, false); renderSprites(false); showText(line);
  }

  function runAsk(line) {
    applyLine(line, false); renderSprites(false); showText(line);
    askActive = true; el.choices.innerHTML = ''; el.choices.hidden = false;
    line.options.forEach((label, i) => {
      const b = document.createElement('button');
      b.className = 'vn-choice'; b.type = 'button'; b.textContent = label;
      b.addEventListener('click', () => {
        const ok = i === line.answer;
        SR.Audio.ui(ok ? 'correct' : 'wrong');
        const fb = ok ? line.right : line.wrong;
        if (ok) { askActive = false; el.choices.hidden = true; lastAdv = performance.now(); }
        else { b.disabled = true; b.classList.add('wrong'); }
        const l2 = { who: line.who, exp: fb.exp, text: fb.text };
        applyLine(l2, false); renderSprites(false); showText(l2);
      });
      el.choices.appendChild(b);
    });
    const first = el.choices.querySelector('button'); if (first) first.focus({ preventScroll: true });
  }

  /* ---------- adegan ---------- */
  async function fadeTo(op, ms) { el.fade.style.transition = `opacity ${ms}ms ease`; el.fade.style.opacity = op; await wait(ms); }

  function resetStage() {
    if (typing) typing.cancel(); typing = null; waiting = false;
    st.sprites = {}; st.speaker = null; el.sprites.innerHTML = '';
    el.text.textContent = ''; el.next.classList.remove('show'); el.choices.hidden = true; el.choices.innerHTML = '';
  }

  async function enterScene(id, resumeIdx) {
    const sc = SR.data.story.scenes[id];
    if (!sc) throw new Error('Adegan tidak ditemukan: ' + id);
    busy = true; st.scene = sc; st.sceneId = id; st.idx = 0;
    const silent = resumeIdx != null;
    const newPlace = !st.bg || sc.bg !== st.bg;       // suara transisi hanya saat tempat berganti
    if (!silent) { await fadeTo(1, 250); if (newPlace) SR.Audio.ui('scene'); }
    resetStage();
    el.chapter.textContent = sc.chapter || '';
    st.bg = null; setBg(sc.bg, true);
    if (sc.bgm !== undefined) SR.Audio.bgm(sc.bgm);
    SR.Audio.amb(sc.amb || null);
    if (silent) {
      for (let i = 0; i < resumeIdx; i++) { const l = sc.lines[i]; if (l && !l.action) applyLine(l, true); }
      st.idx = resumeIdx; renderSprites(true); el.fade.style.transition = 'none'; el.fade.style.opacity = 0;
    } else {
      if (sc.card) {
        el.fade.innerHTML = `<div class="title-card"><small>${fmt(sc.card.top)}</small><strong>${fmt(sc.card.title)}</strong></div>`;
        SR.Audio.sfx('sting'); await wait(1800); el.fade.innerHTML = '';
      } else await wait(60);
      await fadeTo(0, 300);
    }
    busy = false; showLine(); warmNextScene(sc);
  }

  function endScene() {
    const nx = st.scene.next;
    if (nx) enterScene(nx); else host.onEnd();
  }

  /* ---------- kontrol ---------- */
  function advance() {
    const now = performance.now();
    if (!st || busy || askActive || now - lastAdv < GUARD_MS) return;
    if (typing) { typing.finish(); lastAdv = now; return; }
    if (!waiting) return;
    lastAdv = now; waiting = false; st.idx++; showLine();
  }

  function start(sceneId, idx) {
    st = { scene: null, sceneId: null, idx: 0, sprites: {}, speaker: null, bg: null };
    askActive = false; lastAdv = performance.now();
    if (idx > 0) return enterScene(sceneId, idx);
    el.fade.style.transition = 'none'; el.fade.style.opacity = 1;
    return enterScene(sceneId);
  }

  function stop() { if (typing) typing.cancel(); typing = null; st = null; busy = false; askActive = false; waiting = false; }

  SR.Dialogue = { init, start, stop, advance, active: () => !!st };
})();
