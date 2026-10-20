(function(root){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const states=['patrol','windup','attack','recover'];
// Wildlife uses simulation time. Warnings, attacks and collectibles all survive saves.
const Wildlife={
 init(E){
  E.enemies.forEach(e=>Object.assign(e,{homeY:e.y,phase:'patrol',timer:1.5,anim:0,aim:e.x,attackDir:e.dir}));
  E.beasts=(E.L.elephants||[]).map(()=>({phase:'patrol',timer:2,anim:0}));
  E.pranks=[];E.zebra=E.L.zebra?{...E.L.zebra,dir:-1,phase:'graze',anim:0,hop:0,ready:false,caught:false,timer:0,patience:0,watchX:null,watchHero:-1}:null;
 },
 canCatch(E){const z=E.zebra,p=E.p[E.active];return !!z&&!z.caught&&z.ready&&Math.abs(z.x-p.x)<95&&Math.abs(z.y-p.y)<45;},
 catch(E){if(!this.canCatch(E))return false;const z=E.zebra;z.caught=true;z.ready=false;z.phase='caught';E.collected[z.starId]=true;E.burst(z.x,z.y-75,'#ffe487',32);E.event('zebra');return true;},
 feed(E,b,old){const z=E.zebra;if(!z||z.caught||z.mode!=='snack'||Math.abs(b.y-(z.y-38))>28||Math.min(old,b.x)>z.x+30||Math.max(old,b.x)<z.x-30)return false;
  if(E.solids(-1).some(s=>!s.shield&&s.y<b.y+3&&s.y+s.h>b.y-3&&s.x<Math.max(old,z.x)&&s.x+s.w>Math.min(old,z.x)))return false;
  z.timer=4;z.phase='snack';z.ready=true;b.life=0;E.burst(z.x,z.y-55,'#a6c66a',8);E.event('zebraReady');return true;
 },
 tick(E,dt){
  const p=E.p[E.active];
  for(const e of E.enemies){e.anim+=dt;if(e.asleep)continue;e.stun=Math.max(0,e.stun-dt);e.timer-=dt;
   const canSee=Math.abs(p.y-e.homeY)<65&&Math.abs(p.x-e.x)<(e.kind==='vulture'?260:240)&&!E.solids().some(s=>!s.shield&&!s.oneway&&s.h>50&&s.x>Math.min(e.x,p.x)+30&&s.x<Math.max(e.x,p.x)-30&&s.y<e.homeY&&s.y+s.h>e.homeY-30);
   if(e.stun){e.phase='recover';e.timer=Math.max(e.timer,.65);e.y=e.homeY;continue;}
   if(e.phase==='patrol'){
    e.y=e.homeY+(e.kind==='vulture'?Math.sin(e.anim*4)*12:0);e.x=clamp(e.x+e.dir*e.speed*dt,e.minX,e.maxX);if(e.x===e.minX||e.x===e.maxX)e.dir*=-1;
    if(canSee&&e.timer<=0){e.phase='windup';e.timer=e.kind==='hippo'?1.15:e.kind==='lion'?.9:1.1;e.attackDir=Math.sign(p.x-e.x)||e.dir;e.dir=e.attackDir;e.aim=clamp(p.x,e.minX-150,e.maxX+150);E.event('animalWarn',e.kind);}
   }else if(e.phase==='windup'){
    if(e.kind==='vulture'){e.y=e.homeY-115*(1-Math.max(0,e.timer)/1.1);e.x=clamp(e.x+(e.aim-e.x)*dt*6,e.minX,e.maxX);}
    if(e.timer<=0){e.phase='attack';e.timer=e.kind==='lion'?.65:.5;
     if(e.kind==='hippo'){E.pranks.push({kind:'gust',x:e.x+e.dir*32,y:e.homeY-36,vx:e.dir*330,vy:0,life:.62,ground:e.homeY,hit:0});E.event('sneeze');}
     if(e.kind==='vulture'){E.pranks.push({kind:'coconut',x:e.x,y:e.y-15,vx:0,vy:30,life:3,ground:e.homeY,hit:0});E.event('coconut');}
    }
   }else if(e.phase==='attack'){
    if(e.kind==='lion'){e.x=clamp(e.x+e.attackDir*e.speed*2.4*dt,e.minX,e.maxX);e.y=e.homeY-Math.sin(clamp(1-e.timer/.65,0,1)*Math.PI)*72;}
    if(e.timer<=0){e.phase='recover';e.timer=e.kind==='lion'?2:2.6;e.y=e.homeY;}
   }else if(e.timer<=0){e.phase='patrol';e.timer=1.3;e.y=e.homeY;}
  }
  (E.L.elephants||[]).forEach((def,i)=>{const e=E.beasts[i];e.anim+=dt;e.timer-=dt;
   if(E.open(def)){e.phase='patrol';e.timer=2;return;}
   const inFront=p.x>def.x+100&&p.x<def.x+490&&Math.abs(p.y-def.y)<45;
   if(e.phase==='patrol'&&e.timer<=0&&inFront){e.phase='windup';e.timer=1.3;E.event('animalWarn','elephant');}
   else if(e.phase==='windup'&&e.timer<=0){e.phase='attack';e.timer=.45;E.pranks.push({kind:'wave',x:def.x+130,y:def.y-7,vx:260,vy:0,life:1.45,ground:def.y,hit:0});E.burst(def.x+130,def.y,'#eac28e',24);E.event('stomp');}
   else if(e.phase==='attack'&&e.timer<=0){e.phase='recover';e.timer=3.4;}
   else if(e.phase==='recover'&&e.timer<=0){e.phase='patrol';e.timer=.4;}
  });
  const z=E.zebra;if(z){z.anim+=dt;z.hop=Math.max(0,z.hop-dt);z.caught=!!E.collected[z.starId];
   const wasReady=z.ready;z.ready=false;
   if(z.caught){z.phase='caught';return;}
   const same=Math.abs(p.y-z.y)<45,near=same&&Math.abs(p.x-z.x)<240;
   const move=speed=>{z.x=clamp(z.x+z.dir*speed*dt,z.minX,z.maxX);if(z.x===z.minX||z.x===z.maxX){z.dir*=-1;z.hop=.7;}};
   if(z.mode==='curious'){
    const still=z.watchHero===E.active&&z.watchX!==null&&Math.abs(p.x-z.watchX)<.5&&Math.abs(p.vy)<1;
    z.patience=near&&still?Math.min(2,z.patience+dt):0;z.watchX=p.x;z.watchHero=E.active;
    if(z.patience>=1.2){z.dir=Math.sign(p.x-z.x)||z.dir;z.phase='approach';if(Math.abs(p.x-z.x)>65)z.x=clamp(z.x+z.dir*105*dt,z.minX,z.maxX);else{z.phase='curious';z.ready=true;}}
    else{z.phase='graze';if(near&&!still){z.phase='run';z.dir=Math.sign(z.x-p.x)||1;move(130);}}
   }else if(z.mode==='pause'){
    // A readable cycle: a short trot, then three seconds of grazing.
    z.ready=z.anim%6>=3;z.phase=z.ready?'graze':'run';if(!z.ready)move(170);
   }else if(z.timer>0){z.timer=Math.max(0,z.timer-dt);z.phase='snack';z.ready=z.timer>0;}
   else{z.phase='run';move(190);}
   if(z.ready&&!wasReady&&near)E.event('zebraReady');
  }
 },
 impacts(E,dt){
  const solids=E.solids(-1);
  for(const b of E.pranks){b.life-=dt;const oldY=b.y,oldX=b.x;b.x+=b.vx*dt;b.vy+=b.kind==='coconut'?1050*dt:0;b.y+=b.vy*dt;
   const sh=E.p[1];
   if(b.kind==='coconut'){
    if(sh.roof&&b.vy>0&&oldY<=sh.y-80&&b.y>=sh.y-97&&Math.abs(b.x-sh.x)<58){b.life=0;E.burst(b.x,b.y,'#e6be75',14);E.event('block');continue;}
    if(b.vy>0&&solids.some(s=>!s.shield&&oldY+9<=s.y+1&&b.y+9>=s.y&&b.x>s.x-8&&b.x<s.x+s.w+8)){b.life=0;E.burst(b.x,b.y,'#a97a4c',12);continue;}
   }else if(solids.some(s=>!s.shield&&!s.oneway&&s.h>45&&s.x>Math.min(oldX,b.x)-3&&s.x<Math.max(oldX,b.x)+3&&s.y<b.ground-10&&s.y+s.h>b.ground-10)){b.life=0;continue;}
   for(let i=0;i<3;i++){const p=E.p[i];if(b.hit&(1<<i))continue;const near=b.kind==='wave'?Math.abs(p.x-b.x)<p.w/2+18&&Math.abs(p.y-b.ground)<20:Math.abs(p.x-b.x)<p.w/2+(b.kind==='gust'?35:10)&&b.y>p.y-p.h-8&&b.y<p.y+4;if(!near)continue;
    b.hit|=1<<i;
    if(i===1&&!p.roof&&Math.sign(b.vx)===-p.face){b.life=0;E.burst(b.x,b.y,'#f4d585',8);E.event('block');break;}
    if(b.kind==='gust'){
     // A sneeze shoves, it does not remove a life. Solid walls still stop the croc.
     const next=clamp(p.x+Math.sign(b.vx)*94,30,E.L.width-30);const body={x:Math.min(p.x,next)-p.w/2,y:p.y-p.h+2,w:Math.abs(next-p.x)+p.w,h:p.h-4};
     if(!solids.some(s=>!s.shield&&!s.oneway&&body.x<s.x+s.w&&body.x+body.w>s.x&&body.y<s.y+s.h&&body.y+body.h>s.y))p.x=next;p.fear=1;E.event('gust');
    }else if(p.invul<=0){E.respawn(i);b.life=0;}
   }
  }
  E.pranks=E.pranks.filter(b=>b.life>0&&b.y<800&&b.x>-100&&b.x<E.L.width+600);
 },
 snapshot(E){return JSON.parse(JSON.stringify({clock:E.clock,states:E.enemies.map(e=>({phase:e.phase,timer:e.timer,anim:e.anim,aim:e.aim,attackDir:e.attackDir,y:e.y})),beasts:E.beasts,pranks:E.pranks,zebra:E.zebra}));},
 valid(s,L){const num=(x,a,b)=>Number.isFinite(x)&&x>=a&&x<=b;const state=e=>e&&states.includes(e.phase)&&num(e.timer,-1e8,10)&&num(e.anim,0,1e8);
  return !!s&&num(s.clock,0,1e8)&&Array.isArray(s.states)&&s.states.length===(L.enemies||[]).length&&s.states.every((e,i)=>state(e)&&num(e.aim,0,L.width)&&[-1,1].includes(e.attackDir)&&num(e.y,L.enemies[i].y-120,L.enemies[i].y+15))&&Array.isArray(s.beasts)&&s.beasts.length===(L.elephants||[]).length&&s.beasts.every(state)&&Array.isArray(s.pranks)&&s.pranks.length<60&&s.pranks.every(b=>b&&['wave','gust','coconut'].includes(b.kind)&&num(b.x,-100,L.width+600)&&num(b.y,-500,900)&&num(b.vx,-400,400)&&num(b.vy,0,2000)&&num(b.life,0,4)&&num(b.ground,0,600)&&Number.isInteger(b.hit)&&b.hit>=0&&b.hit<=7)&&(!L.zebra?s.zebra===null:s.zebra&&s.zebra.starId===L.zebra.starId&&num(s.zebra.x,L.zebra.minX,L.zebra.maxX)&&s.zebra.y===L.zebra.y&&s.zebra.minX===L.zebra.minX&&s.zebra.maxX===L.zebra.maxX&&[-1,1].includes(s.zebra.dir)&&['graze','approach','curious','snack','run','caught'].includes(s.zebra.phase)&&num(s.zebra.anim,0,1e8)&&num(s.zebra.hop,0,.7)&&typeof s.zebra.ready==='boolean'&&s.zebra.mode===L.zebra.mode&&num(s.zebra.timer,0,4)&&num(s.zebra.patience,0,2)&&(s.zebra.watchX===null||num(s.zebra.watchX,0,L.width))&&[-1,0,1,2].includes(s.zebra.watchHero)&&typeof s.zebra.caught==='boolean');
 },
 restore(E,s){E.clock=s.clock;s.states.forEach((e,i)=>Object.assign(E.enemies[i],e));E.beasts=JSON.parse(JSON.stringify(s.beasts));E.pranks=JSON.parse(JSON.stringify(s.pranks));E.zebra=s.zebra?{...s.zebra}:null;}
};root.CrocoWildlife=Wildlife;if(typeof module!=='undefined')module.exports=Wildlife;
})(typeof globalThis!=='undefined'?globalThis:this);
