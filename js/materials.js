// PENAMPIL MATERI. Isi materi ada di data/materials.js (bukan di sini).
// SR.Materials.mount(elemen, { topic, free, onClose, onDone })
(function () {
  const SR = window.SR = window.SR || {};
  const { fmt, esc } = SR.Util;
  const L = () => SR.Logic;

  const portrait = SR.Util.portrait;

  function tableHtml(gate) {
    const one = L().GATES[gate].arity === 1;
    return `<table class="truth static"><thead><tr><th>A</th>${one ? '' : '<th>B</th>'}<th>Y</th></tr></thead><tbody>` +
      L().truthTable(gate).map(r => `<tr>${r.inputs.map(v => `<td>${v}</td>`).join('')}<td class="y">${r.output}</td></tr>`).join('') + '</tbody></table>';
  }
  function compareHtml(gates) {
    return `<table class="truth static"><thead><tr><th>A</th><th>B</th>${gates.map(g => `<th>${g}</th>`).join('')}</tr></thead><tbody>` +
      L().combos(2).map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td>${gates.map(g => `<td class="y">${L().evaluate(g, r)}</td>`).join('')}</tr>`).join('') + '</tbody></table>';
  }
  function stepsHtml(net, inputs) {
    const v = L().evalNetlist(net, inputs).values;
    const name = k => (net.inputs.includes(k) ? k : k.toUpperCase());
    return '<ol class="steps">' + net.gates.map(g => {
      const args = g.in.map(k => `${name(k)} = ${v[k]}`).join(', ');
      return `<li><b>${name(g.id)}</b> = ${g.type}(${args}) → <b>${v[g.id]}</b></li>`;
    }).join('') + '</ol>';
  }

  // Satu blok konten -> HTML. Menambah jenis blok baru = tambah satu case di sini.
  function block(b, ctx) {
    switch (b.t) {
      case 'p': return `<p>${fmt(b.text)}</p>`;
      case 'list': return `<ul>${b.items.map(i => `<li>${fmt(i)}</li>`).join('')}</ul>`;
      case 'callout': return `<div class="callout ${b.kind || 'tip'}">${fmt(b.text)}</div>`;
      case 'gate': return `<figure class="fig">${SR.Symbols.gate(b.gate)}<figcaption>${fmt(b.caption || '')}</figcaption></figure>`;
      case 'table': return `<figure class="fig">${tableHtml(b.gate)}${b.caption ? `<figcaption>${fmt(b.caption)}</figcaption>` : ''}</figure>`;
      case 'compare': return `<figure class="fig">${compareHtml(b.gates)}${b.caption ? `<figcaption>${fmt(b.caption)}</figcaption>` : ''}</figure>`;
      case 'grid': return `<div class="tbl-wrap"><table class="truth static grid"><thead><tr>${b.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      case 'bitdemo': return `<div class="bitdemo" data-bit="0"><button type="button" class="bit-btn" aria-pressed="false"></button><div class="bulb" aria-hidden="true"></div><p class="bit-txt"></p></div>`;
      case 'switches': return `<figure class="fig sw-fig" data-mode="${b.mode}" data-state="0,0">${SR.Symbols.switches(b.mode, [0, 0], { interactive: true })}<figcaption>${fmt(b.caption || '')}</figcaption><p class="sw-info" aria-live="polite"></p></figure>`;
      case 'circuit': return `<figure class="fig">${SR.Symbols.circuit(b.net, b.inputs, { values: true })}${stepsHtml(b.net, b.inputs)}${b.caption ? `<figcaption>${fmt(b.caption)}</figcaption>` : ''}</figure>`;
      default: console.warn('[materi] jenis blok tidak dikenal:', b.t); return '';
    }
  }

  function wireInteractive(area) {
    area.querySelectorAll('.bitdemo').forEach(d => {
      const btn = d.querySelector('.bit-btn'), txt = d.querySelector('.bit-txt'), bulb = d.querySelector('.bulb');
      const paint = () => {
        const on = d.dataset.bit === '1';
        btn.textContent = on ? '1' : '0'; btn.setAttribute('aria-pressed', on); bulb.classList.toggle('on', on);
        txt.innerHTML = on ? 'Saklar **ON** → bit **1** → lampu menyala'.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') : 'Saklar <b>OFF</b> → bit <b>0</b> → lampu padam';
      };
      btn.addEventListener('click', () => { d.dataset.bit = d.dataset.bit === '1' ? '0' : '1'; SR.Audio.ui('toggle'); paint(); });
      paint();
    });
    area.querySelectorAll('.sw-fig').forEach(f => {
      const mode = f.dataset.mode, info = f.querySelector('.sw-info');
      const paint = () => {
        const st = f.dataset.state.split(',').map(Number);
        f.querySelector('svg').outerHTML = SR.Symbols.switches(mode, st, { interactive: true });
        const gate = mode === 'series' ? 'AND' : 'OR', y = L().evaluate(gate, st);
        info.innerHTML = `Saklar A = <b>${st[0]}</b>, B = <b>${st[1]}</b> → lampu = <b>${y}</b> (${gate})`;
      };
      const flip = i => { const st = f.dataset.state.split(',').map(Number); st[i] = st[i] ? 0 : 1; f.dataset.state = st.join(','); SR.Audio.ui('toggle'); paint(); };
      f.addEventListener('click', e => { const g = e.target.closest('[data-sw]'); if (g) flip(+g.dataset.sw); });
      f.addEventListener('keydown', e => { const g = e.target.closest('[data-sw]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); flip(+g.dataset.sw); } });
      paint();
    });
  }

  function mount(root, opts) {
    const topics = SR.data.materials;
    let ti = Math.max(0, topics.findIndex(t => t.id === opts.topic)), pi = 0;

    function render() {
      const t = topics[ti], p = t.pages[pi], last = pi === t.pages.length - 1;
      const who = p.who || t.who;
      root.innerHTML = `
        <div class="mat">
          ${opts.free ? `<nav class="mat-tabs" aria-label="Daftar materi">${topics.map((x, i) => `<button type="button" class="tab${i === ti ? ' active' : ''}" data-t="${i}">${esc(x.short || x.title)}</button>`).join('')}</nav>` : `<h2 class="mat-title">${esc(t.title)}</h2>`}
          <div class="mat-page">
            <aside class="mat-say">${portrait(who, p.exp)}<div class="bubble"><span class="who">${esc(SR.data.characters[who].name)}</span><p>${fmt(p.say)}</p></div></aside>
            <article class="mat-body"><h3>${esc(p.title)}</h3>${(p.blocks || []).map(block).join('')}</article>
          </div>
          <footer class="mat-nav">
            <button type="button" class="btn ghost" data-a="prev" ${pi === 0 ? 'disabled' : ''}>◀ Sebelumnya</button>
            <span class="dots" aria-label="Halaman ${pi + 1} dari ${t.pages.length}">${t.pages.map((_, i) => `<i class="${i === pi ? 'on' : ''}"></i>`).join('')}</span>
            <button type="button" class="btn primary" data-a="next">${last ? (opts.free ? (ti < topics.length - 1 ? 'Materi berikutnya ▶' : 'Selesai ✔') : 'Lanjut Cerita ▶') : 'Berikutnya ▶'}</button>
          </footer>
        </div>`;
      wireInteractive(root);
      if (last) SR.Progress.markMaterial(t.id);
      const body = root.querySelector('.mat-body'); if (body) body.scrollTop = 0;
    }

    root.onclick = e => {
      const tab = e.target.closest('[data-t]');
      if (tab) { ti = +tab.dataset.t; pi = 0; return render(); }
      const a = e.target.closest('[data-a]');
      if (!a) return;
      if (a.dataset.a === 'prev' && pi > 0) { pi--; render(); }
      else if (a.dataset.a === 'next') {
        if (pi < topics[ti].pages.length - 1) { pi++; render(); }
        else if (opts.free && ti < topics.length - 1) { ti++; pi = 0; render(); }
        else opts.onDone && opts.onDone();
      }
    };
    render();
  }

  SR.Materials = { mount };
})();
