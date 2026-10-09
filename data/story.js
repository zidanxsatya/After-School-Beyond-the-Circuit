// CERITA — Bab 1: "Surat Tanpa Pengirim". Edit dialog di sini; mesin dialog ada di js/dialogue.js.
//
// Satu baris dialog (objek) dapat berisi:
//   who   : 'rena' | 'pia' | 'sera' | 'kamu'  (tanpa who = narasi)
//   text  : isi teks. **tebal** dan `kode` didukung
//   exp   : ekspresi (nama file di assets/characters/<id>/, tanpa .webp; daftar ada di data/assets.js)
//   pos   : 'left' | 'center' | 'right'  (posisi karakter; bertahan sampai diubah)
//   show  : [{ id:'pia', exp:'smile', pos:'right' }]  menampilkan / memindahkan karakter tanpa bicara
//   hide  : ['pia']  menyembunyikan karakter
//   bg, bgm, amb, sfx : ganti latar / musik / suara latar (null = hentikan) / efek suara
// Baris interaksi (pakai action):
//   { action:'material', id }                        buka materi, lalu lanjut cerita
//   { action:'simulation', gate, task, title }       simulator dengan tugas; lanjut setelah tugas selesai
//   { action:'ask', who, exp, text, options, answer, right:{exp,text}, wrong:{exp,text} }   pertanyaan singkat
//   { action:'evaluation' }                          mulai evaluasi akhir, lalu layar hasil
// Adegan: { chapter, bg, bgm, amb, card, next, lines:[...] }   next = id adegan berikutnya.
(function () {
  const SR = window.SR = window.SR || {};
  SR.data = SR.data || {};

  // Pembantu penulisan agar dialog ringkas: rena('exp', 'teks', { pos:'left' })
  const say = who => (exp, text, extra) => Object.assign({ who, exp, text }, extra);
  const rena = say('rena'), pia = say('pia'), sera = say('sera');
  const kamu = text => ({ who: 'kamu', text });
  const narr = (text, extra) => Object.assign({ text }, extra);
  const CH = 'Bab 1 · Surat Tanpa Pengirim';

  SR.data.story = {
    start: 's1_gerbang',
    scenes: {

      /* ---------- 1. Gerbang sekolah ---------- */
      s1_gerbang: {
        chapter: CH, bg: 'school_entrance', bgm: 'morning', amb: 'ambient_wind', next: 's2_koridor',
        card: { top: 'Bab 1', title: 'Surat Tanpa Pengirim' },
        lines: [
          narr('Pagi di SMK Nusa Teknik. Gerbang sekolah masih lengang, tetapi seseorang sudah berdiri gelisah di depannya.'),
          rena('thinking', 'Kurir sekolah biasanya tiba tepat jam enam lewat lima belas. Sekarang sudah lewat tiga menit… mencurigakan.', { pos: 'left' }),
          pia('oops', 'Maaf, maaf, maaf! Aku nyasar lewat gang belakang!', { pos: 'right', sfx: 'walk_shoes' }),
          rena('smile', 'Pia! Untung kamu datang. Ada kiriman untuk klub detektif?'),
          pia('confused', 'Justru itu masalahnya. Ada satu surat yang aneh. Tidak ada nama pengirim. Alamatnya cuma tertulis "Sekolah".'),
          pia('troubled', 'Di amplopnya ada tulisan: "Untuk siapa pun yang bisa membaca 0 dan 1". Aku kurir, bukan ahli sandi!'),
          rena('cheerful', 'Surat tanpa pengirim dengan pesan sandi? Ini kasus yang pantas kami tangani!', { sfx: 'idea' }),
          rena('teasing', 'Kamu ikut menyelidiki, kan? Aku butuh partner yang teliti.'),
          kamu('Tentu. Ayo kita lihat isi suratnya.'),
          pia('normal2', 'Isinya cuma dua kalimat: "Pintu Ruang Lab Elektronika terbuka bagi yang memahami gerbang logika. Ada tiga kunci."'),
          pia('wry', 'Ruang lab itu ada di lantai dua, dan katanya sudah lama terkunci.'),
          rena('confident', 'Kita ke sana sekarang. Pia, kamu ikut!'),
          pia('wry2', 'Eh, aku kan masih harus mengantar… ya sudahlah, sebentar saja!')
        ]
      },

      /* ---------- 2. Koridor: pertemuan dengan Sera + materi biner ---------- */
      s2_koridor: {
        chapter: CH, bg: 'hallway', bgm: 'looking_wonderful', amb: null, next: 's3_kelas',
        lines: [
          narr('Di ujung koridor lantai dua ada pintu tua bertuliskan LAB ELEKTRONIKA. Di sampingnya menempel panel kecil dengan tiga lampu LED dan beberapa saklar.', { sfx: 'walk_hallway' }),
          rena('serious', 'Itu dia. Tiga lampu, tiga kunci. Cocok dengan isi surat.', { pos: 'left' }),
          pia('confused2', 'Saklarnya cuma punya dua posisi, atas dan bawah. Kalau kutekan semua, pasti terbuka kan?', { pos: 'right' }),
          rena('flustered', 'Jangan asal tekan!'),
          sera('cold', 'Kalau kamu menekan sembarangan, panel itu terkunci selama sepuluh menit.', { show: [{ id: 'pia', pos: 'center' }], pos: 'right', sfx: 'appear' }),
          pia('surprised', 'Waaa! Dari mana kamu muncul?!', { sfx: 'surprise' }),
          sera('normal', 'Aku Sera, ketua Klub Elektronika. Ruangan itu wilayah klub kami, dan panelnya bukan mainan.'),
          rena('thinking', 'Kami menerima surat ini. Katanya hanya yang paham gerbang logika yang bisa membuka pintunya.'),
          sera('hmm', 'Surat itu…', { sfx: 'blink' }),
          sera('normal2', 'Hm. Tidak apa-apa. Kalau kalian sungguh ingin masuk, pelajari dasarnya dulu. Tidak ada gunanya mengutak-atik panel tanpa paham apa yang kalian lakukan.'),
          sera('normal', 'Mulai dari yang paling dasar: bilangan biner. Dengarkan baik-baik.'),
          { action: 'material', id: 'biner' },
          sera('smile', 'Sudah jelas? Satu bit hanya boleh 0 atau 1. Sekarang buktikan dulu.'),
          { action: 'ask', who: 'sera', exp: 'normal', text: 'Salah satu LED di panel itu sedang menyala. Bit berapa yang diwakilinya?',
            options: ['Bit 0', 'Bit 1'], answer: 1,
            right: { exp: 'smile2', text: 'Tepat. Menyala berarti 1 (HIGH), padam berarti 0 (LOW).' },
            wrong: { exp: 'puzzled', text: 'Ingat tabel tadi: lampu menyala itu HIGH. Coba pikirkan lagi.' } },
          pia('sparkle', 'Oh, jadi lampu itu seperti saklar yang bisa "bicara" pakai angka!'),
          rena('smile', 'Cara berpikir yang bagus, Pia.'),
          sera('normal', 'Kunci pertama memakai gerbang AND. Ikut aku ke kelas.')
        ]
      },

      /* ---------- 3. Kelas: AND ---------- */
      s3_kelas: {
        chapter: CH, bg: 'classroom_front', bgm: 'peaceful', next: 's3b_kunci1',
        lines: [
          narr('Sera membawa mereka ke ruang kelas yang kosong. Ia berdiri di depan papan tulis.'),
          sera('normal', 'Gerbang AND punya dua input dan satu output. Bayangkan Pia mengantar surat penting.', { pos: 'right', show: [{ id: 'rena', pos: 'left', exp: 'normal' }] }),
          pia('smile2', 'Aku?', { pos: 'center' }),
          sera('normal2', 'Aturannya: surat resmi hanya boleh dikirim bila ditandatangani Rena **dan** guru. Satu tanda tangan saja tidak cukup.'),
          rena('thinking', 'Jadi kalau aku sudah tanda tangan, tapi guru belum…'),
          sera('smile', 'Surat tidak dikirim. Outputnya 0. Sekarang pelajari aturan lengkapnya.'),
          { action: 'material', id: 'and' },
          { action: 'ask', who: 'sera', exp: 'normal', text: 'Rena sudah tanda tangan, guru belum. Apakah Pia mengirim surat itu?',
            options: ['Ya, surat dikirim', 'Tidak, surat tertahan'], answer: 1,
            right: { exp: 'smile', text: 'Benar. Satu input 0 saja membuat output AND menjadi 0.' },
            wrong: { exp: 'puzzled2', text: 'Ingat aturan AND: semua input harus 1. Coba lagi.' } },
          rena('confident', 'Berarti kunci pertama pasti begini: dua saklar, dan lampunya hanya menyala jika keduanya aktif!'),
          sera('normal', 'Buktikan di panelnya. Kembali ke koridor.')
        ]
      },
      s3b_kunci1: {
        chapter: CH, bg: 'hallway', bgm: 'lively_time', next: 's4_perpus',
        lines: [
          narr('Kembali di depan panel. Lampu pertama berlabel **AND**. Dua saklar menunggu untuk diatur.', { sfx: 'walk_hallway' }),
          rena('serious', 'Coba semua kombinasinya dulu, baru kita nyalakan lampunya.', { pos: 'left' }),
          { action: 'simulation', gate: 'AND', title: 'Kunci 1 · Gerbang AND', task: { target: 1 } },
          narr('Klik! Lampu pertama menyala dan terdengar bunyi kunci terbuka.', { sfx: 'power_up' }),
          rena('cheerful', 'Satu kunci terbuka!'),
          pia('sparkle', 'Dua saklar harus aktif bersamaan… seperti mesin press di bengkel itu!', { pos: 'right' }),
          sera('smile2', 'Dua kunci lagi. Pia, kamu tadi bilang tahu tempat yang tenang?', { pos: 'center' }),
          pia('grin', 'Perpustakaan! Ayo!')
        ]
      },

      /* ---------- 4. Perpustakaan: OR ---------- */
      s4_perpus: {
        chapter: CH, bg: 'library', bgm: 'lively_time', next: 's4b_kunci2',
        lines: [
          narr('Pia membawa mereka ke perpustakaan. Suasananya sepi dan nyaman.'),
          pia('smile', 'Di sini ada Pak Penjaga yang menyimpan titipan surat. Surat boleh diambil Rena **atau** Sera. Siapa pun boleh!', { pos: 'right', show: [{ id: 'rena', pos: 'left', exp: 'normal' }, { id: 'sera', pos: 'center', exp: 'normal' }] }),
          sera('normal2', 'Itu contoh gerbang OR. Cukup salah satu yang datang, urusannya selesai.'),
          rena('thinking', 'Kalau dua-duanya datang?'),
          sera('smile', 'Tetap berhasil. OR hanya gagal jika tidak ada satu pun yang datang. Sekarang aturan lengkapnya.'),
          { action: 'material', id: 'or' },
          { action: 'ask', who: 'pia', exp: 'normal', text: 'Rena tidak datang, tapi Sera datang mengambil surat. Apakah suratnya berhasil diambil?',
            options: ['Ya, berhasil', 'Tidak, gagal'], answer: 0,
            right: { exp: 'sparkle', text: 'Betul! Pada OR, satu saja sudah cukup.' },
            wrong: { exp: 'troubled', text: 'Eh, ingat OR itu salah satu cukup. Coba lagi!' } },
          rena('smug', 'Jadi kunci kedua: lampu menyala kalau minimal satu saklar aktif.'),
          sera('normal', 'Betul. Kembali ke panel.')
        ]
      },
      s4b_kunci2: {
        chapter: CH, bg: 'hallway', bgm: 'lively_time', next: 's5_halaman',
        lines: [
          narr('Lampu kedua berlabel **OR**.', { sfx: 'walk_hallway' }),
          { action: 'simulation', gate: 'OR', title: 'Kunci 2 · Gerbang OR', task: { target: 1 } },
          narr('Klik! Lampu kedua menyala.', { sfx: 'power_up' }),
          pia('surprised', 'Ketika dua-duanya aktif lampunya tetap menyala. Aku sempat mengira bakal mati!', { pos: 'right', show: [{ id: 'rena', pos: 'left', exp: 'normal' }, { id: 'sera', pos: 'center', exp: 'normal' }] }),
          sera('smile2', 'Itu kesalahan yang umum. OR bukan "salah satu saja", melainkan "minimal satu".'),
          rena('confident', 'Tinggal satu kunci.')
        ]
      },

      /* ---------- 5. Halaman: NOT ---------- */
      s5_halaman: {
        chapter: CH, bg: 'school_ground', bgm: 'evening_road', amb: 'ambient_wind', next: 's5b_kunci3',
        lines: [
          narr('Mereka melintasi halaman sekolah. Di dekat tiang, sebuah lampu masih menyala.'),
          rena('serious', 'Lampu di tiang itu menyala padahal matahari sudah terang. Rusak, ya?', { pos: 'left' }),
          sera('normal', 'Mungkin tidak rusak. Lampu itu memakai sensor cahaya dan sebuah gerbang NOT.', { pos: 'right' }),
          pia('confused', 'NOT itu… "bukan"?', { pos: 'center' }),
          sera('smile', 'Ya, membalik. Sensor terang memberi 1, lampu justru dibuat padam (0). Sensor gelap memberi 0, lampu menyala (1). Pelajari lebih rinci.'),
          { action: 'material', id: 'not' },
          { action: 'ask', who: 'sera', exp: 'normal', text: 'Sensor cahaya membaca 0 karena hari gelap. Apa output gerbang NOT, yaitu keadaan lampunya?',
            options: ['0, lampu padam', '1, lampu menyala'], answer: 1,
            right: { exp: 'smile', text: 'Tepat. Input 0 dibalik menjadi 1.' },
            wrong: { exp: 'puzzled', text: 'NOT membalik. Kalau inputnya 0, hasilnya apa?' } },
          rena('thinking', 'Mungkin sensornya tertutup daun, jadi dikiranya gelap. Nanti kita laporkan ke petugas sekolah.', { sfx: 'idea' }),
          sera('normal2', 'Sekarang kunci ketiga.')
        ]
      },
      s5b_kunci3: {
        chapter: CH, bg: 'hallway', bgm: 'wonderful_happening', next: 's6_gabungan',
        lines: [
          narr('Lampu ketiga berlabel **NOT**. Kali ini hanya ada satu saklar.', { sfx: 'walk_hallway' }),
          { action: 'simulation', gate: 'NOT', title: 'Kunci 3 · Gerbang NOT', task: { target: 1 } },
          narr('Klik! Lampu ketiga menyala. Ketiga lampu LED kini bersinar.', { sfx: 'power_up' }),
          pia('sparkle', 'Tiga-tiganya menyala! Pintunya terbuka?', { pos: 'right', show: [{ id: 'rena', pos: 'left', exp: 'normal' }, { id: 'sera', pos: 'center', exp: 'normal' }] }),
          sera('normal', 'Belum. Ada satu pengaman tambahan.')
        ]
      },

      /* ---------- 6. Rangkaian gabungan ---------- */
      s6_gabungan: {
        chapter: CH, bg: 'hallway', bgm: 'wonderful_happening', next: 's7_lab',
        lines: [
          sera('normal', 'Sebelum pintu terakhir, rangkum dulu apa yang sudah kalian lihat. Semua gerbang tadi bisa ditulis dalam tabel kebenaran.', { pos: 'center' }),
          rena('thinking', 'Tabel yang mendaftar semua kemungkinan input dan outputnya, kan?', { pos: 'left' }),
          sera('smile', 'Betul. Perhatikan cara menyusun dan membacanya.'),
          { action: 'material', id: 'tabel' },
          sera('normal', 'Satu hal lagi. Rangkaian nyata jarang memakai satu gerbang saja. Output satu gerbang sering jadi input gerbang berikutnya.'),
          rena('thinking', 'Jadi kita harus menghitung dari kiri ke kanan?', { pos: 'left' }),
          sera('smile2', 'Betul. Pelajari caranya.'),
          { action: 'material', id: 'rangkaian' },
          narr('Rena membaca rangkaian di panel dengan teliti, lalu menurunkan satu saklar.', { sfx: 'switch' }),
          narr('Pintu Lab Elektronika terbuka perlahan.', { sfx: 'door_open' }),
          pia('surprised', 'Terbuka!', { pos: 'right', sfx: 'surprise' }),
          rena('cheerful', 'Kasus selesai!'),
          sera('smile2', 'Belum. Aku yang menulis surat itu.', { sfx: 'kiran' }),
          pia('confused2', 'Hah?! Jadi aku mengantar surat dari orang yang berdiri di belakangku sepanjang pagi?!', { sfx: 'tsukkomi1' }),
          sera('wry', 'Klub Elektronika kekurangan anggota. Aku mencari orang yang mau belajar, bukan yang sekadar menekan tombol.'),
          rena('smug', 'Dan kamu menguji kami dengan gerbang logika.'),
          sera('smile', 'Satu ujian lagi di dalam. Panel evaluasi akhir. Masuklah.')
        ]
      },

      /* ---------- 7. Lab: evaluasi ---------- */
      s7_lab: {
        chapter: CH, bg: 'classroom_back', bgm: 'happy_days', next: null,
        lines: [
          narr('Di dalam, Ruang Lab Elektronika dipenuhi papan rangkaian dan kabel yang tertata rapi.', { sfx: 'door_close' }),
          sera('normal', 'Jawab pertanyaan di panel itu. Tidak ada hukuman, hanya penilaian.', { pos: 'right', show: [{ id: 'rena', pos: 'left', exp: 'normal' }, { id: 'pia', pos: 'center', exp: 'normal' }] }),
          pia('grin', 'Semangat! Aku mendukung dari belakang!'),
          rena('confident', 'Kita mulai.'),
          { action: 'evaluation' }
        ]
      }
    }
  };
})();
