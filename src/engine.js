(function(root){
'use strict';
const D=root.CROCO_DATA||(typeof require!=='undefined'?require('./levels.js'):null);
const Wildlife=root.CrocoWildlife||(typeof require!=='undefined'?require('./wildlife.js'):null);
const Expedition=root.CrocoExpedition||(typeof require!=='undefined'?require('./expedition.js'):null);
const Adventure=root.CrocoAdventure||(typeof require!=='undefined'?require('./adventure.js'):null);
const clone=x=>JSON.parse(JSON.stringify(x));
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const body=p=>({x:p.x-p.w/2,y:p.y-p.h,w:p.w,h:p.h});
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
class Engine {
 constructor(level,event=()=>{}){this.L=level;this.event=event;this.reset();}
 reset(){this.p=D.heroes.map((h,i)=>({...h,...this.L.spawns[i],vx:0,vy:0,face:1,ground:false,coyote:0,roof:false,cool:0,charge:0,invul:0,walk:0,climbing:false,onLadder:false,climbPhase:0,shoot:0,land:0,fear:0,pushing:false}));this.active=0;this.flags=clone(this.L.initialFlags||{});this.broken={};this.collected={};this.shots=[];this.clock=0;this.elapsed=0;this.turretTimers={};this.checkpoint=false;this.won=false;this.rebounds=0;this.effects=[];this.history=[];this.histClock=0;this.stateVersion=1;this.elephantPose={};this.enemies=(this.L.enemies||[]).map(e=>({...e,w:42,h:38,asleep:false,stun:0}));this.blocks=Object.fromEntries((this.L.blocks||[]).map(b=>[b.id,b.x]));this.lifts=Object.fromEntries((this.L.lifts||[]).map(l=>[l.id,l.y]));Wildlife.init(this);Adventure.init(this);Expedition.init(this);Expedition.sync(this);}
 flag(id,depth=0){const rule=this.L.logic?.find(r=>r.id===id);if(rule)return Adventure.test(this,rule.when,depth+1);const plate=this.L.plates.find(p=>p.id===id);return !!this.flags[id]||!!this.broken[id]||!!plate?.latchWhen?.some(key=>this.flags[key]);}
 open(o){if(o.when!==undefined&&!Adventure.test(this,o.when))return false;return !!o.latchWhen?.some(id=>this.flag(id))||((o.requires||[]).every(id=>this.flag(id))&&(o.requiresOff||[]).every(id=>!this.flag(id)));}
 solids(who=-1){let a=this.L.platforms.map(x=>({...x})).concat(Adventure.solids(this));for(const b of this.L.bridges)if(this.open(b))a.push({...b});for(const g of this.L.gates)if(!this.open(g)||(who>=0&&g.heroes&&!g.heroes.includes(who)))a.push({...g});for(const c of this.L.crates)if(!this.broken[c.id])a.push({...c,crate:c.id});for(const b of this.L.blocks||[])a.push({...b,x:this.blocks[b.id],railBlock:b.id});for(const l of this.L.lifts||[])a.push({...l,y:this.lifts[l.id],oneway:true});const shield=this.p[1];if(who!==1&&shield.roof)a.push({x:shield.x-48,y:shield.y-87,w:96,h:12,oneway:true,shield:true});return a;}
 select(i){if(i>=0&&i<3){this.active=i;this.event('select',i);}}
 triggerReactor(r){if((this.flag(r.id)&&!r.repeat)||!this.open(r))return false;this.flags[r.id]=true;if(r.note)Adventure.note(this,r.note);this.burst(r.x+r.w/2,r.y,'#f8d47c',24);this.event('reactor',r.id);return true;}
 canTakeZebra(){return Wildlife.canCatch(this);}
 action(){if(this.won)return;if(Wildlife.catch(this))return;const p=this.p[this.active];const sw=!this.adventure&&this.L.switches.find(s=>Math.abs(s.x-p.x)<65&&Math.abs(s.y-p.y)<40);if(sw){if(!this.open(sw)){this.event('lockedTarget','plates');return;}if(sw.toggle||!this.flags[sw.id]){this.flags[sw.id]=sw.toggle?!this.flags[sw.id]:true;this.event('lever',sw.id);this.burst(sw.x,sw.y-40,'#ffdc83',18);}return;}
  const portal=!this.adventure&&(this.L.portals||[]).find(t=>Math.abs(t.x-p.x)<42&&Math.abs(t.y-p.y)<35&&this.open(t));if(portal){p.x=portal.toX;p.y=portal.toY;p.onLadder=false;p.climbing=false;p.vy=0;p.ground=false;p.charge=0;this.event('portal');this.burst(p.x,p.y-40,'#a5dbdb',20);return;}
  if(p.cool>0)return;
  if(this.active===0){p.charge=.35;p.cool=.65;this.event('charge');}
  else if(this.active===1){p.roof=!p.roof;p.cool=.25;this.event('shield',p.roof);}
  else{this.shots.push({x:p.x+p.face*30,y:p.y-38,vx:p.face*620,kind:'pea',life:1.5});p.cool=.38;p.shoot=.26;this.event('shoot');}
 }
 ladderFor(p,direction=0){return (this.L.ladders||[]).find(l=>this.open(l)&&(!l.heroes||l.heroes.includes(this.p.indexOf(p)))&&Math.abs(l.x-p.x)<27&&p.y>=l.y-2&&p.y<=l.y+l.h+10&&!(direction>0&&p.y>=l.y+l.h-.1)&&!(direction<0&&p.y<=l.y+.1));}
 jump(){const p=this.p[this.active];if(this.active===0&&(p.ground||p.coyote>0)){p.vy=-640;p.ground=false;p.coyote=0;this.event('jump');}}
 burst(x,y,c,n=10){for(let i=0;i<n;i++)this.effects.push({x,y,vx:Math.cos(i*2.399)*80,vy:-50-Math.sin(i*2.399)*80,life:.7,c});}
 respawn(i){Expedition.dropOnHit(this,i);Adventure.hit(this,i);const p=this.p[i];const home=Adventure.home(this,i)||(this.checkpoint?{x:this.L.checkpoint.x+(i-1)*65,y:this.L.checkpoint.y}:this.L.spawns[i]);p.x=home.x;p.y=home.y;p.vx=0;p.vy=0;p.invul=2;p.charge=0;p.onLadder=false;p.climbing=false;this.rebounds++;this.event('boing',i);this.burst(p.x,p.y-30,'#fbe3ad');}
 sleepEnemy(e){if(e.essential){e.stun=this.L.expedition?2.4:1;e.phase='recover';e.timer=1.5;e.y=e.homeY-(e.hover||0);this.event('animalStun');return;}if(e.asleep)return;e.asleep=true;e.y=e.homeY;this.flags[e.id]=true;this.burst(e.x,e.y-22,'#e9c17b',12);this.event('enemy');}
 step(dt,input={}){
  if(this.won)return;dt=Math.min(dt,1/30);this.clock+=dt;this.elapsed+=dt;Expedition.sync(this);Wildlife.tick(this,dt);Adventure.before(this,dt,input);
  const shieldBefore={x:this.p[1].x,y:this.p[1].y},riders=this.p.map((p,i)=>i!==1&&this.p[1].roof&&Math.abs(p.y-(this.p[1].y-87))<2&&Math.abs(p.x-this.p[1].x)<48&&p.ground);
  for(const pl of this.L.plates)this.flags[pl.id]=(!pl.blockOnly&&this.p.some((p,i)=>(pl.hero===undefined||pl.hero===i)&&(!pl.roof||p.roof)&&Math.abs(p.y-pl.y)<9&&Math.abs(p.x-(pl.x+pl.w/2))<pl.w/2+10))||(!!pl.acceptBlock&&(this.L.blocks||[]).some(b=>Math.abs(b.y+b.h-pl.y)<3&&this.blocks[b.id]+b.w/2>=pl.x&&this.blocks[b.id]+b.w/2<=pl.x+pl.w));
  for(const [j,e] of (this.L.elephants||[]).entries()){const a=this.elephantPose[j]||0;this.elephantPose[j]=a+clamp((this.open(e)?1:0)-a,-dt*3,dt*3);}
  for(const l of this.L.lifts||[]){const old=this.lifts[l.id],goal=this.open(l)?l.toY:l.y,dy=clamp(goal-old,-l.speed*dt,l.speed*dt);this.lifts[l.id]+=dy;for(const p of this.p)if(Math.abs(p.y-old)<.01&&p.vy>=0&&p.x+p.w/2>l.x&&p.x-p.w/2<l.x+l.w){p.y+=dy;p.vy=0;p.ground=true;}}
  const a=this.p[this.active];const dir=(input.right?1:0)-(input.left?1:0);
  if(input.jump&&!this.ladderFor(a))this.jump();if(input.action)this.action();if(input.interact){if(this.adventure)Adventure.interact(this);else Expedition.interact(this);}
  for(let i=0;i<3;i++){
   const p=this.p[i];p.cool=Math.max(0,p.cool-dt);p.charge=Math.max(0,p.charge-dt);p.invul=Math.max(0,p.invul-dt);p.coyote=Math.max(0,p.coyote-dt);p.shoot=Math.max(0,p.shoot-dt);p.land=Math.max(0,p.land-dt);p.pushing=false;p.fear=(this.L.elephants||[]).some(e=>!this.open(e)&&Math.abs(p.x-e.x)<e.radius)?1:0;
   const size=Adventure.footprint(this,i),mounted=!!this.adventure?.riding[i];if(mounted&&i===this.active&&dir)p.face=dir;if(!mounted){
   p.vx=i===this.active?dir*p.speed:0;if(i===this.active&&dir)p.face=dir;if(p.charge>0)p.vx=p.face*560;
   const ladder=this.ladderFor(p,i===this.active?(input.down?1:input.up?-1:0):0),requested=i===this.active&&ladder&&(input.up||input.down);if(requested)p.onLadder=true;if(!ladder||(i===this.active&&dir))p.onLadder=false;const climbing=ladder&&p.onLadder;p.climbing=!!climbing;if(requested)p.climbPhase+=dt*10;
   if(p.ground){const belt=(this.L.conveyors||[]).find(b=>Math.abs(p.y-b.y)<3&&p.x>b.x&&p.x<b.x+b.w);if(belt)p.vx+=belt.speed;}
   if(p.vx)p.walk+=dt*11;else p.walk*=.9;
   p.x=clamp(p.x+p.vx*dt,30,this.L.width-30);
   for(const s of this.solids(i)){if(s.oneway||climbing)continue;if(overlap({x:p.x-size.w/2,y:p.y-size.h,w:size.w,h:size.h},s)){if(s.railBlock&&!s.windOnly&&i===1&&p.vx){p.pushing=true;const old=this.blocks[s.railBlock],next=clamp(old+p.vx*dt,s.minX,s.maxX),box={...s,x:next};if(!this.solids(-1).some(t=>!t.shield&&t.railBlock!==s.railBlock&&overlap(box,t))){this.blocks[s.railBlock]=next;for(let j=0;j<3;j++)if(j!==i&&Math.abs(this.p[j].y-s.y)<2&&this.p[j].x>old-10&&this.p[j].x<old+s.w+10)this.p[j].x+=next-old;}s.x=this.blocks[s.railBlock];}if(s.crate&&i===0&&p.charge>0&&this.open(s)){this.broken[s.crate]=true;this.burst(s.x+20,s.y+20,'#cf9460',18);this.event('break');continue;}if(p.vx>0)p.x=s.x-size.w/2;else if(p.vx<0)p.x=s.x+s.w+size.w/2;}}
   const previous=p.y;if(climbing){p.x=ladder.x;p.vy=0;p.y=clamp(p.y+(i===this.active?((input.down?1:0)-(input.up?1:0)):0)*250*dt,ladder.y,ladder.y+ladder.h);p.ground=p.y===ladder.y;}else{p.vy+=1500*dt;if(i===1&&p.roof)p.vy=Math.min(p.vy,95);Adventure.wind(this,p,dt);p.y+=p.vy*dt;p.ground=false;
   for(const s of this.solids(i)){
    if(p.x+p.w/2<=s.x||p.x-p.w/2>=s.x+s.w)continue;
    if(p.vy>=0&&previous<=s.y+1&&p.y>=s.y){if(p.vy>240)p.land=.18;p.y=s.y;p.vy=0;p.ground=true;p.coyote=.1;}
    else if(!s.oneway&&p.vy<0&&previous-size.h>=s.y+s.h-1&&p.y-size.h<=s.y+s.h){p.y=s.y+s.h+size.h;p.vy=0;}
   }
   }
   if(!climbing&&p.ground){const spring=(this.L.springs||[]).find(s=>Math.abs(s.y-p.y)<3&&p.x>s.x&&p.x<s.x+s.w&&this.open(s));if(spring){p.vy=-(spring.power||850);p.ground=false;this.event('spring');}}
   }
   for(const key of this.L.keys||[])if(!this.flags[key.id]&&this.open(key)&&(key.hero===undefined||key.hero===i)&&Math.hypot(p.x-key.x,p.y-33-key.y)<40){this.flags[key.id]=true;this.event('key');this.burst(key.x,key.y,'#f5cc69',16);}
   for(const e of this.enemies){if(e.asleep||e.distracted||(this.L.expedition&&e.stun>0))continue;const dx=e.x-p.x,near=Math.abs(dx)<p.w/2+e.w/2+4&&Math.abs(p.y-e.y)<40;if(near){if(i===0&&p.charge>0)this.sleepEnemy(e);else if(i===1&&!p.roof&&Math.sign(dx)===p.face){e.dir=p.face;e.x=clamp(p.x+p.face*(p.w/2+e.w/2+8),e.minX,e.maxX);e.stun=.25;p.x=p.face===1?Math.min(p.x,e.x-p.w/2-e.w/2-3):Math.max(p.x,e.x+p.w/2+e.w/2+3);}else if(p.invul<=0)this.respawn(i);}}
   if(p.y>(this.L.height||620)+120)this.respawn(i);
   for(const star of this.L.stars)if(star.id!==this.L.zebra?.starId&&!this.collected[star.id]&&this.open(star)&&Math.hypot(p.x-star.x,p.y-33-star.y)<46){this.collected[star.id]=true;this.event('star');this.burst(star.x,star.y,'#ffe28a',16);}
  }
  if(this.L.expedition)for(let i=0;i<3;i++)if(riders[i]&&this.p[i].vy>=0){const p=this.p[i],dx=this.p[1].x-shieldBefore.x;const box={x:p.x+dx-p.w/2,y:p.y-p.h,w:p.w,h:p.h-2};if(!this.solids(i).some(s=>!s.shield&&!s.oneway&&overlap(box,s)))p.x+=dx;}
  Adventure.after(this);Expedition.tick(this,dt);
  // A checkpoint is shared only when all three have safely crossed it.
  if(!this.checkpoint&&this.p.every(p=>p.x>this.L.checkpoint.x-100&&Math.abs(p.y-this.L.checkpoint.y)<6&&p.ground)){this.checkpoint=true;this.event('checkpoint');}
  for(const t of this.L.turrets){if(this.flags[t.off]||(t.awakeX&&!this.p.some(p=>p.x>=t.awakeX)))continue;this.turretTimers[t.id]=(this.turretTimers[t.id]??t.period)-dt;if(this.turretTimers[t.id]<=0){this.shots.push({x:t.x-25,y:t.y,vx:t.dir*260,kind:'seed',life:3.2});this.turretTimers[t.id]=t.period;}}
  for(const b of this.shots){const old=b.x,oldY=b.y;b.x+=b.vx*dt;b.y+=(b.vy||0)*dt;b.life-=dt;const reflected=Adventure.reflect(this,b,old,oldY);if(this.adventure&&b.kind==='pea'&&!reflected)this.traces.push({x:old,y:oldY,toX:b.x,toY:b.y,life:.6});
   if(b.kind==='pea'&&b.life>0)Wildlife.feed(this,b,old);
   if(b.kind==='pea'&&b.life>0)for(const e of this.enemies)if(!e.asleep&&Math.abs(b.y-(e.y-22))<27&&Math.min(old,b.x)<=e.x+22&&Math.max(old,b.x)>=e.x-22){this.sleepEnemy(e);b.life=0;break;}
   if(b.kind==='pea'&&b.life>0)for(const target of this.L.targets)if((target.toggle||!this.flags[target.id])&&!reflected&&(this.adventure?Adventure.segment(old,oldY,b.x,b.y,target.x,target.y,25):Math.abs(b.y-target.y)<28&&Math.min(old,b.x)<=target.x+20&&Math.max(old,b.x)>=target.x-20)){b.life=0;if((target.hitDirection&&Math.sign(b.vx)!==target.hitDirection)||(target.requiresPortal&&b.through!==target.requiresPortal)||!this.open(target)){this.burst(target.x,target.y,'#93adab',8);this.event('lockedTarget',target.hitDirection?'direction':target.requiresPortal?'portal':'plates');}else{this.flags[target.id]=target.toggle?!this.flags[target.id]:true;if(target.note)Adventure.note(this,target.note);for(const id of target.flips||[])this.flags[id]=!this.flags[id];this.burst(target.x,target.y,'#ffcf76',20);this.event('target',target.id);}break;}
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
  const exit=this.L.exit,exitLeft=exit.direction?exit.direction==='left':exit.x+exit.w/2<this.L.width/2;
  if(this.open(exit)&&(!exit.room||this.p.every(p=>{const r=this.L.rooms.find(r=>r.id===exit.room);return p.x>r.x+35&&p.x<r.x+r.w-35;}))&&this.p.every(p=>(exitLeft?p.x<=exit.x+exit.w:p.x>=exit.x)&&Math.abs(p.y+(this.adventure?.riding[this.p.indexOf(p)]?87:0)-exit.y)<15)){this.won=true;this.event('win');}
  this.histClock+=dt;if(this.histClock>=.5){this.histClock=0;this.history.push(this.snapshot());if(this.history.length>16)this.history.shift();}
 }
 snapshot(){return {version:1,layoutRevision:this.L.revision||1,levelId:this.L.id,adventure:Adventure.snapshot(this),expedition:Expedition.snapshot(this),p:this.p.map(p=>({x:p.x,y:p.y,vy:p.vy,face:p.face,roof:p.roof,onLadder:!!p.onLadder,charge:p.charge,cool:p.cool})),shots:clone(this.shots),turretTimers:clone(this.turretTimers),active:this.active,flags:clone(this.flags),broken:clone(this.broken),collected:clone(this.collected),elapsed:this.elapsed,wildlife:Wildlife.snapshot(this),lifts:clone(this.lifts),blocks:clone(this.blocks),enemies:this.enemies.map(e=>({id:e.id,x:e.x,dir:e.dir,asleep:e.asleep,stun:e.stun})),checkpoint:this.checkpoint,rebounds:this.rebounds};}
 restore(s){if(!Engine.valid(s,this.L))return false;this.reset();this.p.forEach((p,i)=>Object.assign(p,s.p[i],{invul:1,ground:false}));this.active=s.active;this.shots=clone(s.shots||[]);this.turretTimers=clone(s.turretTimers||{});this.flags=clone(s.flags);this.broken=clone(s.broken);this.collected=clone(s.collected);this.elapsed=s.elapsed;this.lifts=s.lifts?clone(s.lifts):this.lifts;this.blocks=s.blocks?clone(s.blocks):this.blocks;if(s.enemies)s.enemies.forEach((e,i)=>Object.assign(this.enemies[i],e));if(s.wildlife)Wildlife.restore(this,s.wildlife);Expedition.restore(this,s.expedition);Adventure.restore(this,s.adventure);this.checkpoint=s.checkpoint;this.rebounds=s.rebounds||0;(this.L.elephants||[]).forEach((e,j)=>this.elephantPose[j]=this.open(e)?1:0);this.p.forEach((p,i)=>{p.ground=p.vy>=0&&this.solids(i).some(s=>Math.abs(p.y-s.y)<.01&&p.x+p.w/2>s.x&&p.x-p.w/2<s.x+s.w);p.coyote=p.ground?.1:0;});return true;}
 rewind(){if(this.history.length<2)return false;const history=this.history;const state=history[0];const elapsed=this.elapsed;this.restore(state);this.elapsed=elapsed;this.history=[];this.event('rewind');return true;}
 static valid(s,L){const boolMap=(v,ids)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>ids.includes(k)&&typeof v[k]==='boolean');return !!(s&&(!L.adventure||!s.adventure?.riding.some(Boolean)||s.p?.[1]?.roof)&&(!s.shots||Array.isArray(s.shots)&&s.shots.length<100&&s.shots.every(b=>['pea','seed'].includes(b.kind)&&[b.x,b.y,b.vx,b.life].every(Number.isFinite)&&b.life>0&&b.life<=5&&Math.abs(b.vx)<=2000&&(b.vy===undefined||Number.isFinite(b.vy)&&Math.abs(b.vy)<=2000)))&&(!s.turretTimers||Object.entries(s.turretTimers).every(([id,t])=>L.turrets.some(d=>d.id===id)&&Number.isFinite(t)&&t>=0&&t<=20))&&Adventure.valid(s.adventure,L)&&Expedition.valid(s.expedition,L)&&Wildlife.valid(s.wildlife,L)&&(!L.zebra||s.wildlife.zebra.caught===!!s.collected?.[L.zebra.starId])&&s.version===1&&(s.layoutRevision||1)===(L.revision||1)&&s.levelId===L.id&&Array.isArray(s.p)&&s.p.length===3&&s.p.every(p=>p&&Number.isFinite(p.x)&&p.x>=0&&p.x<=L.width&&Number.isFinite(p.y)&&p.y>=-500&&p.y<(L.height||620)+130&&Number.isFinite(p.vy)&&Math.abs(p.vy)<2000&&[-1,1].includes(p.face)&&typeof p.roof==='boolean'&&(p.charge===undefined||Number.isFinite(p.charge)&&p.charge>=0&&p.charge<=.35)&&(p.cool===undefined||Number.isFinite(p.cool)&&p.cool>=0&&p.cool<=.65)&&(p.onLadder===undefined||typeof p.onLadder==='boolean'))&&Number.isInteger(s.active)&&s.active>=0&&s.active<3&&Number.isFinite(s.elapsed)&&s.elapsed>=0&&s.elapsed<1e8&&typeof s.checkpoint==='boolean'&&boolMap(s.flags,[...L.switches,...L.targets,...L.plates,...(L.keys||[]),...(L.enemies||[]),...(L.reactors||[]),...(L.rules||[]),...(L.logic||[]),...(L.mirrors||[]),...(L.milestones||[])].map(x=>x.id).concat(L.stateIds||[]))&&boolMap(s.broken,L.crates.map(x=>x.id))&&boolMap(s.collected,L.stars.map(x=>x.id))&&(!(L.enemies||[]).length||Array.isArray(s.enemies)&&s.enemies.length===L.enemies.length&&s.enemies.every((e,i)=>e.id===L.enemies[i].id&&Number.isFinite(e.x)&&e.x>=L.enemies[i].minX&&e.x<=L.enemies[i].maxX&&[-1,1].includes(e.dir)&&typeof e.asleep==='boolean'&&e.asleep===!!s.flags[e.id]&&Number.isFinite(e.stun)&&e.stun>=0&&e.stun<=(L.expedition?2.4:1)))&&(!L.blocks?.length||s.blocks&&Object.keys(s.blocks).length===L.blocks.length&&L.blocks.every(b=>Number.isFinite(s.blocks[b.id])&&s.blocks[b.id]>=b.minX&&s.blocks[b.id]<=b.maxX))&&(!L.lifts?.length||s.lifts&&Object.keys(s.lifts).length===L.lifts.length&&L.lifts.every(l=>Number.isFinite(s.lifts[l.id])&&s.lifts[l.id]>=Math.min(l.y,l.toY)&&s.lifts[l.id]<=Math.max(l.y,l.toY))));}
}
root.CrocoEngine=Engine;if(typeof module!=='undefined')module.exports=Engine;
})(typeof globalThis!=='undefined'?globalThis:this);
