/* Emulator Hub autoload bridge
   Keeps every emulator as a separate HTML file.
   Receives File objects from landing.html through postMessage and feeds the
   emulator's existing <input type="file"> controls, dispatching normal
   input/change events. */
(() => {
  'use strict';

  const delay = ms => new Promise(r => setTimeout(r, ms));

  function setFiles(input, files) {
    if (!input || !files || !files.length) return false;
    const dt = new DataTransfer();
    for (const f of files) dt.items.add(f);
    input.files = dt.files;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function byId(id) { return document.getElementById(id); }

  async function loadPayload(p) {
    const loaded = [];
    const bios = Array.isArray(p.bios) ? p.bios : [];
    const roms = Array.isArray(p.rom) ? p.rom : [];

    if (p.system === 'gameboy') {
      if (setFiles(byId('romFile'), roms.slice(0, 1))) loaded.push('ROM');
    }

    else if (p.system === 'sega') {
      // BIOS is optional for this SMS/Game Gear core. Never inject one automatically.
      if (setFiles(byId('romFile'), roms.slice(0,1))) loaded.push('ROM');
    }
    else if (p.system === 'coleco') {
      if (setFiles(byId('biosFile'), bios.slice(0, 1))) {
        loaded.push('BIOS');
        await delay(450);
      }
      if (setFiles(byId('romFile'), roms.slice(0, 1))) loaded.push('ROM');
    }

    else if (p.system === 'spectrum') {
      // zx48jsd: #romFile = 16 KiB system ROM, #gameFile = SNA/Z80/TAP/SCR.
      if (setFiles(byId('romFile'), bios.slice(0, 1))) {
        loaded.push('48K ROM');
        await delay(500);
      }
      if (setFiles(byId('gameFile'), roms.slice(0, 1))) loaded.push('GAME');
    }

    else if (p.system === 'msx1') {
      if (setFiles(byId('biosFile'), bios.slice(0, 1))) {
        loaded.push('BIOS');
        await delay(450);
      }
      if (setFiles(byId('romFile'), roms.slice(0, 1))) loaded.push('ROM');
    }


    else if (p.system === 'vectrex') {
      if (setFiles(byId('biosFile'), bios.slice(0,1))) { loaded.push('BIOS'); await delay(450); }
      if (setFiles(byId('romFile'), roms.slice(0,1))) loaded.push('ROM');
    }

    else if (p.system === 'intellivision') {
      // Standalone Intellijsd M5.0: strict hand-off.
      // EXEC/GROM are firmware; game cartridges are accepted from the hub only as .int.
      const exec = bios.find(f => f.size === 8192 && /(?:^|[._ -])(?:exec|executive)(?:[._ -]|$)/i.test(f.name));
      const grom = bios.find(f => f.size === 2048 && /(?:^|[._ -])grom(?:[._ -]|$)|graphics[ _.-]*rom/i.test(f.name));
      const cart = roms.find(f => /\.int$/i.test(f.name));
      const execInput = byId('file-exec');
      const gromInput = byId('file-grom');
      const cartInput = byId('file-cart');
      if (exec && setFiles(execInput, [exec])) { loaded.push('EXEC'); await delay(300); }
      if (grom && setFiles(gromInput, [grom])) { loaded.push('GROM'); await delay(300); }
      if (cart && setFiles(cartInput, [cart])) loaded.push('ROM .int');
    }

    // Generic extension point for emulator pages that want the File objects directly.
    window.__EMULATOR_HUB_PAYLOAD__ = p;
    window.dispatchEvent(new CustomEvent('emulator-hub-autoload', { detail: p }));

    try {
      parent.postMessage({ type: 'emulator-autoload-status', system: p.system, loaded, ok: true }, '*');
    } catch (_) {}
  }

  window.addEventListener('message', e => {
    const p = e.data;
    if (!p || p.type !== 'emulator-autoload') return;
    loadPayload(p).catch(err => {
      console.error('[Emulator Hub] autoload failed', err);
      try {
        parent.postMessage({ type: 'emulator-autoload-status', system: p.system, ok: false, error: String(err) }, '*');
      } catch (_) {}
    });
  });

  const ready = () => {
    try { parent.postMessage({ type: 'emulator-ready' }, '*'); } catch (_) {}
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else setTimeout(ready, 0);
})();
