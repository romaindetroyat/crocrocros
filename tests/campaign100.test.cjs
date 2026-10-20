'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const EClass=require('../src/engine'),X=require('../src/expedition');
let E,commands=[],label='';
function tick(n,input={}){if(n<=0)return;let last=commands.at(-1);if(last?.input&&JSON.stringify(last.input)===JSON.stringify(input))last.n+=n;else commands.push({n,input});for(let f=0;f<n;f++)E.step(1/60,input);}
function select(h){E.select(h);commands.push({select:h});tick(2);}
function walk(x,max=1400){let n=0;while(Math.abs(E.p[E.active].x-x)>4&&!E.won&&n++<max){const p=E.p[E.active],dir=Math.sign(x-p.x),danger=E.active===2&&E.enemies.some(e=>!e.asleep&&!e.distracted&&e.kind==='lion'&&Math.abs(e.homeY-p.y)<40&&Math.sign(e.x-p.x)===dir&&Math.abs(e.x-p.x)<300);tick(1,{right:dir>0,left:dir<0,action:danger&&p.cool<=0});}assert(n<max,`${label} walk ${x}: ${JSON.stringify(E.p[E.active])}`);tick(2);}
function climb(y){let n=0;while(Math.abs(E.p[E.active].y-y)>.1&&n++<600)tick(1,{up:y<E.p[E.active].y,down:y>E.p[E.active].y});assert(n<600,`${label} climb ${y}: ${JSON.stringify(E.p[E.active])} rebounds ${E.rebounds}`);tick(3);}
function roomOf(p=E.p[E.active]){return E.L.rooms.find(r=>p.x>=r.x&&p.x<=r.x+r.w&&p.y<=r.floor+25&&p.y>r.floor-335);}
function goto(h,id,x){select(h);const start=roomOf();assert(start,`${label} no room`);if(E.p[h].y<start.floor-150){walk(start.x+95);let n=0;while(E.p[h].y<start.floor-1&&n++<600)tick(1);assert(n<600,label+' descent');}const queue=[[start.id]],seen=new Set([start.id]);let route;
 while(queue.length){const cost=t=>t.length+t.reduce((n,r)=>n+E.enemies.filter(e=>e.room===r&&!e.asleep&&!e.distracted&&e.kind!=='vulture').length*8,0);queue.sort((a,b)=>cost(a)-cost(b));const trail=queue.shift(),a=trail.at(-1);if(a===id){route=trail;break;}for(const c of E.L.connections){if(!X.test(E,c.when))continue;const b=c.a===a?c.b:c.b===a?c.a:null;if(b&&!seen.has(b)){seen.add(b);queue.push([...trail,b]);}}}
 assert(route,`${label}: no route ${start.id} → ${id}, hero ${h} flags=${JSON.stringify(E.flags)}`);
 for(let j=1;j<route.length;j++){const a=E.L.rooms.find(r=>r.id===route[j-1]),b=E.L.rooms.find(r=>r.id===route[j]);if(a.row===b.row)walk(b.x+(b.x>a.x?100:600));else {walk(a.x+350);climb(b.floor);}}
 const r=E.L.rooms.find(r=>r.id===id);if(x!==undefined)walk(x);else walk(r.x+95);
}
function interact(){tick(1,{interact:true});tick(5);}
function jumpTo(x){tick(1,{jump:true});let n=0;while(n++<180){const p=E.p[E.active];tick(1,{right:x-p.x>4,left:p.x-x>4});if(n>10&&p.ground)break;}assert(n<180,label+' landing');}
function highItem(it){const d=E.L.items.find(d=>d.id===it.id);if(d.boost&&!it.slot&&it.holder<0&&it.y<E.L.rooms.find(r=>r.id===d.room).floor-150){const r=E.L.rooms.find(r=>r.id===d.room);goto(1,r.id,r.x+250);if(!E.p[1].roof){tick(1,{action:true});tick(20);}goto(0,r.id,r.x+180);jumpTo(r.x+250);assert(Math.abs(E.p[0].y-(r.floor-87))<2,label+' shield');jumpTo(it.x);return;}if(d.elevation){const lift=E.L.lifts.find(l=>l.id==='lift-'+it.id);if(E.p[E.active].y>it.y+40){walk(lift.x+lift.w/2);if(E.lifts[lift.id]>lift.toY+.1){if(E.expedition.modes[lift.control]===0)interact();let n=0;while(E.lifts[lift.id]>lift.toY+.1&&n++<600)tick(1);assert(n<600,label+' lift');}else{throw Error(label+' lift upstairs; recall needed');}walk(it.x);}return;} const p=E.p[E.active],r=roomOf();if(it.y<r.floor-60&&p.y>it.y+40){walk(r.x+65);tick(1,{jump:true});let n=0;while(E.p[E.active].y>it.y-1&&n++<60)tick(1);assert(n<60,label+' jump height');walk(it.x,120);tick(35);}}
function execute(s){label=E.L.id+' '+JSON.stringify(s);if(process.env.TRACE)console.log(label,Math.round(E.elapsed));
 const find=(arr,id)=>E.L[arr].find(o=>o.id===id);const h=s.hero;
 if(s.op==='go')goto(h,s.arg);
 if(s.op==='take'){const d=find('items',s.arg),it=X.item(E,s.arg);const r=it.slot?find('sockets',it.slot).room:it.holder>=0?roomOf(E.p[it.holder]).id:roomOf({x:it.x,y:it.y}).id;goto(h,r);highItem(it);walk(it.x);interact();assert.equal(X.carried(E,h)?.id,s.arg,label);}
 if(s.op==='put'){const slot=find('sockets',s.arg);goto(h,slot.room,slot.x);interact();assert.equal(E.expedition.items.find(i=>i.slot===s.arg)?.holder,-1,label);}
 if(s.op==='turn'){const c=find('controls',s.arg);goto(h,c.room,c.x);const old=E.expedition.modes[c.id];interact();assert.notEqual(E.expedition.modes[c.id],old,label);}
 if(s.op==='shoot'){const t=find('targets',s.arg);goto(2,t.room,t.x-150);tick(1,{right:true});tick(1,{action:true});tick(65);assert(E.flag(t.id),label);}
 if(s.op==='smash'){const c=find('crates',s.arg);goto(0,c.room,c.x-60);tick(1,{right:true,action:true});tick(16,{right:true});tick(30);assert(E.broken[c.id],label);}
 if(s.op==='nuts'){const r=find('reactors',s.arg),bird=E.enemies.find(e=>e.kind==='vulture'&&e.room===r.room);goto(h,r.room,r.x+35);let n=0;while(!(bird.phase==='windup'&&bird.timer<.18&&Math.abs(bird.aim-(r.x+35))<25)&&n++<700)tick(1);assert(n<700,label+' bird aim');walk(r.x-150);n=0;while(!E.flag(r.id)&&n++<400)tick(1);assert(n<400,label+' nut collector');}
 if(s.op==='gust'){const r=find('reactors',s.arg);goto(h,r.room,r.x+5);let n=0;while(!E.flag(r.id)&&n++<900)tick(1);assert(n<900,label+' gust collector');}
 if(s.op==='stomp'){const r=find('reactors',s.arg);goto(h,r.room,r.x+125);let n=0;while(!E.flag(r.id)&&n++<700)tick(1);assert(n<700,label+' wave receiver');}
 if(s.op==='glide'){const r=E.L.rooms.find(r=>r.id===s.arg);goto(1,r.id,r.x+150);climb(r.floor-150);if(!E.p[1].roof){tick(1,{action:true});tick(20);}walk(r.x+610);let n=0;while(E.p[1].y<r.floor&&n++<300)tick(1);assert(n<300,label+' glide landing');}
 if(s.op==='stand'){const q=find('sockets',s.arg);goto(h,q.room,q.x);tick(10);}
 if(s.op==='wait'){let n=0;while(!E.flag(s.arg)&&n++<900)tick(1);assert(n<900,label);}
 if(s.op==='finish'){// Optional stars are collected after the intended solution if accessible.
  for(const star of E.L.stars){if(star.id===E.L.zebra?.starId){const z=E.zebra,r=roomOf({x:z.x,y:z.y});goto(0,r.id,z.x-60);let n=0;while(!E.canTakeZebra()&&n++<1200){if(z.mode==='pause'&&z.ready)tick(1,{right:z.x>E.p[0].x,left:z.x<E.p[0].x});else tick(1);}assert(n<1200,label+' zebra');tick(1,{action:true});continue;}const r=roomOf({x:star.x,y:star.y+34});if(r){try{const lion=E.enemies.find(e=>e.room===r.id&&e.kind==='lion'&&!e.asleep&&!e.distracted);if(lion){const side=E.p[2].x>lion.x?1:-1;goto(2,r.id,Math.max(r.x+85,Math.min(r.x+615,lion.x+side*160)));tick(1,{right:side<0,left:side>0,action:true});tick(25);walk(star.x);walk(r.x+95);}else goto(0,r.id,star.x);}catch(e){if(process.env.STARS)throw e;}}}
  for(let i=0;i<3;i++)goto(i,E.L.endRoom,E.L.exit.x+E.L.exit.w/2);tick(5);
 }
}
function run(L,route){E=new EClass(L,(kind,arg)=>{if(process.env.TRACE&&kind==='boing')console.log('HIT',arg,label,E.p.map(p=>[p.x,p.y]));});commands=[];tick(5);for(const s of route.steps)execute(s);assert(E.won,L.id+' victory '+JSON.stringify(E.p.map(p=>[p.x,p.y]))+' '+JSON.stringify(E.flags));assert.equal(E.rebounds,0,L.id+' recovery shortcuts');return {levelId:L.id,commands,seconds:Math.round(E.elapsed),stars:Object.keys(E.collected).length,rooms:L.rooms.length};}
if(require.main===module){const D=require('../content/campaign.json'),plans=require('./campaign100-plans.json'),out=[];for(const L of D.levels){if(process.env.ONLY&&Number(process.env.ONLY)!==Number(L.id.split('-')[1]))continue;const r=run(L,plans.find(p=>p.levelId===L.id));out.push(r);console.log('PASS',L.id,L.name,r.seconds+'s',r.stars+'★');}if(!process.env.ONLY){fs.writeFileSync(path.join(__dirname,'campaign100-solutions.json'),JSON.stringify(out));fs.writeFileSync(path.join(__dirname,'campaign100-report.json'),JSON.stringify(out.map(({commands,...r})=>r),null,2));}}
module.exports={run};
