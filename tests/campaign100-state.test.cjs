'use strict';
const assert=require('node:assert/strict'),PACK=require('../content/campaign.json'),D={...PACK,levels:PACK.archiveLevels||PACK.levels},Engine=require('../src/engine'),X=require('../src/expedition'),solutions=require('./campaign100-solutions.json');
let samples=0;
for(const L of D.levels){const E=new Engine(L),route=solutions.find(s=>s.levelId===L.id);assert(route,L.id);let frames=0;
 for(const c of route.commands){if(c.select!==undefined)E.select(c.select);else for(let j=0;j<c.n;j++){E.step(1/60,c.input);if(++frames%120===0){const s=E.snapshot();assert(Engine.valid(s,L),L.id+' snapshot '+frames);const R=new Engine(L);assert(R.restore(JSON.parse(JSON.stringify(s))),L.id+' restore');assert.deepEqual(R.expedition,s.expedition);samples++;}}}
 assert(E.won,L.id+' replay');assert.equal(Object.keys(E.collected).length,3,L.id+' stars');assert.equal(E.rebounds,0,L.id+' no damage');
 const s=E.snapshot();if(s.expedition?.items.length){s.expedition.items[0].holder=9;assert(!Engine.valid(s,L),L.id+' invalid holder rejected');}
}
console.log('PASS 100 recorded input replays, 300 stars, '+samples+' validated/restored snapshots; invalid owners rejected.');
