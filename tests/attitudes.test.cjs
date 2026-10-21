'use strict';
const assert=require('node:assert/strict'),Engine=require('../src/engine'),D=require('../content/campaign.json'),Art=require('../src/art'),T=Art.acting,{createCanvas}=require('@napi-rs/canvas');
const g=createCanvas(800,500).getContext('2d');
const E=new Engine(D.levels[0]);for(let n=0;n<30;n++)E.step(1/60);const before=JSON.stringify(E.snapshot());
for(const c of T.catalog)for(const f of [0,.1,.35,.58,.8,1]){g.resetTransform();Art.croc(g,{...E.p[c.hero],x:300,y:350,face:f>.5?-1:1},c.hero,f*c.duration,false,T.sample(c.id,f*c.duration,c.hero));}
for(const c of T.duets)for(const f of [0,.1,.35,.58,.8,1])c.actors.forEach((hero,k)=>{const pose=T.sample(c.roles[k],Math.max(0,f*c.duration-k*.45),hero,c.duration);pose.face=k===0?1:-1;Art.croc(g,{...E.p[hero],x:250+k*220,y:350},hero,f*c.duration,false,pose);});
assert.equal(JSON.stringify(E.snapshot()),before,'painting has no simulation / save side effects');
// Isolated actors exercise a complete deck. Every gesture must actually be scheduled.
E.p.forEach((p,i)=>{p.x=100+i*500;p.ground=true;});const seen=[new Set(),new Set(),new Set()];for(let n=0;n<18000;n++){E.clock+=1/60;T.frame(E,E.clock).forEach((v,i)=>{if(T.cast[i].some(c=>c.id===v.id))seen[i].add(v.id);});}assert.deepEqual(seen.map(s=>s.size),[15,15,15]);
for(const p of E.p)p.vx=100;E.clock+=1/60;assert(T.frame(E,E.clock).every(p=>p.id==='rest'),'movement cancels idle immediately');
E.p.forEach((p,i)=>{p.vx=0;p.x=100+i*70;});for(let n=0;n<600;n++){E.clock+=1/60;T.frame(E,E.clock);}const snapshot=JSON.stringify(E.snapshot());const atPause=T.frame(E,E.clock);assert.deepEqual(T.frame(E,E.clock+10),atPause,'simulation pause freezes idle');assert.equal(JSON.stringify(E.snapshot()),snapshot);
const social=new Set();for(let n=0;n<24000;n++){E.clock+=1/60;const poses=T.frame(E,E.clock);for(const duet of T.duets)if(duet.actors.every((hero,k)=>poses[hero].id===duet.roles[k]&&poses[hero].face===(E.p[duet.actors[1-k]].x>E.p[hero].x?1:-1)))social.add(duet.id);}assert.equal(social.size,8,'all eight shared gags are scheduled and look at their partner');
T.react(E,'lockedTarget');assert.equal(T.frame(E,E.clock)[E.active].id,'puzzled');E.clock-=10;assert(T.frame(E,E.clock).every(p=>p.id==='rest'),'rewind resets pending performances');
T.setReduced(true);for(let n=0;n<600;n++){E.clock+=1/60;assert(T.frame(E,E.clock).every(p=>!p.prop&&!p.fx&&!p.hand));}T.setReduced(false);
console.log('PASS 45 performances and 8 duets × 6 phases; complete solo and social schedules; movement, pause, rewind and reduced motion; unchanged saves.');
