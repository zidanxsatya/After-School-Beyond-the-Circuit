// Pemeriksaan otomatis tanpa browser. Jalankan:  node tests/check.js
// Memeriksa: logika gerbang, kunci jawaban soal, referensi cerita (latar/ekspresi/audio), dan keberadaan file aset.
const fs = require('fs'), path = require('path'), assert = require('assert');
global.window = global;
const root = path.join(__dirname, '..');
['js/util', 'data/assets', 'data/story', 'data/materials', 'data/questions', 'js/logic', 'js/symbols', 'js/settings', 'js/progress', 'js/evaluation']
  .forEach(f => require(path.join(root, f + '.js')));
const L = SR.Logic, D = SR.data;
let n = 0; const ok = (c, m) => { assert(c, m); n++; };
const eq = (a, b, m) => { assert.deepStrictEqual(a, b, m); n++; };

/* 1. Logika gerbang (tabel ditulis manual sebagai pembanding independen) */
eq(L.truthTable('AND').map(r => r.output), [0, 0, 0, 1], 'tabel AND');
eq(L.truthTable('OR').map(r => r.output), [0, 1, 1, 1], 'tabel OR');
eq(L.truthTable('NOT').map(r => r.output), [1, 0], 'tabel NOT');
eq(L.truthTable('AND').map(r => r.inputs), [[0, 0], [0, 1], [1, 0], [1, 1]], 'urutan baris');
eq([L.rowIndex([0, 0]), L.rowIndex([0, 1]), L.rowIndex([1, 0]), L.rowIndex([1, 1])], [0, 1, 2, 3], 'rowIndex');
assert.throws(() => L.evaluate('AND', [1]), /butuh 2/); assert.throws(() => L.evaluate('AND', [1, 2]), /0 atau 1/); assert.throws(() => L.evaluate('XOR', [1, 1]), /tidak dikenal/); n += 3;
const nand = { inputs: ['A', 'B'], gates: [{ id: 'g1', type: 'AND', in: ['A', 'B'] }, { id: 'g2', type: 'NOT', in: ['g1'] }], out: 'g2' };
eq(L.combos(2).map(c => L.evalNetlist(nand, { A: c[0], B: c[1] }).out), [1, 1, 1, 0], 'netlist AND->NOT');

/* 2. Aset: semua file yang dirujuk ada */
const files = [];
Object.values(D.characters).forEach(c => (c.expressions || []).forEach(e => files.push(c.dir + e + '.webp')));
Object.values(D.backgrounds).forEach(f => files.push(f));
Object.values(D.audio.bgm).forEach(b => files.push(b.file));
Object.values(D.audio.sfx).forEach(f => files.push(f));
files.forEach(f => ok(fs.existsSync(path.join(root, f)), 'file hilang: ' + f));
Object.values(D.audio.ui).forEach(id => ok(D.audio.sfx[id], 'ui sfx tidak ada: ' + id));

/* 3. Cerita: semua rujukan valid */
const S = D.story.scenes, mats = D.materials.map(m => m.id);
ok(S[D.story.start], 'adegan awal');
Object.entries(S).forEach(([id, sc]) => {
  ok(D.backgrounds[sc.bg], `${id}: latar ${sc.bg}`);
  if (sc.bgm) ok(D.audio.bgm[sc.bgm], `${id}: bgm ${sc.bgm}`);
  if (sc.amb) ok(D.audio.sfx[sc.amb], `${id}: amb ${sc.amb}`);
  if (sc.next) ok(S[sc.next], `${id}: next ${sc.next}`);
  const shown = new Set();
  sc.lines.forEach((l, i) => {
    const w = `${id}[${i}]`;
    const chk = (cid, exp) => { const c = D.characters[cid]; ok(c, `${w}: karakter ${cid}`); if (exp && c.expressions) ok(c.expressions.includes(exp), `${w}: ekspresi ${cid}/${exp}`); };
    if (l.who) chk(l.who, l.exp);
    (l.show || []).forEach(s => { chk(s.id, s.exp); shown.add(s.id); });
    if (l.who && D.characters[l.who].sprite !== false) shown.add(l.who);
    (l.hide || []).forEach(h => chk(h));
    if (l.bg) ok(D.backgrounds[l.bg], `${w}: bg`);
    if (l.bgm) ok(D.audio.bgm[l.bgm], `${w}: bgm ${l.bgm}`);
    if (l.sfx) ok(D.audio.sfx[l.sfx], `${w}: sfx ${l.sfx}`);
    if (l.pos) ok(['left', 'center', 'right'].includes(l.pos), `${w}: pos`);
    if (l.action === 'material') ok(mats.includes(l.id), `${w}: materi ${l.id}`);
    if (l.action === 'simulation') ok(L.GATES[l.gate], `${w}: gerbang ${l.gate}`);
    if (l.action === 'ask') {
      ok(l.options[l.answer] !== undefined, `${w}: answer`); chk(l.who, l.exp); chk(l.who, l.right.exp); chk(l.who, l.wrong.exp);
      ok(l.right.text && l.wrong.text, `${w}: umpan balik`);
    }
    if (!l.action) ok(typeof l.text === 'string' && l.text.length, `${w}: teks`);
  });
});
ok(Object.values(S).some(s => s.next === null && s.lines.some(l => l.action === 'evaluation')), 'adegan akhir memanggil evaluasi');

/* 3b. Kedipan: berkas ada, kotak valid, daftar ekspresi hanya berisi ekspresi yang memang ada */
Object.entries(D.characters).forEach(([cid, c]) => {
  if (!c.blink) return;
  ok(fs.existsSync(path.join(root, c.dir + c.blink.file)), cid + ': blink file');
  ok(c.blink.box.length === 4 && c.blink.box.every(v => v > 0 && v < 1) && c.blink.box[0] + c.blink.box[2] < 1 && c.blink.box[1] + c.blink.box[3] < 1, cid + ': blink box');
  c.blink.exps.forEach(e => { ok(c.expressions.includes(e), `${cid}: blink exp ${e}`); ok(!/^eyes_closed/.test(e), `${cid}: ${e} sudah bermata tertutup`); });
  ok(c.blink.exps.includes(c.default), cid + ': ekspresi default harus bisa berkedip');
});

/* 4. Materi */
D.materials.forEach(m => m.pages.forEach((p, i) => {
  const who = p.who || m.who, c = D.characters[who];
  ok(c && c.expressions.includes(p.exp || c.default), `materi ${m.id}[${i}] ekspresi`);
  (p.blocks || []).forEach(b => { if (b.gate) ok(L.GATES[b.gate], 'gate blok'); if (b.t === 'circuit') L.evalNetlist(b.net, b.inputs); });
}));

/* 5. Soal: kunci jawaban diverifikasi terhadap perhitungan manual yang independen */
const ids = new Set();
D.questions.forEach(q => {
  ok(!ids.has(q.id), 'id ganda ' + q.id); ids.add(q.id);
  ok(mats.includes(q.topic), `${q.id}: topic ${q.topic}`); ok(q.explain, `${q.id}: explain`);
  const b = SR.Evaluation.build(q);
  if (q.type === 'mc') { ok(q.answer >= 0 && q.answer < q.options.length, q.id + ' answer'); ok(new Set(q.options).size === q.options.length, q.id + ' opsi ganda'); eq(b.options[b.correct], q.options[q.answer], q.id + ' kunci setelah acak'); }
  if (q.type === 'output') { const [a, c] = q.inputs; const exp = q.gate === 'AND' ? (a && c ? 1 : 0) : q.gate === 'OR' ? (a || c ? 1 : 0) : (a ? 0 : 1); eq(+b.options[b.correct], exp, q.id); }
  if (q.type === 'identify') eq(b.options[b.correct], q.gate, q.id);
  if (q.type === 'switches') { const [a, c] = q.states; const lamp = q.mode === 'series' ? (a && c ? 1 : 0) : (a || c ? 1 : 0); eq(b.options[b.correct], lamp ? 'Lampu menyala' : 'Lampu padam', q.id); }
  if (q.type === 'circuit') { const i = q.inputs; const g1 = q.net.gates[0].type === 'AND' ? (i.A && i.B ? 1 : 0) : (i.A || i.B ? 1 : 0); eq(+b.options[b.correct], g1 ? 0 : 1, q.id); }
  if (q.type === 'table') eq(b.correct, q.gate === 'OR' ? [0, 1, 1, 1] : q.gate === 'AND' ? [0, 0, 0, 1] : [1, 0], q.id);
});
ok(D.questions.length >= 10, 'jumlah soal');
// mc diacak 50x: kunci selalu menunjuk opsi benar
for (let k = 0; k < 50; k++) D.questions.filter(q => q.type === 'mc').forEach(q => { const b = SR.Evaluation.build(q); assert.strictEqual(b.options[b.correct], q.options[q.answer]); }); n++;

console.log(`OK — ${n} pemeriksaan lulus.`);
