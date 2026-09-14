/*
 * JSD Emulator Hub — local iframe autoload bridge
 * Project integration code only.
 */
(()=>{
  'use strict';
  const byId=id=>document.getElementById(id);
  const delay=ms=>new Promise(r=>setTimeout(r,ms));
  const ext=f=>((f&&f.name)||'').toLowerCase().match(/\.([^.]+)$/)?.[1]||'';

  function setFiles(input,files){
    if(!input||!files||!files.length)return false;
    try{
      const dt=new DataTransfer();
      for(const f of files)if(f instanceof File)dt.items.add(f);
      if(!dt.files.length)return false;
      input.files=dt.files;
      input.dispatchEvent(new Event('change',{bubbles:true}));
      return true;
    }catch(err){
      console.warn('JSD autoload: cannot assign files',err);
      return false;
    }
  }
  async function waitClass(id,cls='loaded',timeout=5000){
    const t=performance.now();
    while(performance.now()-t<timeout){
      const el=byId(id);
      if(el&&el.classList.contains(cls))return true;
      await delay(40);
    }
    return false;
  }
  function status(system,loaded,error=''){
    try{parent.postMessage({type:'emulator-autoload-status',system,loaded,error,ok:!error},'*')}catch(_){}
  }

  addEventListener('message',async e=>{
    const p=e.data;
    if(!p||p.type!=='emulator-autoload')return;
    const system=String(p.system||'');
    const bios=Array.isArray(p.bios)?p.bios.filter(f=>f instanceof File):[];
    const roms=Array.isArray(p.rom)?p.rom.filter(f=>f instanceof File):[];
    const loaded=[];
    try{
      if(system==='gameboy'){
        if(setFiles(byId('romFile'),roms.slice(0,1)))loaded.push('ROM');

      }else if(system==='sega'){
        if(setFiles(byId('romFile'),roms.slice(0,1)))loaded.push('ROM');

      }else if(system==='neogeo'){
        if(bios.length&&setFiles(byId('biosInput'),bios)){
          loaded.push('BIOS');
          await waitClass('biosDropZone','loaded',6000);
          await delay(80);
        }
        if(roms.length&&setFiles(byId('gameInput'),roms)){
          loaded.push('GAME');
          await waitClass('gameDropZone','loaded',6000);
        }

      }else if(system==='coleco'){
        const b=bios.find(f=>f.size===8192);
        if(b&&setFiles(byId('biosFile'),[b])){loaded.push('BIOS');await delay(120)}
        if(setFiles(byId('romFile'),roms.slice(0,1)))loaded.push('ROM');

      }else if(system==='msx1'){
        const b=bios.find(f=>f.size===32768);
        if(b&&setFiles(byId('biosFile'),[b])){loaded.push('BIOS');await delay(120)}
        if(setFiles(byId('romFile'),roms.slice(0,1)))loaded.push('ROM');

      }else if(system==='spectrum'){
        const b=bios.find(f=>f.size===16384);
        if(b&&setFiles(byId('romFile'),[b])){loaded.push('SYSTEM ROM');await delay(120)}
        if(setFiles(byId('gameFile'),roms.slice(0,1)))loaded.push('GAME');

      }else if(system==='vectrex'){
        const b=bios.find(f=>f.size===8192);
        if(b&&setFiles(byId('biosFile'),[b])){loaded.push('BIOS');await delay(120)}
        if(setFiles(byId('romFile'),roms.slice(0,1)))loaded.push('ROM');

      }else if(system==='intellivision'){
        const exec=bios.find(f=>f.size===8192&&/exec|executive/i.test(f.name));
        const grom=bios.find(f=>f.size===2048&&/(^|[^a-z])grom([^a-z]|$)|graphics[ _.-]*rom/i.test(f.name));
        const cart=roms.find(f=>ext(f)==='int');
        if(exec&&setFiles(byId('file-exec'),[exec])){loaded.push('EXEC');await delay(80)}
        if(grom&&setFiles(byId('file-grom'),[grom])){loaded.push('GROM');await delay(80)}
        if(cart&&setFiles(byId('file-cart'),[cart]))loaded.push('CARTRIDGE');
      }
      status(system,loaded);
    }catch(err){
      status(system,loaded,String(err&&err.message||err));
    }
  });

  try{parent.postMessage({type:'emulator-autoload-ready'},'*')}catch(_){}
})();
