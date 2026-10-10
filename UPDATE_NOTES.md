# Update: After School: Beyond the Circuit

Berisi HANYA file yang berubah. File lain (aset, css/visual-novel.css, css/simulation.css, js lain, data cerita/materi/soal) tidak disertakan dan JANGAN dihapus.

## Diubah (9 file), tidak ada yang ditambah atau dihapus
| File | Alasan |
|---|---|
| index.html | Judul tab, meta description/og, judul menu: nama resmi baru |
| css/main.css | Gaya judul menu; potret persegi besar; tata letak halaman Materi; tabel lebar bisa digulir; perbaikan menu layar pendek |
| js/util.js | Fungsi bersama `SR.Util.portrait` (satu cara menampilkan potret untuk semua karakter) |
| js/materials.js | Memakai fungsi potret bersama; tabel dibungkus agar tidak melebarkan halaman |
| js/evaluation.js, js/main.js | Potret umpan balik & hasil memakai fungsi bersama |
| data/assets.js | Menambah `portrait` (jendela wajah) pada tiap karakter. Sprite, ekspresi, latar, audio tidak berubah |
| README.md, LICENSES_AND_ATTRIBUTION.md | Nama proyek; kredit dan lisensi tidak diubah |

## Sengaja tidak diubah
- Nama folder/repo, path aset, dan kunci simpanan browser `sirkuitrahasia.*` (agar progres pemain tersimpan tidak hilang).

## Menerapkan dengan GitHub Desktop
1. Ekstrak ZIP ini, lalu salin isinya ke folder repository lokal. Pilih "Replace / Timpa" saat ditanya. Jangan hapus file lain.
2. Buka GitHub Desktop; daftar Changes harus berisi 9 file di atas.
3. Isi Summary (mis. "Ganti nama proyek, perbesar potret materi"), klik Commit to main, lalu Push origin.
4. GitHub Pages akan memublikasikan ulang sekitar 1-2 menit. Muat ulang dengan Ctrl+F5 bila tampilan lama masih muncul.
