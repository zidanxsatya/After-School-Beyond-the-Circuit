# Update animasi karakter — After School: Beyond the Circuit

Berisi HANYA file yang berubah/bertambah (9). Aset lain, `js/` lain, `data/` lain tidak disertakan dan JANGAN dihapus.
Dibuat di atas versi setelah update polish sebelumnya.

## Ditambah (3) — aset turunan dari sprite yang sudah ada (bukan karya baru)
- assets/characters/rena/blink.webp, assets/characters/pia/blink.webp, assets/characters/sera/blink.webp — kelopak mata tertutup (± 11 KB tiap berkas), dipotong dari sprite `eyes_closed` / `eyes_closed_smile` yang sudah ada. Sumber dan lisensinya sama dengan sprite asalnya (lihat LICENSES_AND_ATTRIBUTION.md).

## Diubah (6)
| File | Alasan |
|---|---|
| js/dialogue.js | Pembungkus idle `.fig`, tempelan kedip + penjadwal acak, kedip batal saat ganti ekspresi, hormati "kurangi gerak" |
| css/visual-novel.css | Animasi idle (napas+goyang) dan kedip |
| css/main.css | Idle pada karakter di menu utama |
| data/assets.js | Data `blink` tiap karakter (berkas, kotak mata, daftar ekspresi aman); peran Pia/Rena ditulis sebagai anggota klub |
| tests/check.js | Pemeriksaan data kedip (opsional dijalankan: `node tests/check.js`) |
| README.md | Dokumentasi animasi idle & kedip |

## Tidak dihapus: tidak ada file yang dihapus.

## Menerapkan dengan GitHub Desktop
1. Ekstrak ZIP, salin isinya ke folder repository lokal, timpa file yang sama (folder `assets/characters/<id>/` hanya mendapat 1 berkas baru; sprite lama tidak tersentuh).
2. Di GitHub Desktop, tab Changes harus berisi 9 file (3 baru, 6 diubah).
3. Commit, lalu Push origin. Setelah Pages terbit, muat ulang dengan Ctrl+F5.
