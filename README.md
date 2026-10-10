# After School: Beyond the Circuit

> Nama proyek sebelumnya: *SirkuitRahasia*. Kunci penyimpanan browser (`sirkuitrahasia.*`) sengaja **tidak** diganti agar progres pemain yang sudah tersimpan tidak hilang.

Novel visual edukasi (web, HTML + CSS + JavaScript murni) untuk belajar **Rangkaian Logika**: bilangan biner, gerbang AND / OR / NOT, tabel kebenaran, dan membaca rangkaian sederhana. Bahasa: Indonesia.

Bukan proyek Ren'Py. Tidak butuh server, database, login, atau layanan berbayar. Easy Ren'Py GUI hanya dipakai sebagai referensi visual.

## Menjalankan di komputer

**Tidak perlu server.** Klik dua kali `index.html` (Chrome, Edge, Firefox, Safari terbaru). Semua data (cerita, materi, soal) berupa berkas `.js` biasa, bukan `fetch` JSON, sehingga bisa dibuka langsung dari folder.

Opsional, bila ingin meniru kondisi hosting: di folder ini jalankan `python3 -m http.server 8000` lalu buka `http://localhost:8000`.

Cek otomatis (butuh Node.js, tanpa browser): `node tests/check.js`

## Alur game

Menu → **Cerita** (Bab 1) → materi → simulasi (3 kunci) → evaluasi akhir → hasil. Menu lain: **Materi**, **Simulasi** (bebas), **Latihan** (evaluasi), **Progres**, **Pengaturan**. Progres dan pengaturan disimpan di `localStorage` browser; "Lanjutkan" melanjutkan cerita dari baris terakhir. Tombol `Esc` / **Menu** di cerita membuka jeda. `Spasi`, `Enter`, `→`, klik, atau ketuk melanjutkan dialog.

## Struktur folder

```
index.html            kerangka halaman & urutan skrip
css/   main.css (dasar, menu, materi, evaluasi)  visual-novel.css (layar cerita)  simulation.css (simulator & diagram)
js/    util  logic (hitungan gerbang)  symbols (gambar SVG)  settings  progress  audio  sprites (cache sprite)
       dialogue (mesin cerita)  simulation  materials (penampil)  evaluation  main (navigasi)
data/  assets.js (karakter, ekspresi, latar, audio)  story.js  materials.js  questions.js
assets/ characters/<rena|pia|sera>/*.webp   backgrounds/*.webp   audio/bgm/*.mp3   audio/sfx/*.mp3   ASSET_MAP.md
tests/check.js
```

Urutan `<script>` di `index.html` penting (data dulu, `main.js` terakhir). Jika menambah berkas JS, daftarkan di sana.

## Mengedit dialog (`data/story.js`)

Cerita = kumpulan **adegan**; tiap adegan punya latar, musik, dan daftar `lines`. Bagian atas berkas itu menjelaskan semua kolom. Contoh satu adegan:

```js
s_contoh: { chapter: 'Bab 1', bg: 'hallway', bgm: 'peaceful', next: 'adegan_berikutnya',
  lines: [
    narr('Teks narasi tanpa nama.'),
    rena('smile', 'Halo!', { pos: 'left' }),       // karakter, ekspresi, teks, opsi
    pia('grin', 'Hai!', { pos: 'right', sfx: 'appear' }),
    kamu('Balasan pemain.'),
    { action: 'material', id: 'and' },             // buka materi
    { action: 'simulation', gate: 'AND', title: 'Kunci 1', task: { target: 1 } },
    { action: 'ask', who: 'sera', exp: 'normal', text: 'Pertanyaan?', options: ['A', 'B'], answer: 1,
      right: { exp: 'smile', text: 'Benar.' }, wrong: { exp: 'puzzled', text: 'Coba lagi.' } }
  ] }
```

- Adegan baru: tambahkan di `scenes`, lalu arahkan `next` adegan sebelumnya ke id-nya. Adegan terakhir memakai `next: null`.
- Setiap adegan memulai dari panggung kosong: tampilkan karakter lagi lewat `show: [{ id, exp, pos }]` atau cukup dengan baris bicara mereka.
- `**tebal**` dan `` `kode` `` bisa dipakai di teks. Pilihan jawaban `ask` boleh dicoba berulang sampai benar.
- Jalankan `node tests/check.js` setelah mengedit: ia memeriksa id adegan, latar, ekspresi, musik, dan efek yang salah ketik.

## Menambah / mengganti karakter dan ekspresi

1. Siapkan PNG transparan dengan ukuran kanvas sama untuk semua ekspresi satu karakter. Proyek ini memakai WebP yang sudah dipotong ke area karakter (satu potongan sama untuk semua ekspresi agar posisi wajah tidak bergeser).
2. Taruh di `assets/characters/<id>/<ekspresi>.webp` (nama ASCII, huruf kecil).
3. Di `data/assets.js` tambahkan nama ekspresi ke `expressions` karakter itu. Karakter baru: salin satu blok karakter, ubah `dir`, `color`, dan isi `ar` (lebar/tinggi gambar) serta `hf` (tinggi gambar asli ÷ tinggi kanvas asli).
4. Pakai di cerita: `rena('nama_ekspresi', '...')`.

Daftar ekspresi yang tersedia ada di `data/assets.js`; asal tiap nama ada di `assets/ASSET_MAP.md`.
**Berkedip tidak diterapkan:** set sprite yang diberikan berupa gambar utuh per ekspresi, tanpa lapisan mata terpisah, sehingga berkedip tidak bisa dibuat tanpa merusak wajah.

## Mengganti latar dan musik

- Latar: taruh `assets/backgrounds/nama.webp`, daftarkan di `SR.data.backgrounds` (`data/assets.js`), pakai `bg: 'nama'`.
- Musik latar: `assets/audio/bgm/nama.mp3`, daftarkan di `SR.data.audio.bgm`, pakai `bgm: 'nama'` (di adegan atau baris). `bgm: null` menghentikan musik. Suara latar (angin, dll.) lewat `amb: 'id_sfx'`.
- Efek suara: `assets/audio/sfx/nama.mp3`, daftarkan di `SR.data.audio.sfx`, pakai `sfx: 'nama'`. Suara klik/benar/salah diatur di `SR.data.audio.ui`.
- **Aturan audio:** efek suara dalam cerita dipakai hanya untuk kejadian yang tampak di layar (kemunculan karakter, reaksi, kunci terbuka, pintu). Suara latar berulang (`amb`) tersedia di mesin tetapi **tidak dipakai** secara bawaan, supaya tidak menutupi dialog; pakai hanya bila adegannya memang membutuhkannya. Efek yang sama tidak bertumpuk (dimulai ulang), dan klik UI ditahan bila ada efek lain yang baru saja mulai.
- Audio baru dimulai setelah klik/ketuk pertama (aturan browser). Musik berulang (loop) memakai MP3 sehingga mungkin ada jeda sangat singkat saat mengulang.

## Mengedit materi (`data/materials.js`)

Tiap materi berisi halaman; tiap halaman punya `say` (ucapan karakter) dan `blocks` (isi). Jenis blok: `p`, `list`, `callout`, `gate`, `table`, `compare`, `grid`, `bitdemo`, `switches`, `circuit`. Tabel kebenaran dihitung otomatis dari `js/logic.js`, jadi tidak perlu diketik dan tidak bisa salah. Jenis blok baru: tambahkan satu `case` di fungsi `block()` pada `js/materials.js`.

## Menambah soal (`data/questions.js`)

Tambahkan satu objek ke daftar. Jenis: `mc` (pilihan ganda; pilihan diacak saat tampil), `output` (tentukan output gerbang), `identify` (kenali simbol), `table` (isi tabel kebenaran), `switches` (saklar seri/paralel + lampu), `circuit` (rangkaian dua gerbang). Untuk semua jenis kecuali `mc`, **kunci jawaban dihitung otomatis** dari logika gerbang. Isi `topic` dengan id materi (`biner`, `and`, `or`, `not`, `tabel`, `rangkaian`) agar hasil per topik benar. Skor = jumlah soal benar (bobot opsional lewat `weight`). Jawaban tidak ditampilkan sebelum pemain menekan "Periksa jawaban".

## Menguji simulator

1. Buka **Simulasi** dari menu, pilih AND / OR / NOT.
2. Ketuk saklar A dan B. LED, rumus (mis. `1 AND 0 = 0`), dan baris tabel (▶) harus selalu cocok.
3. Harapan: AND → 1 hanya pada 1,1. OR → 0 hanya pada 0,0. NOT → membalik.
4. Perhitungan murni ada di `js/logic.js` dan diuji oleh `node tests/check.js`; tampilan ada di `js/simulation.js`.

## Menyiapkan untuk GitHub (manual)

1. **Baca dulu `LICENSES_AND_ATTRIBUTION.md`.** Izin redistribusi hampir semua aset (karakter, latar, musik, efek suara) belum terbukti. Putuskan berkas mana yang boleh publik; folder `assets/` bisa ditahan.
2. Unggah isi folder proyek (bukan folder pembungkusnya) ke repositori. Gunakan huruf besar/kecil nama berkas persis seperti sekarang (GitHub Pages peka huruf besar/kecil).
3. Semua path bersifat relatif, jadi bisa ditaruh di akar repositori atau subfolder.
4. Ukuran proyek sekitar 32 MB; masing-masing berkas jauh di bawah batas 100 MB GitHub.

## Batasan yang diketahui

- Isi Bab 1 (cerita, materi, soal) **ditulis baru** untuk versi web; berkas cerita Ren'Py sebelumnya tidak ikut diunggah ke percakapan ini.
- Hanya satu bab. NAND/NOR/XOR/XNOR belum ada (di rangkaian gabungan, NOT setelah AND/OR hanya dipakai sebagai latihan membaca).
- Font memakai daftar font sistem (tanpa berkas font), jadi tampilan huruf berbeda tiap perangkat.
- Pengujian browser dilakukan di Chromium desktop dan viewport ponsel; **belum** diuji di Safari/iOS, Firefox, atau perangkat sentuh asli, dan suara hanya diuji secara teknis (tidak didengarkan).
