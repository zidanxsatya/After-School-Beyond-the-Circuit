// LOGIKA GERBANG — murni perhitungan, tanpa DOM. Dipakai simulator, evaluasi, dan tes.
(function () {
  const SR = window.SR = window.SR || {};

  const GATES = {
    AND: { arity: 2, fn: (a, b) => (a === 1 && b === 1 ? 1 : 0) },
    OR:  { arity: 2, fn: (a, b) => (a === 1 || b === 1 ? 1 : 0) },
    NOT: { arity: 1, fn: a => (a === 1 ? 0 : 1) }
  };

  function evaluate(type, inputs) {
    const g = GATES[type];
    if (!g) throw new Error('Gerbang tidak dikenal: ' + type);
    if (inputs.length !== g.arity) throw new Error(type + ' butuh ' + g.arity + ' input');
    inputs.forEach(v => { if (v !== 0 && v !== 1) throw new Error('Input harus 0 atau 1'); });
    return g.fn(...inputs);
  }

  // Semua kombinasi input, urutan hitung biner: 00, 01, 10, 11 (A = bit paling kiri)
  function combos(n) {
    const rows = [];
    for (let i = 0; i < 2 ** n; i++) {
      const row = [];
      for (let b = n - 1; b >= 0; b--) row.push((i >> b) & 1);
      rows.push(row);
    }
    return rows;
  }

  const truthTable = type => combos(GATES[type].arity).map(inputs => ({ inputs, output: evaluate(type, inputs) }));
  const rowIndex = inputs => inputs.reduce((acc, v) => acc * 2 + v, 0);

  // Rangkaian gabungan (netlist). Gerbang HARUS tertulis berurutan dari kiri ke kanan.
  // net = { inputs:['A','B'], gates:[{id:'g1', type:'AND', in:['A','B']}, ...], out:'g2' }
  function evalNetlist(net, values) {
    const val = Object.assign({}, values);
    net.gates.forEach(g => {
      val[g.id] = evaluate(g.type, g.in.map(k => {
        if (!(k in val)) throw new Error('Sinyal belum ada: ' + k);
        return val[k];
      }));
    });
    return { values: val, out: val[net.out] };
  }

  SR.Logic = { GATES, evaluate, combos, truthTable, rowIndex, evalNetlist };
})();
