/*
 * JSD Vectrex Clean Core
 * ----------------------
 * Independent Vectrex emulator core written for JSD Emulator Hub.
 * No third-party emulator source, binary, or translated emulator code is used.
 * The implementation follows public MC6809, MOS 6522, AY-3-8912 and Vectrex
 * hardware documentation.
 */
(() => {
'use strict';
const u8=v=>v&255,u16=v=>v&65535,s8=v=>(v<<24)>>24,s16=v=>(v<<16)>>16,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const CC={E:0x80,F:0x40,H:0x20,I:0x10,N:8,Z:4,V:2,C:1};

class AY38912Clean{
  constructor(){this.r=new Uint8Array(16);this.addr=0;this.reset()}
  reset(){this.r.fill(0);this.addr=0}
  latch(v){this.addr=v&15}
  write(v){this.r[this.addr]=v&255}
  read(){return this.r[this.addr]}
}

class VIA6522Clean{
  constructor(machine){this.m=machine;this.reset()}
  reset(){this.orb=0xff;this.ora=0;this.ddrb=0;this.ddra=0;this.t1c=0xffff;this.t1l=0xffff;this.t2c=0xffff;this.t2l=0xffff;this.sr=0;this.acr=0;this.pcr=0;this.ifr=0;this.ier=0;this.t1Run=false;this.t2Run=false;this.t1pb7=1;}
  irq(){return !!(this.ifr&this.ier&0x7f)}
  updateIFR(){if(this.ifr&this.ier&0x7f)this.ifr|=0x80;else this.ifr&=0x7f}
  read(reg){reg&=15;switch(reg){
    case 0:{let v=this.orb|0x40;const joy=this.m.selectedJoystick();const dac=s8(this.ora);if(dac>joy)v|=0x20;else v&=~0x20;this.ifr&=~0x18;this.updateIFR();return v}
    case 1:case 15:{this.ifr&=~3;this.updateIFR();const mode=(this.orb>>3)&3;if(mode===1)return this.m.ay.read();return this.ora}
    case 2:return this.ddrb;case 3:return this.ddra;
    case 4:this.ifr&=~0x40;this.updateIFR();return this.t1c&255;case 5:return(this.t1c>>8)&255;case 6:return this.t1l&255;case 7:return(this.t1l>>8)&255;
    case 8:this.ifr&=~0x20;this.updateIFR();return this.t2c&255;case 9:return(this.t2c>>8)&255;
    case 10:this.ifr&=~4;this.updateIFR();return this.sr;case 11:return this.acr;case 12:return this.pcr;case 13:this.updateIFR();return this.ifr;case 14:return this.ier|0x80;
  }return 0xff}
  write(reg,v){reg&=15;v&=255;switch(reg){
    case 0:this.orb=v;this.ifr&=~0x18;this.soundBus();this.m.analogLatch();break;
    case 1:case 15:this.ora=v;this.ifr&=~3;this.soundBus();this.m.analogLatch();break;
    case 2:this.ddrb=v;break;case 3:this.ddra=v;break;
    case 4:this.t1l=(this.t1l&0xff00)|v;break;
    case 5:this.t1l=(v<<8)|(this.t1l&255);this.t1c=this.t1l;this.t1Run=true;this.t1pb7=0;this.ifr&=~0x40;break;
    case 6:this.t1l=(this.t1l&0xff00)|v;break;case 7:this.t1l=(v<<8)|(this.t1l&255);this.ifr&=~0x40;break;
    case 8:this.t2l=(this.t2l&0xff00)|v;break;case 9:this.t2l=(v<<8)|(this.t2l&255);this.t2c=this.t2l;this.t2Run=true;this.ifr&=~0x20;break;
    case 10:this.sr=v;this.ifr&=~4;break;case 11:this.acr=v;break;case 12:this.pcr=v;this.m.updateControlLines();break;
    case 13:this.ifr&=~(v&0x7f);break;case 14:if(v&0x80)this.ier|=v&0x7f;else this.ier&=~(v&0x7f);break;
  }this.updateIFR()}
  soundBus(){const bc1=(this.orb>>3)&1,bdir=(this.orb>>4)&1;if(bdir&&bc1)this.m.ay.latch(this.ora);else if(bdir&&!bc1)this.m.ay.write(this.ora)}
  tick(c){
    if(this.t1Run){this.t1c-=c;if(this.t1c<0){this.ifr|=0x40;if(this.acr&0x40){this.t1c=(this.t1l+1)+(this.t1c);this.t1pb7^=1}else{this.t1Run=false;this.t1pb7=1}}}
    if(this.t2Run){this.t2c-=c;if(this.t2c<0){this.ifr|=0x20;this.t2Run=false}}
    this.updateIFR();
  }
  rampHigh(){return(this.acr&0x80)?!!this.t1pb7:!!(this.orb&0x80)}
  zeroLow(){const mode=(this.pcr>>1)&7;return mode===6}
  blankHigh(){const cb2=(this.pcr>>5)&7,srMode=(this.acr>>2)&7;if(cb2===7)return true;if(cb2===6)return false;if(srMode===6)return this.sr!==0;return false}
}

class MC6809Clean{
  constructor(m){this.m=m;this.resetRegs()}
  resetRegs(){this.a=0;this.b=0;this.dp=0;this.x=0;this.y=0;this.u=0;this.s=0;this.pc=0;this.cc=CC.I|CC.F;this.cycles=0;this.wait=false;this.trace=[];this.traceEnabled=false}
  get d(){return(this.a<<8)|this.b} set d(v){v&=65535;this.a=v>>8;this.b=v&255}
  rb(a){return this.m.read8(a)} wb(a,v){this.m.write8(a,v)} rw(a){return(this.rb(a)<<8)|this.rb(a+1)} ww(a,v){this.wb(a,v>>8);this.wb(a+1,v)}
  f8(){const v=this.rb(this.pc);this.pc=u16(this.pc+1);return v} f16(){const v=this.rw(this.pc);this.pc=u16(this.pc+2);return v}
  push8(which,v){this[which]=u16(this[which]-1);this.wb(this[which],v)} pop8(which){const v=this.rb(this[which]);this[which]=u16(this[which]+1);return v}
  push16(which,v){this.push8(which,v&255);this.push8(which,v>>8)} pop16(which){const hi=this.pop8(which),lo=this.pop8(which);return(hi<<8)|lo}
  setNZ8(v){v&=255;this.cc=(this.cc&~(CC.N|CC.Z))|(v&0x80?CC.N:0)|(v===0?CC.Z:0);return v}
  setNZ16(v){v&=65535;this.cc=(this.cc&~(CC.N|CC.Z))|(v&0x8000?CC.N:0)|(v===0?CC.Z:0);return v}
  logic8(v){this.cc&=~CC.V;return this.setNZ8(v)} logic16(v){this.cc&=~CC.V;return this.setNZ16(v)}
  add8(a,b,c=0){const w=(a&255)+(b&255)+c,v=w&255;this.cc&=~(CC.N|CC.Z|CC.V|CC.C|CC.H);if(v&0x80)this.cc|=CC.N;if(!v)this.cc|=CC.Z;if(w>255)this.cc|=CC.C;if(((a^v)&(b^v)&0x80))this.cc|=CC.V;if(((a&15)+(b&15)+c)>15)this.cc|=CC.H;return v}
  sub8(a,b,c=0){const w=(a&255)-(b&255)-c,v=w&255;this.cc&=~(CC.N|CC.Z|CC.V|CC.C);if(v&0x80)this.cc|=CC.N;if(!v)this.cc|=CC.Z;if(w<0)this.cc|=CC.C;if(((a^b)&(a^v)&0x80))this.cc|=CC.V;return v}
  add16(a,b){const w=(a&65535)+(b&65535),v=w&65535;this.cc&=~(CC.N|CC.Z|CC.V|CC.C);if(v&0x8000)this.cc|=CC.N;if(!v)this.cc|=CC.Z;if(w>65535)this.cc|=CC.C;if(((a^v)&(b^v)&0x8000))this.cc|=CC.V;return v}
  sub16(a,b){const w=(a&65535)-(b&65535),v=w&65535;this.cc&=~(CC.N|CC.Z|CC.V|CC.C);if(v&0x8000)this.cc|=CC.N;if(!v)this.cc|=CC.Z;if(w<0)this.cc|=CC.C;if(((a^b)&(a^v)&0x8000))this.cc|=CC.V;return v}
  reset(){this.resetRegs();this.pc=this.rw(0xfffe)}
  regByCode(c){return c===0?this.d:c===1?this.x:c===2?this.y:c===3?this.u:c===4?this.s:c===5?this.pc:c===8?this.a:c===9?this.b:c===10?this.cc:c===11?this.dp:0}
  setRegByCode(c,v){if(c===0)this.d=v;else if(c===1)this.x=u16(v);else if(c===2)this.y=u16(v);else if(c===3)this.u=u16(v);else if(c===4)this.s=u16(v);else if(c===5)this.pc=u16(v);else if(c===8)this.a=u8(v);else if(c===9)this.b=u8(v);else if(c===10)this.cc=u8(v);else if(c===11)this.dp=u8(v)}
  indexed(){const p=this.f8(),regName=['x','y','u','s'][(p>>5)&3];if(!(p&0x80)){let o=p&31;if(o&16)o-=32;return u16(this[regName]+o)}const indirect=!!(p&0x10),mode=p&15;let ea=0;switch(mode){case 0:ea=this[regName];this[regName]=u16(this[regName]+1);break;case 1:ea=this[regName];this[regName]=u16(this[regName]+2);break;case 2:this[regName]=u16(this[regName]-1);ea=this[regName];break;case 3:this[regName]=u16(this[regName]-2);ea=this[regName];break;case 4:ea=this[regName];break;case 5:ea=u16(this[regName]+s8(this.b));break;case 6:ea=u16(this[regName]+s8(this.a));break;case 8:ea=u16(this[regName]+s8(this.f8()));break;case 9:ea=u16(this[regName]+s16(this.f16()));break;case 11:ea=u16(this[regName]+s16(this.d));break;case 12:ea=u16(this.pc+s8(this.f8()));break;case 13:ea=u16(this.pc+s16(this.f16()));break;case 15:ea=this.f16();break;default:ea=this[regName]}return indirect?this.rw(ea):ea}
  ea(mode){if(mode===0)return(this.dp<<8)|this.f8();if(mode===1)return this.indexed();if(mode===2)return this.f16();return 0}
  cond(n){const N=!!(this.cc&CC.N),Z=!!(this.cc&CC.Z),V=!!(this.cc&CC.V),C=!!(this.cc&CC.C);return[true,false,!C&&!Z,C||Z,!C,C,!Z,Z,!V,V,!N,N,N===V,N!==V,!Z&&N===V,Z||N!==V][n]}
  interrupt(vector,full=true){if(full){this.cc|=CC.E;this.push16('s',this.pc);this.push16('s',this.u);this.push16('s',this.y);this.push16('s',this.x);this.push8('s',this.dp);this.push8('s',this.b);this.push8('s',this.a);this.push8('s',this.cc)}else{this.cc&=~CC.E;this.push16('s',this.pc);this.push8('s',this.cc)}this.cc|=CC.I;this.pc=this.rw(vector);this.wait=false}
  unary8(op,v,write=true){let r=v;switch(op&15){case 0:r=this.sub8(0,v);break;case 3:r=this.logic8(~v);this.cc|=CC.C;break;case 4:{const c=v&1;r=v>>>1;this.cc=(this.cc&~(CC.N|CC.Z|CC.C|CC.V))|(c?CC.C:0)|(r?0:CC.Z);if(((this.cc&CC.N)!==0)!==((this.cc&CC.C)!==0))this.cc|=CC.V;break}case 6:{const oldC=this.cc&CC.C?0x80:0,c=v&1;r=(v>>>1)|oldC;this.cc=(this.cc&~(CC.N|CC.Z|CC.C|CC.V))|(r&0x80?CC.N:0)|(r?0:CC.Z)|(c?CC.C:0);break}case 7:{const c=v&1;r=((v>>1)|(v&0x80))&255;this.cc=(this.cc&~(CC.N|CC.Z|CC.C))|(r&0x80?CC.N:0)|(r?0:CC.Z)|(c?CC.C:0);break}case 8:{const c=(v>>7)&1;r=(v<<1)&255;this.cc=(this.cc&~(CC.N|CC.Z|CC.C|CC.V))|(r&0x80?CC.N:0)|(r?0:CC.Z)|(c?CC.C:0);if(((r>>7)&1)!==c)this.cc|=CC.V;break}case 9:{const ci=this.cc&CC.C?1:0,c=(v>>7)&1;r=((v<<1)|ci)&255;this.cc=(this.cc&~(CC.N|CC.Z|CC.C|CC.V))|(r&0x80?CC.N:0)|(r?0:CC.Z)|(c?CC.C:0);if(((r>>7)&1)!==c)this.cc|=CC.V;break}case 10:r=this.sub8(v,1);this.cc=(this.cc&~CC.V)|((v===0x80)?CC.V:0);break;case 12:r=this.add8(v,1);this.cc=(this.cc&~CC.V)|((v===0x7f)?CC.V:0);break;case 13:this.setNZ8(v);this.cc&=~CC.V;write=false;break;case 15:r=0;this.cc=(this.cc&~(CC.N|CC.V|CC.C))|CC.Z;break;default:write=false}return{r:r&255,write}}
  step(){
    if(this.m.via.irq()&&!(this.cc&CC.I))this.interrupt(0xfff8,true);if(this.wait){this.m.tickHardware(1);this.cycles++;return 1}
    const start=this.pc,op=this.f8();if(this.traceEnabled){this.trace.push(start.toString(16).padStart(4,'0').toUpperCase()+' '+op.toString(16).padStart(2,'0').toUpperCase());if(this.trace.length>96)this.trace.shift()}
    let c=2;if(op===0x10||op===0x11)c=this.page(op);else c=this.base(op);this.cycles+=c;this.m.tickHardware(c);return c
  }
  page(page){const op=this.f8();if(page===0x10&&op>=0x20&&op<=0x2f){const d=s16(this.f16());if(this.cond(op&15))this.pc=u16(this.pc+d);return 5}if(page===0x10&&op===0x3f){this.interrupt(0xfff4,true);return 20}if(page===0x11&&op===0x3f){this.interrupt(0xfff2,true);return 20}
    const mode=op<0x90?3:op<0xa0?0:op<0xb0?1:2,low=op&15,ea=mode===3?0:this.ea(mode);const get16=()=>mode===3?this.f16():this.rw(ea),store16=v=>this.ww(ea,v);
    if(page===0x10){if(low===3&&op>=0x80&&op<0xc0){this.sub16(this.d,get16());return 5}if(low===0xc){this.sub16(this.y,get16());return 5}if(low===0xe){this.y=this.logic16(get16());return 5}if(low===0xf&&mode!==3){store16(this.y);this.logic16(this.y);return 5}if(op>=0xce){if(low===0xe)this.s=this.logic16(get16());else if(low===0xf&&mode!==3){store16(this.s);this.logic16(this.s)}return 5}}
    else{if(low===3){this.sub16(this.u,get16());return 5}if(low===0xc){this.sub16(this.s,get16());return 5}}return 2}
  base(op){
    if(op<=0x0f){const ea=this.ea(0),q=this.unary8(op,this.rb(ea));if(q.write)this.wb(ea,q.r);return 6}
    if(op>=0x40&&op<=0x5f){const isB=op>=0x50,q=this.unary8(op,isB?this.b:this.a);if(q.write){if(isB)this.b=q.r;else this.a=q.r}return 2}
    if(op>=0x60&&op<=0x6f){const ea=this.ea(1),q=this.unary8(op,this.rb(ea));if((op&15)===14){this.pc=ea;return 3}if(q.write)this.wb(ea,q.r);return 6}
    if(op>=0x70&&op<=0x7f){const ea=this.ea(2),q=this.unary8(op,this.rb(ea));if((op&15)===14){this.pc=ea;return 3}if(q.write)this.wb(ea,q.r);return 7}
    if(op>=0x20&&op<=0x2f){const d=s8(this.f8());if(this.cond(op&15))this.pc=u16(this.pc+d);return 3}
    if(op===0x12)return 2;if(op===0x13){this.wait=true;return 4}if(op===0x16){this.pc=u16(this.pc+s16(this.f16()));return 5}if(op===0x17){const d=s16(this.f16());this.push16('s',this.pc);this.pc=u16(this.pc+d);return 9}if(op===0x19){let a=this.a,adj=0,c=this.cc&CC.C;if((a&15)>9||(this.cc&CC.H))adj|=6;if(a>0x99||c)adj|=0x60;this.a=this.add8(a,adj);if(c)this.cc|=CC.C;return 2}if(op===0x1a){this.cc|=this.f8();return 3}if(op===0x1c){this.cc&=this.f8();return 3}if(op===0x1d){this.a=(this.b&0x80)?0xff:0;this.setNZ16(this.d);return 2}if(op===0x1e||op===0x1f){const p=this.f8(),s=(p>>4)&15,d=p&15,a=this.regByCode(s),b=this.regByCode(d);if(op===0x1e){this.setRegByCode(s,b);this.setRegByCode(d,a)}else this.setRegByCode(d,a);return 8}
    if(op>=0x30&&op<=0x33){const ea=this.indexed();if(op===0x30){this.x=ea;this.cc=(this.cc&~CC.Z)|(this.x?0:CC.Z)}if(op===0x31){this.y=ea;this.cc=(this.cc&~CC.Z)|(this.y?0:CC.Z)}if(op===0x32)this.s=ea;if(op===0x33)this.u=ea;return 4}
    if(op>=0x34&&op<=0x37){const mask=this.f8(),push=op<0x36,stack=(op&1)?'u':'s',other=stack==='s'?'u':'s';if(push){if(mask&0x80)this.push16(stack,this.pc);if(mask&0x40)this.push16(stack,this[other]);if(mask&0x20)this.push16(stack,this.y);if(mask&0x10)this.push16(stack,this.x);if(mask&8)this.push8(stack,this.dp);if(mask&4)this.push8(stack,this.b);if(mask&2)this.push8(stack,this.a);if(mask&1)this.push8(stack,this.cc)}else{if(mask&1)this.cc=this.pop8(stack);if(mask&2)this.a=this.pop8(stack);if(mask&4)this.b=this.pop8(stack);if(mask&8)this.dp=this.pop8(stack);if(mask&0x10)this.x=this.pop16(stack);if(mask&0x20)this.y=this.pop16(stack);if(mask&0x40)this[other]=this.pop16(stack);if(mask&0x80)this.pc=this.pop16(stack)}return 5}
    if(op===0x39){this.pc=this.pop16('s');return 5}if(op===0x3a){this.x=u16(this.x+this.b);return 3}if(op===0x3b){this.cc=this.pop8('s');if(this.cc&CC.E){this.a=this.pop8('s');this.b=this.pop8('s');this.dp=this.pop8('s');this.x=this.pop16('s');this.y=this.pop16('s');this.u=this.pop16('s')}this.pc=this.pop16('s');return 10}if(op===0x3c){this.cc&=this.f8();this.wait=true;return 20}if(op===0x3d){this.d=(this.a*this.b)&65535;this.cc=(this.cc&~(CC.Z|CC.C))|(this.d?0:CC.Z)|(this.b&0x80?CC.C:0);return 11}if(op===0x3f){this.interrupt(0xfffa,true);return 19}
    if(op>=0x80){return this.alu(op)}return 2
  }
  alu(op){const hi=op>>4,low=op&15,mode=(hi&3),isB=hi>=0xc,addrMode=mode===0?3:mode===1?0:mode===2?1:2,ea=addrMode===3?0:this.ea(addrMode);const get8=()=>addrMode===3?this.f8():this.rb(ea),get16=()=>addrMode===3?this.f16():this.rw(ea),store8=v=>this.wb(ea,v),store16=v=>this.ww(ea,v);let v;
    if(!isB){switch(low){case 0:this.a=this.sub8(this.a,get8());break;case 1:this.sub8(this.a,get8());break;case 2:this.a=this.sub8(this.a,get8(),this.cc&CC.C?1:0);break;case 3:this.d=this.sub16(this.d,get16());break;case 4:this.a=this.logic8(this.a&get8());break;case 5:this.logic8(this.a&get8());break;case 6:this.a=this.logic8(get8());break;case 7:if(addrMode!==3){store8(this.a);this.logic8(this.a)}break;case 8:this.a=this.logic8(this.a^get8());break;case 9:this.a=this.add8(this.a,get8(),this.cc&CC.C?1:0);break;case 10:this.a=this.logic8(this.a|get8());break;case 11:this.a=this.add8(this.a,get8());break;case 12:this.sub16(this.x,get16());break;case 13:{const target=addrMode===3?u16(this.pc+s8(this.f8())):ea;this.push16('s',this.pc);this.pc=target;break}case 14:this.x=this.logic16(get16());break;case 15:if(addrMode!==3){store16(this.x);this.logic16(this.x)}break}}
    else{switch(low){case 0:this.b=this.sub8(this.b,get8());break;case 1:this.sub8(this.b,get8());break;case 2:this.b=this.sub8(this.b,get8(),this.cc&CC.C?1:0);break;case 3:this.d=this.add16(this.d,get16());break;case 4:this.b=this.logic8(this.b&get8());break;case 5:this.logic8(this.b&get8());break;case 6:this.b=this.logic8(get8());break;case 7:if(addrMode!==3){store8(this.b);this.logic8(this.b)}break;case 8:this.b=this.logic8(this.b^get8());break;case 9:this.b=this.add8(this.b,get8(),this.cc&CC.C?1:0);break;case 10:this.b=this.logic8(this.b|get8());break;case 11:this.b=this.add8(this.b,get8());break;case 12:this.d=this.logic16(get16());break;case 13:if(addrMode!==3){store16(this.d);this.logic16(this.d)}break;case 14:this.u=this.logic16(get16());break;case 15:if(addrMode!==3){store16(this.u);this.logic16(this.u)}break}}return addrMode===3?2:addrMode===0?4:addrMode===1?5:5}
}

class JSDVectrexCore{
  constructor(){this.cart=new Uint8Array(0x8000);this.bios=new Uint8Array(0x2000);this.ram=new Uint8Array(0x400);this.ay=new AY38912Clean();this.via=new VIA6522Clean(this);this.cpu=new MC6809Clean(this);this.cartLoaded=false;this.biosLoaded=false;this.cycles=0;this.frame=0;this.frameCycle=0;this.lines=[];this.completedLines=[];this.beamX=0;this.beamY=0;this.yHold=0;this.zeroRef=0;this.intensity=.7;this.input={up:false,down:false,left:false,right:false,b1:false,b2:false,b3:false,b4:false};this.reset()}
  reset(){this.ram.fill(0);this.ay.reset();this.via.reset();this.cycles=0;this.frame=0;this.frameCycle=0;this.lines=[];this.completedLines=[];this.beamX=this.beamY=0;this.yHold=this.zeroRef=0;this.intensity=.7;if(this.biosLoaded)this.cpu.reset();else this.cpu.resetRegs()}
  loadCart(bytes){this.cart.fill(0xff);this.cart.set(new Uint8Array(bytes).subarray(0,0x8000));this.cartLoaded=true;this.reset()}
  loadBios(bytes){this.bios.fill(0xff);const b=new Uint8Array(bytes);if(b.length>=0x2000)this.bios.set(b.subarray(b.length-0x2000));else this.bios.set(b,0x2000-b.length);this.biosLoaded=true;this.reset()}
  read8(a){a&=65535;if(a<0x8000)return this.cartLoaded?this.cart[a]:0xff;if(a>=0xc800&&a<=0xcfff)return this.ram[a&0x3ff];if(a>=0xd000&&a<=0xd7ff)return this.via.read(a&15);if(a>=0xe000)return this.biosLoaded?this.bios[a-0xe000]:0xff;return 0xff}
  write8(a,v){a&=65535;v&=255;if(a>=0xc800&&a<=0xcfff)this.ram[a&0x3ff]=v;else if(a>=0xd000&&a<=0xd7ff)this.via.write(a&15,v)}
  selectedJoystick(){const sel=(this.via.orb>>1)&3;const vals=[this.input.right?80:this.input.left?-80:0,this.input.down?80:this.input.up?-80:0,0,0];return vals[sel]}
  controllerButtons(){let v=0xff;if(this.input.b1)v&=~1;if(this.input.b2)v&=~2;if(this.input.b3)v&=~4;if(this.input.b4)v&=~8;return v}
  analogLatch(){if(this.via.orb&1)return;const sel=(this.via.orb>>1)&3,val=s8(this.via.ora);if(sel===0)this.yHold=val;else if(sel===1)this.zeroRef=val;else if(sel===2)this.intensity=clamp((val+128)/255,0,1)}
  updateControlLines(){if(this.via.zeroLow()){this.beamX=0;this.beamY=0}}
  tickHardware(c){
    this.via.tick(c);const zero=this.via.zeroLow();if(zero){this.beamX*=Math.max(0,1-c*.25);this.beamY*=Math.max(0,1-c*.25);if(Math.abs(this.beamX)<.02)this.beamX=0;if(Math.abs(this.beamY)<.02)this.beamY=0}
    const ramp=!this.via.rampHigh();if(ramp&&!zero){const dx=(s8(this.via.ora)-this.zeroRef)*c/64,dy=(this.yHold-this.zeroRef)*c/64,x0=this.beamX,y0=this.beamY;this.beamX=clamp(this.beamX+dx,-180,180);this.beamY=clamp(this.beamY-dy,-180,180);if(this.via.blankHigh()&&this.intensity>.01&&(Math.abs(this.beamX-x0)+Math.abs(this.beamY-y0)>.01))this.lines.push({x0,y0,x:this.beamX,y:this.beamY,i:this.intensity})}
    this.cycles+=c;this.frameCycle+=c;if(this.frameCycle>=30000){this.frameCycle%=30000;this.frame++;this.completedLines=this.lines;this.lines=[]}
  }
  runCycles(n){let used=0,guard=0;while(used<n&&guard++<200000){const c=this.cpu.step();used+=c}return used}
  step(){return this.cpu.step()}
}
window.JSDVectrexCore=JSDVectrexCore;
})();
