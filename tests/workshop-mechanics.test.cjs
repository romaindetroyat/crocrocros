'use strict';
const assert=require('node:assert/strict'),D=require('../src/levels'),Engine=require('../src/engine');
const tick=(e,n,input={})=>{for(let i=0;i<n;i++)e.step(1/60,input);};
function restore(e){const s=e.snapshot(),copy=new Engine(e.L);assert.ok(copy.restore(s));assert.deepEqual(copy.snapshot(),s);return copy;}
let e=new Engine(D.workshop[1]);tick(e,120);assert.equal(e.rebounds,0);assert.equal(e.p[0].y,1400);assert.ok(Engine.valid(e.snapshot(),e.L));
// Bodies cannot replace a wind cart or a real counterweight.
e.p[1].x=682;tick(e,3);assert.equal(e.flag('wind'),false);
e=new Engine(D.workshop[1]);const r=e.L.reactors[0];e.shots.push({kind:'pea',x:r.x+30,y:r.y-10,vx:0,life:1});tick(e,3);assert.equal(e.flag('rain'),false);
e.pranks.push({kind:'coconut',x:r.x+r.w/2,y:r.y-20,vx:0,vy:200,life:2,ground:r.y,hit:0});tick(e,12);assert.equal(e.flag('rain'),true);e=restore(e);tick(e,3);assert.equal(e.enemies[1].asleep,true);
// An essential animal can be stunned, but cannot be removed before its puzzle.
e=new Engine(D.workshop[1]);e.sleepEnemy(e.enemies[1]);assert.equal(e.enemies[1].asleep,false);assert.ok(e.enemies[1].stun>0);e=restore(e);
// Wrong-side gust cannot magically advance the cart. Correct gust respects the rail.
e=new Engine(D.workshop[1]);e.pranks.push({kind:'gust',x:540,y:1364,vx:330,vy:0,life:.62,ground:1400,hit:0});tick(e,20);assert.equal(e.blocks.windCart,650);assert.equal(e.flag('wind'),true);e=restore(e);
// Descending lift must not pull a waiting passenger through the floor.
e=new Engine(D.workshop[1]);e.flags.rain=true;e.flags.wind=true;e.blocks.windCart=650;e.lifts.lift=950;e.p[2].x=390;e.p[2].y=1400;tick(e,220);assert.equal(e.p[2].y,1400);assert.equal(e.rebounds,0);e.select(2);tick(e,1,{action:true});tick(e,200);assert.equal(e.p[2].y,950);restore(e);
// Every scripted route survives real save/reload checkpoints, including the tall rooms.
for(const route of require('./workshop-solutions.json')){e=new Engine(D.workshop.find(l=>l.id===route.levelId));for(const [i,c]of route.commands.entries()){if(c.select!==undefined)e.select(c.select);else tick(e,c.n,c.input);if(!e.won&&i%9===0&&!e.shots.length&&e.p.every(p=>!p.charge&&!p.vy))e=restore(e);}assert.ok(e.won,route.levelId+' after reloads');assert.equal(e.rebounds,0);}
// Releasing a controller retracts the roof route; the last shot cannot be fired early.
e=new Engine(D.workshop[2]);const sky=e.L.bridges.find(b=>b.id==='sky'),target=e.L.targets.find(t=>t.id==='finish');e.flags.b=true;assert.equal(e.open(sky),false);e.flags.guard=true;assert.equal(e.open(sky),true);e.flags.b=false;assert.equal(e.open(sky),false);assert.equal(e.open(target),false);const invalid=e.snapshot();invalid.p[0].y=9999;assert.equal(Engine.valid(invalid,e.L),false);
console.log('PASS vertical bounds, wind cart, animal-only receptor, essential-animal recovery, waiting lift passenger, 3 routes with reloads, reversible circuits and invalid saves.');
