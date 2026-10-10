# Lisensi dan Atribusi — After School: Beyond the Circuit

> **Penting untuk Master sebelum mengunggah ke GitHub publik.** Di dalam semua arsip aset yang diterima **tidak ditemukan berkas lisensi, README sumber, atau catatan atribusi** (kecuali dari Easy Ren'Py GUI, lihat bawah). Karena itu **izin redistribusi publik hampir semua aset BELUM TERBUKTI**. Dokumen ini hanya mencatat apa yang benar-benar diketahui; tidak ada aset yang saya nyatakan "aman".

## Ringkasan status

| Kelompok aset | Lokasi di proyek | Sumber & lisensi yang diketahui | Status |
|---|---|---|---|
| Sprite Rena (Detective Girl) | `assets/characters/rena/` | Arsip `Detective_Girl.zip`. Tidak ada info pembuat/lisensi. | ⚠️ **Belum jelas — tinjau sebelum publik** |
| Sprite Pia (Mail Girl) | `assets/characters/pia/` | Arsip `Mail_Girl.zip`. Tidak ada info pembuat/lisensi. | ⚠️ **Belum jelas — tinjau sebelum publik** |
| Sprite Sera (Noble Girl) | `assets/characters/sera/` | Arsip `Noble_Girl.zip` (folder `PNG素材`). Tidak ada info pembuat/lisensi. | ⚠️ **Belum jelas — tinjau sebelum publik** |
| Latar sekolah/kota (siang) | `assets/backgrounds/` | Arsip `Background_Day.zip`. Tidak ada info pembuat/lisensi. | ⚠️ **Belum jelas — tinjau sebelum publik** |
| Musik latar (11 lagu) | `assets/audio/bgm/` | Arsip `Asset_Song.zip` (berkas OGG berjudul bahasa Inggris). Tidak ada info komposer/lisensi. | ⚠️ **Belum jelas — tinjau sebelum publik** |
| Efek suara (35 berkas) | `assets/audio/sfx/` | Arsip `Asset_SFX.zip` (nama berkas bahasa Jepang). Tidak ada info pembuat/lisensi. | ⚠️ **Belum jelas — tinjau sebelum publik** |
| Kode, teks cerita, materi, soal, CSS, simbol/diagram SVG | `index.html`, `css/`, `js/`, `data/`, `tests/` | Dibuat untuk proyek ini. Pemilik proyek menentukan lisensinya. | Tidak ada pihak ketiga di dalamnya |
| Easy Ren'Py GUI (Feniks) | **Tidak disertakan** | Hanya dijadikan **referensi visual** (tata letak kotak dialog & nameplate). README-nya menyatakan template boleh dipakai bebas; kredit "Feniks" tidak wajib tetapi diharapkan. Tidak ada berkas, kode, atau gambar darinya yang disalin ke proyek web. | Tidak ada redistribusi |
| `easy_blink` / `alphamask_layeredimage.rpy` | **Tidak disertakan** | Kode Ren'Py (kredit Feniks diminta jika dipakai). Tidak dipakai karena proyek bukan Ren'Py. | Tidak ada redistribusi |

## Atribusi yang disarankan (sebagai bentuk kehati-hatian)

Jika lisensi sumber aset sudah ditemukan, lengkapi bagian ini sesuai syaratnya. Sementara itu, tuliskan:

- Tata letak antarmuka terinspirasi dari *Easy Ren'Py GUI* oleh Feniks (feniksdev.com). Tidak ada kode atau aset template yang disertakan.
- Karakter, latar, musik, dan efek suara: **sumber asli belum teridentifikasi** — isi nama pembuat dan tautan lisensi di sini setelah dikonfirmasi.

## Pertanyaan yang masih terbuka (perlu keputusan Master)

1. Dari mana ketiga set sprite karakter berasal, dan apakah lisensinya mengizinkan redistribusi publik serta penggunaan dalam proyek pendidikan? Nama Rena/Pia/Sera hanya nama sementara proyek.
2. Apakah latar `Background_Day` boleh diunggah ulang dalam repositori publik (banyak paket latar hanya mengizinkan *penggunaan di dalam game*, bukan penyebaran berkas mentahnya)?
3. Apakah musik dan efek suara mengizinkan redistribusi berkas (bukan hanya pemakaian dalam game)? Beberapa pustaka mewajibkan kredit tertentu.
4. Konversi format (PNG→WebP + pemotongan + pengecilan, OGG→MP3) adalah perubahan teknis; periksa apakah lisensi sumber mengizinkan karya turunan.

## Opsi aman bila lisensi tidak bisa dipastikan

- Unggah **hanya kode dan data** (`index.html`, `css/`, `js/`, `data/`, `tests/`, dokumen) ke GitHub publik dan simpan folder `assets/` secara lokal / repositori privat. Game membutuhkan folder `assets/` untuk tampil dengan benar; perilaku game **tanpa** aset belum saya uji, jadi kembalikan folder itu sebelum menjalankan game.
- Atau gunakan repositori privat dengan hosting yang mendukungnya.

Nama berkas asli ↔ nama di proyek tercatat di `assets/ASSET_MAP.md`.
