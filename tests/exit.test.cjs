'use strict';
const assert=require('node:assert/strict'),Engine=require('../src/engine'),{levels}=require('../src/levels');
function corridor(){const L=structuredClone(levels[0]);Object.assign(L,{width:1400,platforms:[{x:0,y:520,w:1400,h:150}],exit:{x:1000,y:520,w:150},spawns:[{x:1200,y:520},{x:1080,y:520},{x:950,y:520}],zebra:null});for(const k of ['gates','bridges','switches','targets','plates','crates','turrets','keys','lifts','ladders','springs','portals','conveyors','blocks','enemies','elephants','stars'])L[k]=[];return L;}
let wins=0,E=new Engine(corridor(),kind=>{if(kind==='win')wins++;});E.step(1/60);assert.ok(!E.won,'one teammate still before the finish');E.select(2);for(let i=0;i<50&&!E.won;i++)E.step(1/60,{right:true});assert.ok(E.won,'one beyond the arch and two in it can finish');E.step(1/60);assert.equal(wins,1,'victory fires once');
E=new Engine(corridor());E.p.forEach((p,i)=>p.x=1200+i*40);const saved=E.snapshot(),resumed=new Engine(E.L);assert.ok(resumed.restore(saved));resumed.step(1/60);assert.ok(resumed.won,'save with all three beyond the arch is no longer stuck');
E=new Engine(corridor());E.p[2].x=E.L.exit.x;E.step(1/60);assert.ok(E.won,'exact arrival threshold counts');
const upper=corridor();upper.platforms.push({x:1000,y:320,w:400,h:25});upper.spawns=[{x:1200,y:320},{x:1250,y:320},{x:1300,y:320}];E=new Engine(upper);E.step(1/60);assert.ok(!E.won,'passing above the exit on another floor does not finish');
// Production return exit: leftward overshoot must count, while its seal remains mandatory.
E=new Engine(levels[8]);E.p.forEach(p=>{p.x=35;p.y=320;});E.step(1/60);assert.ok(!E.won,'overshooting a sealed exit cannot bypass the puzzle');E.flags.home=true;E.step(1/60);assert.ok(E.won,'all three beyond the left-hand exit finish once unsealed');
E=new Engine(levels[8]);E.flags.home=true;E.p.forEach(p=>{p.x=300;p.y=320;});E.step(1/60);assert.ok(!E.won,'right side of a leftward exit is still the approach');
console.log('PASS finish overshoot right/left, mixed positions, last teammate crossing, exact edge, single victory, saved overshoot, wrong floor and sealed exit.');
