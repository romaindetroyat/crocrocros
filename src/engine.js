(function(root){
'use strict';
const D=root.CROCO_DATA||(typeof require!=='undefined'?require('./levels.js'):null);
const Wildlife=root.CrocoWildlife||(typeof require!=='undefined'?require('./wildlife.js'):null);
const clone=x=>JSON.parse(JSON.stringify(x));
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const body=p=>({x:p.x-p.w/2,y:p.y-p.h,w:p.w,h:p.h});
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
class Engine {
 constructor(level,event=()=>{}){this.L=level;this.event=event;this.reset();}
 reset(){this.p=D.heroes.map((h,i)=>({...h,...this.L.spawns[i],vx:0,vy:0,face:1,ground:false,coyote:0,roof:false,cool:0,charge:0,invul:0,walk:0,climbing:false,onLadder:false,climbPhase:0,shoot:0,land:0,fear:0,pushing:false}));this.active=0;this.flags={};this.broken={};this.collected={};this.shots=[];this.clock=0;this.elapsed=0;this.turretTimers={};this.checkpoint=false;this.won=false;this.rebounds=0;this.effects=[];this.history=[];this.histClock=0;this.stateVersion=1;this.elephantPose={};this.enemies=(this.L.enemies||[]).map(e=>({...e,w:42,h:38,asleep:false,stun:0}));this.blocks=Object.fromEntries((this.L.blocks||[]).map(b=>[b.id,b.x]));this.lifts=Object.fromEntries((this.L.lifts||[]).map(l=>[l.id,l.y]));Wildlife.init(this);}
 flag(id){const plate=this.L.plates.find(p=>p.id===id);return !!this.flags[id]||!!this.broken[id]||!!plate?.latchWhen?.some(key=>this.flags[key]);}
 open(o){return !!o.latchWhen?.some(id=>this.flag(id))||((o.requires||[]).every(id=>this.flag(id))&&(o.requiresOff||[]).every(id=>!this.flag(id)));}
 solids(who=-1){let a=this.L.platforms.map(x=>({...x}));for(const b of this.L.bridges)if(this.open(b))a.push({...b});for(const g of this.L.gates)if(!this.open(g))a.push({...g});for(const c of this.L.crates)if(!this.broken[c.id])a.push({...c,crate:c.id});for(const b of this.L.blocks||[])a.push({...b,x:this.blocks[b.id],railBlock:b.id});for(const l of this.L.lifts||[])a.push({...l,y:this.lifts[l.id],oneway:true});const shield=this.p[1];if(who!==1&&shield.roof)a.push({x:shield.x-48,y:shield.y-87,w:96,h:12,oneway:true,shield:true});return a;}
 select(i){if(i>=0&&i<3){this.active=i;this.event('select',i);}}
 canTakeZebra(){return Wildlife.canCatch(this);}
 action(){if(this.won)return;if(Wildlife.catch(this))return;const p=this.p[this.active];const sw=this.L.switches.find(s=>Math.abs(s.x-p.x)<65&&Math.abs(s.y-p.y)<40);if(sw){if(sw.toggle||!this.flags[sw.id]){this.flags[sw.id]=sw.toggle?!this.flags[sw.id]:true;this.event('lever',sw.id);this.burst(sw.x,sw.y-40,'#ffdc83',18);}return;}
  const portal=(this.L.portals||[]).find(t=>Math.abs(t.x-p.x)<42&&Math.abs(t.y-p.y)<35&&this.open(t));if(portal){p.x=portal.toX;p.y=portal.toY;p.onLadder=false;p.climbing=false;p.vy=0;p.ground=false;p.charge=0;this.event('portal');this.burst(p.x,p.y-40,'#a5dbdb',20);return;}
  if(p.cool>0)return;
  if(this.active===0){p.charge=.35;p.cool=.65;this.event('charge');}
  else if(this.active===1){p.roof=!p.roof;p.cool=.25;this.event('shield',p.roof);}
  else{this.shots.push({x:p.x+p.face*30,y:p.y-38,vx:p.face*620,kind:'pea',life:1.5});p.cool=.38;p.shoot=.26;this.event('shoot');}
 }
 ladderFor(p){return (this.L.ladders||[]).find(l=>Math.abs(l.x-p.x)<27&&p.y>=l.y-2&&p.y<=l.y+l.h+10);}
 jump(){const p=this.p[this.active];if(this.active===0&&(p.ground||p.coyote>0)){p.vy=-640;p.ground=false;p.coyote=0;this.event('jump');}}
 burst(x,y,c,n=10){for(let i=0;i<n;i++)this.effects.push({x,y,vx:Math.cos(i*2.399)*80,vy:-50-Math.sin(i*2.399)*80,life:.7,c});}
 respawn(i){const p=this.p[i];const home=this.checkpoint?{x:this.L.checkpoint.x+(i-1)*65,y:this.L.checkpoint.y}:this.L.spawns[i];p.x=home.x;p.y=home.y;p.vx=0;p.vy=0;p.invul=2;p.charge=0;p.onLadder=false;p.climbing=false;this.rebounds++;this.event('boing',i);this.burst(p.x,p.y-30,'#fbe3ad');}
 sleepEnemy(e){if(e.asleep)return;e.asleep=true;e.y=e.homeY;this.flags[e.id]=true;this.burst(e.x,e.y-22,'#e9c17b',12);this.event('enemy');}
 step(dt,input={}){
  if(this.won)return;dt=Math.min(dt,1/30);this.clock+=dt;this.elapsed+=dt;Wildlife.tick(this,dt);
  for(const pl of this.L.plates)this.flags[pl.id]=this.p.some((p,i)=>(pl.hero===undefined||pl.hero===i)&&(!pl.roof||p.roof)&&Math.abs(p.y-pl.y)<9&&Math.abs(p.x-(pl.x+pl.w/2))<pl.w/2+10)||(!!pl.acceptBlock&&(this.L.blocks||[]).some(b=>Math.abs(b.y+b.h-pl.y)<3&&this.blocks[b.id]+b.w/2>=pl.x&&this.blocks[b.id]+b.w/2<=pl.x+pl.w));
  for(const [j,e] of (this.L.elephants||[]).entries()){const a=this.elephantPose[j]||0;this.elephantPose[j]=a+clamp((this.open(e)?1:0)-a,-dt*3,dt*3);}
  for(const l of this.L.lifts||[]){const old=this.lifts[l.id],goal=this.open(l)?l.toY:l.y,dy=clamp(goal-old,-l.speed*dt,l.speed*dt);this.lifts[l.id]+=dy;for(const p of this.p)if(Math.abs(p.y-old)<2&&p.vy>=0&&p.x+p.w/2>l.x&&p.x-p.w/2<l.x+l.w){p.y+=dy;p.vy=0;p.ground=true;}}
  const a=this.p[this.active];const dir=(input.right?1:0)-(input.left?1:0);
  if(input.jump&&!this.ladderFor(a))this.jump();if(input.action)this.action();
  for(let i=0;i<3;i++){
   const p=this.p[i];p.cool=Math.max(0,p.cool-dt);p.charge=Math.max(0,p.charge-dt);p.invul=Math.max(0,p.invul-dt);p.coyote=Math.max(0,p.coyote-dt);p.shoot=Math.max(0,p.shoot-dt);p.land=Math.max(0,p.land-dt);p.pushing=false;p.fear=(this.L.elephants||[]).some(e=>!this.open(e)&&Math.abs(p.x-e.x)<e.radius)?1:0;
   p.vx=i===this.active?dir*p.speed:0;if(i===this.active&&dir)p.face=dir;if(p.charge>0)p.vx=p.face*560;
   const ladder=this.ladderFor(p),requested=i===this.active&&ladder&&(input.up||input.down);if(requested)p.onLadder=true;if(!ladder||(i===this.active&&dir))p.onLadder=false;const climbing=ladder&&p.onLadder;p.climbing=!!climbing;if(requested)p.climbPhase+=dt*10;
   if(p.ground){const belt=(this.L.conveyors||[]).find(b=>Math.abs(p.y-b.y)<3&&p.x>b.x&&p.x<b.x+b.w);if(belt)p.vx+=belt.speed;}
   if(p.vx)p.walk+=dt*11;else p.walk*=.9;
   p.x=clamp(p.x+p.vx*dt,30,this.L.width-30);
   for(const s of this.solids(i)){if(s.oneway||climbing)continue;if(overlap(body(p),s)){if(s.railBlock&&i===1&&p.vx){p.pushing=true;const old=this.blocks[s.railBlock],next=clamp(old+p.vx*dt,s.minX,s.maxX),box={...s,x:next};if(!this.solids(-1).some(t=>!t.shield&&t.railBlock!==s.railBlock&&overlap(box,t))){this.blocks[s.railBlock]=next;for(let j=0;j<3;j++)if(j!==i&&Math.abs(this.p[j].y-s.y)<2&&this.p[j].x>old-10&&this.p[j].x<old+s.w+10)this.p[j].x+=next-old;}s.x=this.blocks[s.railBlock];}if(s.crate&&i===0&&p.charge>0&&this.open(s)){this.broken[s.crate]=true;this.burst(s.x+20,s.y+20,'#cf9460',18);this.event('break');continue;}if(p.vx>0)p.x=s.x-p.w/2;else if(p.vx<0)p.x=s.x+s.w+p.w/2;}}
   const previous=p.y;if(climbing){p.x=ladder.x;p.vy=0;p.y=clamp(p.y+(i===this.active?((input.down?1:0)-(input.up?1:0)):0)*250*dt,ladder.y,ladder.y+ladder.h);p.ground=p.y===ladder.y;}else{p.vy+=1500*dt;if(i===1&&p.roof)p.vy=Math.min(p.vy,95);p.y+=p.vy*dt;p.ground=false;
   for(const s of this.solids(i)){
    if(p.x+p.w/2<=s.x||p.x-p.w/2>=s.x+s.w)continue;
    if(p.vy>=0&&previous<=s.y+1&&p.y>=s.y){if(p.vy>240)p.land=.18;p.y=s.y;p.vy=0;p.ground=true;p.coyote=.1;}
    else if(!s.oneway&&p.vy<0&&previous-p.h>=s.y+s.h-1&&p.y-p.h<=s.y+s.h){p.y=s.y+s.h+p.h;p.vy=0;}
   }
   }
   if(!climbing&&p.ground){const spring=(this.L.springs||[]).find(s=>Math.abs(s.y-p.y)<3&&p.x>s.x&&p.x<s.x+s.w&&this.open(s));if(spring){p.vy=-850;p.ground=false;this.event('spring');}}
   for(const key of this.L.keys||[])if(!this.flags[key.id]&&(key.hero===undefined||key.hero===i)&&Math.hypot(p.x-key.x,p.y-33-key.y)<40){this.flags[key.id]=true;this.event('key');this.burst(key.x,key.y,'#f5cc69',16);}
   for(const e of this.enemies){if(e.asleep)continue;const dx=e.x-p.x,near=Math.abs(dx)<p.w/2+e.w/2+4&&Math.abs(p.y-e.y)<40;if(near){if(i===0&&p.charge>0)this.sleepEnemy(e);else if(i===1&&!p.roof&&Math.sign(dx)===p.face){e.dir=p.face;e.x=clamp(p.x+p.face*(p.w/2+e.w/2+8),e.minX,e.maxX);e.stun=.25;p.x=p.face===1?Math.min(p.x,e.x-p.w/2-e.w/2-3):Math.max(p.x,e.x+p.w/2+e.w/2+3);}else if(p.invul<=0)this.respawn(i);}}
   if(p.y>740)this.respawn(i);
   for(const star of this.L.stars)if(star.id!==this.L.zebra?.starId&&!this.collected[star.id]&&Math.hypot(p.x-star.x,p.y-33-star.y)<46){this.collected[star.id]=true;this.event('star');this.burst(star.x,star.y,'#ffe28a',16);}
  }
  // A checkpoint is shared only when all three have safely crossed it.
  if(!this.checkpoint&&this.p.every(p=>p.x>this.L.checkpoint.x-100&&p.y<=525&&p.ground)){this.checkpoint=true;this.event('checkpoint');}
  for(const t of this.L.turrets){if(this.flags[t.off]||(t.awakeX&&!this.p.some(p=>p.x>=t.awakeX)))continue;this.turretTimers[t.id]=(this.turretTimers[t.id]??t.period)-dt;if(this.turretTimers[t.id]<=0){this.shots.push({x:t.x-25,y:t.y,vx:t.dir*260,kind:'seed',life:3.2});this.turretTimers[t.id]=t.period;}}
  for(const b of this.shots){const old=b.x;b.x+=b.vx*dt;b.life-=dt;
   if(b.kind==='pea'&&b.life>0)Wildlife.feed(this,b,old);
   if(b.kind==='pea'&&b.life>0)for(const e of this.enemies)if(!e.asleep&&Math.abs(b.y-(e.y-22))<27&&Math.min(old,b.x)<=e.x+22&&Math.max(old,b.x)>=e.x-22){this.sleepEnemy(e);b.life=0;break;}
   if(b.kind==='pea'&&b.life>0)for(const target of this.L.targets)if(!this.flags[target.id]&&Math.abs(b.y-target.y)<28&&Math.min(old,b.x)<=target.x+20&&Math.max(old,b.x)>=target.x-20){b.life=0;if((target.hitDirection&&Math.sign(b.vx)!==target.hitDirection)||!this.open(target)){this.burst(target.x,target.y,'#93adab',8);this.event('lockedTarget',target.hitDirection?'direction':'plates');}else{this.flags[target.id]=true;this.burst(target.x,target.y,'#ffcf76',20);this.event('target',target.id);}break;}
   if(b.kind==='seed'){
    const sh=this.p[1];if(!sh.roof&&Math.abs(b.y-(sh.y-40))<42&&(b.vx<0?sh.face===1:sh.face===-1)&&Math.min(old,b.x)<sh.x+43&&Math.max(old,b.x)>sh.x-43){b.life=0;this.burst(b.x,b.y,'#eac67a',4);this.event('block');}
    if(b.life>0)for(let i=0;i<3;i++){const p=this.p[i];if(p.invul<=0&&overlap({x:b.x-5,y:b.y-5,w:10,h:10},body(p))){this.respawn(i);b.life=0;break;}}
   }
   for(const s of this.solids(-1)){if(s.shield)continue;if(overlap({x:b.x-3,y:b.y-3,w:6,h:6},s))b.life=0;}
  }
  this.shots=this.shots.filter(b=>b.life>0);
  Wildlife.impacts(this,dt);
  this.effects=this.effects.filter(e=>{e.x+=e.vx*dt;e.y+=e.vy*dt;e.vy+=180*dt;e.life-=dt;return e.life>0;});
  // The finish extends from the arch towards the nearest world edge, including overshoot.
  // Keep its elevation and mechanism conditions: a different floor is not an arrival.
  const exit=this.L.exit,exitLeft=exit.x+exit.w/2<this.L.width/2;
  if(this.open(exit)&&this.p.every(p=>(exitLeft?p.x<=exit.x+exit.w:p.x>=exit.x)&&Math.abs(p.y-exit.y)<15)){this.won=true;this.event('win');}
  this.histClock+=dt;if(this.histClock>=.5){this.histClock=0;this.history.push(this.snapshot());if(this.history.length>16)this.history.shift();}
 }
 snapshot(){return {version:1,layoutRevision:this.L.revision||1,levelId:this.L.id,p:this.p.map(p=>({x:p.x,y:p.y,vy:p.vy,face:p.face,roof:p.roof,onLadder:!!p.onLadder})),active:this.active,flags:clone(this.flags),broken:clone(this.broken),collected:clone(this.collected),elapsed:this.elapsed,wildlife:Wildlife.snapshot(this),lifts:clone(this.lifts),blocks:clone(this.blocks),enemies:this.enemies.map(e=>({id:e.id,x:e.x,dir:e.dir,asleep:e.asleep,stun:e.stun})),checkpoint:this.checkpoint,rebounds:this.rebounds};}
 restore(s){if(!Engine.valid(s,this.L))return false;this.reset();this.p.forEach((p,i)=>Object.assign(p,s.p[i],{invul:1,ground:false}));this.active=s.active;this.flags=clone(s.flags);this.broken=clone(s.broken);this.collected=clone(s.collected);this.elapsed=s.elapsed;this.lifts=s.lifts?clone(s.lifts):this.lifts;this.blocks=s.blocks?clone(s.blocks):this.blocks;if(s.enemies)s.enemies.forEach((e,i)=>Object.assign(this.enemies[i],e));if(s.wildlife)Wildlife.restore(this,s.wildlife);this.checkpoint=s.checkpoint;this.rebounds=s.rebounds||0;(this.L.elephants||[]).forEach((e,j)=>this.elephantPose[j]=this.open(e)?1:0);return true;}
 rewind(){if(this.history.length<2)return false;const history=this.history;const state=history[0];const elapsed=this.elapsed;this.restore(state);this.elapsed=elapsed;this.history=[];this.event('rewind');return true;}
 static valid(s,L){const boolMap=(v,ids)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>ids.includes(k)&&typeof v[k]==='boolean');return !!(s&&Wildlife.valid(s.wildlife,L)&&(!L.zebra||s.wildlife.zebra.caught===!!s.collected?.[L.zebra.starId])&&s.version===1&&(s.layoutRevision||1)===(L.revision||1)&&s.levelId===L.id&&Array.isArray(s.p)&&s.p.length===3&&s.p.every(p=>p&&Number.isFinite(p.x)&&p.x>=0&&p.x<=L.width&&Number.isFinite(p.y)&&p.y>=-500&&p.y<750&&Number.isFinite(p.vy)&&Math.abs(p.vy)<2000&&[-1,1].includes(p.face)&&typeof p.roof==='boolean'&&(p.onLadder===undefined||typeof p.onLadder==='boolean'))&&Number.isInteger(s.active)&&s.active>=0&&s.active<3&&Number.isFinite(s.elapsed)&&s.elapsed>=0&&s.elapsed<1e8&&typeof s.checkpoint==='boolean'&&boolMap(s.flags,[...L.switches,...L.targets,...L.plates,...(L.keys||[]),...(L.enemies||[])].map(x=>x.id))&&boolMap(s.broken,L.crates.map(x=>x.id))&&boolMap(s.collected,L.stars.map(x=>x.id))&&(!(L.enemies||[]).length||Array.isArray(s.enemies)&&s.enemies.length===L.enemies.length&&s.enemies.every((e,i)=>e.id===L.enemies[i].id&&Number.isFinite(e.x)&&e.x>=L.enemies[i].minX&&e.x<=L.enemies[i].maxX&&[-1,1].includes(e.dir)&&typeof e.asleep==='boolean'&&e.asleep===!!s.flags[e.id]&&Number.isFinite(e.stun)&&e.stun>=0&&e.stun<=1))&&(!L.blocks?.length||s.blocks&&Object.keys(s.blocks).length===L.blocks.length&&L.blocks.every(b=>Number.isFinite(s.blocks[b.id])&&s.blocks[b.id]>=b.minX&&s.blocks[b.id]<=b.maxX))&&(!L.lifts?.length||s.lifts&&Object.keys(s.lifts).length===L.lifts.length&&L.lifts.every(l=>Number.isFinite(s.lifts[l.id])&&s.lifts[l.id]>=Math.min(l.y,l.toY)&&s.lifts[l.id]<=Math.max(l.y,l.toY))));}
}
root.CrocoEngine=Engine;if(typeof module!=='undefined')module.exports=Engine;
})(typeof globalThis!=='undefined'?globalThis:this);
