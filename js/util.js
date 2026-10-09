// Fungsi kecil yang dipakai banyak modul.
(function () {
  const SR = window.SR = window.SR || {};
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Teks aman + format ringan: **tebal** dan `kode`
  const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>');
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  SR.Util = { esc, fmt, $, $$, wait };
})();
