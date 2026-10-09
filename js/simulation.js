// SIMULATOR GERBANG LOGIKA. Perhitungan memakai SR.Logic; file ini hanya tampilan & interaksi.
// SR.Simulation.mount(elemen, { gates:['AND','OR','NOT'], gate:'AND', task:{ target:1 }, onComplete(gate) })
(function () {
  const SR = window.SR = window.SR || {};
  const L = () => SR.Logic;
  const SYMBOL = { AND: 'AND', OR: 'OR', NOT: 'NOT' };

  function mount(root, opts) {
    const gates = opts.gates || ['AND', 'OR', 'NOT'];
    const task = opts.task || null;
    let gate = opts.gate || gates[0], inputs = [], seen = new Set(), completed = false;

    root.innerHTML = `
      <div class="sim">
        <div class="sim-tabs" role="tablist" aria-label="Pilih gerbang"></div>
        <div class="sim-board">
          <div class="sim-ins"></div>
          <div class="sim-wires"></div>
          <div class="sim-out"><div class="led" aria-hidden="true"></div><div class="led-label"></div></div>
        </div>
        <p class="sim-eq" aria-live="polite"></p>
        <table class="truth" aria-label="Tabel kebenaran"></table>
        <div class="sim-task" aria-live="polite"></div>
      </div>`;
    const q = s => root.querySelector(s);
    const tabs = q('.sim-tabs'), ins = q('.sim-ins'), wires = q('.sim-wires'), led = q('.led'), ledLabel = q('.led-label'),
          eq = q('.sim-eq'), table = q('.truth'), taskBox = q('.sim-task');

    function buildTabs() {
      tabs.hidden = gates.length < 2;
      tabs.innerHTML = '';
      gates.forEach(g => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'tab'; b.textContent = g; b.setAttribute('role', 'tab'); b.dataset.gate = g;
        b.addEventListener('click', () => setGate(g));
        tabs.appendChild(b);
      });
    }

    function buildInputs() {
      const n = L().GATES[gate].arity;
      ins.innerHTML = '';
      for (let i = 0; i < n; i++) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'sw-btn'; b.dataset.i = i;
        b.style.top = (n === 1 ? 50 : (i === 0 ? 35 : 65)) + '%';
        b.setAttribute('role', 'switch');
        b.addEventListener('click', () => toggle(i));
        ins.appendChild(b);
      }
    }

    function toggle(i) {
      inputs[i] = inputs[i] ? 0 : 1;
      SR.Audio.ui('toggle');
      draw();
      const b = ins.children[i]; if (b) b.focus({ preventScroll: true });
    }

    function setGate(g) {
      gate = g; inputs = new Array(L().GATES[g].arity).fill(0); seen = new Set(); completed = false;
      buildInputs(); draw();
    }

    function draw() {
      const out = L().evaluate(gate, inputs), ri = L().rowIndex(inputs), names = ['A', 'B'];
      seen.add(ri);
      tabs.querySelectorAll('.tab').forEach(t => { const on = t.dataset.gate === gate; t.classList.toggle('active', on); t.setAttribute('aria-selected', on); });
      Array.from(ins.children).forEach((b, i) => {
        b.classList.toggle('on', inputs[i] === 1);
        b.setAttribute('aria-checked', inputs[i] === 1);
        b.innerHTML = `<span class="nm">${names[i]}</span><span class="knob"></span><span class="val">${inputs[i]}</span>`;
        b.setAttribute('aria-label', `Input ${names[i]}, nilai ${inputs[i]}. Tekan untuk mengubah`);
      });
      wires.innerHTML = SR.Symbols.gate(gate, { in: inputs, out });
      led.classList.toggle('on', out === 1);
      ledLabel.innerHTML = `<span>Y</span><b>${out}</b><small>${out ? 'LED menyala' : 'LED mati'}</small>`;
      eq.innerHTML = gate === 'NOT'
        ? `NOT ${inputs[0]} = <b>${out}</b>`
        : `${inputs[0]} ${gate} ${inputs[1]} = <b>${out}</b>`;

      const head = gate === 'NOT' ? '<th></th><th>A</th><th>Y</th>' : '<th></th><th>A</th><th>B</th><th>Y</th>';
      table.innerHTML = `<thead><tr>${head}</tr></thead><tbody>` + L().truthTable(gate).map((r, idx) => {
        const act = idx === ri, mark = act ? '▶' : (task && seen.has(idx) ? '✓' : '');
        return `<tr class="${act ? 'active' : ''}${task && seen.has(idx) ? ' seen' : ''}" data-row="${idx}"><td class="mk">${mark}</td>` +
          r.inputs.map(v => `<td>${v}</td>`).join('') + `<td class="y">${r.output}</td></tr>`;
      }).join('') + '</tbody>';

      if (task) drawTask(out);
    }

    function drawTask(out) {
      const total = 2 ** L().GATES[gate].arity, done = seen.size, needOut = task.target != null;
      const ready = done >= total && (!needOut || out === task.target);
      let msg = `Kombinasi dicoba: <b>${done}/${total}</b>`;
      if (done < total) msg += ' — ubah saklar sampai semua baris tabel bertanda ✓.';
      else if (needOut && out !== task.target) msg += ` — sekarang atur saklar agar LED ${task.target ? 'menyala (Y = 1)' : 'mati (Y = 0)'}.`;
      else msg += ' — lengkap!';
      taskBox.className = 'sim-task' + (ready ? ' ok' : '');
      taskBox.innerHTML = msg;
      if (ready && !completed) { completed = true; opts.onComplete && opts.onComplete(gate); }
    }

    buildTabs(); setGate(gate);
    return { setGate, destroy() { root.innerHTML = ''; }, state: () => ({ gate, inputs: inputs.slice() }) };
  }

  SR.Simulation = { mount };
})();
