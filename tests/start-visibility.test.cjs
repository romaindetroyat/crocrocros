'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),D=require('../src/levels'),Engine=require('../src/engine'),{conflicts}=require('../content/clear-starts.cjs');
const report=[];
for(const [i,l]of D.levels.entries()){
 assert.deepEqual(conflicts(l),[],`level ${i+1}: clear full-sprite bounds around starting mechanisms`);
 for(const [hero,p]of l.spawns.entries())assert.ok(l.platforms.some(s=>s.y===p.y&&p.x-D.heroes[hero].w/2>=s.x&&p.x+D.heroes[hero].w/2<=s.x+s.w),`level ${i+1}: hero ${hero} supported`);
 const e=new Engine(l);for(let n=0;n<120;n++)e.step(1/60);assert.equal(e.rebounds,0,`level ${i+1}: safe idle start`);
 assert.ok(!l.plates.some(pl=>e.flag(pl.id)),`level ${i+1}: no plate held at start`);
 report.push({level:i+1,id:l.id,clear:true,entranceAdded:l.startOffset||0});
}
fs.writeFileSync(require('node:path').join(__dirname,'start-visibility-report.json'),JSON.stringify(report,null,2)+'\n');console.log(`PASS ${report.length} clear starts, supported heroes, no accidental plate activation, no initial damage; ${report.filter(r=>r.entranceAdded).length} staging areas corrected.`);
