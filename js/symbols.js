// SIMBOL & DIAGRAM (SVG). Hanya menggambar; tidak menghitung apa pun sendiri
// kecuali memanggil SR.Logic untuk nilai lampu/rangkaian.
(function () {
  const SR = window.SR = window.SR || {};
  const L = () => SR.Logic;
  const cls = (base, v) => base + (v === 1 ? ' on' : v === 0 ? ' off' : '');

  // Koordinat dasar sebuah gerbang: kotak 140 x 80, port input di y=28/52 (NOT: 40), output di x=140,y=40
  const PORTS = { AND: [28, 52], OR: [28, 52], NOT: [40] };
  const BODY = {
    AND: { d: 'M30 12 H62 A28 28 0 0 1 62 68 H30 Z', outX: 90, inX: 34 },
    OR:  { d: 'M30 12 H55 C75 12 88 26 96 40 C88 54 75 68 55 68 H30 Q44 40 30 12 Z', outX: 96, inX: 36 },
    NOT: { d: 'M30 14 L84 40 L30 66 Z', outX: 95.5, inX: 30 }
  };

  function gateInner(type, ins, out) {
    const b = BODY[type], ports = PORTS[type];
    let s = '';
    ports.forEach((y, i) => { s += `<path class="${cls('sym-wire', ins ? ins[i] : null)}" d="M0 ${y} H${b.inX}"/>`; });
    s += `<path class="${cls('sym-wire', out == null ? null : out)}" d="M${b.outX} 40 H140"/>`;
    s += `<path class="sym-body" d="${b.d}"/>`;
    if (type === 'NOT') s += '<circle class="sym-body" cx="90" cy="40" r="5.5"/>';
    return s;
  }

  // Simbol gerbang berdiri sendiri. state: { in:[..], out:0|1 } (opsional)
  function gate(type, state) {
    state = state || {};
    return `<svg class="sym-gate" viewBox="0 0 140 80" role="img" aria-label="Simbol gerbang ${type}">${gateInner(type, state.in, state.out)}</svg>`;
  }

  // Rangkaian gabungan dari netlist. inputs = {A:1,B:0}. opts: { hideOut, values }
  function circuit(net, inputs, opts) {
    opts = opts || {};
    const res = L().evalNetlist(net, inputs);
    const v = res.values;
    const cy = {}, depth = {}, X = {};
    net.inputs.forEach((n, i) => { cy[n] = 46 + i * 80; depth[n] = 0; });
    net.gates.forEach(g => {
      depth[g.id] = 1 + Math.max(...g.in.map(k => depth[k]));
      cy[g.id] = g.in.reduce((a, k) => a + cy[k], 0) / g.in.length;
      X[g.id] = 80 + (depth[g.id] - 1) * 200;
    });
    const maxD = Math.max(...net.gates.map(g => depth[g.id]));
    const W = 80 + (maxD - 1) * 200 + 140 + 70;
    const H = Math.max(...Object.values(cy)) + 56;
    let wires = '', nodes = '';

    net.inputs.forEach(n => {
      nodes += `<g><rect class="sym-in ${v[n] ? 'on' : 'off'}" x="2" y="${cy[n] - 16}" width="52" height="32" rx="8"/>` +
               `<text class="sym-txt" x="28" y="${cy[n] + 5}" text-anchor="middle">${n} = ${v[n]}</text></g>`;
    });
    net.gates.forEach(g => {
      const ports = PORTS[g.type];
      g.in.forEach((k, i) => {
        const x1 = k in X ? X[k] + 140 : 54, y1 = cy[k], x2 = X[g.id], y2 = cy[g.id] - 40 + ports[i], xm = (x1 + x2) / 2;
        wires += `<path class="${cls('sym-wire', v[k])}" d="M${x1} ${y1} H${xm} V${y2} H${x2}"/>`;
      });
      nodes += `<g transform="translate(${X[g.id]} ${cy[g.id] - 40})">${gateInner(g.type, g.in.map(k => v[k]), opts.values ? v[g.id] : null)}</g>`;
      nodes += `<text class="sym-id" x="${X[g.id] + 56}" y="${cy[g.id] - 46}" text-anchor="middle">${g.type}</text>`;
      if (opts.values && g.id !== net.out) {
        nodes += `<g><circle class="sym-badge" cx="${X[g.id] + 160}" cy="${cy[g.id] - 14}" r="11"/><text class="sym-txt sm" x="${X[g.id] + 160}" y="${cy[g.id] - 10}" text-anchor="middle">${v[g.id]}</text></g>`;
      }
    });
    const ox = X[net.out] + 140, oy = cy[net.out];
    wires += `<path class="${cls('sym-wire', opts.hideOut ? null : v[net.out])}" d="M${ox} ${oy} H${ox + 24}"/>`;
    const lampState = opts.hideOut ? '' : (v[net.out] ? ' on' : ' off');
    nodes += `<circle class="sym-lamp${lampState}" cx="${ox + 40}" cy="${oy}" r="16"/>` +
             `<text class="sym-txt" x="${ox + 40}" y="${oy + 5}" text-anchor="middle">${opts.hideOut ? '?' : v[net.out]}</text>` +
             `<text class="sym-id" x="${ox + 40}" y="${oy + 34}" text-anchor="middle">Y</text>`;
    return `<svg class="sym-circuit" viewBox="0 0 ${W} ${H}" role="img" aria-label="Diagram rangkaian logika">${wires}${nodes}</svg>`;
  }

  // Rangkaian saklar + lampu. mode: 'series' (seri = AND) | 'parallel' (paralel = OR). states [a,b]: 1 = tertutup.
  function switches(mode, states, opts) {
    opts = opts || {};
    const [a, b] = states;
    const lamp = L().evaluate(mode === 'series' ? 'AND' : 'OR', [a, b]);
    const sw = (x, y, closed, i) => {
      const lever = closed ? `M${x} ${y} H${x + 44}` : `M${x} ${y} L${x + 40} ${y - 22}`;
      const attrs = opts.interactive ? ` data-sw="${i}" role="button" tabindex="0" aria-label="Saklar ${'AB'[i]} ${closed ? 'tertutup' : 'terbuka'}"` : '';
      return `<g class="sw${opts.interactive ? ' click' : ''}"${attrs}><rect class="sw-hit" x="${x - 6}" y="${y - 30}" width="56" height="44" rx="8"/>` +
        `<circle class="sw-pin" cx="${x}" cy="${y}" r="4"/><circle class="sym-pin" cx="${x + 44}" cy="${y}" r="4"/>` +
        `<path class="sw-lever ${closed ? 'on' : 'off'}" d="${lever}"/>` +
        `<text class="sym-id" x="${x + 22}" y="${y + 30}" text-anchor="middle">${'AB'[i]} (${closed ? 'tertutup' : 'terbuka'})</text></g>`;
    };
    const w = (d, on) => `<path class="${cls('sym-wire', on ? 1 : 0)}" d="${d}"/>`;
    let body = '';
    const bat = `<g><rect class="sym-body" x="8" y="62" width="34" height="36" rx="4"/><text class="sym-txt sm" x="25" y="85" text-anchor="middle">+ −</text></g>`;
    const lampSvg = (x, y) => `<circle class="sym-lamp ${lamp ? 'on' : 'off'}" cx="${x}" cy="${y}" r="18"/><path class="sym-x" d="M${x - 9} ${y - 9} L${x + 9} ${y + 9} M${x + 9} ${y - 9} L${x - 9} ${y + 9}"/><text class="sym-id" x="${x}" y="${y + 40}" text-anchor="middle">Lampu ${lamp ? 'MENYALA' : 'padam'}</text>`;
    if (mode === 'series') {
      body += w('M25 62 V40 H66', a && b) + w('M110 40 H166', a && b) + w('M210 40 H282 V80', a && b) + w('M282 98 V128 H25 V98', a && b);
      body += sw(66, 40, a, 0) + sw(166, 40, b, 1) + bat + lampSvg(282, 80);
      return `<svg class="sym-switches" viewBox="0 0 330 180" role="img" aria-label="Dua saklar seri dengan lampu">${body}</svg>`;
    }
    body += w('M25 62 V50 H50', a || b) + w('M50 50 V30 H80', a) + w('M50 50 V100 H80', b) + w('M124 30 H190 V50', a) + w('M124 100 H190 V50', b) + w('M190 50 H282 V80', a || b) + w('M282 98 V150 H25 V98', a || b);
    body += sw(80, 30, a, 0) + sw(80, 100, b, 1) + bat + lampSvg(282, 80);
    return `<svg class="sym-switches" viewBox="0 0 330 200" role="img" aria-label="Dua saklar paralel dengan lampu">${body}</svg>`;
  }

  SR.Symbols = { gate, circuit, switches };
})();
