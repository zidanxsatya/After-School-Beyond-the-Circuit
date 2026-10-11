# Update angin halus pada rambut — After School: Beyond the Circuit

Berisi HANYA file yang berubah/bertambah (6). Aset gambar/audio TIDAK berubah dan tidak disertakan. Jangan hapus file lain.
Dibuat di atas versi setelah update animasi (idle + kedip) sebelumnya.

## Ditambah (1)
- data/wind.js — data zona rambut (mask berupa data-URI, ± 18 KB). Tanpa berkas gambar baru.

## Diubah (5)
| File | Alasan |
|---|---|
| js/dialogue.js | Lapisan angin per karakter (Rena, Sera); gambar dasarnya digambar ke canvas dengan area rambut dihapus; pemanasan mask; kedip membaca ekspresi dari `data-exp` |
| css/visual-novel.css | Pola gerak angin A/B/C; amplitudo napas/goyang idle diperkecil sedikit (3 px / 0,2°) |
| index.html | Memuat data/wind.js |
| tests/check.js | Pemeriksaan data angin (jalankan: `node tests/check.js`) |
| README.md | Dokumentasi angin & penyetel ketajaman |

## Dampak pada perilaku lama
- Rena dan Sera: gambar dasar kini dirender lewat <canvas> (bukan <img>). Perpindahan ekspresi untuk keduanya menjadi langsung (tanpa cross-fade 0,14 dtk); Pia tetap memakai <img> dan cross-fade.
- Dengan "kurangi gerak" aktif, Rena/Sera memakai jalur <img> lama (tanpa angin, idle, kedip).

## Menerapkan dengan GitHub Desktop
1. Ekstrak ZIP, salin isinya ke folder repository lokal, timpa file yang sama (jangan hapus file lain).
2. Tab Changes harus berisi 6 file (1 baru, 5 diubah).
3. Commit, lalu Push origin. Setelah Pages terbit, muat ulang dengan Ctrl+F5.
