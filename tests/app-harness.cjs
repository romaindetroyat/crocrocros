// Application logic smoke tests using a minimal DOM and the real Canvas API.
// This is not a substitute for Safari/device/browser layout testing.
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createCanvas}=require('@napi-rs/canvas');
const D=require('../src/levels.js'),Engine=require('../src/engine.js'),Art=require('../src/art.js');
const src=path.join(__dirname,'../src');
function harness(store=new Map(),device={}){
 const els=new Map(),events={},docEvents={};let raf=null,now=0,engine=null;const timeouts=[];
 class El{constructor(id,tag='div'){this.id=id;this.tag=tag;this.style={};this.hidden=false;this.disabled=false;this.open=false;this.attrs={};this.listeners={};this.classes=new Set();this.classList={add:(...v)=>v.forEach(x=>this.classes.add(x)),remove:(...v)=>v.forEach(x=>this.classes.delete(x)),toggle:(x,b)=>{if(b===undefined)b=!this.classes.has(x);b?this.classes.add(x):this.classes.delete(x);},contains:x=>this.classes.has(x)};this.canvas=createCanvas(120,120);}
 set innerHTML(v){this.html=v;for(const m of v.matchAll(/<(\w+)[^>]*\bid="([^"]+)"[^>]*>/g)){const el=new El(m[2],m[1]);el.disabled=/\sdisabled/.test(m[0]);els.set(m[2],el);}}
 get innerHTML(){return this.html||'';}getContext(){return this.canvas.getContext('2d');}set width(v){this.canvas.width=v;}get width(){return this.canvas.width;}set height(v){this.canvas.height=v;}get height(){return this.canvas.height;}
 getBoundingClientRect(){return this.id==='scene'?(device.viewport?{width:device.viewport.width,height:device.viewport.height-116}:{width:1100,height:620}):{width:600,height:520};}setAttribute(k,v){this.attrs[k]=v;}addEventListener(n,f){this.listeners[n]=f;}showModal(){this.open=true;}close(){this.open=false;}focus(){}click(){if(!this.disabled)this.onclick?.();}remove(){}setPointerCapture(){}
 }
 for(const m of fs.readFileSync(path.join(src,'index.html'),'utf8').matchAll(/<(\w+)[^>]*\bid="([^"]+)"[^>]*>/g))els.set(m[2],new El(m[2],m[1]));
 const body=new El('body');body.appendChild=()=>{};
 const context={CrocoExpedition:require('../src/expedition'),CROCO_DATA:D,CrocoArt:Art,CrocoEngine:class extends Engine{constructor(...a){super(...a);engine=this;}},document:{getElementById:id=>els.get(id)||null,body,documentElement:new El('html'),hidden:false,createElement:tag=>tag==='audio'&&device.createAudio?device.createAudio():new El('',tag),querySelectorAll:()=>[...els.values()].filter(e=>e.classes.has('held')),addEventListener:(n,f)=>docEvents[n]=f},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},navigator:device.navigator||{},innerWidth:device.viewport?.width||1100,innerHeight:device.viewport?.height||800,visualViewport:device.viewport,AudioContext:device.AudioContext,CrocoMusic:device.CrocoMusic,location:{protocol:'file:',href:'https://crocrocros.vercel.app/'+(device.search||''),search:device.search||''},performance:{now:()=>now},devicePixelRatio:1,requestAnimationFrame:fn=>raf=fn,setTimeout:(fn,ms)=>{timeouts.push({fn,at:now+ms});return timeouts.length;},clearTimeout:()=>{},console,Blob,URL,URLSearchParams,addEventListener:(n,f)=>events[n]=f};context.window=context;
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(src,'app.js'),'utf8'),context);
 function frames(n){for(let i=0;i<n;i++){now+=1000/60;const cb=raf;cb?.(now);for(const t of timeouts)if(!t.done&&now>=t.at){t.done=true;t.fn();}}}
 return {els,store,frames,events,docEvents,context,get engine(){return engine;},key:(k,type='keydown')=>events[type]?.({key:k,preventDefault(){},repeat:false})};
}

module.exports={harness};
