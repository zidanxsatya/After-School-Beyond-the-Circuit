// MATERI PEMBELAJARAN — edit teks di sini tanpa menyentuh kode tampilan.
// Satu materi: { id, title, short, who, pages:[ { title, who?, exp?, say, blocks:[...] } ] }
//   say    = kalimat penjelasan karakter di samping halaman
//   blocks = p | list | callout | gate | table | compare | grid | bitdemo | switches | circuit
// Tabel kebenaran (blok "table"/"compare") dihitung otomatis dari SR.Logic, jadi tidak bisa salah ketik.
// id materi (biner, and, or, not, tabel, rangkaian) juga dipakai sebagai "topic" pada data/questions.js.
(function () {
  const SR = window.SR = window.SR || {};
  SR.data = SR.data || {};

  SR.data.materials = [
    {
      id: 'biner', short: 'Biner', title: 'Bilangan Biner: 0 dan 1', who: 'sera',
      pages: [
        { title: 'Dunia yang hanya punya dua keadaan', exp: 'normal',
          say: 'Rangkaian digital tidak mengenal "agak menyala". Hanya ada dua keadaan: ada sinyal, atau tidak ada sinyal.',
          blocks: [
            { t: 'p', text: 'Satu angka biner disebut **bit**. Sebuah bit hanya boleh bernilai **0** atau **1**.' },
            { t: 'bitdemo' },
            { t: 'callout', kind: 'tip', text: 'Coba tekan tombolnya. Saklar, lampu, dan angka selalu berubah bersamaan.' }
          ] },
        { title: 'Satu bit, banyak sebutan', exp: 'smile',
          say: 'Buku, datasheet, dan teman sekelasmu mungkin memakai sebutan berbeda. Maknanya sama.',
          blocks: [
            { t: 'grid', head: ['Bit', 'Tegangan', 'Saklar', 'Lampu / LED', 'Logika'], rows: [['0', 'LOW (rendah)', 'OFF / terbuka', 'Padam', 'Salah (False)'], ['1', 'HIGH (tinggi)', 'ON / tertutup', 'Menyala', 'Benar (True)']] },
            { t: 'p', text: 'Di bab ini, **1 = aktif (menyala)** dan **0 = tidak aktif (padam)**.' }
          ] }
      ]
    },
    {
      id: 'and', short: 'AND', title: 'Gerbang AND', who: 'sera',
      pages: [
        { title: 'Aturan AND: semua harus 1', exp: 'normal',
          say: 'AND artinya "dan". Output baru menyala kalau input pertama DAN input kedua sama-sama menyala.',
          blocks: [
            { t: 'p', text: 'Gerbang **AND** punya dua input (A dan B) dan satu output (Y).' },
            { t: 'callout', kind: 'rule', text: '**Y = 1 hanya jika A = 1 dan B = 1.** Selain itu, Y = 0.' }
          ] },
        { title: 'Simbol dan tabel kebenaran AND', exp: 'smile2',
          say: 'Hafalkan bentuknya: sisi kiri rata, sisi kanan melengkung. Lalu baca tabelnya baris demi baris.',
          blocks: [
            { t: 'gate', gate: 'AND', caption: 'Simbol AND. Ditulis: **Y = A · B** (atau A AND B).' },
            { t: 'table', gate: 'AND', caption: 'Hanya satu baris yang menghasilkan 1.' }
          ] },
        { title: 'Analogi: saklar seri', who: 'rena', exp: 'thinking',
          say: 'Bayangkan dua saklar disambung berderet ke satu lampu. Arus hanya lewat kalau keduanya tertutup!',
          blocks: [
            { t: 'switches', mode: 'series', caption: 'Dua saklar **seri** = AND. Ketuk saklar untuk membuka/menutup.' }
          ] },
        { title: 'Contoh di dunia nyata', who: 'pia', exp: 'sparkle',
          say: 'Aku pernah lihat mesin press di bengkel. Tangan harus menekan dua tombol sekaligus, jadi aman!',
          blocks: [
            { t: 'p', text: '**Kontrol dua tangan pada mesin press:** mesin (Y) hanya bekerja jika tombol kiri (A) **dan** tombol kanan (B) ditekan. Dengan begitu kedua tangan operator pasti jauh dari area bahaya.' },
            { t: 'p', text: '**Pengiriman surat:** surat dikirim hanya jika sudah ditandatangani Rena **dan** guru.' }
          ] }
      ]
    },
    {
      id: 'or', short: 'OR', title: 'Gerbang OR', who: 'sera',
      pages: [
        { title: 'Aturan OR: salah satu cukup', exp: 'normal2',
          say: 'OR artinya "atau". Output menyala kalau minimal satu input menyala. Dua-duanya menyala pun tetap menyala.',
          blocks: [
            { t: 'p', text: 'Gerbang **OR** juga punya dua input (A, B) dan satu output (Y).' },
            { t: 'callout', kind: 'rule', text: '**Y = 1 jika A = 1 atau B = 1 (atau keduanya).** Y = 0 hanya jika A dan B sama-sama 0.' }
          ] },
        { title: 'Simbol dan tabel kebenaran OR', exp: 'smile',
          say: 'Bandingkan dengan AND. Bentuk OR melengkung di kedua sisi seperti sirip.',
          blocks: [
            { t: 'gate', gate: 'OR', caption: 'Simbol OR. Ditulis: **Y = A + B** (tanda + di sini berarti "atau", bukan penjumlahan biasa).' },
            { t: 'table', gate: 'OR', caption: 'Hanya satu baris yang menghasilkan 0.' }
          ] },
        { title: 'Analogi: saklar paralel', who: 'rena', exp: 'confident',
          say: 'Sekarang dua saklar dipasang bercabang. Cukup satu jalan terbuka, arus sudah sampai ke lampu.',
          blocks: [
            { t: 'switches', mode: 'parallel', caption: 'Dua saklar **paralel** = OR. Ketuk saklar untuk membuka/menutup.' }
          ] },
        { title: 'Contoh di dunia nyata', who: 'pia', exp: 'surprised',
          say: 'Alarm kebakaran di gedung sekolah! Asap saja sudah cukup bikin alarm bunyi, panas saja juga.',
          blocks: [
            { t: 'p', text: '**Alarm kebakaran:** alarm (Y) berbunyi jika sensor asap (A) **atau** sensor panas (B) aktif.' },
            { t: 'p', text: '**Penerimaan surat:** surat boleh diterima Rena **atau** Sera.' }
          ] }
      ]
    },
    {
      id: 'not', short: 'NOT', title: 'Gerbang NOT (Inverter)', who: 'sera',
      pages: [
        { title: 'Aturan NOT: dibalik', exp: 'normal',
          say: 'NOT hanya punya satu input. Tugasnya sederhana: membalik. Masuk 1 keluar 0, masuk 0 keluar 1.',
          blocks: [
            { t: 'callout', kind: 'rule', text: '**Y = kebalikan dari A.** Jika A = 1 maka Y = 0. Jika A = 0 maka Y = 1.' },
            { t: 'p', text: 'Karena membalik sinyal, NOT juga disebut **inverter**.' }
          ] },
        { title: 'Simbol dan tabel kebenaran NOT', exp: 'smile2',
          say: 'Segitiga dengan bulatan kecil di ujung. Bulatan itu tanda pembalikan, jangan sampai terlewat.',
          blocks: [
            { t: 'gate', gate: 'NOT', caption: 'Simbol NOT. Ditulis: **Y = Ā** (A dengan garis di atas) atau NOT A.' },
            { t: 'table', gate: 'NOT', caption: 'Hanya dua baris, karena hanya ada satu input.' }
          ] },
        { title: 'Contoh di dunia nyata', who: 'pia', exp: 'smile',
          say: 'Lampu jalan di dekat sekolah menyala sendiri kalau hari gelap. Itu NOT, lho!',
          blocks: [
            { t: 'p', text: '**Lampu jalan otomatis:** sensor cahaya memberi 1 saat terang dan 0 saat gelap. Lampu = NOT (sensor).' },
            { t: 'grid', head: ['Sensor cahaya (A)', 'Keadaan', 'Lampu (Y)'], rows: [['1', 'Terang', '0 (padam)'], ['0', 'Gelap', '1 (menyala)']] }
          ] }
      ]
    },
    {
      id: 'tabel', short: 'Tabel Kebenaran', title: 'Tabel Kebenaran', who: 'sera',
      pages: [
        { title: 'Apa itu tabel kebenaran?', exp: 'normal',
          say: 'Tabel kebenaran mendaftar semua kemungkinan input beserta output-nya. Tidak ada yang boleh terlewat.',
          blocks: [
            { t: 'p', text: 'Setiap baris adalah satu kombinasi input. Kolom paling kanan (Y) adalah hasil gerbang untuk kombinasi itu.' },
            { t: 'grid', head: ['Jumlah input', 'Jumlah baris'], rows: [['1 input', '2 baris'], ['2 input', '4 baris'], ['3 input', '8 baris']] },
            { t: 'callout', kind: 'tip', text: 'Rumusnya: n input → **2ⁿ** baris.' }
          ] },
        { title: 'Urutan baris: berhitung biner', exp: 'smile',
          say: 'Supaya tidak ada kombinasi yang terlewat, tulis input dengan urutan berhitung biner: 00, 01, 10, 11.',
          blocks: [
            { t: 'compare', gates: ['AND', 'OR'], caption: 'Input yang sama, dua gerbang berbeda. Bandingkan kolom AND dan OR di tiap baris.' },
            { t: 'p', text: 'Membaca tabel: pilih satu baris, lihat nilai A dan B, lalu baca Y di kolom gerbang yang dimaksud.' }
          ] },
        { title: 'Hubungan input dan output', who: 'rena', exp: 'thinking',
          say: 'Intinya: output tidak acak. Untuk input yang sama, gerbang yang sama selalu memberi output yang sama.',
          blocks: [
            { t: 'list', items: ['**AND**: output 1 hanya jika **semua** input 1.', '**OR**: output 1 jika **minimal satu** input 1.', '**NOT**: output adalah **kebalikan** input.'] },
            { t: 'callout', kind: 'tip', text: 'Ragu pada suatu jawaban? Tulis tabelnya, lalu cari barisnya.' }
          ] }
      ]
    },
    {
      id: 'rangkaian', short: 'Membaca Rangkaian', title: 'Membaca Rangkaian Sederhana', who: 'sera',
      pages: [
        { title: 'Output satu gerbang jadi input gerbang lain', exp: 'normal',
          say: 'Rangkaian sungguhan jarang memakai satu gerbang saja. Kabelnya disambung dari gerbang ke gerbang.',
          blocks: [
            { t: 'p', text: 'Cara membacanya: mulai dari **kiri**, hitung gerbang pertama, lalu pakai hasilnya untuk gerbang berikutnya. Teruskan sampai output akhir (Y).' },
            { t: 'circuit', net: { inputs: ['A', 'B'], gates: [{ id: 'g1', type: 'AND', in: ['A', 'B'] }, { id: 'g2', type: 'NOT', in: ['g1'] }], out: 'g2' }, inputs: { A: 1, B: 1 },
              caption: 'Contoh: A = 1 dan B = 1 masuk ke AND (hasil 1), lalu dibalik oleh NOT menjadi 0.' }
          ] },
        { title: 'Latihan membaca satu rangkaian lagi', who: 'rena', exp: 'confident',
          say: 'Tidak ada trik rahasia. Hitung gerbang demi gerbang, dan tuliskan hasil antaranya.',
          blocks: [
            { t: 'circuit', net: { inputs: ['A', 'B'], gates: [{ id: 'g1', type: 'OR', in: ['A', 'B'] }, { id: 'g2', type: 'NOT', in: ['g1'] }], out: 'g2' }, inputs: { A: 0, B: 0 },
              caption: 'A = 0, B = 0 → OR menghasilkan 0 → NOT membaliknya menjadi 1.' }
          ] },
        { title: 'Rangkaian saklar dan lampu', who: 'pia', exp: 'smile2',
          say: 'Rangkaian saklar yang tadi juga termasuk. Seri berperilaku seperti AND, paralel seperti OR.',
          blocks: [
            { t: 'grid', head: ['Susunan saklar', 'Gerbang yang setara', 'Lampu menyala jika'], rows: [['Seri', 'AND', 'kedua saklar tertutup'], ['Paralel', 'OR', 'minimal satu saklar tertutup']] }
          ] }
      ]
    }
  ];
})();
