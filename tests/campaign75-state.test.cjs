'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),Engine=require('../src/engine'),D=require('../content/campaign.json'),solutions=require('./campaign75-solutions.json');
let samples=0,cargo=0,duo=0,moving=0,shots=0,notes=0;
for(const L of D.levels){let E=new Engine(L),frames=0;const route=solutions.find(s=>s.levelId===L.id);assert(route,L.id);
 for(const c of route.commands){if(c.select!==undefined)E.select(c.select);else for(let j=0;j<c.n;j++){E.step(1/60,c.input);if(++frames%83===0&&!E.won){const s=JSON.parse(JSON.stringify(E.snapshot()));assert(Engine.valid(s,L),L.id+' valid '+frames+' '+JSON.stringify(s.flags));const R=new Engine(L);assert(R.restore(s),L.id+' restore');assert.deepEqual(JSON.parse(JSON.stringify(R.snapshot())),s,L.id+' roundtrip '+frames);cargo+=!!s.expedition?.items.some(i=>i.holder>=0);duo+=s.adventure.riding.some(Boolean);moving+=L.movers.some(m=>s.adventure.movers[m.id].x!==m.x||s.adventure.movers[m.id].y!==m.y);shots+=s.shots.length>0;notes+=Object.keys(s.flags).some(k=>k.includes('-step-')&&s.flags[k]);E=R;samples++;}}}
 assert(E.won,L.id+' resumed replay');assert.equal(Object.keys(E.collected).length,3,L.id+' stars');assert.equal(E.rebounds,0,L.id+' no recovery shortcuts');
}
const stats={levels:75,stars:225,rebounds:0,resumePoints:samples,resumesWithCargo:cargo,resumesWithPassengers:duo,resumesAfterPlatformMovement:moving,resumesWithProjectiles:shots,resumesDuringScores:notes};fs.writeFileSync(require('path').join(__dirname,'campaign75-state-report.json'),JSON.stringify(stats,null,2));console.log('PASS',stats);
