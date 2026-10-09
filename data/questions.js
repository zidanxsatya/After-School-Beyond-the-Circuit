// BANK SOAL — tambah soal dengan menambah satu objek ke daftar ini.
// Jenis soal:
//   mc       : { text, options:[...], answer: indeks jawaban benar (mulai 0) }   (pilihan akan diacak saat tampil)
//   output   : { gate:'AND', inputs:[1,0] }              -> jawaban DIHITUNG otomatis
//   identify : { gate:'OR' }                              -> kenali simbol gerbang
//   table    : { gate:'AND', text }                       -> pemain mengisi kolom Y
//   switches : { mode:'series'|'parallel', states:[1,0] } -> lampu menyala/padam? (dihitung otomatis)
//   circuit  : { net:{...}, inputs:{A:1,B:0} }            -> output akhir rangkaian (dihitung otomatis)
// topic harus salah satu id materi: biner | and | or | not | tabel | rangkaian
// explain = penjelasan aturan (jangan menulis hasil angka di sini untuk soal yang dihitung otomatis;
//           hasil perhitungan ditambahkan sendiri oleh sistem).
(function () {
  const SR = window.SR = window.SR || {};
  SR.data = SR.data || {};

  const NAND = { inputs: ['A', 'B'], gates: [{ id: 'g1', type: 'AND', in: ['A', 'B'] }, { id: 'g2', type: 'NOT', in: ['g1'] }], out: 'g2' };
  const NOR  = { inputs: ['A', 'B'], gates: [{ id: 'g1', type: 'OR', in: ['A', 'B'] }, { id: 'g2', type: 'NOT', in: ['g1'] }], out: 'g2' };

  SR.data.questions = [
    { id: 'q01', type: 'mc', topic: 'biner', text: 'Bilangan biner hanya memakai angka…',
      options: ['0 dan 1', '0 sampai 9', '1 dan 2', 'A dan B'], answer: 0,
      explain: 'Biner (basis dua) hanya mengenal dua simbol: 0 dan 1.' },
    { id: 'q02', type: 'mc', topic: 'biner', text: 'Dalam rangkaian digital, bit **1** biasanya berarti…',
      options: ['Sinyal aktif (HIGH / lampu menyala)', 'Sinyal tidak aktif (LOW / lampu padam)', 'Rangkaian rusak', 'Tegangan negatif'], answer: 0,
      explain: 'Bit 1 = aktif/HIGH/ON, sedangkan bit 0 = tidak aktif/LOW/OFF.' },
    { id: 'q03', type: 'output', topic: 'and', gate: 'AND', inputs: [1, 1],
      explain: 'AND menghasilkan 1 hanya jika semua inputnya 1.' },
    { id: 'q04', type: 'output', topic: 'and', gate: 'AND', inputs: [1, 0],
      explain: 'Selama ada satu input 0, output AND pasti 0.' },
    { id: 'q05', type: 'output', topic: 'or', gate: 'OR', inputs: [0, 1],
      explain: 'OR menghasilkan 1 jika minimal satu input bernilai 1.' },
    { id: 'q06', type: 'output', topic: 'or', gate: 'OR', inputs: [0, 0],
      explain: 'OR hanya menghasilkan 0 jika semua inputnya 0.' },
    { id: 'q07', type: 'output', topic: 'not', gate: 'NOT', inputs: [1],
      explain: 'NOT selalu membalik nilai inputnya.' },
    { id: 'q08', type: 'identify', topic: 'and', gate: 'AND', text: 'Simbol gerbang di bawah ini adalah…',
      explain: 'AND: sisi kiri rata dan sisi kanan melengkung penuh.' },
    { id: 'q09', type: 'identify', topic: 'or', gate: 'OR', text: 'Simbol gerbang di bawah ini adalah…',
      explain: 'OR: bentuk seperti sirip dengan ujung runcing di kanan.' },
    { id: 'q10', type: 'identify', topic: 'not', gate: 'NOT', text: 'Simbol gerbang di bawah ini adalah…',
      explain: 'NOT: segitiga dengan bulatan kecil di ujung output (tanda pembalik).' },
    { id: 'q11', type: 'table', topic: 'or', gate: 'OR', text: 'Lengkapi kolom Y pada tabel kebenaran gerbang **OR**.',
      explain: 'Y bernilai 1 untuk semua baris kecuali baris yang kedua inputnya 0.' },
    { id: 'q12', type: 'mc', topic: 'tabel', text: 'Berapa baris tabel kebenaran untuk gerbang dengan **2 input**?',
      options: ['2 baris', '3 baris', '4 baris', '8 baris'], answer: 2,
      explain: 'n input menghasilkan 2ⁿ baris. Untuk 2 input: 2² = 4 baris.' },
    { id: 'q13', type: 'mc', topic: 'and', text: 'Gerbang mana yang outputnya 1 **hanya jika semua input bernilai 1**?',
      options: ['AND', 'OR', 'NOT', 'Semua gerbang'], answer: 0,
      explain: 'Itulah aturan gerbang AND.' },
    { id: 'q14', type: 'switches', topic: 'rangkaian', mode: 'series', states: [1, 0], text: 'Perhatikan rangkaian saklar seri berikut. Bagaimana keadaan lampunya?',
      explain: 'Saklar seri berperilaku seperti AND: lampu menyala hanya jika kedua saklar tertutup.' },
    { id: 'q15', type: 'switches', topic: 'rangkaian', mode: 'parallel', states: [0, 1], text: 'Perhatikan rangkaian saklar paralel berikut. Bagaimana keadaan lampunya?',
      explain: 'Saklar paralel berperilaku seperti OR: cukup satu saklar tertutup agar lampu menyala.' },
    { id: 'q16', type: 'circuit', topic: 'rangkaian', net: NAND, inputs: { A: 1, B: 1 }, text: 'Berapa output akhir (Y) rangkaian berikut? Hitung dari kiri ke kanan.',
      explain: 'Hitung gerbang AND lebih dulu, lalu balikkan hasilnya dengan NOT.' },
    { id: 'q17', type: 'circuit', topic: 'rangkaian', net: NOR, inputs: { A: 0, B: 0 }, text: 'Berapa output akhir (Y) rangkaian berikut? Hitung dari kiri ke kanan.',
      explain: 'Hitung gerbang OR lebih dulu, lalu balikkan hasilnya dengan NOT.' }
  ];
})();
