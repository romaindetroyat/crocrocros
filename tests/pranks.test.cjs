'use strict';
const assert=require('node:assert/strict'),D=require('../src/levels.js'),Engine=require('../src/engine.js');
const tick=(E,n,input={})=>{for(let i=0;i<n;i++)E.step(1/60,input);};
function arena(kind,hero=0){const L=structuredClone(D.levels[11]);Object.assign(L,{width:1300,platforms:[{x:0,y:520,w:1300,h:160}],gates:[],keys:[],stars:[],ladders:[],switches:[],targets:[],plates:[],crates:[],turrets:[],bridges:[],blocks:[],lifts:[],portals:[],elephants:[],zebra:null,checkpoint:{x:50,y:520},exit:{x:1150,y:520,w:120},spawns:[{x:450,y:520},{x:80,y:520},{x:140,y:520}],enemies:[]});if(kind==='elephant'){L.elephants=[{x:150,y:520,radius:400,requires:['calm']}];L.switches=[{id:'calm',x:900,y:520}];}else if(kind)L.enemies=[{id:'test',kind,x:600,y:520,minX:570,maxX:720,speed:70,dir:-1}];const E=new Engine(L);E.select(hero);tick(E,3);return E;}
function until(E,fn,n=600,input={}){for(let i=0;i<n;i++){if(fn())return;E.step(1/60,input);}assert.fail('expected simulation event did not occur');}
let E,s,copy;
// Zebra encounters have their own normal-input regression suite.

// A visible elephant windup precedes a damaging ground wave.
E=arena('elephant');until(E,()=>E.beasts[0].phase==='windup');assert.equal(E.rebounds,0);assert.equal(E.pranks.length,0);tick(E,50);assert.equal(E.rebounds,0);until(E,()=>E.rebounds>0);assert.ok(E.rebounds>0);
// Jumping clears the SAME wave; the shield must face its origin.
E=arena('elephant');until(E,()=>E.pranks.some(b=>b.kind==='wave'&&b.x>370));tick(E,1,{jump:true});tick(E,75);assert.equal(E.rebounds,0,'jump clears wave');
E=arena('elephant',1);E.L.spawns[0].x=80;E.L.spawns[1].x=450;E.reset();E.select(1);tick(E,1,{left:true});tick(E,320);assert.equal(E.rebounds,0,'front shield stops stomp');E=arena('elephant',1);E.L.spawns[0].x=80;E.L.spawns[1].x=450;E.reset();E.select(1);tick(E,320);assert.ok(E.rebounds>0,'shield facing away fails');
// Hippo sneeze pushes a croc but does not itself kill; a correctly facing guard blocks it.
E=arena('hippo');const before=E.p[0].x;until(E,()=>E.pranks.some(b=>b.kind==='gust'));tick(E,45);assert.ok(E.p[0].x<before-50);assert.equal(E.rebounds,0);
E=arena('hippo',1);E.L.spawns[0].x=80;E.L.spawns[1].x=450;E.reset();E.select(1);tick(E,260);assert.equal(E.p[1].x,450);assert.equal(E.rebounds,0);
// Lion anticipates, leaves the ground and then recovers at a stable landing.
E=arena('lion');until(E,()=>E.enemies[0].phase==='windup');const floor=E.enemies[0].homeY;until(E,()=>E.enemies[0].y<floor-55);s=E.snapshot();copy=new Engine(E.L);assert.ok(copy.restore(s));assert.deepEqual(copy.snapshot(),s);tick(E,15);tick(copy,15);assert.deepEqual(copy.snapshot().wildlife,E.snapshot().wildlife,'pounce resumes at same phase');until(E,()=>E.enemies[0].phase==='recover');assert.equal(E.enemies[0].y,floor);
// Bird carries its coconut into the air; falling coconut hurts, roof blocks it, dodge escapes.
function coconutArena(roof=false){const E=arena('vulture',1);E.L.spawns[0].x=80;E.L.spawns[1].x=450;E.L.enemies[0].x=610;E.L.enemies[0].minX=605;E.L.enemies[0].maxX=615;E.reset();E.select(1);if(roof)tick(E,1,{action:true});until(E,()=>E.enemies[0].phase==='windup');tick(E,25);until(E,()=>E.p[1].x>608,100,{right:true});until(E,()=>E.pranks.some(b=>b.kind==='coconut'));return E;}
E=coconutArena();assert.ok(E.pranks[0].y<420,'nut is released from airborne bird');s=E.snapshot();copy=new Engine(E.L);assert.ok(copy.restore(s));assert.deepEqual(copy.snapshot(),s);until(E,()=>E.rebounds>0,100);assert.ok(E.rebounds>0);
E=coconutArena(true);tick(E,25);assert.equal(E.rebounds,0,'raised shield intercepts coconut');assert.ok(!E.pranks.some(b=>b.kind==='coconut'));
E=coconutArena();tick(E,18,{right:true});assert.equal(E.rebounds,0,'walking out from under drop works');
// Invalid timers/projectiles cannot be injected through imports.
const bad=structuredClone(s);bad.wildlife.pranks[0].vy=Infinity;assert.ok(!Engine.valid(bad,E.L));
console.log('PASS elephant warning/damage/jump/front vs back shield; sneeze shove/block; lion pounce/recovery; bird ascent/drop/damage/roof/dodge; exact mid-attack save/restore and malformed hazard rejection.');
