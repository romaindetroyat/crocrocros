'use strict';
const assert=require('node:assert/strict'),D=require('../src/levels.js'),Engine=require('../src/engine.js');
const E=new Engine(D.levels[3]);const tick=(n,input={})=>{for(let j=0;j<n;j++)E.step(1/60,input);};
function walk(x){let n=0;while(Math.abs(E.p[E.active].x-x)>4&&n++<400)tick(1,{right:E.p[E.active].x<x,left:E.p[E.active].x>x});assert.ok(n<400);}
// Scout cannot move or smash the counterweight.
tick(30);walk(260);tick(62,{up:true});walk(320);tick(30,{right:true,action:true});assert.equal(E.blocks.weight,350);assert.equal(E.flag('weightPlate'),false);assert.equal(Object.keys(E.broken).length,0);
// Heavy hero pushes it, and its exact position survives save and rewind.
E.select(1);walk(260);tick(62,{up:true});walk(420);const moved=E.snapshot();assert.ok(moved.blocks.weight>350);const loaded=new Engine(E.L);assert.ok(loaded.restore(moved));assert.deepEqual(loaded.snapshot(),moved);const bad=structuredClone(moved);bad.blocks.weight=9999;assert.ok(!Engine.valid(bad,E.L));
walk(485);tick(3,{right:true});assert.equal(E.blocks.weight,510);assert.equal(E.flag('weightPlate'),true);walk(260);tick(62,{down:true});assert.equal(E.flag('weightPlate'),true,'counterweight holds gate after everyone leaves');assert.ok(E.open(E.L.gates[0]));
const beforeRewind=E.snapshot();assert.ok(E.rewind());assert.ok(E.blocks.weight<beforeRewind.blocks.weight,'rewind must restore the counterweight too');
console.log('PASS only heavy hero pushes, no smashing, exact save/restore, invalid rail position rejection, unattended plate and rewind.');
