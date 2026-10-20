'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Engine=require('../src/engine'),D=require('../src/levels');
const {conflicts}=require('../content/clear-starts.cjs');let E,commands=[],stage='';
function tick(n,input={}){const last=commands.at(-1);if(last?.input&&JSON.stringify(last.input)===JSON.stringify(input))last.n+=n;else commands.push({n,input});for(let i=0;i<n;i++)E.step(1/60,input);}
function select(i){E.select(i);commands.push({select:i});tick(2);}
function walk(x,max=1600){let n=0;while(!E.won&&Math.abs(E.p[E.active].x-x)>4&&n++<max)tick(1,{right:x>E.p[E.active].x,left:x<E.p[E.active].x});assert.ok(n<max,`${stage}: hero ${E.active} blocked to ${x} at ${E.p[E.active].x},${E.p[E.active].y}`);tick(3);}
function climb(x,y){walk(x);let n=0;while(Math.abs(E.p[E.active].y-y)>2&&n++<600)tick(1,{up:y<E.p[E.active].y,down:y>E.p[E.active].y});assert.ok(n<600,`${stage}: climb ${x},${y} at ${E.p[E.active].y}`);tick(3);}
function jump(x){tick(1,{jump:true});let n=0;while(n++<180){const p=E.p[E.active],dx=x-p.x;tick(1,{right:dx>3,left:dx< -3});if(E.p[E.active].ground&&n>8)break;}assert.ok(n<180,stage+' jump');}
function action(){tick(1,{action:true});tick(25);}
function wait(f,label,max=1200){let n=0;while(!f()&&n++<max)tick(1);assert.ok(n<max,`${stage} timeout ${label}: ${JSON.stringify(E.p.map(p=>[p.x,p.y]))}`);}
function fire(x,dir=1){select(2);walk(x);tick(1,{right:dir>0,left:dir<0});action();tick(80);}
function flag(id){assert.ok(E.flag(id),stage+' missing '+id);}
function mark(s){stage=E.L.id+' / '+s;if(process.env.TRACE)console.log(stage,Math.round(E.elapsed));}
function coconut(){walk(1305);wait(()=>E.enemies[0]?.kind==='vulture'?E.enemies[0].phase==='windup'&&Math.abs(E.enemies[0].aim-1305)<15&&E.enemies[0].timer<.25:E.enemies.find(e=>e.kind==='vulture').phase==='windup'&&Math.abs(E.enemies.find(e=>e.kind==='vulture').aim-1305)<15&&E.enemies.find(e=>e.kind==='vulture').timer<.25,'aim coconut');walk(1420);wait(()=>E.flag('rain'),'nut receptor');}
const routes=[],report=[];
for(let i=0;i<D.workshop.length;i++){
 if(process.env.ONLY&&+process.env.ONLY!==i+1)continue;
 E=new Engine(D.workshop[i],(kind,arg)=>{if(process.env.TRACE&&kind==='boing')console.log('RECOVERY',arg,E.elapsed,E.p.map(p=>[p.x,p.y]));});commands=[];tick(30);assert.deepEqual(conflicts(E.L),[]);mark('start');
 if(i===0){
 select(1);walk(270);action();select(0);walk(215);jump(270);assert.equal(E.p[0].y,813);jump(350);walk(550);flag('red');walk(730);wait(()=>E.p[0].ground&&E.p[0].y===900,'descent');jump(730);walk(740);tick(1,{action:true,right:true});tick(12,{right:true});flag('crate');walk(730);
 select(1);action();walk(940);fire(900);fire(1100);flag('ladder');mark('rooftops');
 for(let j=0;j<3;j++){select(j);climb(1370,320);walk(1530);}
 }
 if(i===1){
 select(0);walk(300);jump(490);climb(490,1220);walk(640);climb(490,1400);jump(645);wait(()=>E.flag('wind')||(E.enemies[0].phase==='windup'&&E.enemies[0].timer<.25),'sneeze cue');if(!E.flag('wind')){tick(1,{jump:true});tick(65);}flag('wind');mark('wind solved');
 climb(490,1220);walk(790);walk(1080);climb(1080,950);coconut();flag('rain');mark('nut solved');
 walk(500);jump(280);climb(240,420);walk(515);flag('red');
 for(const hero of [1,2]){select(hero);walk(390);if(process.env.TRACE)console.log('LIFT BOARD',hero,E.p[hero].x,E.p[hero].y,E.lifts.lift,E.flags);if(E.lifts.lift!==1400){action();wait(()=>E.lifts.lift===1400,'call down');}action();if(process.env.TRACE)console.log('LIFT GO',hero,E.p[hero].x,E.p[hero].y,E.lifts.lift,E.flags);wait(()=>E.p[hero].y===950,'ride up');walk(280);climb(240,420);if(hero===1){walk(337);action();flag('roof');}}
 fire(1410);flag('finish');for(let j=0;j<3;j++){select(j);walk(1650);} 
 }
 if(i===2){
 select(2);walk(370);climb(370,1980);walk(725);wait(()=>E.p[2].ground&&E.p[2].y===2100,'rail bypass');walk(980);
 select(0);climb(300,1800);walk(535);wait(()=>E.p[2].y===1580,'first lift');select(2);walk(1190);flag('blue');coconut();fire(1330);flag('relay');mark('expedition');
 select(1);climb(370,1980);walk(725);wait(()=>E.p[1].ground&&E.p[1].y===2100,'guard rail bypass');walk(2180);flag('gold');walk(660);climb(660,1980);walk(370);climb(370,2100);
 select(0);walk(725);wait(()=>E.p[0].ground&&E.p[0].y===2100,'scout descends');climb(1110,1580);climb(2200,900);walk(2300);flag('red');walk(2278);
 select(2);climb(2200,900);walk(1920);mark('sky bridge');
 select(1);walk(555);tick(3,{right:true});flag('b');climb(300,1800);walk(435);flag('guard');select(2);walk(390);
 select(1);climb(300,2100);climb(370,1980);walk(660);climb(660,2100);walk(511);tick(3,{left:true});flag('a');climb(660,1980);walk(370);climb(370,2100);climb(300,1800);walk(435);
 fire(390,-1);flag('finish');mark('return');select(2);walk(490);action();select(0);walk(2090);action();select(1);climb(300,2100);walk(150);
 }
 tick(20);assert.equal(E.rebounds,0,stage+' no recovery shortcuts');assert.ok(E.won,stage+' completed');assert.equal(Object.keys(E.collected).length,3,stage+' all stars');
 routes.push({levelId:E.L.id,commands});report.push({id:E.L.id,seconds:Math.round(E.elapsed),stars:3,rebounds:E.rebounds,height:E.L.height});console.log('PASS',E.L.name,Math.round(E.elapsed)+'s');
}
if(!process.env.ONLY){fs.writeFileSync(path.join(__dirname,'workshop-solutions.json'),JSON.stringify(routes));fs.writeFileSync(path.join(__dirname,'workshop-report.json'),JSON.stringify(report,null,2)+'\n');}
