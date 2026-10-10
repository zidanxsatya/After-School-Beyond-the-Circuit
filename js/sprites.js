// CACHE SPRITE — menyimpan sprite yang sudah dimuat & didekode (maks. MAX gambar, yang paling lama tak dipakai dibuang)
// agar pergantian ekspresi tidak menunggu unduh/dekode. Hanya sprite yang akan segera dipakai yang dipanaskan (preload).
(function () {
  const SR = window.SR = window.SR || {};
  const MAX = 16;                       // ± 4,6 MB terdekode per sprite -> batas memori ± 75 MB
  const cache = new Map(), bgs = new Set();
  const key = (c, e) => c + '/' + e;
  const url = (c, e) => SR.data.characters[c].dir + e + '.webp';

  function get(c, e) {
    const k = key(c, e), hit = cache.get(k);
    if (hit) { cache.delete(k); cache.set(k, hit); return hit; }       // tandai baru dipakai
    const img = new Image(); img.decoding = 'async'; img.src = url(c, e);
    const it = { img, ready: false };
    it.p = (img.decode ? img.decode() : new Promise((r, j) => { img.onload = r; img.onerror = j; })).then(() => { it.ready = true; }, () => { it.ready = true; });
    cache.set(k, it);
    while (cache.size > MAX) cache.delete(cache.keys().next().value);
    return it;
  }
  const preload = (c, e) => { const ch = SR.data.characters[c]; if (ch && ch.sprite !== false && ch.expressions.includes(e)) get(c, e); };
  function preloadBg(id) {
    const u = SR.data.backgrounds[id];
    if (!u || bgs.has(u)) return;
    bgs.add(u); const i = new Image(); i.decoding = 'async'; i.src = u; if (i.decode) i.decode().catch(() => {});
  }
  SR.Sprites = { url, get, preload, preloadBg };
})();
