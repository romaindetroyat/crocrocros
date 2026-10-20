'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),Engine=require('../src/engine'),A=require('../src/adventure');
const {levels,plans}=require('../content/adventure-campaign.cjs');let E,commands=[],label='';
function tick(n,input={}){const last=commands.at(-1);if(last?.input&&JSON.stringify(last.input)===JSON.stringify(input))last.n+=n;else commands.push({n,input});for(let j=0;j<n;j++)E.step(1/60,input);}
function select(i){if(i===undefined)return;E.select(i);commands.push({select:i});tick(2);}
function walk(x,max=1600){let n=0;while(!E.won&&Math.abs(E.p[E.active].x-x)>4&&n++<max){const p=E.p[E.active];tick(1,{right:x>p.x,left:x<p.x});}assert(n<max,label+' walk '+x+' '+JSON.stringify(E.p[E.active])+' movers='+JSON.stringify(E.adventure.movers));tick(3);}
function wait(test,name,max=1800){let n=0;while(!test()&&!E.won&&n++<max)tick(1);assert(n<max,label+' wait '+name+' '+JSON.stringify(E.p.map(p=>[p.x,p.y,p.ground]))+' '+JSON.stringify(E.flags));tick(3);}
function jump(x){tick(1,{jump:true});let n=0;while(n++<180){const p=E.p[0];tick(1,{right:x-p.x>3,left:p.x-x>3});if(n>10&&p.ground)break;}assert(n<180,label+' jump');tick(3);}
function action(){tick(1,{action:true});tick(22);}
function interact(){tick(1,{interact:true});tick(8);}
function run(L,P){E=new Engine(L,(kind,arg)=>{if(process.env.TRACE&&kind==='boing')console.log('HIT',label,arg,E.p.map(p=>[p.x,p.y]));});commands=[];tick(30);for(const s of P.steps){label=L.id+' '+JSON.stringify(s);if(process.env.TRACE)console.log(label,E.p.map(p=>[Math.round(p.x),Math.round(p.y)]),E.adventure.riding);select(s.hero);const [a,b,c]=s.args||[];
 if(s.op==='regroup'){select(1);walk(a);wait(()=>E.p[1].ground,'rally ground');for(const i of [0,2]){select(i);if(E.adventure.riding[i]){interact();wait(()=>E.p[i].ground,'rally disembark');}}select(1);if(E.p[1].roof)action();for(const i of [0,1,2]){select(i);walk(c[i]);}}
 if(s.op==='walk')walk(a);
 if(s.op==='climb'){walk(a);let n=0;while((E.p[E.active].y>b+.01||E.p[E.active].y<b-4.2)&&n++<1200)tick(1,{up:b<E.p[E.active].y,down:b>E.p[E.active].y});assert(n<1200,label+' climb actual '+E.p[E.active].y);tick(3);}
 if(s.op==='jump')jump(a);
 if(s.op==='action')action();
 if(s.op==='use')interact();
 if(s.op==='leave'){assert(E.adventure.riding[E.active],label+' must ride');interact();wait(()=>E.p[E.active].ground,'disembark');}
 if(s.op==='board'){if(!E.p[1].roof)action();interact();}
 if(s.op==='fire'){walk(a);tick(1,{right:b>0,left:b<0});action();tick(100);}
 if(s.op==='charge'){tick(1,{right:true,action:true});tick(20,{right:true});walk(a);}
 if(s.op==='wait'){if(a==='flag')wait(()=>E.flag(b),b);if(a==='ground')wait(()=>E.p[E.active].ground,'ground');if(a==='above')wait(()=>E.p[E.active].y<c,'above '+c);if(a==='mover'){const def=L.movers.find(m=>m.id===b);wait(()=>Math.abs(E.adventure.movers[b].x-(c?def.toX:def.x))<1&&Math.abs(E.adventure.movers[b].y-(c?def.toY:def.y))<1,'mover '+b);}}
 if(s.op==='finish'){tick(30);assert(E.won,label+' victory '+JSON.stringify(E.p.map(p=>[p.x,p.y]))+' '+JSON.stringify(E.flags));assert.equal(E.rebounds,0,label+' no recovery shortcut');assert.equal(Object.keys(E.collected).length,3,label+' optional stars '+JSON.stringify(E.collected));}
 }
 return {levelId:L.id,commands,seconds:Math.round(E.elapsed),stars:Object.keys(E.collected).length};
}
if(require.main===module){const out=[];for(let i=0;i<levels.length;i++){if(process.env.ONLY&&+process.env.ONLY!==i+1)continue;const r=run(levels[i],plans[i]);out.push(r);console.log('PASS',i+1,levels[i].name,r.seconds+'s');}if(!process.env.ONLY){fs.writeFileSync(path.join(__dirname,'adventure-solutions.json'),JSON.stringify(out));fs.writeFileSync(path.join(__dirname,'adventure-report.json'),JSON.stringify(out.map(({commands,...r})=>r),null,2));}}
module.exports={run};
