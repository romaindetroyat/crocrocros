'use strict';
const assert=require('node:assert/strict'),D=require('../src/levels'),Engine=require('../src/engine');
const tick=(e,n,input={})=>{for(let i=0;i<n;i++)e.step(1/60,input);};
function arena(mode){const l=structuredClone(D.levels[3]);Object.assign(l,{gates:[],crates:[],blocks:[],plates:[],switches:[],targets:[],elephants:[],enemies:[],platforms:[{x:0,y:520,w:l.width,h:160}],zebra:{x:500,y:520,minX:420,maxX:650,starId:'star-3',mode}});const e=new Engine(l);e.p[0].x=450;e.p[2].x=330;tick(e,3);return e;}
function resume(e){const saved=e.snapshot(),copy=new Engine(e.L);assert.ok(copy.restore(saved));assert.deepEqual(copy.snapshot(),saved);return copy;}
let e=arena('curious');e.action();assert.ok(!e.collected['star-3'],'contact alone is not the reward');e=arena('curious');tick(e,100);assert.ok(e.canTakeZebra());e=resume(e);e.action();assert.ok(e.collected['star-3']);assert.ok(!e.canTakeZebra());
e=arena('curious');tick(e,55);e.select(2);tick(e,10);assert.ok(!e.zebra.ready,'changing crocs restarts patient approach');
e=arena('pause');assert.ok(!e.canTakeZebra());tick(e,190);assert.ok(e.zebra.ready);e=resume(e);tick(e,180);assert.ok(!e.zebra.ready,'pause ends');
e=arena('snack');e.select(2);tick(e,1,{action:true});tick(e,30);assert.ok(e.zebra.ready,'pea offers a snack');e=resume(e);tick(e,250);assert.ok(!e.zebra.ready,'snack ends');
e=arena('snack');e.L.gates.push({x:385,y:230,w:28,h:290,requires:['blocked']});e.select(2);tick(e,1,{action:true});tick(e,80);assert.ok(!e.zebra.ready,'cannot feed through a closed gate');
const bad=arena('curious').snapshot();bad.wildlife.zebra.timer=Infinity;assert.ok(!Engine.valid(bad,arena('curious').L));
const encounters=D.levels.filter(l=>l.zebra);assert.equal(encounters.length,5);assert.deepEqual(new Set(encounters.map(l=>l.zebra.mode)),new Set(['curious','snack','pause']));for(const l of encounters){assert.ok(l.exit.x-l.zebra.maxX>350,'encounter is well before the finish');assert.ok(l.platforms.some(p=>p.y===l.zebra.y&&p.x<=l.zebra.minX&&p.x+p.w>=l.zebra.maxX),'supported patrol lane');}
console.log('PASS five authored encounters, three behaviors, patience, snack and pause expiry, wall blocking, exact saves, invalid state rejection.');
