// PENYIMPANAN & PENGATURAN. localStorage dibungkus try/catch agar game tetap jalan
// bila penyimpanan diblokir (mode privat, dsb.) — data hanya bertahan selama halaman terbuka.
(function () {
  const SR = window.SR = window.SR || {};
  const mem = {};
  const Store = {
    get(k, def) { try { const v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : def; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* diabaikan */ } },
    remove(k) { delete mem[k]; try { localStorage.removeItem(k); } catch (e) { /* diabaikan */ } }
  };

  const DEFAULTS = { musicVol: 0.6, sfxVol: 0.8, musicMute: false, sfxMute: false, textSpeed: 45 };
  const KEY = 'sirkuitrahasia.settings.v1';
  const cur = Object.assign({}, DEFAULTS, Store.get(KEY, {}));
  const listeners = [];

  SR.Store = Store;
  SR.Settings = {
    DEFAULTS,
    get: k => cur[k],
    set(k, v) { cur[k] = v; Store.set(KEY, cur); listeners.forEach(f => f(k, v)); },
    onChange(f) { listeners.push(f); },
    reset() { Object.keys(DEFAULTS).forEach(k => this.set(k, DEFAULTS[k])); }
  };
})();
