// Fungsi kecil yang dipakai banyak modul.
(function () {
  const SR = window.SR = window.SR || {};
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Teks aman + format ringan: **tebal** dan `kode`
  const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>');
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // Kotak potret persegi: jendela wajah per karakter (data/assets.js -> portrait), rasio gambar tidak diubah.
  // Ukuran diatur CSS lewat variabel --ps (mis. style="--ps:140px") atau kelas pembungkus.
  const portrait = (who, exp, cls) => {
    const c = SR.data.characters[who], p = c.portrait || { x: 0, w: 1 };
    return `<div class="portrait ${cls || ''}" style="--c:${c.color}"><img src="${c.dir}${exp || c.default}.webp" alt="${esc(c.name)}" style="width:${(100 / p.w).toFixed(2)}%;left:-${(p.x / p.w * 100).toFixed(2)}%"></div>`;
  };
  SR.Util = { esc, fmt, $, $$, wait, portrait };
})();
