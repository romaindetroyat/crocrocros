'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {levels}=require('../src/levels.js'),Engine=require('../src/engine.js'),recipes=require('./recipes.json');
let E,commands=[],context='';
function tick(n,input={}){const last=commands.at(-1);if(last?.input&&JSON.stringify(last.input)===JSON.stringify(input))last.n+=n;else commands.push({n,input});for(let j=0;j<n;j++)E.step(1/60,input);}
function select(i){E.select(i);commands.push({select:i});tick(2);}
function walk(x,max=500){let n=0;while(!E.won&&Math.abs(E.p[E.active].x-x)>4&&n++<max)tick(1,{right:x>E.p[E.active].x,left:x<E.p[E.active].x});assert.ok(n<max,`${context}: walk blocked hero ${E.active}, desired ${x}, actual ${E.p[E.active].x}, y ${E.p[E.active].y}`);tick(3);}
function jumpTo(x){tick(1,{jump:true});let n=0;while(n++<160){const p=E.p[E.active],dx=x-p.x;tick(1,{right:dx>3,left:dx< -3});if(E.p[E.active].ground&&n>8)break;}assert.ok(n<160,`${context}: jump never landed`);}
function action(){tick(1,{action:true});tick(26);}
function roofAt(x){select(1);walk(x);if(!E.p[1].roof)action();}
function climb(shieldX,platformX){select(0);walk(shieldX-55);jumpTo(shieldX);assert.ok(Math.abs(E.p[0].y-433)<2,`${context}: shield ${E.p[0].y}`);jumpTo(platformX);assert.ok(Math.abs(E.p[0].y-340)<2,`${context}: platform ${E.p[0].y}`);}
function shootFrom(x,dir=1){select(2);walk(x);tick(1,{right:dir===1,left:dir===-1});const enemies=E.enemies.some(e=>!e.asleep);action();tick(48);if(enemies){action();tick(48);}}
function waitUntil(test,label,max=500,input={}){let n=0;while(!test()&&n++<max)tick(1,input);assert.ok(n<max,`${context}: timeout ${label}`);}
function solve(step,m){const {type,offset:o,width:w}=step,p=`m${m}-`;context=`${E.L.sourceCode} ${type}`;
 for(let i=0;i<3;i++){select(i);walk(o+60+i*55);} // All moves use the same physics as the game.
 if(type==='boost'||type==='relay'){
  roofAt(o+235);climb(o+235,o+350);walk(o+430);
  if(type==='relay'){select(1);walk(o+440);if(E.p[1].roof)action();shootFrom(o+345);assert.equal(E.flags[p+'shot'],true,context);}
  else {assert.equal(E.flags[p+'key'],true,context);if(E.L.targets.some(t=>t.id===p+'shot')){shootFrom(o+345);assert.equal(E.flags[p+'shot'],true,context);}}
  select(0);walk(o+555);tick(50);
 }else if(type==='lift'){
  select(2);walk(o+320);select(1);walk(o+220);waitUntil(()=>E.p[2].y<=301,'lift up');
  select(2);walk(o+460);assert.equal(E.flags[p+'key'],true,context);walk(o+575);tick(60);
 }else if(type==='cover'||type==='armour'){
  select(1);if(E.p[1].roof)action();walk(o+395);shootFrom(o+310);assert.equal(E.flags[p+'shot'],true,context);
  if(type==='armour'){select(0);walk(o+510);tick(1,{action:true,right:true});tick(30,{right:true});assert.equal(E.broken[p+'crate'],true,context);}
 }else if(type==='portal'){
  shootFrom(o+145);assert.equal(E.flags[p+'shot'],true,context);select(1);walk(o+230);action();assert.equal(E.p[1].y,280,context);walk(o+440);assert.equal(E.flags[p+'key'],true,context);walk(o+505);action();assert.equal(E.p[1].y,520,context);
 }else if(['charge','reverse','belt'].includes(type)){
  select(0);walk(o+235);tick(1,{action:true,right:true});tick(30,{right:true});assert.equal(E.broken[p+'crate'],true,context);
  if(type==='belt'){walk(o+450);assert.equal(E.flags[p+'key'],true,context);}
  shootFrom(o+(type==='reverse'?555:400),type==='reverse'?-1:1);assert.equal(E.flags[p+'shot'],true,context);
 }else if(type==='ladder'||type==='spring'){
  select(2);
  if(type==='ladder'){walk(o+350);tick(65,{up:true});assert.equal(E.p[2].y,300,context);walk(o+420);}
  else {walk(o+270);waitUntil(()=>E.p[2].vy<0,'bounce');walk(o+420);waitUntil(()=>E.p[2].ground&&E.p[2].y===300,'spring landing');}
  shootFrom(o+395);assert.equal(E.flags[p+'shot'],true,context);select(2);walk(o+580);tick(60);
 }else if(type==='bridge'){
  select(0);walk(o+130);action();assert.equal(E.flags[p+'A'],true);
  select(1);walk(o+500);select(2);walk(o+500);
  select(0);walk(o+130);action();walk(o+235);action();
  select(1);walk(o+745);if(E.p[1].roof)action();shootFrom(o+500);assert.equal(E.flags[p+'shot'],true,context);
 }else if(type==='combination'){
  select(0);walk(o+140);action();walk(o+360);action();shootFrom(o+455);assert.equal(E.flags[p+'shot'],true,context);
 }
 for(let i=0;i<3;i++){select(i);walk(o+w-40);}
}
const routes=[],report=[];
for(let index=0;index<levels.length;index++){
 E=new Engine(levels[index]);commands=[];tick(30);
 if(recipes[index].custom){context=E.L.name;require('./opening-solutions.cjs')(recipes[index].custom,{E,tick,select,walk,jumpTo,action,roofAt,climb,shootFrom,waitUntil,assert});}else recipes[index].steps.forEach(solve);
 if(E.zebra&&!E.zebra.caught){const z=E.zebra;select(z.mode==='snack'?2:0);walk((z.minX+z.maxX)/2);
  if(z.mode==='snack'){let tries=0;while(!z.ready&&tries++<5){tick(1,{right:z.x>E.p[2].x,left:z.x<E.p[2].x});action();tick(25);}assert.ok(z.ready,`${context}: feed zebra`);}
  else waitUntil(()=>z.ready,'zebra offers star',600);
  if(z.mode!=='curious')walk(z.x-45);if(z.mode==='pause')waitUntil(()=>E.canTakeZebra(),'near grazing zebra',600);action();assert.ok(E.collected[z.starId],`${context}: optional zebra star`);
 }
 for(const star of E.L.stars)if(!E.collected[star.id]&&star.y>=365){select(0);walk(star.x);jumpTo(star.x);}
 assert.equal(Object.keys(E.collected).length,3,`${E.L.sourceCode}: all three optional stars reachable`);
 assert.equal(E.rebounds,0,`${E.L.sourceCode}: route must not rely on respawning`);
 for(let i=0;i<3;i++){select(i);walk(E.L.exit.x+40+i*30);}tick(15);assert.equal(E.won,true,`${context}: all three must finish`);
 report.push({level:index+1,id:E.L.id,reference:E.L.sourceCode,seconds:Math.round(E.elapsed),rebounds:E.rebounds});
 routes.push({levelId:E.L.id,commands:[...commands]});console.log(`PASS ${index+1}/37 ${E.L.sourceCode} — ${E.L.name} (${Math.round(E.elapsed)}s, ${E.rebounds} recoveries)`);
}
// Regression: no condition may be bypassed by shooting early, nor by the wrong hero.
E=new Engine(levels[12]);tick(30);shootFrom(345);assert.ok(!E.flag('m0-shot'),'two plates required');
E=new Engine(levels[27]);tick(30);assert.equal(E.open(E.L.bridges[0]),false);E.flags['m0-A']=true;assert.equal(E.open(E.L.bridges[0]),true);E.flags['m0-B']=true;assert.equal(E.open(E.L.bridges[0]),false);E.flags['m0-shot']=true;assert.equal(E.open(E.L.bridges[0]),true);
E=new Engine(levels[1]);tick(30);select(2);walk(615);select(0);walk(230);tick(62,{up:true});walk(445);tick(30);const snap=E.snapshot(),restored=new Engine(E.L);assert.ok(restored.restore(snap));assert.deepEqual(restored.snapshot(),snap,'moving lift resumes at exactly the saved position');const bad=structuredClone(snap);bad.lifts.lift=-999;assert.ok(!Engine.valid(bad,E.L));
E=new Engine(levels[0]);tick(30);walk(200);tick(90,{left:true});assert.ok(E.rewind());const bad2=E.snapshot();bad2.flags.evil=true;assert.ok(!Engine.valid(bad2,E.L));
fs.writeFileSync(path.join(__dirname,'solution-report.json'),JSON.stringify(report,null,2));
if(process.env.WRITE_ROUTES)fs.writeFileSync(path.join(__dirname,'solutions.json'),JSON.stringify(routes));
console.log('PASS conditions, moving-lift save/restore, invalid save rejection and rewind.');
