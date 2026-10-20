'use strict';
// Reserve a short, safe staging area only where the full sprite hides a mechanism.
// Collision bodies are narrower than tails, snouts and shields: use drawing bounds.
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function bounds(kind,o){if(kind==='switches')return {x:o.x-30,y:o.y-83,w:60,h:87};if(kind==='plates')return {x:o.x-4,y:o.y-12,w:o.w+8,h:40};if(kind==='ladders')return {x:o.x-25,y:o.y-25,w:50,h:o.h+30};if(kind==='portals')return {x:o.x-36,y:o.y-96,w:72,h:120};if(kind==='targets')return {x:o.x-28,y:o.y-60,w:56,h:88};return {x:o.x-30,y:o.y-30,w:60,h:60};}
function conflicts(l){const hits=[];for(const [hero,p]of l.spawns.entries())for(const kind of ['switches','plates','ladders','portals','targets','keys'])for(const o of l[kind]||[])if(overlap({x:p.x-65,y:p.y-110,w:130,h:122},bounds(kind,o)))hits.push({hero,kind,id:o.id||kind,x:o.x});return hits;}
function clearStarts(levels,routes){for(const [i,l]of levels.entries()){
 if(!conflicts(l).length)continue;
 const shift=160,spawns=structuredClone(l.spawns),leftPlatforms=l.platforms.filter(p=>p.x===0);
 const translate=o=>{if(!o||typeof o!=='object')return;for(const [k,v]of Object.entries(o)){if(['x','minX','maxX','toX','awakeX'].includes(k)&&typeof v==='number')o[k]+=shift;else if(typeof v==='object')translate(v);}};
 translate(l);l.spawns=spawns;l.width+=shift;l.startOffset=shift;l.revision=8;
 for(const p of leftPlatforms){p.x=0;p.w+=shift;}
 // Keep the rally pennant outside the uncluttered starting bay.
 if(routes[i].steps)routes[i].steps.forEach(s=>s.offset+=shift);
 if(conflicts(l).length)throw Error(`Starting area remains obstructed: ${l.id}`);
}}
module.exports=clearStarts;module.exports.conflicts=conflicts;
