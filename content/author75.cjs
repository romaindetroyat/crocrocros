'use strict';
const levels=[],plans=[];let L,P;
const fields=['platforms','bridges','gates','switches','targets','plates','crates','turrets','keys','lifts','ladders','springs','portals','conveyors','stars','signs','pads','blocks','elephants','enemies','reactors','rallies','mirrors','winds','movers','beats','logic','goals','landmarks','residents','sequences','stateIds'];
function begin(n,name,idea,briefing,w=1600,h=1050,y=800){
 L={id:'marais-'+String(n).padStart(3,'0'),revision:300,adventure:true,curated:true,name,idea,briefing,width:w,height:h,spawns:[120,190,260].map(x=>({x,y})),checkpoint:{x:140,y},exit:{x:w-180,y,w:140,direction:'right'},hints:[],design:{discovery:idea,pressure:'réflexion',verified:false},intro:'',victory:'Une réparation de plus. Et trois crocos toujours ensemble.'};for(const f of fields)L[f]=[];
 P={levelId:L.id,steps:[]};levels[n-1]=L;plans[n-1]=P;return L;
}
const cmd=(hero,op,...args)=>P.steps.push({hero,op,args});
const floor=(x,y,w,h=24)=>L.platforms.push({x,y,w,h,oneway:true});
const ladder=(x,top,bottom,opts={})=>L.ladders.push({x,y:top,h:bottom-top,requires:[],...opts});
const lever=(id,x,y,opts={})=>L.switches.push({id,x,y,toggle:true,label:'B · '+id.toUpperCase(),...opts});
const gate=(x,y,requires=[],opts={})=>L.gates.push({x,y:y-210,w:26,h:210,requires,...opts});
const target=(id,x,y,requires=[],opts={})=>L.targets.push({id,x,y:y-38,requires,label:id.toUpperCase(),...opts});
const key=(id,x,y,opts={})=>L.keys.push({id,x,y:y-33,hero:0,...opts});
const star=(x,y,name='Le détour',opts={})=>L.stars.push({id:'star-'+L.stars.length,x,y:y-33,name,...opts});
const plate=(id,x,y,hero,opts={})=>L.plates.push({id,x:x-35,y,w:70,hero,label:hero===undefined?'POIDS': ['CROQUINET','CROQUEFORT','CROQUEBOUM'][hero],...opts});
const mover=(id,x,y,w,toX,toY,requires,opts={})=>L.movers.push({id,x,y,w,h:20,toX,toY,requires,speed:155,name:'LA NACELLE',...opts});
const rule=(id,when,label)=>L.logic.push({id,when,label:label||id});
const walk=(i,x)=>cmd(i,'walk',x),climb=(i,x,y)=>cmd(i,'climb',x,y),jump=x=>cmd(0,'jump',x),act=i=>cmd(i,'action'),use=i=>cmd(i,'use'),fire=(x,dir=1)=>cmd(2,'fire',x,dir),wait=(i,what,id,value)=>cmd(i,'wait',what,id,value);
const toggle=(i,x)=>{walk(i,x);use(i);},shoot=(x,flag,dir=1)=>{fire(x,dir);wait(2,'flag',flag);};
const together=x=>{for(const i of [0,1,2])walk(i,x+(i-1)*30);};
function done(hints,requires=[],x=L.exit.x+55,y=L.exit.y){L.hints=hints;L.exit.requires=requires;L.goals=requires.map(id=>({id,text:L.targets.find(t=>t.id===id)?.label||L.logic.find(t=>t.id===id)?.label||id}));together(x);cmd(undefined,'finish');L.design.signature={idea:L.idea,requires,logic:L.logic,mechanisms:[...L.switches,...L.targets].map(({id,requires,requiresOff,flips,hero,when,toggle})=>({id,requires,requiresOff,flips,hero,when,toggle}))};}
function sequence(id,x,y,notes,opts={}){L.sequences.push({id,x,y,notes,...opts});L.stateIds.push(id,...notes.map((_,i)=>id+'-step-'+i));}
function cargo(){L.expedition=true;for(const field of ['items','sockets','controls','balances','rooms','rules','basins'])L[field]=[];}
function item(id,x,y,name,opts={}){L.items.push({id,x,y,name,kind:'gear',...opts});}
function socket(id,x,y,name,accept,opts={}){L.sockets.push({id,x,y,name,accept,...opts});}
function mode(id,x,y,name,labels,opts={}){L.controls.push({id,x,y,name,labels,states:labels.length,...opts});}
function xrule(id,when){L.rules.push({id,when});}
const take=(i,id)=>cmd(i,'take',id),put=(i,id)=>cmd(i,'put',id);
const api={take,put,cargo,item,socket,mode,xrule,sequence,levels,plans,begin,floor,ladder,lever,gate,target,key,star,plate,mover,rule,cmd,walk,climb,jump,act,use,fire,wait,toggle,shoot,together,done,get L(){return L;},get P(){return P;}};
module.exports=api;
