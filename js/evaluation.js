// SISTEM EVALUASI. Soal ada di data/questions.js. Jawaban soal berbasis gerbang DIHITUNG dari SR.Logic
// (bukan diketik manual), sehingga kunci jawaban selalu cocok dengan logika gerbang.
// SR.Evaluation.mount(elemen, { questions, onFinish(hasil), onExit() })
(function () {
  const SR = window.SR = window.SR || {};
  const { fmt, esc } = SR.Util;
  const L = () => SR.Logic;
  const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

  // Mengubah satu soal menjadi { stimulus, kind, options, correct, auto } — satu-satunya tempat kunci jawaban ditentukan.
  function build(q) {
    switch (q.type) {
      case 'mc': {
        const order = shuffle(q.options.map((text, i) => ({ text, ok: i === q.answer })));
        return { stimulus: '', kind: 'choice', options: order.map(o => o.text), correct: order.findIndex(o => o.ok), auto: '' };
      }
      case 'output': {
        const y = L().evaluate(q.gate, q.inputs);
        const eq = q.gate === 'NOT' ? `NOT ${q.inputs[0]} = ${y}` : `${q.inputs[0]} ${q.gate} ${q.inputs[1]} = ${y}`;
        return { stimulus: `<div class="stim">${SR.Symbols.gate(q.gate)}<p class="inline-in">${q.inputs.map((v, i) => `<span class="chip">${'AB'[i]} = ${v}</span>`).join('')}</p></div>`,
                 kind: 'choice', options: ['0', '1'], correct: y, auto: `Perhitungan: ${eq}.` };
      }
      case 'identify': {
        const names = ['AND', 'OR', 'NOT'];
        return { stimulus: `<div class="stim">${SR.Symbols.gate(q.gate)}</div>`, kind: 'choice', options: names, correct: names.indexOf(q.gate), auto: '' };
      }
      case 'switches': {
        const g = q.mode === 'series' ? 'AND' : 'OR', y = L().evaluate(g, q.states);
        return { stimulus: `<div class="stim">${SR.Symbols.switches(q.mode, q.states)}</div>`, kind: 'choice', options: ['Lampu padam', 'Lampu menyala'], correct: y,
                 auto: `Saklar A = ${q.states[0]}, B = ${q.states[1]} pada rangkaian ${q.mode === 'series' ? 'seri (AND)' : 'paralel (OR)'} → lampu = ${y}.` };
      }
      case 'circuit': {
        const r = L().evalNetlist(q.net, q.inputs);
        const steps = q.net.gates.map(g => `${g.id.toUpperCase()} = ${g.type}(${g.in.map(k => (q.net.inputs.includes(k) ? k : k.toUpperCase()) + '=' + r.values[k]).join(', ')}) = ${r.values[g.id]}`).join('; ');
        return { stimulus: `<div class="stim">${SR.Symbols.circuit(q.net, q.inputs, { hideOut: true })}</div>`, kind: 'choice', options: ['0', '1'], correct: r.out, auto: `Langkah: ${steps}.` };
      }
      case 'table': {
        const rows = L().truthTable(q.gate);
        return { stimulus: '', kind: 'table', rows, correct: rows.map(r => r.output), auto: '' };
      }
      default: throw new Error('Jenis soal tidak dikenal: ' + q.type);
    }
  }

  const REACT = {
    right: [['pia', 'grin'], ['rena', 'happy'], ['sera', 'smile'], ['pia', 'sparkle']],
    wrong: [['rena', 'thinking'], ['pia', 'troubled'], ['sera', 'normal2'], ['rena', 'concerned']]
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];

  function mount(root, opts) {
    const qs = opts.questions;
    let i = 0, score = 0, byTopic = {}, picked = null, cells = null, checked = false, b = null;

    function render() {
      const q = qs[i]; b = SR.Evaluation.build(q); picked = null; checked = false;
      cells = b.kind === 'table' ? b.rows.map(() => null) : null;
      const prompt = q.type === 'output' ? (q.text || 'Berapa nilai output Y?') : q.type === 'identify' ? (q.text || 'Gerbang apakah ini?') : q.text;
      root.innerHTML = `
        <div class="ev">
          <header class="ev-head">
            <span class="ev-count">Soal ${i + 1} / ${qs.length}</span>
            <div class="ev-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${qs.length}" aria-valuenow="${i}"><i style="width:${(i / qs.length) * 100}%"></i></div>
            <button type="button" class="btn ghost small" data-a="exit">Keluar</button>
          </header>
          <section class="ev-card">
            <p class="ev-q">${fmt(prompt)}</p>
            ${b.stimulus}
            ${b.kind === 'choice' ? `<div class="ev-options" role="radiogroup">${b.options.map((o, k) => `<button type="button" class="opt" role="radio" aria-checked="false" data-k="${k}"><span class="key">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>` : tableInput()}
            <div class="ev-feedback" aria-live="polite"></div>
          </section>
          <footer class="ev-foot"><button type="button" class="btn primary" data-a="check" disabled>Periksa jawaban</button></footer>
        </div>`;
    }

    function tableInput() {
      const one = L().GATES[qs[i].gate].arity === 1;
      return `<table class="truth ev-table"><thead><tr><th>A</th>${one ? '' : '<th>B</th>'}<th>Y</th></tr></thead><tbody>` +
        b.rows.map((r, k) => `<tr>${r.inputs.map(v => `<td>${v}</td>`).join('')}<td><button type="button" class="cell" data-c="${k}" aria-label="Output baris ${k + 1}, belum diisi">?</button></td></tr>`).join('') + '</tbody></table><p class="hint">Ketuk kotak Y untuk mengganti ? → 0 → 1.</p>';
    }

    function ready() { return b.kind === 'choice' ? picked != null : cells.every(c => c != null); }
    function refresh() { root.querySelector('[data-a="check"]').disabled = checked ? false : !ready(); }

    function check() {
      const q = qs[i];
      let ok, correctText;
      if (b.kind === 'choice') { ok = picked === b.correct; correctText = b.options[b.correct]; }
      else { ok = cells.every((c, k) => c === b.correct[k]); correctText = b.correct.join(', '); }
      checked = true;
      const topic = q.topic || 'umum'; byTopic[topic] = byTopic[topic] || { right: 0, total: 0 }; byTopic[topic].total++;
      if (ok) { score += q.weight || 1; byTopic[topic].right++; }
      SR.Audio.ui(ok ? 'correct' : 'wrong');

      root.querySelectorAll('.opt').forEach((o, k) => { o.disabled = true; if (k === b.correct) o.classList.add('right'); else if (k === picked) o.classList.add('wrong'); });
      root.querySelectorAll('.cell').forEach((c, k) => { c.disabled = true; c.classList.add(cells[k] === b.correct[k] ? 'right' : 'wrong'); c.textContent = cells[k]; if (cells[k] !== b.correct[k]) c.insertAdjacentHTML('afterend', `<span class="fix">→ ${b.correct[k]}</span>`); });

      const [who, exp] = pick(ok ? REACT.right : REACT.wrong), ch = SR.data.characters[who];
      const explain = [q.explain, b.auto].filter(Boolean).map(fmt).join(' ');
      root.querySelector('.ev-feedback').innerHTML =
        `<div class="fb ${ok ? 'ok' : 'bad'}">${SR.Util.portrait(who, exp)}` +
        `<div><strong>${ok ? 'Benar!' : 'Belum tepat.'}</strong>${ok ? '' : ` Jawaban yang benar: <b>${esc(correctText)}</b>.`}<p>${explain}</p></div></div>`;
      const btn = root.querySelector('[data-a="check"]'); btn.dataset.a = 'next'; btn.textContent = i === qs.length - 1 ? 'Lihat hasil ▶' : 'Soal berikutnya ▶'; btn.disabled = false; btn.focus({ preventScroll: true });
    }

    function next() {
      if (i < qs.length - 1) { i++; render(); return; }
      const total = qs.reduce((a, q) => a + (q.weight || 1), 0);
      opts.onFinish({ score, total, percent: Math.round((score / total) * 100), byTopic, when: Date.now() });
    }

    root.onclick = e => {
      const opt = e.target.closest('.opt'), cell = e.target.closest('.cell'), act = e.target.closest('[data-a]');
      if (opt && !checked) {
        picked = +opt.dataset.k;
        root.querySelectorAll('.opt').forEach((o, k) => { o.classList.toggle('sel', k === picked); o.setAttribute('aria-checked', k === picked); });
        SR.Audio.ui('toggle'); refresh();
      } else if (cell && !checked) {
        const k = +cell.dataset.c; cells[k] = cells[k] == null ? 0 : cells[k] === 0 ? 1 : 0;
        cell.textContent = cells[k]; cell.classList.add('set'); cell.setAttribute('aria-label', `Output baris ${k + 1}, nilai ${cells[k]}`);
        SR.Audio.ui('toggle'); refresh();
      } else if (act) {
        if (act.dataset.a === 'check' && ready()) check();
        else if (act.dataset.a === 'next') next();
        else if (act.dataset.a === 'exit') opts.onExit && opts.onExit();
      }
    };
    render();
  }

  SR.Evaluation = { mount, build };
})();
