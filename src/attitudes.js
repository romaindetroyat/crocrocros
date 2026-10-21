(function(root){
'use strict';
// Presentation only. No pose, random choice or prop is written to the simulation.
const cast=[
 [ ['impatient','Le pied qui attend',3.6],['toes','Un départ beaucoup trop préparé',4.2],['scarf','La grande écharpe',4.8],['lookout','Capitaine du petit horizon',4.8],['shadowbox','Le champion du vide',4.5],['shoelace','Le lacet récalcitrant',5.4],['balance','Équilibre… presque',4.8],['bug','Un moustique de trop',5.6],['sneeze','La poussière a gagné',4.5],['idea','Une idée lumineuse',4.4],['sneak','Discret comme un croco',4.8],['whistle','Moi ? Je n’ai rien fait',4.8],['stretch','Prêt pour l’exploit',4.6],['doze','Une micro-sieste',6.2],['bow','Merci, merci, je sais',4.6] ],
 [ ['polish','Bouclier du dimanche',5.4],['flex','Petits muscles, grand sourire',4.6],['helmet','Où est passé le paysage ?',5.6],['flower','Le colosse et la pâquerette',5.8],['belly','Ça creuse, l’aventure',4.8],['weightlift','Une plume, ce bouclier',5.2],['drum','Concert de bouclier',5.2],['shieldpeek','On m’a vu ?',4.6],['knee','Les genoux du héros',5.4],['snore','Le ronflement héroïque',6.4],['heart','Avec tout mon grand cœur',4.8],['count','Trois… enfin, je crois',5.2],['shrug','C’était dans le plan ?',4.6],['proud','Votre taxi est arrivé',4.4],['teatime','Une minuscule tasse',6] ],
 [ ['monocle','Le monocle impeccable',5],['barrel','Contrôle du lance-boulettes',5.2],['pea','La boulette fugitive',5.8],['juggle','Trois boulettes, deux mains',5.8],['notebook','Le plan absolument infaillible',5.8],['measure','Calculs très approximatifs',5.2],['feather','Une plume mal placée',5.4],['inspect','L’enquêteur du marais',5.2],['listen','Qu’est-ce qui fait ce bruit ?',4.4],['yawn','Une idée après la sieste',5.4],['nap','Le penseur s’est endormi',6.2],['conduct','Maestro des boulettes',5],['aim','L’as du doigt mouillé',5.4],['ponder','Une équation à trois museaux',5.2],['magic','Et voilà… une boulette',5.8] ]
].map((list,hero)=>list.map(([id,title,duration])=>({id,title,duration,hero})));
const duets=[
 {id:'salut',title:'Le salut beaucoup trop sérieux',actors:[0,1],roles:['salute','wave'],duration:4.8},
 {id:'frime',title:'Un public difficile',actors:[1,2],roles:['flex','eyeroll'],duration:5.2},
 {id:'atchoum',title:'À tes souhaits, collègue',actors:[0,1],roles:['sneeze','bless'],duration:5.6},
 {id:'orchestre',title:'La fanfare du marais',actors:[2,1],roles:['conduct','drum'],duration:6.2},
 {id:'cachecache',title:'Bouh. Très impressionnant.',actors:[0,2],roles:['peek','startle'],duration:5.2},
 {id:'sieste',title:'Le bâillement contagieux',actors:[2,1],roles:['yawn','snore'],duration:6.4},
 {id:'histoire',title:'Il était gros comme ÇA',actors:[0,2],roles:['story','wow'],duration:6},
 {id:'fou-rire',title:'C’est lui qui a commencé',actors:[0,2],roles:['laugh','embarrassed'],duration:5.4}
];
const catalog=cast.flat(),byId=Object.fromEntries(catalog.map(c=>[c.id,c]));
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const hump=(t,a,b)=>Math.sin(clamp((t-a)/(b-a))*Math.PI);
const states=new WeakMap();
let reduced=false;
function hash(s){let n=2166136261;for(const c of s||'crocos')n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;}
function random(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296;}
function state(E){let s=states.get(E);if(!s){s={clock:E.clock||0,seed:hash(E.L?.id),socialAt:(E.clock||0)+12,socialIndex:0,actors:[0,1,2].map(i=>({idle:0,next:1.4+i*1.9,deck:[],clip:null,last:null}))};states.set(E,s);}return s;}
function next(s,a,i){if(!a.deck.length){a.deck=cast[i].slice();for(let k=a.deck.length-1;k>0;k--){const j=Math.floor(random(s)*(k+1));[a.deck[k],a.deck[j]]=[a.deck[j],a.deck[k]];}if(a.deck.at(-1).id===a.last)[a.deck[0],a.deck[a.deck.length-1]]=[a.deck.at(-1),a.deck[0]];}const c=a.deck.pop();a.last=c.id;return c;}
function start(a,id,clock,duration,extra={}){a.clip={id,start:clock,duration:duration||byId[id]?.duration||1.6,...extra};}
function quiet(p,i,E){return p.ground&&!p.climbing&&Math.abs(p.vx||0)<8&&Math.abs(p.vy||0)<8&&!p.charge&&!p.shoot&&!p.pushing&&!p.fear&&!p.roof&&!E.adventure?.riding[i];}
function react(E,kind,arg){if(!E?.p)return;const s=state(E),clock=E.clock||0;let who=E.active,id=null,duration=1.6;
 if(kind==='select'){who=arg;id=['ready','salute','monocle'][who];duration=1.25;}
 if(kind==='star'||kind==='key'){id=['found','heart','magic'][who];duration=2;}
 if(kind==='target'||kind==='stage'||kind==='break'){id=['proud','proud','salute'][who];duration=1.8;}
 if(kind==='lockedTarget')id='puzzled';
 if(kind==='boing'){who=Number.isInteger(arg)?arg:who;id='dizzy';duration=2.4;}
 if(kind==='portal')id='wow';
 if(kind==='checkpoint'||kind==='rally'||kind==='rewind'){E.p.forEach((p,i)=>start(s.actors[i],'relief',clock,1.8));return;}
 if(kind==='animalWarn'||kind==='trumpet'){id='alert';duration=2;}
 if(id&&s.actors[who])start(s.actors[who],id,clock,duration,{reaction:true});
}
function frame(E,time=0){let s=state(E),clock=E.clock||0;if(clock<s.clock-.001){states.delete(E);s=state(E);}const dt=clamp(clock-s.clock,0,.1);s.clock=clock;
 const resting=E.p.map((p,i)=>quiet(p,i,E));
 for(let i=0;i<3;i++){const a=s.actors[i];a.idle=resting[i]?a.idle+dt:0;if(!resting[i]){a.next=Math.min(a.next,2.6+i*.5);if(a.clip&&!a.clip.reaction)a.clip=null;}if(a.clip&&clock-a.clip.start>=a.clip.duration){a.clip=null;a.next=a.idle+4+random(s)*5;}
  if(!a.clip&&resting[i]&&a.idle>=a.next&&!reduced){const c=next(s,a,i);start(a,c.id,clock,c.duration);}
 }
 // One shared gag at a time; both actors must be safe, close and already at rest.
 if(!reduced&&clock>=s.socialAt){const candidates=[0,1,2].filter(i=>resting[i]&&s.actors[i].idle>3&&!s.actors[i].clip?.reaction);let d=null;
  for(let k=0;k<duets.length;k++){const j=(s.socialIndex+k)%duets.length,c=duets[j],[i,o]=c.actors;if(c.actors.every(v=>candidates.includes(v))&&Math.abs(E.p[i].x-E.p[o].x)>50&&Math.abs(E.p[i].x-E.p[o].x)<185&&Math.abs(E.p[i].y-E.p[o].y)<18){d=c;s.socialIndex=j+1;break;}}
  if(d){d.actors.forEach((i,k)=>start(s.actors[i],d.roles[k],clock,d.duration,{partner:d.actors[1-k],social:d.id,delay:k*.45}));s.socialAt=clock+24+random(s)*10;}else s.socialAt=clock+2;
 }
 return E.p.map((p,i)=>{const a=s.actors[i],riding=!!E.adventure?.riding[i];let v;
  if(E.won)v=sample(['victory-jig','victory-strong','victory-bow'][i],Math.max(0,time-(E.celebrationAt||0)/1000)%3.2,i,3.2);
  else if(riding)v=sample(i===0?'rider-scout':'rider-gunner',clock%4,i,4,true);
  else if(i===1&&p.roof)v=sample(E.adventure?.riding.some(Boolean)?'carry':'shelter',clock%4,i,4,true);
  else if(a.clip&&(resting[i]||a.clip.reaction)){const c=a.clip;v=sample(c.id,Math.max(0,clock-c.start-(c.delay||0)),i,c.duration);if(c.partner!==undefined){v.lookX=2.5;v.face=E.p[c.partner].x>p.x?1:-1;}if(!resting[i])v=faceOnly(v);}
  else v=neutral(i,clock);
  if(p.pushing){v=faceOnly(v);v.brow='effort';v.mouth='grit';v.lookX=2;v.cheek=2;}
  else if(p.charge){v=faceOnly(v);v.brow='effort';v.mouth='grin';v.lookX=3;}
  else if(p.shoot){v=faceOnly(v);v.eye='wink';v.brow='focus';v.cheek=3;}
  else if(p.climbing){v=faceOnly(v);v.lookY=-3;v.brow='focus';}
  else if(!p.ground&&!riding){v=faceOnly(v);v.lookY=p.vy<0?-3:3;v.eye=p.vy>400?'wide':'normal';v.mouth=p.vy>400?'o':'grin';}
  if(reduced){v=faceOnly(v);v.fx=null;v.lid=0;v.headTilt=0;v.headY=0;}
  return v;
 });
}
function neutral(i,t){return {id:'rest',weight:1,lookX:Math.sin(t*.55+i)*1.5,lookY:0,lid:Math.sin(t*1.13+i*2)>.993?1:0,eye:'normal',brow:'soft',mouth:'smile',bodyX:0,bodyY:0,lean:0,sx:1,sy:1,headTilt:0,headY:0,tail:0,hatLift:0,hatTilt:0,gunTilt:0,shieldTilt:0};}
function faceOnly(v){return {...neutral(0,0),id:v.id,lookX:v.lookX,lookY:v.lookY,eye:v.eye,lid:v.lid,brow:v.brow,mouth:v.mouth,cheek:v.cheek,headTilt:v.headTilt*.3};}
function sample(id,t,i=0,duration=byId[id]?.duration||5,continuous=false){
 const a=neutral(i,t),u=clamp(t/duration),w=continuous?1:smooth(t/.35)*smooth((duration-t)/.45),s=Math.sin(t*6),slow=Math.sin(t*3);a.id=id;a.t=t;a.u=u;a.weight=w;
 const hand=(x,y)=>a.hand=[x,y],back=(x,y)=>a.back=[x,y],feet=(x,y,xx,yy)=>a.feet=[[x,y],[xx,yy]],prop=(kind,x,y)=>{a.prop=kind;a.propX=x;a.propY=y;};
 switch(id){
 case 'impatient':a.brow='flat';a.lid=.35;a.lookX=-2;a.lean=-.06;hand(8,-30);a.footTap=Math.max(0,Math.sin(t*12))*7;a.tail=s*8;break;
 case 'toes':a.bodyY=-Math.abs(slow)*7;a.sx=.96;a.sy=1.04;hand(27,-37);back(-19,-38);a.mouth='grin';a.lookY=-3;a.tail=-10;break;
 case 'scarf':hand(5,-51);back(-18,-45);a.headTilt=-.12;a.scarf=1+slow*.35;a.lookX=-2;a.mouth=u>.6?'grin':'o';a.lean=slow*.035;break;
 case 'lookout':hand(22,-89);a.headTilt=-.08;a.lookX=Math.sin(t*1.6)*3;a.lookY=-2;a.lean=.08;a.eye='wide';break;
 case 'shadowbox':hand(32+Math.max(0,s)*20,-52);back(-3+Math.max(0,-s)*32,-48);a.lean=s*.08;a.bodyY=-Math.abs(s)*3;a.mouth='grin';a.brow='focus';a.tail=-5;break;
 case 'shoelace':a.lean=.33;a.bodyY=13;a.sy=.8;hand(28,-9);back(12,-10);a.headTilt=.2;a.lookY=4;a.brow='focus';a.mouth=u>.72?'o':'smile';a.footTap=u>.72?Math.abs(s)*8:0;prop('lace',22,-5);break;
 case 'balance':a.lean=Math.sin(t*4)*.18;hand(46,-49);back(-37,-53);feet(-9,-3,16,-23);a.eye=u>.55?'wide':'normal';a.mouth=u>.55?'o':'grin';a.tail=-15+slow*8;break;
 case 'bug':{const swat=u>.55;a.lookX=3*Math.sin(t*3);a.lookY=-3;a.headTilt=slow*.1;a.eye='wide';a.mouth=swat?'o':'smile';hand(swat?30+s*24:20,-70+(swat?slow*22:0));prop('bug',35+Math.sin(t*4)*29,-97+Math.cos(t*3)*18);a.fx=u>.8?'puff':null;break;}
 case 'sneeze':{const buildup=u<.55,burst=u>.55&&u<.72;a.headTilt=buildup?-.16:burst?.27:0;a.lean=burst?.18:-.05;a.eye=burst?'shut':'squint';a.mouth=buildup?'o':burst?'wide':'smile';a.jaw=buildup?u*12:burst?14:0;hand(26,-55);a.bodyX=burst?-Math.sin((u-.55)/.17*Math.PI)*6:0;a.fx=burst?'sneeze':null;break;}
 case 'idea':a.lookY=u<.5?-3:0;a.brow=u<.5?'question':'soft';hand(u<.5?22:25,u<.5?-58:-103);a.mouth=u<.5?'o':'grin';a.fx=u>.48?'idea':null;a.bodyY=u>.48?-hump(u,.48,.9)*5:0;break;
 case 'sneak':a.sy=.82;a.bodyY=10;a.lean=.12;hand(38,-42);back(-30,-43);a.lookX=Math.sin(t*2)*3;a.eye='squint';a.mouth='grin';a.tail=-15;a.footTap=Math.abs(s)*5;break;
 case 'whistle':a.headTilt=-.15;a.lookY=-3;a.lookX=-2;a.mouth='pucker';hand(-2,-30);a.fx='notes';a.tail=slow*9;break;
 case 'stretch':hand(18,-111);back(-24,-108);a.sy=1.06;a.headTilt=-.16;a.eye='shut';a.mouth='wide';a.jaw=6;a.bodyY=-3;a.tail=12;break;
 case 'doze':a.sy=.84;a.bodyY=11;a.headTilt=.17+Math.sin(t*2)*.08;a.eye='shut';hand(15,-24);a.mouth='smile';a.fx=u>.35?'sleep':null;break;
 case 'bow':a.lean=hump(u,.1,.85)*.38;hand(7,-39);back(-26,-37);a.headTilt=.16;a.eye='happy';a.mouth='grin';a.hatLift=hump(u,.1,.85)*12;break;
 case 'polish':hand(34+Math.sin(t*11)*6,-32+Math.cos(t*11)*13);back(26,-24);a.headTilt=.12;a.lookY=3;a.mouth='grin';prop('cloth',a.hand[0],a.hand[1]);a.fx=u>.72?'sparkle':null;a.shieldTilt=-.15;break;
 case 'flex':hand(35,-74);back(-30,-78);a.lean=-.06;a.sx=1.09;a.sy=1.03;a.mouth='grin';a.eye='happy';a.tail=8;a.shieldX=-34;a.shieldY=14;break;
 case 'helmet':a.hatLift=u<.46?-hump(u,0,.46)*15:0;a.hatTilt=u<.46?.18:0;a.eye=u<.46?'wide':'happy';hand(u<.46?25:8,u<.46?-36:-100);a.mouth=u<.46?'o':'grin';a.headTilt=slow*.08;a.fx=u>.35&&u<.55?'question':null;break;
 case 'flower':prop('flower',34,-56);hand(30,-40);a.lookX=2;a.lookY=2;a.headTilt=.12;a.eye=u>.45?'happy':'normal';a.mouth='smile';a.fx=u>.6?'heart':null;a.shieldX=-40;a.shieldY=4;break;
 case 'belly':hand(12+Math.sin(t*5)*9,-30+Math.cos(t*5)*7);a.headTilt=.1;a.lookY=4;a.mouth=u>.5?'o':'smile';a.sx=1.02+slow*.02;a.fx=u>.4?'rumble':null;a.shieldX=-40;break;
 case 'weightlift':a.shieldX=-9;a.shieldY=-43-Math.max(0,slow)*22;a.shieldTilt=-.25;hand(26,-75-Math.max(0,slow)*22);a.brow='effort';a.mouth='grit';a.sy=1.02;a.back=[-19,-31];break;
 case 'drum':a.shieldTilt=-.8;a.shieldX=-6;a.shieldY=-2;hand(30,-41-Math.max(0,s)*23);back(3,-38-Math.max(0,-s)*24);a.headTilt=slow*.08;a.mouth='grin';a.fx='notes';break;
 case 'shieldpeek':a.sy=.78;a.bodyY=15;a.shieldY=-29;a.shieldX=-9;a.headTilt=-.1;a.headX=u>.4?Math.sin(t*3)*17:0;a.eye='wide';a.lookX=-3;a.mouth='o';hand(27,-44);break;
 case 'knee':a.sy=.84;a.bodyY=12;a.lean=.14;hand(20,-14);back(-15,-16);a.headTilt=.15;a.brow='effort';a.mouth=u>.65?'grin':'grit';a.fx=u>.35&&u<.55?'crack':null;break;
 case 'snore':a.sy=.86;a.bodyY=9;a.eye='shut';a.headTilt=.15;a.mouth='o';a.jaw=3+Math.max(0,slow)*7;a.fx='sleep';hand(7,-28);a.tail=slow*2;break;
 case 'heart':hand(18,-43);back(5,-44);a.headTilt=-.08;a.eye='happy';a.mouth='grin';a.fx='heart';a.shieldX=-39;a.shieldY=8;break;
 case 'count':hand(28,-62);back(15,-57);a.lookY=2;a.lookX=2;a.brow=u>.5?'question':'focus';a.mouth=u>.6?'o':'smile';a.fx=u>.6?'question':'count';a.headTilt=.08;break;
 case 'shrug':hand(39,-56);back(-30,-55);a.headTilt=-.12;a.brow='question';a.mouth='crooked';a.sy=1.02;a.shieldX=-35;a.shieldY=6;break;
 case 'proud':hand(13,-29);back(-15,-29);a.sx=1.06;a.headTilt=-.13;a.eye='happy';a.mouth='grin';a.sy=1.025;a.tail=-5;break;
 case 'teatime':hand(u<.35?32:37,u<.35?-37:-55);prop('cup',a.hand[0]+4,a.hand[1]-8);a.mouth=u>.35&&u<.75?'pucker':'smile';a.eye='happy';a.headTilt=-.06;a.shieldX=-38;a.shieldY=8;break;
 case 'monocle':hand(17,-76);a.lookX=-1;a.eye=u>.6?'wink':'squint';a.headTilt=-.09;a.monocle=u>.2&&u<.65?7:0;a.fx=u>.65?'sparkle':null;a.gunTilt=.6;a.gunY=13;break;
 case 'barrel':a.gunTilt=-.65;a.gunX=-10;a.gunY=-4;hand(35,-55);a.lookY=3;a.headTilt=.2;a.brow='focus';a.eye='squint';a.mouth=u>.7?'o':'smile';a.fx=u>.65?'puff':null;break;
 case 'pea':{const drop=u>.48&&u<.82;prop('pea',drop?44+(u-.48)*20:30,drop?-59+Math.pow((u-.48)/.34,2)*56:-59-Math.sin(u*Math.PI)*9);hand(drop?43:30,drop?-25:-56);a.lookY=drop?4:-2;a.eye=drop?'wide':'normal';a.mouth=drop?'o':'grin';a.lean=drop?.15:0;a.gunTilt=.65;break;}
 case 'juggle':prop('juggle',24,-80);hand(25+s*11,-51);back(-6-s*9,-48);a.lookY=-4;a.eye=u>.72?'wide':'normal';a.mouth=u>.72?'o':'grin';a.headTilt=slow*.07;a.gunTilt=.8;a.gunY=14;break;
 case 'notebook':prop('notebook',27,-48);hand(29+Math.sin(t*15)*3,-51);back(13,-42);a.headTilt=.18;a.lookY=4;a.brow='focus';a.mouth=u>.7?'grin':'pucker';a.gunTilt=.9;a.gunX=-20;a.gunY=20;break;
 case 'measure':hand(39,-67);back(-5,-51);prop('ruler',34,-64);a.eye='wink';a.lookX=3;a.headTilt=-.06;a.mouth='pucker';a.gunTilt=.7;break;
 case 'feather':prop('feather',32+Math.sin(t*3)*6,-71);hand(30,-57);a.headTilt=u>.55?Math.sin(t*12)*.1:.1;a.eye=u>.55?'shut':'normal';a.mouth=u>.55?'wide':'smile';a.jaw=u>.55?9:0;a.gunTilt=.6;break;
 case 'inspect':a.lean=.18;a.headTilt=.18;a.lookY=4;prop('lens',37,-33);hand(31,-35);a.eye='wide';a.mouth='o';a.gunTilt=.9;a.gunX=-15;break;
 case 'listen':hand(-5,-73);a.headTilt=-.14;a.lookX=-3;a.brow='question';a.mouth='o';a.gunTilt=.5;break;
 case 'yawn':a.headTilt=-.18;a.eye='shut';a.mouth='wide';a.jaw=hump(u,.1,.9)*14;hand(35,-54);a.sy=1.03;a.gunTilt=.6;break;
 case 'nap':a.headTilt=.17;a.sy=.86;a.bodyY=10;a.eye='shut';a.mouth='smile';hand(24,-58);a.fx='sleep';a.gunTilt=.65;break;
 case 'conduct':hand(37+slow*10,-70+Math.sin(t*6)*19);back(-23-slow*9,-62+Math.cos(t*6)*13);prop('baton',a.hand[0],a.hand[1]);a.lean=slow*.07;a.eye='happy';a.mouth='grin';a.gunTilt=.85;a.gunX=-20;a.gunY=15;a.fx='notes';break;
 case 'aim':hand(40,-81);a.eye='wink';a.brow='focus';a.lookY=-2;a.headTilt=-.12;a.fx=u>.65?'breeze':null;a.gunTilt=.5;break;
 case 'ponder':hand(25,-57);a.lookY=-3;a.brow='question';a.mouth='crooked';a.headTilt=-.06;a.fx=u>.35?'question':null;a.gunTilt=.6;break;
 case 'magic':hand(36,-60);back(3,-36);a.hatLift=u>.4?7:0;a.eye=u>.55?'wide':'squint';a.mouth='grin';prop(u>.5?'magic':'empty',37,-71);a.gunTilt=.8;a.gunY=12;break;
 case 'salute':case 'ready':hand(22,-88);a.headTilt=-.06;a.mouth='grin';a.eye=id==='ready'?'wink':'normal';a.sy=1.03;break;
 case 'wave':hand(31+s*9,-95);a.eye='happy';a.mouth='grin';a.headTilt=-.05;break;
 case 'eyeroll':hand(5,-34);a.lid=.5;a.lookY=-4;a.lookX=-2;a.mouth='flat';a.headTilt=-.07;break;
 case 'bless':a.headTilt=-.1;a.eye=u<.4?'wide':'happy';a.mouth=u<.4?'o':'grin';hand(33,-63);prop('cloth',37,-66);break;
 case 'peek':a.sy=.78;a.bodyY=16;a.headTilt=-.1;hand(34,-72);back(1,-73);a.eye=u<.5?'shut':'wide';a.mouth=u<.5?'smile':'wide';a.bodyY-=u>.5?hump(u,.5,.9)*17:0;break;
 case 'startle':a.bodyY=u>.35?-hump(u,.35,.8)*8:0;hand(35,-83);back(-27,-81);a.eye=u>.3?'wide':'normal';a.mouth=u>.3?'o':'smile';a.fx=u>.35&&u<.7?'surprise':null;break;
 case 'story':hand(40+slow*11,-51);back(-31-slow*10,-54);a.headTilt=slow*.07;a.mouth='wide';a.jaw=3+Math.abs(s)*5;a.brow='question';break;
 case 'wow':a.eye='wide';a.mouth='o';a.jaw=7;hand(21,-44);a.headTilt=-.09;a.fx=u<.5?'surprise':null;break;
 case 'laugh':a.eye='happy';a.mouth='wide';a.jaw=10;a.lean=Math.sin(t*8)*.08;hand(15,-30);a.bodyY=Math.sin(t*12)*2;break;
 case 'embarrassed':a.lookX=-3;a.lookY=2;a.headTilt=.12;a.blush=true;hand(-8,-78);a.mouth='crooked';a.lean=-.05;break;
 case 'found':a.eye='happy';a.mouth='grin';hand(29,-98);a.bodyY=-hump(u,0,1)*6;a.fx='sparkle';break;
 case 'puzzled':a.brow='question';a.mouth='crooked';hand(-7,-84);a.headTilt=-.15;a.fx='question';break;
 case 'dizzy':a.eye='dizzy';a.mouth='crooked';a.headTilt=slow*.13;hand(13,-90);a.fx='dizzy';break;
 case 'relief':a.eye='happy';a.mouth='smile';hand(20,-88);a.headTilt=.08;a.fx=u<.6?'sweat':null;break;
 case 'alert':a.eye='wide';a.brow='question';a.mouth='o';a.lookX=3;a.fx='surprise';break;
 case 'rider-scout':hand(26,-87);a.eye='wide';a.lookX=3;a.headTilt=-.08;a.mouth='grin';a.tail=-6;break;
 case 'rider-gunner':hand(13,-74);a.eye='squint';a.lookY=-2;a.mouth='grin';a.headTilt=-.04;break;
 case 'carry':a.mouth='grin';a.brow='soft';a.lookY=-4;a.lookX=-1;break;
 case 'shelter':a.eye='wide';a.lookY=-3;a.mouth='smile';break;
 case 'victory-jig':a.eye='happy';a.mouth='wide';a.jaw=7;hand(27+s*12,-94);back(-26-s*8,-90);a.bodyY=-Math.abs(s)*9;a.lean=slow*.1;feet(-13,-3-Math.max(0,s)*15,17,-3-Math.max(0,-s)*15);break;
 case 'victory-strong':a.eye='happy';a.mouth='grin';hand(31,-91);back(-28,-88);a.sx=1.07;a.shieldX=-38;a.shieldY=3;a.bodyY=-Math.abs(slow)*5;break;
 case 'victory-bow':a.eye='wink';a.mouth='grin';a.lean=hump(u,.15,.85)*.32;a.hatLift=15*hump(u,.15,.85);hand(9,-102);a.gunTilt=.7;break;
 }
 // Ease each clip in and out; props have their own alpha, feet remain planted.
 for(const k of ['bodyX','bodyY','lean','headTilt','headY','headX','tail','hatLift','hatTilt','gunTilt','gunX','gunY','shieldTilt','shieldX','shieldY','footTap','monocle'])if(a[k]!==undefined)a[k]*=w;
 a.sx=1+(a.sx-1)*w;a.sy=1+(a.sy-1)*w;
 if(a.hand)a.hand=[17+(a.hand[0]-17)*w,-33+(a.hand[1]+33)*w];
 if(a.back)a.back=[-16+(a.back[0]+16)*w,-34+(a.back[1]+34)*w];
 if(!w){a.fx=null;a.prop=null;a.eye='normal';a.mouth='smile';a.brow='soft';}
 return a;
}
function cover(i,t){const cycle=Math.floor((t+i*1.8)/7),c=cast[i][((cycle*7+i*4)%cast[i].length+cast[i].length)%cast[i].length];return reduced?neutral(i,0):sample(c.id,(t+i*1.8)%7,i,c.duration);}
const api={faceOnly,cast,catalog,duets,sample,frame,react,cover,neutral,setReduced:v=>{reduced=!!v;},get reduced(){return reduced;}};
root.CrocoAttitudes=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
