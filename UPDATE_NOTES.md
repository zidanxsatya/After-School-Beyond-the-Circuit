# Update polish — After School: Beyond the Circuit

Berisi HANYA file yang berubah (13). Aset (gambar/audio), `css/simulation.css`, `js/` lain, `data/questions.js`, dan `tests/` tidak disertakan dan JANGAN dihapus.
Update ini dibuat di atas versi yang sudah memuat update portrait/penggantian nama sebelumnya.

## Ditambah (1)
- js/sprites.js — cache sprite (maks. 16 gambar) + pemanasan (preload) sprite/latar yang segera dipakai.

## Diubah (12)
| File | Alasan |
|---|---|
| index.html | Memuat `js/sprites.js` (harus sebelum `js/dialogue.js`; sudah diatur) |
| js/dialogue.js | Ganti ekspresi dari cache, preload 4 baris ke depan + adegan berikutnya, jeda ketuk 220→160 ms, transisi adegan lebih singkat, suara transisi hanya saat tempat berganti |
| js/materials.js | Hanya halaman & navigasi yang digambar ulang (tab tidak), potret halaman sebelum/sesudahnya dipanaskan |
| js/audio.js | Satu elemen Audio per efek dipakai ulang (bukan `new Audio` tiap putar), efek sama tidak bertumpuk, klik UI ditahan saat ada efek lain, efek UI dipanaskan |
| js/main.js | Simpanan checkpoint ditulis di luar jalur render; tombol "Periksa jawaban" tidak lagi memutar klik + benar/salah bersamaan |
| js/evaluation.js | Komentar singkat karakter pada pembahasan jawaban (gaya Rena/Pia/Sera) |
| css/visual-novel.css | Sprite digeser dengan `transform` (bukan `left`), tanpa transisi/drop-shadow `filter`, tanpa `backdrop-filter` pada kotak dialog |
| css/main.css | Latar panel diberi lapisan GPU sendiri (penyebab lag terbesar di Materi); gaya `.quip` |
| data/story.js | Dialog Rena ditulis ulang; identitas siswi (Pia: anggota Klub Pos, bukan kurir sungguhan); SFX lingkungan dikurangi |
| data/materials.js | Penjelasan Rena pada 4 halaman materi |
| data/assets.js | `ui.unlock` memakai `twinkle` (sebelumnya `door_open`, yang kini hanya untuk pintu di cerita) |
| README.md | Struktur & aturan audio |

## Tidak dihapus: tidak ada file yang dihapus. Aset, alur cerita, soal, dan kunci jawaban tidak berubah.

## Menerapkan dengan GitHub Desktop
1. Ekstrak ZIP, salin isinya ke folder repository lokal, timpa file yang sama (jangan hapus file lain).
2. Di GitHub Desktop, tab Changes harus berisi 13 file (1 baru, 12 diubah).
3. Commit (mis. "Polish: performa dialog, dialog Rena, audio"), lalu Push origin.
4. Setelah Pages terbit (1–2 menit), muat ulang dengan Ctrl+F5 agar berkas lama tidak tertahan di cache browser.
