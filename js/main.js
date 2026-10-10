// APLIKASI UTAMA — navigasi antar layar, menu, hasil/progres, pengaturan. Tidak berisi konten cerita/materi/soal.
(function () {
  const SR = window.SR;
  const { $, $$, fmt, esc } = SR.Util;
  const P = () => SR.Progress.get();

  let current = 'menu', settingsReturn = 'menu', storyActive = false;

  const PANEL_BG = { materials: 'classroom_front', sim: 'classroom_back', eval: 'classroom_back', result: 'library', settings: 'school_spring' };
  Object.keys(PANEL_BG).forEach(k => {
    const u = SR.data.backgrounds[PANEL_BG[k]];
    $('#screen-' + k + ' .backdrop').style.backgroundImage = `url("${u}")`;
  });
  $('.menu-bg').style.backgroundImage = `url("${SR.data.backgrounds.school_spring}")`;

  function show(name) {
    current = name;
    $$('.screen').forEach(s => s.classList.toggle('active', s.id === 'screen-' + name));
    window.scrollTo(0, 0);
  }

  /* ---------- menu utama ---------- */
  const MENU_CHARS = [['rena', 'smile', 'c-rena'], ['sera', 'normal', 'c-sera'], ['pia', 'grin', 'c-pia']];
  $('.menu-chars').innerHTML = MENU_CHARS.map(([id, exp, c]) => {
    const ch = SR.data.characters[id];
    return `<img class="mc ${c}" src="${ch.dir}${exp}.webp" alt="" style="--ar:${ch.ar};--hf:${ch.hf}" draggable="false">`;
  }).join('');

  function buildMenu() {
    const p = P(), items = [];
    if (p.checkpoint) { items.push(['Lanjutkan', 'continue', true]); items.push(['Cerita Baru', 'new']); }
    else items.push([p.storyDone ? 'Putar Ulang Cerita' : 'Mulai Cerita', 'new', true]);
    items.push(['Materi', 'materials'], ['Simulasi', 'sim'], ['Latihan', 'eval'], ['Progres', 'result'], ['Pengaturan', 'settings']);
    $('#menu-list').innerHTML = items.map(([t, a, pr]) => `<button class="btn menu-btn${pr ? ' primary' : ''}" type="button" data-menu="${a}">${t}</button>`).join('');
  }
  function toMenu() {
    SR.Dialogue.stop(); storyActive = false;
    buildMenu(); show('menu'); SR.Audio.bgm('everyday_life'); SR.Audio.amb(null);
  }
  $('#menu-list').addEventListener('click', e => {
    const b = e.target.closest('[data-menu]'); if (!b) return;
    ({ continue: () => startStory(true), new: () => startStory(false), materials: () => openMaterials(null, true), sim: openSandbox,
       eval: () => openEval(false), result: () => showResult(null), settings: () => openSettings('menu') })[b.dataset.menu]();
  });

  /* ---------- cerita ---------- */
  SR.Dialogue.init({
    onCheckpoint: (s, i) => setTimeout(() => SR.Progress.setCheckpoint(s, i), 0),   // tulis simpanan di luar jalur render
    onEnd: () => { SR.Progress.finishStory(); toMenu(); },
    runAction(line, done) {
      if (line.action === 'material') openMaterials(line.id, false, done);
      else if (line.action === 'simulation') openStorySim(line, done);
      else if (line.action === 'evaluation') openEval(true);
      else { console.warn('[story] action tidak dikenal:', line.action); done(); }
    }
  });

  function startStory(resume) {
    const cp = resume && P().checkpoint;
    if (!resume) SR.Progress.clearCheckpoint();
    storyActive = true; show('story');
    $('#pause').hidden = true;
    SR.Dialogue.start(cp ? cp.scene : SR.data.story.start, cp ? cp.line : 0);
  }
  const pauseOn = on => { $('#pause').hidden = !on; if (on) $('#pause [data-pause="resume"]').focus(); };
  $('#btn-pause').addEventListener('click', () => pauseOn(true));
  $('#pause').addEventListener('click', e => {
    const a = e.target.closest('[data-pause]'); if (!a) return;
    if (a.dataset.pause === 'resume') pauseOn(false);
    else if (a.dataset.pause === 'settings') { pauseOn(false); openSettings('story'); }
    else if (a.dataset.pause === 'menu') { pauseOn(false); toMenu(); }
  });
  document.addEventListener('keydown', e => {
    if (current !== 'story') return;
    if (e.key === 'Escape') { pauseOn($('#pause').hidden); return; }
    if (!$('#pause').hidden) return;
    const tag = e.target.tagName;
    if ((e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') && tag !== 'BUTTON') { e.preventDefault(); SR.Dialogue.advance(); }
  });
  document.addEventListener('click', e => { if (e.target.closest('.btn, .icon-btn, .tab') && !e.target.closest('[data-a="check"]')) SR.Audio.ui('click', { soft: true }); }, true);   // "Periksa jawaban" punya suara benar/salah sendiri

  /* ---------- materi ---------- */
  function openMaterials(topic, free, onDone) {
    show('materials');
    if (free) SR.Audio.bgm('relaxing_time');
    $('#mat-back').hidden = !free;
    $('#mat-heading').textContent = free ? 'Materi' : 'Materi · ' + SR.data.materials.find(m => m.id === topic).title;
    SR.Materials.mount($('#mat-root'), { topic: topic || SR.data.materials[0].id, free,
      onDone: free ? toMenu : () => { show('story'); onDone(); } });
  }
  $('#mat-back').addEventListener('click', toMenu);

  /* ---------- simulasi ---------- */
  let simInst = null;
  function openSandbox() {
    show('sim'); SR.Audio.bgm('relaxing_time');
    $('#sim-heading').textContent = 'Simulasi Gerbang Logika';
    $('#sim-back').hidden = false; $('#sim-foot').hidden = true;
    $('#sim-intro').innerHTML = 'Ketuk saklar A dan B untuk mengubah input. Perhatikan LED, rumus, dan baris tabel kebenaran yang menyala.';
    simInst = SR.Simulation.mount($('#sim-root'), { gates: ['AND', 'OR', 'NOT'], gate: 'AND' });
  }
  function openStorySim(line, done) {
    show('sim');
    $('#sim-heading').textContent = line.title || 'Simulasi';
    $('#sim-back').hidden = true; $('#sim-foot').hidden = false;
    const cont = $('#sim-continue'); cont.disabled = true;
    $('#sim-intro').innerHTML = 'Coba semua kombinasi saklar sampai semua baris tabel bertanda ✓, lalu penuhi targetnya untuk membuka kunci.';
    simInst = SR.Simulation.mount($('#sim-root'), { gates: [line.gate], gate: line.gate, task: line.task || { target: 1 },
      onComplete: g => { SR.Progress.markSim(g); cont.disabled = false; SR.Audio.ui('unlock'); cont.focus(); } });
    cont.onclick = () => { show('story'); done(); };
  }
  $('#sim-back').addEventListener('click', toMenu);

  /* ---------- evaluasi & hasil ---------- */
  function openEval(fromStory) {
    show('eval'); SR.Audio.bgm('snowmelt');
    $('#eval-heading').textContent = fromStory ? 'Evaluasi Akhir · Panel Lab' : 'Latihan';
    SR.Evaluation.mount($('#eval-root'), { questions: SR.data.questions,
      onFinish: r => { SR.Progress.saveQuiz(r); if (fromStory) SR.Progress.finishStory(); storyActive = false; showResult(r); },
      onExit: toMenu });  // dari cerita: checkpoint tetap di evaluasi, "Lanjutkan" mengulang evaluasi
  }

  function rank(pct) {
    if (pct >= 90) return ['Master Sirkuit', 'sera', 'beaming', 'Sempurna. Panel pun mengakui kemampuanmu.'];
    if (pct >= 70) return ['Penjaga Sirkuit', 'pia', 'sparkle', 'Hebat! Kamu layak jadi anggota klub!'];
    if (pct >= 50) return ['Teknisi Magang', 'rena', 'smile', 'Lumayan. Ulangi materi yang masih ragu, lalu coba lagi.'];
    return ['Calon Teknisi', 'rena', 'thinking', 'Jangan menyerah. Baca ulang materinya, lalu coba lagi.'];
  }
  function showResult(r) {
    show('result'); SR.Audio.bgm('happy_days');
    const p = P(), res = r || p.quiz.last, mats = SR.data.materials;
    let html = '';
    if (res) {
      const [title, who, exp, msg] = rank(res.percent), ch = SR.data.characters[who];
      const weak = Object.keys(res.byTopic).filter(t => res.byTopic[t].right < res.byTopic[t].total);
      html += `<section class="res-card ${r ? 'fresh' : ''}">
        <div class="res-score"><b>${res.score}</b><span>/ ${res.total}</span><small>${res.percent}%</small></div>
        <div class="res-msg"><h3>${title}</h3><div class="fb ok">${SR.Util.portrait(who, exp)}<div><strong>${ch.name}</strong><p>${msg}</p></div></div></div>
        <table class="truth static topics"><thead><tr><th>Topik</th><th>Benar</th></tr></thead><tbody>${Object.keys(res.byTopic).map(t => {
          const m = mats.find(x => x.id === t), s = res.byTopic[t];
          return `<tr><td>${esc(m ? m.short : t)}</td><td class="y">${s.right} / ${s.total} ${s.right === s.total ? '✓' : ''}</td></tr>`;
        }).join('')}</tbody></table>
        ${weak.length ? `<p class="hint">Perlu diulang: ${weak.map(t => { const m = mats.find(x => x.id === t); return `<a href="#" class="lnk" data-mat="${t}">${esc(m ? m.short : t)}</a>`; }).join(', ')}</p>` : '<p class="hint">Semua topik dikuasai. 🎉</p>'}
      </section>`;
    } else html += '<section class="res-card"><p>Belum ada nilai. Selesaikan cerita atau buka menu <b>Latihan</b>.</p></section>';
    const done = (c, t) => `<li class="${c ? 'ok' : ''}"><span aria-hidden="true">${c ? '✓' : '○'}</span> ${t}</li>`;
    html += `<section class="res-prog"><h3>Progres</h3><ul class="checklist">
      ${done(p.storyDone, 'Cerita Bab 1 selesai')}
      ${['AND', 'OR', 'NOT'].map(g => done(p.sims[g], `Kunci ${g} terbuka (simulasi)`)).join('')}
      ${mats.map(m => done(p.materials[m.id], `Materi dibaca: ${esc(m.title)}`)).join('')}
      ${done(!!p.quiz.best, p.quiz.best ? `Nilai terbaik: ${p.quiz.best.score} / ${p.quiz.best.total} (${p.quiz.attempts}× percobaan)` : 'Belum mengerjakan evaluasi')}
    </ul></section>
    <div class="res-actions"><button class="btn primary" type="button" data-r="retry">Ulangi Latihan</button><button class="btn" type="button" data-r="menu">Menu Utama</button></div>`;
    $('#res-root').innerHTML = html;
  }
  $('#res-root').addEventListener('click', e => {
    const a = e.target.closest('[data-r]'), l = e.target.closest('[data-mat]');
    if (l) { e.preventDefault(); openMaterials(l.dataset.mat, true); }
    else if (a) { a.dataset.r === 'retry' ? openEval(false) : toMenu(); }
  });
  $('#res-back').addEventListener('click', toMenu);

  /* ---------- pengaturan ---------- */
  function openSettings(ret) {
    settingsReturn = ret; show('settings');
    const S = SR.Settings, speeds = [['Lambat', 25], ['Normal', 45], ['Cepat', 90], ['Instan', 0]];
    $('#set-root').innerHTML = `<div class="set">
      <label class="row"><span>Volume musik</span><input type="range" min="0" max="100" value="${Math.round(S.get('musicVol') * 100)}" data-s="musicVol"><output>${Math.round(S.get('musicVol') * 100)}%</output></label>
      <label class="row chk"><input type="checkbox" data-s="musicMute" ${S.get('musicMute') ? 'checked' : ''}><span>Matikan musik</span></label>
      <label class="row"><span>Volume efek suara</span><input type="range" min="0" max="100" value="${Math.round(S.get('sfxVol') * 100)}" data-s="sfxVol"><output>${Math.round(S.get('sfxVol') * 100)}%</output></label>
      <label class="row chk"><input type="checkbox" data-s="sfxMute" ${S.get('sfxMute') ? 'checked' : ''}><span>Matikan efek suara</span></label>
      <div class="row"><span>Kecepatan teks</span><div class="seg" role="group" aria-label="Kecepatan teks">${speeds.map(([t, v]) => `<button type="button" class="tab${S.get('textSpeed') === v ? ' active' : ''}" data-speed="${v}">${t}</button>`).join('')}</div></div>
      <div class="row"><button type="button" class="btn small" data-set="defaults">Kembalikan pengaturan</button><button type="button" class="btn small danger" data-set="reset">Hapus progres</button></div>
    </div>`;
  }
  $('#set-root').addEventListener('input', e => {
    const k = e.target.dataset.s; if (!k) return;
    if (e.target.type === 'range') { SR.Settings.set(k, e.target.value / 100); e.target.nextElementSibling.textContent = e.target.value + '%'; }
    else SR.Settings.set(k, e.target.checked);
  });
  $('#set-root').addEventListener('change', e => { if (e.target.dataset.s === 'sfxVol') SR.Audio.sfx('ui_confirm'); });
  $('#set-root').addEventListener('click', e => {
    const sp = e.target.closest('[data-speed]'), a = e.target.closest('[data-set]');
    if (sp) { SR.Settings.set('textSpeed', +sp.dataset.speed); $$('[data-speed]').forEach(b => b.classList.toggle('active', b === sp)); }
    else if (a && a.dataset.set === 'defaults') { SR.Settings.reset(); openSettings(settingsReturn); }
    else if (a && a.dataset.set === 'reset' && confirm('Hapus semua progres (cerita, materi, nilai)? Pengaturan tidak berubah.')) { SR.Progress.reset(); buildMenu(); openSettings(settingsReturn); }
  });
  $('#set-back').addEventListener('click', () => { if (settingsReturn === 'story') show('story'); else toMenu(); });

  /* ---------- mulai ---------- */
  buildMenu(); SR.Audio.bgm('everyday_life');
  window.addEventListener('error', e => console.error('[After School: Beyond the Circuit]', e.message));
})();
