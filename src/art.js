(function(root){
'use strict';
const C={ink:'#244a40',cream:'#fff0bf',gold:'#e9bd58',wood:'#9c6842'};
function path(g,fn,fill,stroke=C.ink,lw=3){g.beginPath();fn(g);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.lineJoin='round';g.lineCap='round';g.stroke();}}
function ellipse(g,x,y,rx,ry,fill,stroke=null,lw=3){path(g,c=>c.ellipse(x,y,rx,ry,0,0,Math.PI*2),fill,stroke,lw);}
function rect(g,x,y,w,h,r,fill,stroke=null,lw=3){path(g,c=>c.roundRect(x,y,w,h,r),fill,stroke,lw);}
function line(g,x,y,x2,y2,c,lw=3){path(g,p=>{p.moveTo(x,y);p.lineTo(x2,y2);},null,c,lw);}
function star(g,x,y,r,color){path(g,c=>{for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();},color,'#b18037',2);}
function text(g,t,x,y,size=14,color=C.ink,align='center'){g.font=`800 ${size}px "Trebuchet MS", sans-serif`;g.textAlign=align;g.fillStyle=color;g.fillText(t,x,y);}
function switchOccluders(E,sw){return E.p.filter(p=>Math.abs(p.x-sw.x)<95&&p.y>sw.y-80&&p.y-p.h<sw.y+6);}
function drawSwitch(g,E,sw,front=false){
 const on=E.flag(sw.id),near=switchOccluders(E,sw);
 if(front)rect(g,sw.x-29,sw.y-59,58,61,12,'#fff0bfdd',C.ink,1);
 rect(g,sw.x-23,sw.y-16,46,16,5,'#697c68',C.ink,2);line(g,sw.x,sw.y-17,sw.x+(on?17:-17),sw.y-49,'#445b50',7);ellipse(g,sw.x+(on?17:-17),sw.y-49,8,8,on?'#b6d57b':'#ed9b57',C.ink,2);
 if(!front&&near.length)return;
 const label=sw.toggle?sw.label+(on?' ●':' ○'):on?'✓':sw.label;
 const y=front?Math.min(sw.y-112,...near.map(p=>p.y-p.h-28)):sw.y-68;
 if(front){g.font='800 12px "Trebuchet MS", sans-serif';const w=Math.max(50,g.measureText(label).width+20);rect(g,sw.x-w/2,y-17,w,24,7,'#fff3cf',C.ink,1.5);line(g,sw.x,y+8,sw.x,sw.y-61,'#f6d78b',2);}
 text(g,label,sw.x,y,12);
}

// Restrained light/shadow and a few large details remain legible at game scale.
function tint(hex,mix){const n=parseInt(hex.slice(1),16),to=mix>0?255:0,a=Math.abs(mix);return '#'+[n>>16,(n>>8)&255,n&255].map(v=>Math.round(v+(to-v)*a).toString(16).padStart(2,'0')).join('');}
function volume(g,y1,y2,base){const v=g.createLinearGradient(-18,y1,25,y2);v.addColorStop(0,tint(base,.22));v.addColorStop(.42,base);v.addColorStop(1,tint(base,-.19));return v;}
function glint(g,x,y,r=1.4){ellipse(g,x,y,r,r,'#fffdf2');}
function scales(g,x,y,color,n=3){for(let j=0;j<n;j++)path(g,c=>{c.moveTo(x+j*6,y+(j%2)*3);c.quadraticCurveTo(x+2+j*6,y+4+(j%2)*3,x+5+j*6,y+(j%2)*3);},null,color,1.1);}
function shieldDetail(g,roof=false){if(roof){for(const x of [-37,-23,23,37])ellipse(g,x,-88,1.8,1.5,'#fff0bb');path(g,c=>{c.moveTo(-38,-91);c.quadraticCurveTo(0,-99,36,-91);},null,'#fff0b3',1.5);}else{for(let j=0;j<8;j++){const a=j*Math.PI/4;ellipse(g,33+Math.cos(a)*11,-34+Math.sin(a)*26,1.5,1.7,'#ffe5a1','#977140',.7);}path(g,c=>{c.moveTo(28,-48);c.lineTo(33,-54);c.lineTo(39,-47);c.lineTo(38,-32);c.lineTo(33,-25);c.lineTo(28,-32);c.closePath();},'#fff0bb','#8f713f',1);line(g,31,-44,35,-44,'#b58c46',1.5);}}
// A small articulated rig, driven by actual simulation states, never by input alone.
function croc(g,p,i,time=0,selected=false){
 const skin=p.skin||['#85b94b','#b49b4c','#4bafaa'][i],big=i===1,w=big?28:i===2?18:17,coat=['#c94f40','#4a6061','#347a9d'][i];
 const climb=!!p.climbing,air=p.ground===false&&!climb&&Math.abs(p.vy||0)>45,run=Math.abs(p.vx||0)>10,charge=p.charge>0,shoot=(p.shoot||0)>0,push=!!p.pushing,fear=(p.fear||0)>0,joy=!!p.joy;
 const phase=climb?(p.climbPhase||0):p.walk||0,step=Math.sin(phase),breath=Math.sin(time*2.1+i),recoil=shoot?Math.sin(Math.min(1,p.shoot/.26)*Math.PI)*8:0;
 const idle=!run&&!air&&!climb&&!shoot&&!push,look=idle?Math.sin(time*.6+i)*1.7:0;
 g.save();g.translate(p.x,p.y);ellipse(g,0,4,selected?33:27,6,selected?'#f9d77870':'#263c3d28');g.scale(p.face||1,1);const skinPaint=volume(g,-91,-7,skin),cloth=volume(g,-57,-17,coat);
 if(climb){
  // Back view: hands reach different rungs while knees and feet alternate.
  const reach=Math.sin(phase),reach2=Math.sin(phase+Math.PI);
  for(const [s,a]of [[-1,reach],[1,reach2]]){line(g,s*12,-42,s*22,-51-a*13,C.ink,12);line(g,s*12,-42,s*22,-51-a*13,skinPaint,8);ellipse(g,s*22,-51-a*13,6,5,skinPaint,C.ink,2);line(g,s*8,-20,s*15,-7+a*7,C.ink,12);line(g,s*8,-20,s*15,-7+a*7,skinPaint,8);ellipse(g,s*15,-5+a*7,10,5,'#3f5648',C.ink,2);}
  path(g,c=>{c.moveTo(0,-22);c.quadraticCurveTo(-14,5,8+reach*6,-1);c.quadraticCurveTo(0,-9,9,-23);},skinPaint);
  ellipse(g,0,-37,w,26,skinPaint,C.ink);rect(g,-w+2,-57,w*2-4,33,8,cloth,C.ink,2);
  for(let j=0;j<3;j++)path(g,c=>{c.moveTo(-4,-49+j*9);c.lineTo(0,-57+j*9);c.lineTo(5,-49+j*9);},'#e6d29b',null);
  ellipse(g,1,-67,19,16,skinPaint,C.ink);rect(g,9,-69,27,15,7,skinPaint,C.ink,2);ellipse(g,15,-75,5,6,'#fff5dc',C.ink,1);ellipse(g,17,-74,2,3,C.ink);
  ellipse(g,0,-83,22,8,['#bf6048','#d8b360','#48778d'][i],C.ink,2);
  if(i===2){rect(g,-15,-51,30,31,8,volume(g,-51,-20,'#a77e50'),C.ink,2);rect(g,-15,-52,30,11,5,'#d2ad71',C.ink,1.5);rect(g,-2,-45,5,9,1,'#f2cc7c',C.ink,1);line(g,14,-74,22,-75,'#b98949',3);}if(i===0){path(g,c=>{c.moveTo(-8,-59);c.lineTo(-31,-46+Math.sin(time*8)*4);c.lineTo(-17,-43);c.lineTo(5,-57);},'#e8674e',C.ink,1.5);}if(big){ellipse(g,1,-38,18,23,'#cfaa60',C.ink,2);ellipse(g,1,-38,5,7,'#ead594');}
 }else{
  const squash=Math.max(0,p.land||0)*.6,tilt=charge?.27:push?.18:air?-.12:shoot?-.06:joy?Math.sin(time*9)*.06:0;
  g.translate(-recoil,(run?Math.abs(step)*-2:breath*.7)+squash*8);g.rotate(tilt);g.scale(1+squash,.999-squash);
  // Tail is a counterbalance, with a loose tip even at rest.
  const tail=air?-14:charge?5:Math.sin(time*3+i)*4;
  path(g,c=>{c.moveTo(-12,-25);c.bezierCurveTo(-34,-15,-49,-12+tail,-58,-32+tail);c.quadraticCurveTo(-52,0+tail,-17,-10);c.closePath();},skinPaint);
  for(let j=0;j<3;j++)path(g,c=>{c.moveTo(-23-j*9,-21+j);c.lineTo(-29-j*9,-31+j+tail*.2);c.lineTo(-34-j*9,-17+j);},tint(skin,-.31),null);scales(g,-40,-17+tail*.2,tint(skin,-.27),3);path(g,c=>{c.moveTo(-19,-14);c.quadraticCurveTo(-41,-7,-51,-20+tail);},null,tint(skin,.28),1.4);
  // Bent thighs, shins and planted boots rather than sliding shoes.
  for(const side of [-1,1]){const s=step*side,footX=air?(side<0?-22:23):side*11+(run?s*11: fear?Math.sin(time*26)*2:0),footY=air?-19-(side>0?7:0):run?-Math.max(0,s)*9:-3;
   line(g,side*9,-23,side*10+(air?-6:s*4),-14,C.ink,13);line(g,side*10+(air?-6:s*4),-14,footX,footY-1,C.ink,10);line(g,side*9,-23,footX,footY-1,skinPaint,7);ellipse(g,footX+3,footY,12,6,'#374f43',C.ink,2);}
  ellipse(g,0,-34,w,big?31:26,skinPaint,C.ink);ellipse(g,9,-32,w*.69,big?24:21,volume(g,-56,-10,big?'#f0d49b':i===2?'#d5ece0':'#e3e5af'));for(let j=0;j<3;j++)path(g,c=>{c.moveTo(1,-41+j*9);c.quadraticCurveTo(10,-37+j*9,19,-41+j*9);},null,'#66765155',1.3);ellipse(g,-10,-54,7,2,'#ffffff35');
  path(g,c=>{c.moveTo(-w,-51);c.lineTo(-w-2,-21);c.lineTo(-7,-19);c.lineTo(-5,-52);c.closePath();},cloth);ellipse(g,-13,-39,2,2,'#ffe0a0');line(g,-w+4,-47,-w+3,-27,tint(coat,.35),1.3);for(let j=0;j<3;j++)line(g,-w+5,-44+j*7,-w+7,-43+j*7,'#ffeac466',1);if(i===2){rect(g,-27,-47,16,28,6,volume(g,-47,-20,'#ad7d4e'),C.ink,1.7);rect(g,-27,-48,16,9,4,'#dfb46e',C.ink,1);ellipse(g,-19,-40,2,2,'#fff0b0');}if(big){line(g,-4,-53,1,-18,'#d6b365',5);line(g,-4,-53,1,-18,'#f5d795',1.3);rect(g,-7,-30,13,9,2,'#ccaa5d',C.ink,1.2);rect(g,-3,-28,5,5,1,'#4c6660');}
  // Head and jaw have separate pivots. Mouth, brows and pupils convey intent.
  g.save();g.translate(0,air?-3:0);g.rotate(fear?-.08:idle?breath*.025:0);
  ellipse(g,5,-65,big?25:19,big?20:18,skinPaint,C.ink);ellipse(g,20,-77,5.7,8,'#eff2cf',C.ink,1.5);ellipse(g,22,-76,1.7,3,C.ink);glint(g,21,-78,1);const gape=fear?7:joy?9:charge||push?3:idle&&Math.sin(time*.45+i)>.97?9:0;
  rect(g,10,-59,big?44:40,14+gape,7,skinPaint,C.ink,2);if(gape){rect(g,15,-55,32,4+gape,4,'#683e37',null);ellipse(g,31,-48+gape*.6,9,3,'#d4836d');}
  path(g,c=>{c.moveTo(12,-69);c.bezierCurveTo(24,-72,big?59:i===2?58:49,-73,big?58:i===2?57:51,-61);c.quadraticCurveTo(big?60:i===2?60:54,-51,39,-51);c.lineTo(13,-52);c.quadraticCurveTo(7,-58,12,-69);},skinPaint,C.ink,2);path(g,c=>{c.moveTo(19,-67);c.quadraticCurveTo(34,-70,46,-66);},null,tint(skin,.46),1.8);ellipse(g,13,-58,9,4,tint(skin,.12));scales(g,-4,-64,tint(skin,-.3),3);scales(g,25,-59,tint(skin,-.23),3);path(g,c=>{c.moveTo(12,-53);c.quadraticCurveTo(31,-49,49,-55);},null,C.ink,1.6);
  for(const x of [29,42])path(g,c=>{c.moveTo(x,-52);c.lineTo(x+2,-46);c.lineTo(x+6,-53);},'#fff9dc',C.ink,1);
  ellipse(g,44,-63,2,1.5,C.ink);ellipse(g,49,-62,1.2,1,C.ink);
  const blink=Math.sin(time*1.15+i*2)>.995,eyeY=-75;
  ellipse(g,11,eyeY,7,fear?11:9,'#fffbe6',C.ink,1.5);if(blink||joy){path(g,c=>{c.moveTo(6,eyeY);c.quadraticCurveTo(11,eyeY-5,16,eyeY);},null,C.ink,2);}else{ellipse(g,13+(fear?-2:look),eyeY+1,charge||push?2.8:fear?1.8:2.4,fear?4:3.4,C.ink);glint(g,12+(fear?-2:look),eyeY-1,1.1);}
  line(g,5,-86+(charge?4:0),18,-86+(fear?4:charge?-2:1),C.ink,3);
  if(push||charge){line(g,16,-56,21,-54,'#39583e',2);line(g,18,-60,23,-59,'#39583e',1.5);}
  if(i===0){path(g,c=>{c.moveTo(-11,-83);c.quadraticCurveTo(-9,-99,12,-91);c.lineTo(25,-82);c.closePath();},volume(g,-96,-80,'#ca5140'));path(g,c=>{c.moveTo(-7,-87);c.quadraticCurveTo(0,-95,12,-88);},null,'#f3a16b',1.5);line(g,-13,-81,28,-81,'#edb078',4);path(g,c=>{c.moveTo(-8,-55);c.lineTo(20,-50);c.lineTo(12,-44);c.lineTo(-8,-48);c.lineTo(-32-(run?7:0),-43+Math.sin(time*8)*3);c.lineTo(-22,-36);c.lineTo(-8,-47);},volume(g,-57,-35,'#ef7053'));path(g,c=>{c.moveTo(-9,-50);c.lineTo(-36-(run?9:0),-52+Math.sin(time*8+1)*5);c.lineTo(-29,-43);c.lineTo(-8,-46);},'#ba493c',C.ink,1.4);ellipse(g,-6,-48,5,4,'#f28b61',C.ink,1);}
  if(big){path(g,c=>{c.moveTo(-18,-83);c.quadraticCurveTo(-15,-105,12,-94);c.quadraticCurveTo(22,-89,24,-81);c.closePath();},volume(g,-100,-80,'#d8ae50'));line(g,-20,-81,28,-81,'#f4d782',5);path(g,c=>{c.moveTo(-8,-91);c.quadraticCurveTo(1,-101,12,-91);},null,'#fff0b6',2);rect(g,-5,-101,13,8,3,'#b78038',C.ink,1.5);ellipse(g,2,-94,3,4,'#ffe9ad');for(const xx of [-14,20])ellipse(g,xx,-83,2,2,'#9f7937');}
  if(i===2){ellipse(g,-3,-88,23,11,volume(g,-99,-82,'#367c9e'),C.ink);rect(g,-16,-86,34,7,3,'#244e68',C.ink,1);line(g,-17,-91,7,-95,'#80bac6',1.5);line(g,-14,-74,8,-76,'#775841',4);ellipse(g,11,-75,9,11,'#d1e7d51c','#b98949',2.8);path(g,c=>{c.moveTo(6,-80);c.lineTo(11,-84);},null,'#fffdf0',2);star(g,-4,-90,4,'#f9d581');}
  g.restore();
  const handX=push?32:joy?21:air?23:17,handY=push?-38:joy?-90:air?-50:-33+(run?step*5:0);
  line(g,7,-45,handX,handY,C.ink,13);line(g,7,-45,handX,handY,skinPaint,9);ellipse(g,handX,handY,7,7,skinPaint,C.ink,2);for(let j=0;j<2;j++)line(g,handX+2+j*3,handY,handX+2+j*3,handY+4,tint(skin,-.3),1);glint(g,handX-2,handY-3,1.5);
  if(big){if(p.roof){if(air){line(g,-12,-48,-23,-78,C.ink,12);line(g,-12,-48,-23,-78,skinPaint,8);for(let j=0;j<3;j++)path(g,c=>{c.moveTo(-70-j*9,-75+j*23);c.quadraticCurveTo(-50,-80+j*23,-40,-73+j*23);},null,'#fff2c088',2);}line(g,17,-43,22,-78,skinPaint,10);ellipse(g,0,-87,49,9,volume(g,-97,-79,'#e8be61'),C.ink);ellipse(g,0,-90,18,4,'#d29747');line(g,-32,-88,32,-88,'#ffdf8e',2);shieldDetail(g,true);}else{g.save();if(push){g.translate(-50,-6);g.rotate(-.2);}ellipse(g,33,-34,15,31,volume(g,-64,-3,'#e5b75b'),C.ink);ellipse(g,33,-34,9,23,'#c99444',C.ink,1);ellipse(g,33,-34,5,7,'#f3d58a',C.ink,1.5);shieldDetail(g);g.restore();}}
  if(i===2){g.save();g.translate(-recoil*.5,air?3:0);rect(g,16,-45,39,14,5,volume(g,-47,-30,'#b48350'),C.ink,2);line(g,21,-40,43,-40,'#e2ba7b',1.5);rect(g,44,-48,12,19,3,volume(g,-49,-29,'#537e8a'),C.ink,2);line(g,48,-45,48,-32,'#a4d0c9',2);ellipse(g,54,-38,2.5,5,'#263f46');rect(g,27,-49,5,5,1,'#dfb25e',C.ink,1);ellipse(g,20,-28,7,6,skinPaint,C.ink,2);if(shoot){for(let j=0;j<3;j++)ellipse(g,63+j*7,-38+(j-1)*6,6-j,5-j,'#fff0b9bb');}g.restore();}
  if(charge){line(g,-68,-50,-46,-50,'#fff5cf',3);line(g,-76,-30,-54,-30,'#fff5cf',2);}
 }
 if(fear){for(let j=0;j<2;j++){const yy=-102+j*15+(time*24%10);ellipse(g,-22-j*9,yy,3,5,'#a7e6e8',C.ink,1);}text(g,'!',30,-109,21,'#fff4c5');}
 g.restore();if(selected){path(g,c=>{c.moveTo(p.x-7,p.y-121);c.lineTo(p.x+7,p.y-121);c.lineTo(p.x,p.y-113);c.closePath();},p.color||['#e36a4c','#e5ba57','#5ba4c9'][i],C.ink,1.5);}
}
function tree(g,x,y,s,color){g.save();g.translate(x,y);g.scale(s,s);path(g,c=>{c.moveTo(-6,0);c.quadraticCurveTo(8,-115,-9,-170);c.lineTo(10,-171);c.quadraticCurveTo(26,-100,12,0);},color,null);for(let j=0;j<5;j++)ellipse(g,-53+j*26,-160+Math.sin(j*2)*15,48,32,color);g.restore();}
function palm(g,x,y,s,time,color='#456d59'){
 g.save();g.translate(x,y);g.scale(s,s);path(g,c=>{c.moveTo(-7,0);c.quadraticCurveTo(13,-87,0,-146);c.lineTo(9,-147);c.quadraticCurveTo(25,-84,6,0);},'#82774e',null);
 for(let j=0;j<7;j++){const a=(j-3)*.45+Math.sin(time*.8+x)*.035;g.save();g.translate(4,-145);g.rotate(a);path(g,c=>{c.moveTo(0,0);c.quadraticCurveTo(48,-28,75,24);c.quadraticCurveTo(36,2,0,0);},color,null);g.restore();}ellipse(g,5,-142,7,8,'#997d48');g.restore();
}
function gear(g,x,y,r,time,color){g.save();g.translate(x,y);g.rotate(time);for(let j=0;j<12;j++){g.rotate(Math.PI/6);rect(g,r-8,-6,16,12,2,color);}ellipse(g,0,0,r,r,color);ellipse(g,0,0,r*.7,r*.7,'#4c7064');for(let j=0;j<6;j++){const a=j*Math.PI/3;line(g,0,0,Math.cos(a)*r*.8,Math.sin(a)*r*.8,color,7);}ellipse(g,0,0,6,6,'#eed9a7');g.restore();}
function elephant(g,x,y,time,calm=false,scale=1,liftY=null,state=null){
 const wind=state?.phase==='windup',attack=state?.phase==='attack',prep=wind?1-Math.max(0,state.timer)/1.3:0;
 if(wind)warning(g,x+65,y-230,state.timer,1.3);
 g.save();g.translate(x,y+(attack?Math.sin(state.timer*28)*3:0));g.scale(scale,scale);const breath=Math.sin(time*1.7)*2,trumpet=!calm&&Math.sin(time*1.4)>.45;
 ellipse(g,0,2,98,12,'#244a402b');
 for(const xx of [-57,43]){g.save();if(xx===43&&wind)g.translate(0,-prep*28);rect(g,xx,-74,33,74,13,volume(g,-76,0,'#819eaa'),'#496674',3);for(let j=0;j<3;j++)ellipse(g,xx+7+j*8,-4,4,4,'#d3d8cb');g.restore();}
 ellipse(g,-14,-103+breath,90,66,volume(g,-172,-43,'#98b0bc'),'#496674',3);
 path(g,c=>{c.moveTo(-96,-113);c.quadraticCurveTo(-115,-78,-108,-61);},null,'#6c8999',6);ellipse(g,-109,-60,4,9,'#4b6474');
 // Picnic blanket and bell make the elephants friendly, but still intimidating.
 rect(g,-57,-156+breath,80,60,8,volume(g,-160,-95,'#b76e59'),'#704f48',2);for(let j=0;j<5;j++)line(g,-49+j*15,-146+breath,-49+j*15,-102+breath,'#edc27b',3);
 for(let j=0;j<7;j++)line(g,-54+j*11,-96+breath,-54+j*11,-88+breath,'#e4bd77',2);rect(g,-54,-153+breath,74,54,6,null,'#f1d198',1.4);for(let j=0;j<3;j++){g.save();g.translate(-40+j*24,-126+breath);g.rotate(Math.PI/4);rect(g,-4,-4,8,8,1,'#f6d391');g.restore();}
 ellipse(g,59,-128+breath,46,49,volume(g,-180,-82,'#a8bec6'),'#496674',3);ellipse(g,34-prep*10,-124+breath,34+prep*13,44+prep*8,'#839eae','#496674',2);ellipse(g,36,-121+breath,22,30,volume(g,-150,-90,'#c3adb5'));path(g,c=>{c.moveTo(27,-143+breath);c.quadraticCurveTo(51,-150+breath,51,-115+breath);},null,'#dde1d1',2);path(g,c=>{c.moveTo(30,-135+breath);c.quadraticCurveTo(44,-134+breath,40,-107+breath);},null,'#8d8e9e',1.7);
 ellipse(g,80,-140+breath,7,8,'#fff3d6','#496674',1.5);if(calm)path(g,c=>{c.moveTo(75,-139+breath);c.quadraticCurveTo(80,-145+breath,85,-139+breath);},null,'#344d5b',2);else {ellipse(g,82,-140+breath,wind?1.8:2.7,wind?6:4,'#344d5b');line(g,72,-153+breath,86,-154+breath+prep*5,'#496674',3);glint(g,81,-143+breath,1.5);}
 const tip=liftY!==null?liftY-y:-7-228*Number(calm)-prep*55;
 // A broad root tapers to a curled, narrow fingertip.
 const a=liftY===null?Number(calm):0;
 path(g,c=>{c.moveTo(83,-145+breath);c.bezierCurveTo(129,-144,119+15*a,-64-190*a,137,tip+2);c.quadraticCurveTo(150,tip+15,152,tip-8);c.quadraticCurveTo(158,tip-14,160,tip-6);c.quadraticCurveTo(161,tip+27,135,tip+21);c.bezierCurveTo(108,tip+15,100+5*a,-72-180*a,87,-105+breath);c.quadraticCurveTo(100,-123,83,-145+breath);},volume(g,-145,tip+25,'#a8bec6'),'#496674',2.5);
 path(g,c=>{c.moveTo(105,-122);c.bezierCurveTo(119,-105,113+15*a,-57-190*a,139,tip+11);},null,'#d5e1dc',3);
 ellipse(g,156,tip-7,3,2,'#496674');
 path(g,c=>{c.moveTo(91,-105);c.quadraticCurveTo(120,-91,120,-114);c.quadraticCurveTo(110,-103,94,-114);},'#fff0cc','#6b8790',1.5);
 path(g,c=>{c.moveTo(-82,-121+breath);c.quadraticCurveTo(-77,-150+breath,-60,-154+breath);},null,'#d3ded355',3);for(let j=0;j<3;j++)path(g,c=>{c.moveTo(-65+j*5,-45);c.quadraticCurveTo(-62+j*5,-39,-58+j*5,-44);},null,'#56798777',1.3);line(g,89,-83,100,-80,'#688694',1.4);line(g,92,-77,103,-74,'#688694',1.4);
 if(trumpet&&liftY===null){for(let j=0;j<3;j++)line(g,175+j*10,tip-18-j*4,179+j*13,tip-25-j*7,'#f9e3ad',3);}
 g.restore();
}
function background(g,W,H,camera,theme,time,scenery){
 const kind=scenery||({morning:'harbour',forest:'canopy',temple:'ruins',factory:'mill',fair:'fair',fort:'fort',sunset:'savannah'}[theme]||'harbour');
 const night=kind==='moon',warm=kind==='savannah'||kind==='fair';
 const colors=night?['#283f66','#687b8c','#537e83','#365b69']:warm?['#d69b86','#f7d79d','#baad79','#7b946b']:kind==='falls'?['#93c2ce','#e0e5be','#88b8ac','#558d87']:['#a8d3ce','#f2e8bb','#9db8a1','#658f7c'];
 const grad=g.createLinearGradient(0,0,0,H);grad.addColorStop(0,colors[0]);grad.addColorStop(1,colors[1]);g.fillStyle=grad;g.fillRect(0,0,W,H);
 ellipse(g,W*.8-camera*.025,93,night?34:47,night?34:47,night?'#f9efd3':'#fff0c2');ellipse(g,W*.8-camera*.025,93,74,74,'#fff5d315');
 if(night){for(let j=0;j<40;j++)ellipse(g,(j*137.3-camera*.03)%(W+20),32+(j*57)%230,1+(j%2),1+(j%2),'#fff5d380');}
 else for(let i=0;i<5;i++){const x=((i*317-camera*.08+time*2)%(W+400)+W+400)%(W+400)-150;ellipse(g,x,67+i%3*47,62,12,'#fff8de60');ellipse(g,x+27,59+i%3*47,36,20,'#fff8de60');}
 for(let layer=0;layer<2;layer++){path(g,c=>{c.moveTo(-50,H);for(let x=-50;x<W+70;x+=35)c.lineTo(x,306+layer*70+Math.sin((x+camera*(layer?.24:.1))*.006)*47+Math.cos((x+camera*.1)*.016)*11);c.lineTo(W+70,H);c.closePath();},colors[layer+2],null);}
 // Each biome has its own silhouette, architecture and moving background layer.
 const repeat=(spacing,fn)=>{for(let j=-1;j<Math.ceil(W/spacing)+2;j++)fn(j*spacing-(camera*.32%spacing),j);};
 if(kind==='harbour'){repeat(480,(x,j)=>{line(g,x+190,440,x+190,195,'#688b7977',5);path(g,c=>{c.moveTo(x+198,201);c.lineTo(x+198,379);c.quadraticCurveTo(x+300,347,x+280,323);c.closePath();},'#f0deb599',null);path(g,c=>{c.moveTo(x+98,429);c.quadraticCurveTo(x+200,485,x+308,429);c.closePath();},'#497c7077',null);palm(g,x+45,490,1.4,time,'#507c6966');});}
 if(kind==='canopy'){repeat(410,(x,j)=>{tree(g,x,550,2.3,'#48765f70');path(g,c=>{c.moveTo(x+15,180);c.quadraticCurveTo(x+220,225,x+410,160);},null,'#476e5c66',5);for(let k=0;k<12;k++)line(g,x+30+k*30,187+Math.sin(k/12*Math.PI)*20,x+30+k*30,210+Math.sin(k/12*Math.PI)*20,'#668d6866',3);for(let k=0;k<4;k++){path(g,c=>{c.moveTo(x+k*65,0);c.bezierCurveTo(x+k*65-20,75,x+k*65+25,110,x+k*65,165+k*7);},null,'#527f6266',4);}});}
 if(kind==='falls'){repeat(530,(x,j)=>{path(g,c=>{c.moveTo(x,530);c.lineTo(x,182);c.lineTo(x+98,146);c.lineTo(x+177,178);c.lineTo(x+197,500);},'#608f8b99',null);rect(g,x+86,166,48,350,3,'#c4e1cf99');for(let k=0;k<8;k++)line(g,x+94+k*5,174+(time*80+k*51)%310,x+94+k*5,195+(time*80+k*51)%310,'#eff8dd99',2);for(let k=0;k<5;k++)ellipse(g,x+95+k*17,493+Math.sin(time*2+k)*3,35,12,'#def0d15c');});}
 if(kind==='ruins'||kind==='moon'){repeat(430,(x,j)=>{rect(g,x+40,237,42,270,4,'#6f928088');rect(g,x+205,237,42,270,4,'#6f928088');path(g,c=>{c.moveTo(x+31,245);c.bezierCurveTo(x+20,89,x+261,92,x+258,245);c.lineTo(x+220,245);c.bezierCurveTo(x+220,145,x+70,145,x+70,245);c.closePath();},'#77988788',null);for(let k=0;k<4;k++)line(g,x+41,290+k*54,x+80,286+k*54,'#d0d7b24d',2);path(g,c=>{c.moveTo(x+61,153);c.quadraticCurveTo(x+30,266,x+71,369);},null,'#4b755c88',7);});}
 if(kind==='mill'){repeat(520,(x,j)=>{rect(g,x,280,200,230,5,'#5e817b99');path(g,c=>{c.moveTo(x-14,280);c.lineTo(x+100,208);c.lineTo(x+215,280);},'#6c806e',null);for(let k=0;k<3;k++)rect(g,x+21+k*60,315,30,50,8,'#eacf8d88');gear(g,x+235,405,83,time*.25,'#8b907380');rect(g,x+130,160,29,87,5,'#5e817baa');for(let k=0;k<4;k++)ellipse(g,x+148+Math.sin(time+k)*15,139-k*28-(time*8%28),22+k*7,12+k*4,'#f3e5c833');});}
 if(kind==='savannah'){repeat(430,(x,j)=>{tree(g,x+50,487,1.2,'#667e5c77');g.save();g.globalAlpha=.48;elephant(g,x+265,465,time+j,true,.45);g.restore();palm(g,x+370,485,1.25,time,'#657e5677');});}
 if(kind==='fair'){repeat(430,(x,j)=>{path(g,c=>{c.moveTo(x,365);c.lineTo(x+99,226);c.lineTo(x+198,365);c.closePath();},'#af69737a',null);path(g,c=>{c.moveTo(x+99,226);c.lineTo(x+61,365);c.lineTo(x+136,365);c.closePath();},'#efcc9988',null);rect(g,x+9,365,180,125,4,'#dbbd9277');line(g,x+99,226,x+99,185,'#738c7266',4);path(g,c=>{c.moveTo(x+99,185);c.quadraticCurveTo(x+120,180+Math.sin(time*3)*5,x+137,195);c.lineTo(x+99,207);},'#b96a67',null);});}
 if(kind==='fort'){repeat(350,(x,j)=>{rect(g,x+20,221,150,292,6,'#617e7f99');for(let k=0;k<4;k++)rect(g,x+18+k*42,202,27,35,3,'#617e7f99');for(let k=0;k<3;k++)rect(g,x+75,265+k*66,27,39,13,'#e4c68c55');line(g,x+90,202,x+90,125,'#587873',4);path(g,c=>{c.moveTo(x+90,125);c.quadraticCurveTo(x+125,115+Math.sin(time*2)*5,x+148,140);c.lineTo(x+90,151);},'#a66d6988',null);});}
 // Hanging pennants, swallows, butterflies and fireflies are scenery, not obstacles.
 if(['harbour','fair','mill'].includes(kind)){path(g,c=>{c.moveTo(0,155);c.quadraticCurveTo(W*.5,234,W,148);},null,'#657c6055',2);for(let j=0;j<W/60;j++){const x=j*60,y=155+Math.sin(x/W*Math.PI)*38;path(g,c=>{c.moveTo(x,y);c.lineTo(x+24,y+2);c.lineTo(x+11+Math.sin(time*2+j)*4,y+27);},['#c47d6577','#dbba6e88','#7aa89a88'][j%3],null);}}
 for(let j=0;j<7;j++){const x=((j*193+time*12-camera*.15)%(W+100)+W+100)%(W+100)-50,y=87+j%3*39;if(night){ellipse(g,x,y+260,3,3,'#f2de9a');ellipse(g,x,y+260,10,10,'#f2de9a20');}else{const wing=Math.sin(time*6+j)*4;path(g,c=>{c.moveTo(x-7,y-wing);c.quadraticCurveTo(x-3,y-3,x,y);c.quadraticCurveTo(x+3,y-3,x+7,y-wing);},null,'#4d797677',1.6);}}
 vista(g,W,H,camera,kind,time);
 const water=g.createLinearGradient(0,490,0,H);const dry=['savannah','fair','fort'].includes(kind);water.addColorStop(0,dry?'#ab986788':night?'#3c748388':'#69ab9b88');water.addColorStop(1,dry?'#7e7952':night?'#315969':'#356f71');g.fillStyle=water;g.fillRect(0,490,W,H-490);
 for(let j=0;j<(dry?0:45);j++){const x=((j*131-camera*.5+time*5)%(W+100)+W+100)%(W+100)-50,y=501+j%8*16;line(g,x,y,x+24+j%4*11,y,'#d9ead047',2);}
}
function warning(g,x,y,t,total=1.1){
 ellipse(g,x,y,18,18,'#fff3c7',C.ink,2);g.beginPath();g.arc(x,y,21,-Math.PI/2,-Math.PI/2+Math.max(0,1-t/total)*Math.PI*2);g.strokeStyle='#ce694c';g.lineWidth=4;g.stroke();text(g,'!',x,y+7,23,'#ad4e39');
}
function coconut(g,x,y,angle=0){g.save();g.translate(x,y);g.rotate(angle);ellipse(g,0,0,11,12,'#97603d',C.ink,2);path(g,c=>{c.moveTo(-5,-9);c.quadraticCurveTo(-10,0,-4,9);},null,'#d3a361',2);for(const [a,b]of [[2,-4],[6,-1],[1,2]])ellipse(g,a,b,1.6,1.6,'#483d30');g.restore();}
function animal(g,e,time){
 const asleep=e.asleep,kind=e.kind||'hippo',t=e.anim??time,wind=e.phase==='windup'&&!asleep,attack=e.phase==='attack'&&!asleep,recover=e.phase==='recover'&&!asleep,run=e.phase==='patrol'&&!asleep;
 const gait=Math.sin(t*(kind==='lion'?13:10)),squash=wind?(kind==='hippo'?1-e.timer/1.15:1-e.timer/.9):0,col=kind==='lion'?'#e4b05e':'#ac9cb6';
 if(wind){warning(g,e.x,e.y-(kind==='vulture'?112:99),e.timer,kind==='hippo'?1.15:kind==='lion'?.9:1.1);if(kind==='vulture'){ellipse(g,e.x,e.homeY-3,27,7,'#cd684b44','#b96348',2);text(g,'↓',e.x,e.homeY-18,24,'#b96348');}}
 g.save();g.translate(e.x,e.y);ellipse(g,0,4,34,6,'#244a4033');g.scale(e.dir||1,1);
 if(kind==='vulture'){
  const flap=asleep?0:Math.sin(t*(wind?17:9))*27;g.translate(0,asleep?8:recover?5:0);
  for(const side of [-1,1]){path(g,c=>{c.moveTo(side*6,-31);c.bezierCurveTo(side*18,-64+flap,side*47,-65+flap,side*57,-24+flap);c.lineTo(side*41,-30+flap);c.lineTo(side*43,-19+flap);c.lineTo(side*31,-25+flap);c.lineTo(side*29,-16+flap);c.lineTo(side*13,-27);},'#777184',C.ink,2);line(g,side*21,-42+flap*.5,side*40,-43+flap,'#aaa0ac',2);}
  ellipse(g,0,-28,19,24,volume(g,-51,-5,'#8d8494'),C.ink,2);ellipse(g,3,-28,12,17,'#b4a6b2');ellipse(g,4,-44,20,7,'#f6e8d0',C.ink,2);for(let j=0;j<5;j++)ellipse(g,-10+j*7,-44+Math.sin(j)*3,5,6,'#fff0d4');
  path(g,c=>{c.moveTo(8,-46);c.quadraticCurveTo(8,-65,19,-66);},null,'#604f59',12);path(g,c=>{c.moveTo(8,-46);c.quadraticCurveTo(8,-65,19,-66);},null,'#e8b4a2',8);ellipse(g,22,-68,15,14,volume(g,-83,-53,'#e6b9a4'),C.ink,2);
  path(g,c=>{c.moveTo(29,-70);c.lineTo(47,-63);c.quadraticCurveTo(48,-49,39,-54);c.lineTo(37,-61);c.lineTo(29,-59);},'#e6ba59',C.ink,2);
  ellipse(g,26,-72,6,7,'#fff9e7');if(asleep)line(g,21,-72,31,-72,C.ink,2);else{ellipse(g,wind?27:28,-70,2,3,C.ink);line(g,21,-81,32,-77,C.ink,2);glint(g,26,-72,1.1);}
  for(let row=0;row<3;row++)for(let j=0;j<3;j++)path(g,c=>{const x=-11+j*9,y=-34+row*8;c.moveTo(x,y);c.quadraticCurveTo(x+4,y+6,x+8,y);},null,'#5f5e744d',1.2);path(g,c=>{c.moveTo(11,-81);c.quadraticCurveTo(14,-88,20,-83);c.quadraticCurveTo(19,-88,25,-84);},null,'#6e6476',2);
  for(const x of [-7,9]){line(g,x,-12,x+3,-2,'#d5aa60',3);line(g,x-3,-1,x+8,-1,'#d5aa60',3);}
  if(wind){coconut(g,1,-5,t);line(g,-6,-13,-7,-5,'#d5aa60',3);line(g,8,-13,8,-5,'#d5aa60',3);}if(recover)text(g,'hi hi !',8,-94,11,'#fff2c6');
 }else{
  const crouch=kind==='lion'&&wind?squash*9:0;g.translate(0,crouch+(run?-Math.abs(gait)*2:0));g.scale(1+squash*.12,1-squash*.12);
  const tailY=Math.sin(t*(wind?20:4))*8;path(g,c=>{c.moveTo(-29,-28);c.bezierCurveTo(-49,-26,-50,-45+tailY,-44,-48+tailY);},null,col,5);if(kind==='lion')ellipse(g,-44,-48+tailY,6,9,'#a87141',C.ink,1);
  for(const [k,side] of [[0,-1],[1,1],[2,-1],[3,1]]){const step=run?Math.sin(t*11+k*Math.PI*.7):0,xx=(k<2?-19:19)+side*5,yy=attack&&kind==='lion'?-19:-5;line(g,xx,-25,xx+step*9,yy,C.ink,11);line(g,xx,-25,xx+step*9,yy,col,7);ellipse(g,xx+step*9+3,yy,11,6,kind==='lion'?'#f4ce86':'#8d859e',C.ink,2);}
  ellipse(g,-4,-29,35,26,volume(g,-57,-4,col),C.ink,2.5);ellipse(g,-12,-35,19,12,kind==='lion'?'#f0ca83':'#c6b6cd');
  if(kind==='lion'){for(let j=0;j<3;j++)path(g,c=>{c.moveTo(-26+j*8,-45);c.lineTo(-22+j*8,-40);},null,'#a4754199',2);
   g.save();g.translate(21,-37);if(wind)g.rotate(Math.sin(t*17)*.05);ellipse(g,0,0,26,28,volume(g,-29,28,'#bd7d48'),C.ink,2);for(let j=0;j<9;j++){const a=j/9*Math.PI*2;ellipse(g,Math.cos(a)*21,Math.sin(a)*23,6,7,'#c98e51');}ellipse(g,4,0,19,21,volume(g,-23,19,'#eebf73'),C.ink,2);
   for(const x of [-9,15]){ellipse(g,x,-23,8,8,'#dba564',C.ink,2);ellipse(g,x,-23,4,4,'#f1c994');}
   ellipse(g,12,8,15,10,'#f6d79d',C.ink,1);ellipse(g,19,2,5,4,'#785344');
   for(const x of [1,15]){ellipse(g,x,-8,5,7,'#fff7de');if(asleep)line(g,x-3,-7,x+3,-7,C.ink,2);else{ellipse(g,x+1,-7,2,3,C.ink);glint(g,x,-9,1);}line(g,x-4,-17,x+4,-15+(wind?4:0),C.ink,2);}
   path(g,c=>{c.moveTo(10,11);c.quadraticCurveTo(17,16,24,10);},null,C.ink,1.5);for(const [xx,yy]of [[7,6],[13,10],[8,13]])ellipse(g,xx,yy,1.1,1,'#8c6849');path(g,c=>{c.moveTo(-6,-13);c.quadraticCurveTo(1,-19,7,-16);},null,'#ffe0a0',1.5);if(recover){ellipse(g,20,16,5,8,'#d98080',C.ink,1);text(g,'?',-17,-41,21,'#fff0bd');}
   for(const sy of [-1,1]){line(g,22,8+sy*3,35,7+sy*6,'#785344',1);line(g,23,8+sy*3,35,10+sy*7,'#785344',1);}g.restore();
  }else{
   const puff=wind?squash*8:0;g.save();g.translate(23,-34);if(attack)g.rotate(.16);
   ellipse(g,0,0,25+puff,23+puff*.6,volume(g,-29,24,col),C.ink,2);for(const x of [-12,12]){ellipse(g,x,-21,8,9,'#b49bb4',C.ink,2);ellipse(g,x,-22,4,5,'#dcb9cb');}
   for(const x of [-5,11]){ellipse(g,x,-8,6,8,'#fff7df',C.ink,1);if(asleep||attack)line(g,x-4,-8,x+4,-6,C.ink,2);else{ellipse(g,x+(wind?-1:2),-7,wind?1.5:2.3,4,C.ink);glint(g,x+(wind?-2:1),-9,1.2);}line(g,x-5,-20+(wind?2:0),x+5,-20-(wind?3:0),C.ink,2);}
   rect(g,2,0,39+puff,25,12,volume(g,0,26,'#d0b3c6'),C.ink,2);ellipse(g,30,5,3,2.5,C.ink);ellipse(g,39,6,2.5,2,C.ink);path(g,c=>{c.moveTo(10,5);c.quadraticCurveTo(17,0,25,4);},null,'#f3dae4',1.7);for(const xx of [11,19,26])ellipse(g,xx,15+(xx%3),1,1,'#997b96');
   if(attack){ellipse(g,24,25,20,17,'#714653',C.ink,2);ellipse(g,27,32,11,5,'#e597a0');for(const x of [13,30])rect(g,x,12,7,10,2,'#fff4d9');}
   else{path(g,c=>{c.moveTo(9,20);c.quadraticCurveTo(25,recover?32:26,39,19);},null,C.ink,2);rect(g,17,22,6,8,2,'#fff4d9',C.ink,1);if(wind){ellipse(g,-11,9,11+puff,9+puff,'#d3a9bd88');text(g,'aa…',-19,-44,11,'#fff3c9');}}
   g.restore();
  }
 }
 if(asleep){g.scale(e.dir||1,1);text(g,'z z Z',-4,-90+Math.sin(t*2)*4,15,'#fff1c4');}g.restore();
}
function zebra(g,z,time){
 const run=z.phase==='run'||z.phase==='approach',trapped=z.ready,caught=z.caught,t=z.anim??time,hop=z.hop>0?Math.sin(z.hop/.7*Math.PI)*45:0;
 ellipse(g,z.x,z.y+4,35,6,'#244a402b');g.save();g.translate(z.x,z.y-hop-(caught?Math.abs(Math.sin(t*5))*6:run?Math.abs(Math.sin(t*15))*3:0));g.scale(z.dir,1);
 for(let j=0;j<4;j++){const x=j<2?-20:20,s=run?Math.sin(t*16+j*Math.PI*.7):caught?Math.sin(t*5+j):0;line(g,x,-29,x+s*9,-16,C.ink,10);line(g,x+s*9,-16,x+s*16,-3-Math.max(0,s)*9,C.ink,8);line(g,x,-29,x+s*16,-5-Math.max(0,s)*9,'#f4e5c6',5);ellipse(g,x+s*16+3,-3-Math.max(0,s)*9,9,5,'#455e57');}
 ellipse(g,-2,-36,35,22,volume(g,-59,-15,'#f6e9cb'),C.ink,2);for(let j=0;j<6;j++){path(g,c=>{c.moveTo(-27+j*10,-53);c.quadraticCurveTo(-33+j*12,-36,-22+j*9,-18);},null,'#4c635d',4);}
 path(g,c=>{c.moveTo(-35,-40);c.quadraticCurveTo(-51,-52,-49,-27+Math.sin(t*9)*8);},null,C.ink,3);ellipse(g,-49,-27+Math.sin(t*9)*8,4,8,'#435e55');
 const neck=z.phase==='graze'?.35+Math.sin(t*3)*.09:z.phase==='snack'?.2+Math.sin(t*15)*.05:run?-.15:Math.sin(t*2)*.04;g.save();g.translate(22,-43);g.rotate(neck);line(g,0,10,9,-26,C.ink,19);line(g,0,10,9,-26,'#f6e9cb',14);for(let j=0;j<4;j++)line(g,-4+j*2,2-j*8,7+j*2,6-j*8,'#435e55',4);path(g,c=>{c.moveTo(1,-30);c.lineTo(-8,-22);c.lineTo(-10,-6);c.lineTo(-4,-9);},'#435e55',null);
 ellipse(g,18,-31,24,14,volume(g,-46,-16,'#f6e9cb'),C.ink,2);ellipse(g,37,-27,12,10,volume(g,-39,-17,'#587267'),C.ink,2);for(const x of [8,20]){g.save();g.translate(x,-43);g.rotate(trapped?-.7:Math.sin(t*4+x)*.12);ellipse(g,0,-4,5,12,'#f6e9cb',C.ink,2);ellipse(g,0,-4,2,7,'#caa9a4');g.restore();}
 ellipse(g,22,-35,7,trapped?9:7,'#fff8df',C.ink,1);ellipse(g,22+(trapped?-2:2),-34,2,4,C.ink);glint(g,21+(trapped?-2:2),-36,1.3);line(g,15,-46,28,-47+(trapped?5:0),C.ink,2);ellipse(g,42,-31,2,1.5,'#233e35');path(g,c=>{c.moveTo(29,-22);c.quadraticCurveTo(38,-17,46,-24);},null,C.ink,1.5);if(run&&!trapped)ellipse(g,37,-17,4,7,'#d98c8c');if(z.phase==='snack'){ellipse(g,44,-20+Math.sin(t*15)*2,4,4,'#a8c96b',C.ink,1);}g.restore();
 if(!caught){rect(g,-14,-55,26,18,5,volume(g,-57,-36,'#d88559'),C.ink,1.4);line(g,-10,-51,9,-51,'#ffe0a7',1.3);ellipse(g,-3,-45,2,2,'#ffde85');line(g,-3,-45,-3,-69,'#c99b4e',3);star(g,-3,-75,14,'#f6d36a');}
 g.restore();if(trapped){text(g,z.mode==='snack'?'MIAM !':z.mode==='curious'?'BONJOUR !':'PETITE PAUSE',z.x,z.y-132,13,'#fff1bc');rect(g,z.x-61,z.y-120,122,24,9,'#244a40ed');text(g,'ESPACE · étoile',z.x,z.y-103,11,'#fff1bc');}else if(caught)text(g,'Bien joué !',z.x,z.y-112,13,'#fff2c8');else text(g,{curious:'CURIEUX',snack:'GOURMAND',pause:'FLÂNEUR'}[z.mode],z.x,z.y-110,11,'#fff1bc');
}
function pranks(g,E,time){
 for(const b of E.pranks){if(b.kind==='coconut'){ellipse(g,b.x,b.ground-3,25,6,'#cd684b33','#b96348',1.5);coconut(g,b.x,b.y,time*9);}else if(b.kind==='wave'){for(let j=0;j<3;j++){path(g,c=>{c.moveTo(b.x-j*12,b.y+7);c.quadraticCurveTo(b.x+13-j*12,b.y-22,b.x+23-j*12,b.y+7);},null,j?'#e4bd79aa':'#fff0b9',4);}ellipse(g,b.x-12,b.y+7,35,6,'#b28a5b55');}else{g.save();g.globalAlpha=Math.min(1,b.life*3);for(let j=0;j<4;j++){const y=b.y-20+j*13;path(g,c=>{c.moveTo(b.x-27,y);c.bezierCurveTo(b.x+30,y-10,b.x+40,y+14,b.x+20,y+7);},null,'#e6efc5',3);}g.restore();}}
}
function livingEdges(g,L,time,camera,W){
 for(const s of L.platforms){if(s.h<80)continue;for(let x=Math.ceil((Math.max(s.x,camera-20)+18)/91)*91;x<Math.min(s.x+s.w-10,camera+W+30);x+=91){const n=Math.floor(x/91);path(g,c=>{c.moveTo(x,s.y+12);c.quadraticCurveTo(x-13,s.y+40,x+7,s.y+67);c.lineTo(x+1,s.y+40);},'#795f4766',null);ellipse(g,x+21,s.y+65,13,5,'#d4b47c55');if(n%3===0){const sway=Math.sin(time*1.4+x)*3;for(let j=0;j<3;j++){path(g,c=>{c.moveTo(x,s.y);c.quadraticCurveTo(x-7+j*7,s.y-22,x-10+j*9+sway,s.y-35-j*5);},null,'#548355',2);ellipse(g,x-10+j*9+sway,s.y-35-j*5,3,6,'#b28c57');}}if(n%4===1){ellipse(g,x,s.y-4,8,3,'#527f53');ellipse(g,x+5,s.y-9,5,5,'#e8bb83');ellipse(g,x+5,s.y-9,2,2,'#926f46');}}}
}
// Large, distinct compositions occupy the middle distance; terrain stays crisp.
function vista(g,W,H,camera,kind,time){
 const spacing=680,origin=Math.floor(camera*.46/spacing);g.save();
 for(let n=origin-1;n<=origin+Math.ceil(W/spacing)+1;n++){
  const x=n*spacing-camera*.46;g.save();g.translate(x,0);
  if(kind==='harbour'){
   // Stilted boat house, little jetty, mooring ropes and stacked fishing baskets.
   for(let j=0;j<5;j++)line(g,58+j*45,385,58+j*45,540,'#6e8373',8);
   rect(g,43,315,210,110,4,'#91aa8a');for(let j=0;j<10;j++)line(g,48+j*22,318,48+j*22,423,'#708b78',2);
   path(g,c=>{c.moveTo(23,317);c.lineTo(137,222);c.lineTo(272,317);c.closePath();},'#b9896a',null);
   for(let j=0;j<7;j++)line(g,54+j*27,307,137+(j-3)*13,237,'#d3b18a',3);
   rect(g,123,353,39,72,18,'#567968');rect(g,65,343,32,34,6,'#efd49a');line(g,81,344,81,375,'#6e8b74',3);line(g,65,359,97,359,'#6e8b74',3);
   rect(g,20,425,315,12,3,'#c3a67a');for(let j=0;j<4;j++){ellipse(g,204+j*22,414-(j%2)*13,18,12,'#ad9871','#77866c',1);line(g,194+j*22,410-(j%2)*13,214+j*22,410-(j%2)*13,'#dcc195',2);}
   path(g,c=>{c.moveTo(306,422);c.quadraticCurveTo(371,492,435,435);},null,'#968768',3);path(g,c=>{c.moveTo(362,460+Math.sin(time)*3);c.quadraticCurveTo(424,508,497,460+Math.sin(time)*3);c.closePath();},'#6d9683',null);
  }else if(kind==='canopy'){
   // Buttress roots and layered foliage, with hanging orchids and sunlit vines.
   path(g,c=>{c.moveTo(30,520);c.bezierCurveTo(110,450,100,210,83,-20);c.lineTo(135,-20);c.bezierCurveTo(123,260,152,466,235,520);c.lineTo(143,486);c.lineTo(130,519);c.lineTo(111,488);c.closePath();},'#4d7864',null);
   path(g,c=>{c.moveTo(115,450);c.bezierCurveTo(96,300,139,120,113,0);},null,'#73916c',9);
   for(let j=0;j<13;j++){const xx=25+j*46,yy=20+Math.sin(j*1.7)*35;ellipse(g,xx,yy,72,40,j%2?'#456d56':'#5c885d');ellipse(g,xx+14,yy-13,41,18,'#719966');}
   for(let j=0;j<5;j++){const xx=200+j*78,sway=Math.sin(time*.7+j+n)*8;path(g,c=>{c.moveTo(xx,0);c.bezierCurveTo(xx-20,100,xx+20,170,xx+sway,258+j%2*40);},null,'#456e55',4);for(let k=0;k<3;k++){ellipse(g,xx+sway+(k%2?8:-8),173+k*27,13,6,'#83a26a');}ellipse(g,xx+sway,262+j%2*40,8,13,'#cc96a0');ellipse(g,xx+sway-9,258+j%2*40,8,5,'#e1b6aa');}
   path(g,c=>{c.moveTo(140,60);c.lineTo(370,490);c.lineTo(455,490);c.lineTo(190,60);},'#fff2b511',null);
  }else if(kind==='falls'){
   const poly=(points,c)=>path(g,p=>{points.forEach(([a,b])=>p.lineTo(a,b));p.closePath();},c,null);
   poly([[10,510],[55,190],[130,94],[259,132],[304,300],[365,510]],'#6b9992');poly([[55,190],[130,94],[160,360],[100,510],[10,510]],'#83aaa0');poly([[130,94],[259,132],[230,305],[160,360]],'#a0b9a4');poly([[230,305],[304,300],[365,510],[280,510]],'#57847e');
   for(let j=0;j<3;j++){const xx=158+j*29,top=144+j*43,w=19+j*7;rect(g,xx,top,w,360-top+150,4,'#bbe3d0');for(let k=0;k<5;k++){const yy=top+((time*150+k*57+j*31)%(490-top));line(g,xx+5+k%2*7,yy,xx+5+k%2*7,yy+22,'#eff9dfbb',2);}ellipse(g,xx+10,498,47,12,'#d5e9d077');}
   for(let j=0;j<8;j++){const xx=65+j*36;ellipse(g,xx,163+j%3*19,28,9,'#638f64');}g.globalAlpha=.2;for(let j=0;j<3;j++){g.beginPath();g.arc(405,511,94+j*5,Math.PI,Math.PI*2);g.strokeStyle=['#eeaa94','#eedc99','#bfd6ad'][j];g.lineWidth=6;g.stroke();}g.globalAlpha=1;
  }else if(kind==='ruins'){
   // A half-buried crocodile guardian rather than another row of identical arches.
   rect(g,60,440,190,50,5,'#8eaa8a');rect(g,77,427,158,17,3,'#c2c39a');ellipse(g,147,341,65,90,'#9eaf8b');rect(g,158,258,132,55,20,'#a9ba96');ellipse(g,157,265,38,42,'#a9ba96');ellipse(g,179,234,14,17,'#c1cba1');ellipse(g,183,237,5,7,'#657f69');line(g,176,295,278,295,'#738b71',4);for(let j=0;j<5;j++)path(g,c=>{c.moveTo(186+j*18,296);c.lineTo(190+j*18,308);c.lineTo(196+j*18,296);},'#d2d2aa',null);
   path(g,c=>{c.moveTo(122,350);c.lineTo(145,330);c.lineTo(134,307);c.lineTo(151,280);},null,'#6c8b6e',3);for(let j=0;j<4;j++){rect(g,115,365+j*13,63,6,3,'#859f7d');}
   for(let j=0;j<6;j++){const xx=340+j*35,yy=469-(j%3)*24;rect(g,xx,yy,48,30,4,j%2?'#8fa587':'#aabb96');line(g,xx+8,yy+10,xx+29,yy+12,'#c8cda6',2);}path(g,c=>{c.moveTo(146,215);c.bezierCurveTo(113,249,168,280,121,362);},null,'#527d55',6);for(let j=0;j<6;j++)ellipse(g,140+Math.sin(j)*14,229+j*22,12,5,'#6d985f');
  }else if(kind==='moon'){
   // Blue marsh, giant luminous mushrooms and reflections.
   for(let j=0;j<5;j++){const xx=70+j*101,yy=480,hh=78+(j%3)*38;path(g,c=>{c.moveTo(xx-7,yy);c.quadraticCurveTo(xx+9,yy-hh/2,xx,yy-hh);},null,'#779b9e',12);ellipse(g,xx,yy-hh,37+j%2*18,16,'#648e9d');path(g,c=>{c.moveTo(xx-38,yy-hh);c.quadraticCurveTo(xx,yy-hh-66,xx+38,yy-hh);c.closePath();},j%2?'#9aa5be':'#77aaa9',null);for(let k=0;k<3;k++)ellipse(g,xx-14+k*14,yy-hh-12-Math.sin(k)*7,4,3,'#d2e5cf');ellipse(g,xx,yy-hh,48,24,'#b6e4b517');line(g,xx-15,yy-hh+4,xx+15,yy-hh+4,'#c7e4bd',2);}
   for(let j=0;j<10;j++){const xx=40+j*61+Math.sin(time*.5+j)*12,yy=340+j%4*31+Math.cos(time+j)*7;ellipse(g,xx,yy,2,2,'#ffe8a7');ellipse(g,xx,yy,9,9,'#fce7a61d');}
  }else if(kind==='mill'){
   rect(g,55,250,160,240,6,'#698d82');for(let j=0;j<7;j++)line(g,57,270+j*32,211,270+j*32,'#8da594',2);path(g,c=>{c.moveTo(35,252);c.lineTo(131,183);c.lineTo(234,252);},'#9b8570',null);rect(g,104,276,45,65,18,'#e7ce8d');line(g,126,280,126,340,'#739283',4);line(g,105,310,149,310,'#739283',4);
   g.save();g.translate(228,410);g.rotate(time*.27);ellipse(g,0,0,87,87,'#55796e','#b4a278',7);ellipse(g,0,0,70,70,'#7d9e8e','#c4b28c',4);for(let j=0;j<10;j++){g.rotate(Math.PI/5);line(g,0,0,80,0,'#b6ab80',8);rect(g,71,-10,22,20,3,'#a79b72');}ellipse(g,0,0,13,13,'#dcc99a');g.restore();
   path(g,c=>{c.moveTo(147,260);c.lineTo(147,206);c.quadraticCurveTo(147,184,169,184);c.lineTo(395,184);c.quadraticCurveTo(420,184,420,210);c.lineTo(420,340);},null,'#5a7f74',18);path(g,c=>{c.moveTo(147,260);c.lineTo(147,206);c.quadraticCurveTo(147,184,169,184);c.lineTo(395,184);c.quadraticCurveTo(420,184,420,210);c.lineTo(420,340);},null,'#adad83',10);for(let j=0;j<5;j++)ellipse(g,420+Math.sin(j)*8,350+(time*60+j*29)%120,3,7,'#a9d1bc');
  }else if(kind==='savannah'){
   // Broad acacia and termite mounds with warm ochre grass.
   path(g,c=>{c.moveTo(109,501);c.lineTo(125,341);c.lineTo(73,287);c.lineTo(84,278);c.lineTo(137,324);c.lineTo(184,273);c.lineTo(195,282);c.lineTo(144,347);c.lineTo(138,501);},'#7d8360',null);
   for(let j=0;j<7;j++){ellipse(g,26+j*35,275+Math.sin(j*2)*9,48,18,j%2?'#93a16a':'#7e935f');ellipse(g,29+j*35,266+Math.sin(j*2)*9,27,8,'#b0b778');}
   for(let j=0;j<3;j++){const xx=390+j*57;path(g,c=>{c.moveTo(xx-35,500);c.quadraticCurveTo(xx-5,422-j%2*55,xx,420-j%2*55);c.quadraticCurveTo(xx+18,429,xx+40,500);},'#bc9d71',null);ellipse(g,xx+3,476,5,10,'#978863');}
   for(let j=0;j<25;j++){const xx=j*25;path(g,c=>{c.moveTo(xx,509);c.lineTo(xx-7,487);c.lineTo(xx+3,496);c.lineTo(xx+9+Math.sin(time+j)*3,480);},null,'#b5aa6e',3);}
  }else if(kind==='fair'){
   // Crocodile carousel: rides turn slowly on a platform, striped canopy above.
   ellipse(g,190,467,149,23,'#bd9d80');rect(g,181,275,18,190,5,'#b9a075');for(let j=0;j<4;j++){const a=time*.4+j*Math.PI/2,xx=190+Math.cos(a)*111,yy=424+Math.sin(a)*12;line(g,xx,287,xx,yy+13,'#c7b184',4);ellipse(g,xx,yy,26,12,'#8eaa88');rect(g,xx+15,yy-8,23,12,5,'#9cb493');ellipse(g,xx+13,yy-13,4,5,'#f0e4bf');line(g,xx-12,yy+10,xx-15,yy+25,'#708c70',5);line(g,xx+12,yy+10,xx+17,yy+25,'#708c70',5);}
   path(g,c=>{c.moveTo(29,287);c.quadraticCurveTo(190,231,190,206);c.quadraticCurveTo(220,252,350,287);c.closePath();},'#ba7e79',null);for(let j=0;j<4;j++)path(g,c=>{c.moveTo(190,210);c.lineTo(55+j*75,286);c.lineTo(85+j*75,286);c.closePath();},'#ead3a4',null);for(let j=0;j<12;j++)ellipse(g,39+j*27,289,5,5,'#fae0a1');line(g,190,205,190,173,'#b49b75',3);star(g,190,168,12,'#e8c27c');
  }else if(kind==='fort'){
   rect(g,25,220,280,283,4,'#79928c');for(let row=0;row<9;row++)for(let col=0;col<5;col++){const xx=27+col*62-(row%2)*27;line(g,xx,230+row*30,xx+55,230+row*30,'#9eafa0',2);line(g,xx,232+row*30,xx,256+row*30,'#637f79',2);}for(let j=0;j<6;j++)rect(g,23+j*52,194,32,42,3,'#809990');
   rect(g,123,351,83,152,41,'#4f746c');for(let j=0;j<6;j++)line(g,134+j*12,361,134+j*12,503,'#92a18b',4);line(g,126,415,203,415,'#a6b09a',5);
   for(const xx of [70,257]){rect(g,xx-13,275,27,50,13,'#42695f');path(g,c=>{c.moveTo(xx-17,331);c.lineTo(xx+17,331);c.lineTo(xx+12,385);c.lineTo(xx,398);c.lineTo(xx-12,385);},'#b58575',null);star(g,xx,353,8,'#dfc48a');}
  }
  g.restore();
 }
 g.restore();
}
function land(g,s,kind){
 const raised=s.h<80,stone=['falls','ruins','fort','moon'].includes(kind),dock=kind==='harbour'||kind==='mill'||kind==='fair';
 const colors={harbour:['#a4815c','#b8a77b','#dfc396'],canopy:['#796948','#547d44','#a2be65'],falls:['#72948c','#739c74','#adc798'],ruins:['#9b9b75','#81945e','#c0cb8b'],moon:['#526e79','#4e8a83','#9bb7a0'],mill:['#937d60','#9ca37c','#d0bc8e'],savannah:['#bd9163','#adad61','#e5ce88'],fair:['#a78562','#a3b66b','#d8cc86'],fort:['#80948b','#76936c','#b4bf8a']},pal=colors[kind]||colors.canopy;
 rect(g,s.x,s.y,s.w,Math.max(24,s.h),raised?5:2,pal[0],C.ink,2.5);
 if(raised&&dock){for(let x=s.x+4;x<s.x+s.w-4;x+=30){rect(g,x,s.y+3,25,s.h-5,2,'#bb9565');ellipse(g,x+5,s.y+7,1.5,1.5,'#66583c');}return;}
 if(stone){g.save();g.beginPath();g.rect(s.x+2,s.y+8,s.w-4,Math.max(16,s.h-9));g.clip();for(let row=0;row<Math.ceil(s.h/31);row++)for(let x=s.x-25+(row%2)*34;x<s.x+s.w;x+=69){line(g,x,s.y+18+row*31,x+64,s.y+18+row*31,'#304e493c',2);line(g,x+64,s.y+19+row*31,x+64,s.y+45+row*31,'#304e493c',2);line(g,x+5,s.y+21+row*31,x+57,s.y+21+row*31,'#eff0c633',1);}g.restore();}
 else{for(let row=0;row<3;row++){path(g,c=>{for(let x=s.x;x<=s.x+s.w;x+=20)c.lineTo(x,s.y+28+row*31+Math.sin(x*.04+row)*5);},null,row%2?'#e6c88a33':'#514c3822',8);}for(let x=s.x+22;x<s.x+s.w;x+=63){ellipse(g,x,s.y+51,7,4,'#ecd19d50');ellipse(g,x+30,s.y+81,10,5,'#574f3530');}}
 g.fillStyle=pal[1];g.fillRect(s.x,s.y,s.w,12);g.fillStyle=pal[2];g.fillRect(s.x,s.y,s.w,4);
 if(!raised&&!dock)for(let x=s.x+8;x<s.x+s.w;x+=19){path(g,c=>{c.moveTo(x,s.y+5);c.lineTo(x-4,s.y-4);c.lineTo(x+2,s.y);c.lineTo(x+7,s.y-9);},null,pal[1],2);}
 if(raised&&kind==='canopy'){path(g,c=>{c.moveTo(s.x+12,s.y+s.h);c.quadraticCurveTo(s.x+28,s.y+s.h+38,s.x+15,s.y+s.h+60);},null,'#66874f',3);for(let j=0;j<4;j++)ellipse(g,s.x+20+(j%2?5:-5),s.y+s.h+12+j*9,7,3,'#82a15d');}
}
function foreground(g,W,H,camera,kind,time){
 // Low foreground banks frame the stage without masking platforms or hazards.
 const dry=['savannah','fair','fort'].includes(kind);g.save();g.translate(-(camera*.7%190),0);
 for(let j=-1;j<W/190+2;j++){const x=j*190+25,y=H+18+(j%2)*12,col=kind==='moon'?'#294d60':'#315f51';
  if(dry){for(let k=0;k<5;k++){path(g,c=>{c.moveTo(x,y);c.quadraticCurveTo(x-22+k*10,y-26,x-31+k*18+Math.sin(time+k)*3,y-66-(k%3)*11);},null,col,3);} }
  else{for(let k=0;k<4;k++){const xx=x-18+k*16;path(g,c=>{c.moveTo(x,y);c.quadraticCurveTo(xx,y-48,xx+Math.sin(time*.8+k)*5,y-89+(k%2)*17);c.quadraticCurveTo(xx+25,y-24,x,y);},col,null);line(g,x,y,xx,y-59,'#4c796045',1);}}
 }g.restore();
}
function expeditionObjects(g,E,time){
 if(!E.expedition)return;const X=root.CrocoExpedition,L=E.L;
 const tag=(label,x,y,color='#244a40ed')=>{const font=E.viewScale?Math.max(11,13/E.viewScale):11,w=Math.min(350,Math.max(70,label.length*font*.57+18)),height=font+12;rect(g,x-w/2,y-font-4,w,height,7,color);g.save();g.font=`bold ${font}px "Trebuchet MS",sans-serif`;g.textAlign='center';g.fillStyle='#fff1c5';g.fillText(label,x,y+1,w-10);g.restore();};
 const icon=(d,x,y,small=false)=>{g.save();g.translate(x,y);if(small)g.scale(.65,.65);const col=d.heavy?'#a0b4ba':'#e6be68';
 if(d.kind==='toy'){ellipse(g,0,0,15,15,'#d97e66',C.ink,2);line(g,-13,-5,13,5,'#f7d992',4);}
 else if(d.kind==='fruit'){ellipse(g,0,0,14,13,'#b8c575',C.ink,2);line(g,0,-11,3,-20,'#62855b',3);}
 else if(d.kind==='crank'){ellipse(g,-9,-5,8,8,col,C.ink,2);line(g,-3,0,12,12,col,7);line(g,10,10,16,4,col,5);}
 else if(d.kind==='rope'){for(let j=0;j<3;j++)ellipse(g,j*3-3,0,12,16,null,'#d8b876',3);}
 else if(d.kind==='bell'){path(g,c=>{c.moveTo(-14,9);c.quadraticCurveTo(-12,-15,0,-15);c.quadraticCurveTo(12,-15,14,9);c.closePath();},col,C.ink,2);ellipse(g,0,12,4,4,C.ink);}
 else{rect(g,-16,-15,32,30,5,col,C.ink,2);line(g,-10,-9,10,9,'#f4dfaa',3);if(d.heavy)text(g,'◆',0,6,16);}
 g.restore();};
 for(const b of L.basins||[]){const on=E.expedition.modes[b.control];rect(g,b.x,b.y-12,b.w,18,5,'#718f8e');if(on){rect(g,b.x+6,b.y-70,b.w-12,60,5,'#69bdbb65');for(let x=b.x+12;x<b.x+b.w-25;x+=37)line(g,x,b.y-67+Math.sin(time*3+x)*3,x+23,b.y-67,'#d9f1d4',2);}}
 for(const s of L.sockets){const it=E.expedition.items.find(i=>i.slot===s.id);const on=s.weight?X.test(E,{weight:s.id}):!!it;rect(g,s.x-33,s.y-10,66,12,4,on?'#a5c87c':'#bcaa7e',C.ink,2);if(!s.weight){rect(g,s.x-24,s.y-48,48,35,7,'#244a4020','#879580',2);if(!it&&s.accept?.length){const d=L.items.find(i=>i.id===s.accept[0]);g.save();g.globalAlpha=.35;icon(d,s.x,s.y-30,true);g.restore();}}
 tag(s.name,s.x,s.y+29);if(s.weight)text(g,'↓',s.x,s.y-28,20);}
 for(const c of L.controls){const m=E.expedition.modes[c.id];if(c.hidden)continue;
  if(c.kind==='lamp'){rect(g,c.x-25,c.y-76,50,62,12,'#395a50',C.ink,2);ellipse(g,c.x,c.y-47,16,16,m?'#ffe78c':'#6a8076',C.ink,2);text(g,c.name,c.x,c.y-91,15);tag('But : '+(c.want?'ON':'OFF'),c.x,c.y-10);continue;}
  if(c.kind==='score'){const seq=L.sequences.find(q=>q.id===c.id),w=seq.order.length*30;rect(g,c.x-w/2-12,c.y-165,w+24,80,12,'#fff0c9',C.ink,2);text(g,'PARTITION',c.x,c.y-143,12);seq.order.forEach((note,i)=>{rect(g,c.x-w/2+i*30,c.y-131,26,30,5,i<m?'#a4c884':'#e4d4af');text(g,note,c.x-w/2+i*30+13,c.y-110,17);});text(g,m+' / '+seq.order.length,c.x,c.y-66,16);continue;}
 rect(g,c.x-23,c.y-34,46,30,6,'#849d91',C.ink,2);line(g,c.x,c.y-20,c.x+(m?17:-17),c.y-63,'#d4b064',6);ellipse(g,c.x+(m?17:-17),c.y-63,8,8,m?'#b5cf80':'#e2ad6b',C.ink,2);tag(c.name,c.x,c.y-91);tag(c.labels?.[m]||String(m),c.x,c.y+30);if(c.flips)text(g,'↔ '+c.flips.map(id=>L.controls.find(o=>o.id===id).name).join(' '),c.x,c.y-119,13);if(c.hero!==undefined)text(g,['Croquinet','Croquefort','Croqueboum'][c.hero],c.x,c.y-123,12);}
 for(const b of L.balances||[]){const [left,right]=X.balance(E,b),ok=X.test(E,{balance:b.id});g.save();g.translate(b.x,b.y-180);line(g,0,5,0,65,'#617c6b',9);g.rotate(Math.max(-.2,Math.min(.2,(right-left)*.04)));line(g,-80,0,80,0,'#cfa85b',8);for(const x of [-65,65]){line(g,x,0,x,35,'#617c6b',3);rect(g,x-24,32,48,10,4,ok?'#a4c884':'#dab67b',C.ink,2);}g.restore();tag(b.name,b.x,b.y-211);tag(left+' = '+right+'  /  '+b.total,b.x,b.y-72,ok?'#4d7949':'#244a40ed');}
 for(const i of E.expedition.items){const d=L.items.find(d=>d.id===i.id);if(!X.test(E,d.visibleWhen))continue;const y=i.holder>=0?E.p[i.holder].y-155:i.y-28;icon(d,i.x,y);if(i.holder>=0||!i.slot)tag(d.name+(d.heavy&&!/lourd/i.test(d.name)?' · lourd':''),i.x,i.holder>=0?y-30:i.y-132);}
 const n=X.nearby(E),p=E.p[E.active];if(n&&!E.viewScale)tag('F · '+n.label,p.x,p.y-195,'#526f5fee');
}
function render(g,W,H,E,camera,time=0,cameraY=0){
 const L=E.L;g.save();background(g,W,H,camera,L.theme,time,L.scenery);g.translate(-camera,-cameraY);
 if(L.height>700){for(const zone of L.zones||[]){g.save();g.globalAlpha=.35;for(let x=zone.x+35;x<zone.x+zone.w;x+=170){rect(g,x,zone.y,18,zone.h,4,'#456e62');for(let y=zone.y+80;y<zone.y+zone.h;y+=180){line(g,x,y,x+150,y-40,'#cfb57c',8);path(g,c=>{c.moveTo(x+12,y-15);c.quadraticCurveTo(x+55,y+65,x+25,y+120);},null,'#96ad6d',5);}}g.restore();rect(g,zone.x+20,zone.y+18,230,34,12,'#244a40bb');text(g,zone.label,zone.x+135,zone.y+41,14,'#fce8b3');}}
 // Decorative piers, arches, lily pads.
 for(let x=30;['harbour','mill','fair'].includes(L.scenery)&&x<L.width;x+=220){if(!L.platforms.some(s=>s.y===520&&x>s.x&&x<s.x+s.w))continue;line(g,x,538,x,650,'#6e6448',14);line(g,x+4,540,x+4,650,'#c19b60',3);}
 for(const s of L.platforms)land(g,s,L.scenery);livingEdges(g,L,time,camera,W);
 for(const [j,e] of (L.elephants||[]).entries()){const calm=E.open(e);elephant(g,e.x,e.y,time,E.elephantPose[j]??Number(calm),e.scale||1,e.lift?E.lifts[e.lift]:null,E.beasts[j]);if(!calm){text(g,E.beasts[j]?.phase==='windup'?'ATTENTION AUX PIEDS !':e.label||"CHUUUT…",e.x,e.y-207,13,"#fff1c9");}}
 // Rail-mounted counterweights: Croquefort pushes by walking against them.
 for(const b of L.blocks||[]){const x=E.blocks[b.id];line(g,b.minX-8,b.y+b.h+5,b.maxX+b.w+8,b.y+b.h+5,'#4a6761',7);for(const end of [b.minX-8,b.maxX+b.w+8])line(g,end,b.y+b.h-7,end,b.y+b.h+10,'#c79c57',5);rect(g,x,b.y,b.w,b.h-4,8,'#88a09a',C.ink,3);rect(g,x+7,b.y+7,b.w-14,b.h-23,5,'#bac6ab',C.ink,1);text(g,b.windOnly?'≈':'X',x+b.w/2,b.y+30,20,C.ink);for(const xx of [x+11,x+b.w-11])ellipse(g,xx,b.y+b.h-5,7,7,'#d9b768',C.ink,2);}
 // Ropes, mechanisms and colour-coded shared keys.
 for(const l of L.ladders||[]){g.save();if(!E.open(l))g.globalAlpha=.25;line(g,l.x-20,l.y-24,l.x-20,l.y+l.h,'#cfa36a',5);line(g,l.x+20,l.y-24,l.x+20,l.y+l.h,'#cfa36a',5);for(let y=l.y-8;y<l.y+l.h;y+=23)line(g,l.x-20,y,l.x+20,y,'#f0d198',5);g.restore();}
 for(const l of L.lifts||[]){const y=E.lifts[l.id];for(const x of l.elephant?[]:[l.x+8,l.x+l.w-8]){line(g,x,l.toY-70,x,l.y+8,'#516e6860',3);line(g,x,l.toY-70,x,y,'#c3a068',3);ellipse(g,x,l.toY-60,12,12,'#e8c87c',C.ink,2);}rect(g,l.x,y,l.w,16,5,'#dab064',C.ink,3);text(g,'↑  ↓',l.x+l.w/2,y+34,17,'#fff1c5');}
 for(const r of L.reactors||[]){const on=E.flag(r.id);rect(g,r.x,r.y-16,r.w,20,5,on?'#b2cf84':'#e6b363',C.ink,3);for(let x=r.x+12;x<r.x+r.w;x+=22)line(g,x,r.y-12,x+9,r.y-4,'#fff0bd',2);rect(g,r.x+r.w/2-55,r.y+12,110,24,8,'#244a40e8');text(g,on?'✓ '+r.label:r.label,r.x+r.w/2,r.y+29,10,'#fff0bd');}
 for(const b of L.conveyors||[]){rect(g,b.x,b.y-4,b.w,12,5,'#4a6761',C.ink,2);for(let x=b.x+12;x<b.x+b.w-4;x+=24){ellipse(g,x,b.y+3,6,6,'#d6b56b',C.ink,1);const shift=(time*40)%24;text(g,b.speed<0?'‹':'›',x+shift,b.y+30,20,'#fff0bf');}}
 for(const s of L.springs||[]){const x=s.x+s.w/2;path(g,c=>{c.moveTo(x-22,s.y);for(let j=0;j<5;j++)c.lineTo(x+(j%2?16:-16),s.y-4-j*5);},null,'#d9b76d',3);ellipse(g,x,s.y-24,s.w/2,8,'#9ebd65',C.ink,2);ellipse(g,x,s.y-27,14,4,'#d5df8b');text(g,'↑',x,s.y-45,19);}
 for(const t of L.portals||[]){const ready=E.open(t);g.save();g.globalAlpha=ready?1:.4;rect(g,t.x-31,t.y-92,62,92,26,'#80c4bb66','#416f6b',4);for(let j=0;j<3;j++){g.beginPath();g.ellipse(t.x,t.y-46,12+j*7,27+j*3,Math.sin(time*1.2+j)*.25,0,Math.PI*2);g.strokeStyle=j%2?'#f2e3a4':'#b0ebe1';g.lineWidth=2;g.stroke();}text(g,'ESPACE',t.x,t.y+22,10,'#fff2c4');g.restore();}
 for(const k of L.keys||[])if(!E.flag(k.id)){const y=k.y+Math.sin(time*3)*3,col=['#d7815b','#e9bd58','#6bacc8'][k.hero]||C.gold;ellipse(g,k.x,y,27,27,col+'26');ellipse(g,k.x-9,y-4,10,10,col,C.ink,2);ellipse(g,k.x-9,y-4,4,4,'#f9edbd',C.ink,1);line(g,k.x,y+2,k.x+17,y+17,col,7);line(g,k.x+12,y+10,k.x+7,y+16,col,5);text(g,['W','X','C'][k.hero]||'CLÉ',k.x,k.y-33,12);}
 for(const b of L.bridges){if(E.open(b)){rect(g,b.x,b.y,b.w,b.h,4,'#c29a5f',C.ink,3);for(let x=b.x+14;x<b.x+b.w;x+=24)line(g,x,b.y,x,b.y+b.h,'#896d47',2);line(g,b.x,b.y+30,b.x+b.w,b.y+30,'#5e7753',3);}else{for(let x=b.x+10;x<b.x+b.w;x+=40)line(g,x,b.y+8,x+20,b.y+8,'#f7e4a960',3);text(g,b.id.endsWith('bridgeA')?'A seul':b.id.endsWith('bridgeB')?'B seul':'PONT REPLIÉ',b.x+b.w/2,b.y+64,12,'#e8edc9');}}
 for(const pad of L.pads){for(let j=0;j<6;j++)ellipse(g,pad.x+Math.cos(j)*14,pad.y-6+Math.sin(j)*4,8,4,'#f3d684');ellipse(g,pad.x,pad.y-6,7,4,'#b98242');}
 for(const sign of L.signs){line(g,sign.x,sign.y-3,sign.x,sign.y-70,'#81684c',6);rect(g,sign.x-63,sign.y-82,126,28,5,'#edcf8b',C.ink,2);text(g,sign.text,sign.x,sign.y-63,10);}
 for(const sw of L.switches)drawSwitch(g,E,sw);
 for(const pl of L.plates){rect(g,pl.x,pl.y-8,pl.w,8,3,E.flag(pl.id)?'#d8dc8a':'#dfa954',C.ink,2);for(let j=0;j<3;j++)line(g,pl.x+15+j*22,pl.y-4,pl.x+19+j*22,pl.y-4,'#fff0bf',2);if(pl.label)text(g,pl.label,pl.x+pl.w/2,pl.y+24,10,'#fff0bd');}
 for(const gate of L.gates){const open=E.open(gate);if(L.expedition&&!gate.passage){rect(g,gate.x,gate.y,gate.w,gate.h,4,'#59796e',C.ink,2);for(let yy=gate.y+30;yy<gate.y+gate.h;yy+=45)line(g,gate.x+3,yy,gate.x+gate.w-3,yy,'#91a28a',2);continue;}if(gate.elephant){if(!open){line(g,gate.x,gate.y+gate.h,gate.x+gate.w,gate.y+gate.h,"#d5a765",4);text(g,"TROMPE BAISSÉE",gate.x+gate.w/2,gate.y-14,10);}continue;}line(g,gate.x-5,gate.y-15,gate.x-5,gate.y+gate.h,'#5b7460',10);line(g,gate.x+gate.w+5,gate.y-15,gate.x+gate.w+5,gate.y+gate.h,'#5b7460',10);rect(g,gate.x-14,gate.y-20,gate.w+28,22,4,'#d1aa67',C.ink,2);if(!open){rect(g,gate.x,gate.y,gate.w,gate.h,3,'#d4a15f',C.ink,2);for(let yy=gate.y+15;yy<gate.y+gate.h;yy+=26)line(g,gate.x+3,yy,gate.x+gate.w-3,yy+8,'#f0ce83',4);text(g,'×',gate.x+gate.w/2,gate.y+gate.h/2,22,C.ink);}else text(g,'✓',gate.x+gate.w/2,gate.y-28,22,'#335949');if(!open)(gate.requires||[]).forEach((id,i)=>{const k=(L.keys||[]).find(k=>k.id===id);ellipse(g,gate.x+gate.w/2,gate.y+35+i*28,8,8,E.flag(id)?'#a5c576':k?['#d7815b','#e9bd58','#6bacc8'][k.hero]:'#728e89',C.ink,2);});}
 for(const c of L.crates)if(!E.broken[c.id]){for(let y=c.y;y<c.y+c.h;y+=c.h/2){rect(g,c.x,y,c.w,c.h/2-2,4,'#be8954',C.ink,3);line(g,c.x+7,y+7,c.x+c.w-7,y+c.h/2-9,'#e8b976',6);line(g,c.x+c.w-7,y+7,c.x+7,y+c.h/2-9,'#8a603e',2);}}
 for(const c of L.crates)if(!E.broken[c.id]&&c.requires?.length&&!E.open(c)){rect(g,c.x+7,c.y+8,c.w-14,c.h-16,5,'#799596',C.ink,2);text(g,'×',c.x+c.w/2,c.y+c.h/2+7,24,'#e6e4b4');}
 for(const t of L.targets){const lit=E.flags[t.id],ready=E.open(t);line(g,t.x,t.y+12,t.x,t.y+38,'#59734e',5);ellipse(g,t.x,t.y,23,23,lit?'#a6be66':ready?'#d77b55':'#839c99',C.ink,3);ellipse(g,t.x,t.y,15,15,lit?'#dce4a2':'#f6d2a0',C.ink,1);ellipse(g,t.x,t.y,7,7,lit?'#718d43':'#cf7851');if(lit)text(g,'✓',t.x,t.y+6,20,'#365846');else text(g,t.label,t.x,t.y-35,10);if(t.rule&&!lit){rect(g,t.x-105,t.y-110,210,25,7,'#244a40e8');text(g,t.rule,t.x,t.y-93,10,'#fff0bd');}if(t.hitDirection&&!lit){const side=t.hitDirection;line(g,t.x+side*27,t.y-23,t.x+side*27,t.y+23,'#46656a',7);text(g,t.hitDirection<0?'←':'→',t.x-side*42,t.y+6,22,'#b5613f');}if(t.requires&&!lit)t.requires.forEach((id,i)=>ellipse(g,t.x+(i-(t.requires.length-1)/2)*18,t.y-53,5,5,E.flag(id)?'#95b667':'#e4d7ad',C.ink,1));if(t.requiresOff&&!lit)t.requiresOff.forEach((id,i)=>{ellipse(g,t.x+i*18,t.y-72,5,5,E.flag(id)?'#d77957':'#95b667',C.ink,1);line(g,t.x-4+i*18,t.y-76,t.x+4+i*18,t.y-68,C.ink,1);});}
 for(const t of L.turrets){const off=E.flags[t.off];g.save();g.translate(t.x+35,t.y+10);line(g,0,26,0,0,'#4b7e50',8);ellipse(g,-8,10,16,7,'#719f5b',C.ink,1);for(let j=0;j<5;j++)ellipse(g,Math.cos(j*1.25)*14,-18+Math.sin(j*1.25)*14,11,12,off?'#d7b876':'#c38583',C.ink,1.5);ellipse(g,0,-18,12,12,'#f1d48c',C.ink,2);text(g,off?'⌣':'•',0,-13,18);g.restore();}
 // A little pennant marks the shared checkpoint.
 const cp=L.checkpoint;line(g,cp.x,cp.y,cp.x,cp.y-92,'#4d6d56',5);path(g,c=>{c.moveTo(cp.x,cp.y-92);c.lineTo(cp.x+39,cp.y-84);c.lineTo(cp.x,cp.y-65);c.closePath();},E.checkpoint?'#e6bf62':'#d6d9b5',C.ink,2);
 const ex=L.exit;rect(g,ex.x-8,ex.y-135,15,135,5,'#6c845c',C.ink,3);rect(g,ex.x+ex.w-7,ex.y-135,15,135,5,'#6c845c',C.ink,3);path(g,c=>{c.moveTo(ex.x-15,ex.y-135);c.quadraticCurveTo(ex.x+ex.w/2,ex.y-180,ex.x+ex.w+15,ex.y-135);c.lineTo(ex.x+ex.w+15,ex.y-110);c.quadraticCurveTo(ex.x+ex.w/2,ex.y-150,ex.x-15,ex.y-110);c.closePath();},'#eac77e',C.ink,3);text(g,E.open(ex)?'PAR ICI !':(L.expedition?'À PRÉPARER':'SCEAU MANQUANT'),ex.x+ex.w/2,ex.y-137,E.open(ex)?15:11);if(L.questReward!==undefined){rect(g,ex.x+ex.w/2-18,ex.y-205,36,34,4,'#d8b861',C.ink,2);star(g,ex.x+ex.w/2,ex.y-188,10,'#fff1ba');}ellipse(g,ex.x+ex.w/2,ex.y-4,ex.w/2,7,'#f8e3a45c');
 for(const s of L.stars)if(s.id!==L.zebra?.starId&&!E.collected[s.id]){ellipse(g,s.x,s.y,25,25,'#fff0ab30');star(g,s.x,s.y+Math.sin(time*3+s.x)*4,15,'#f2c85b');}
 for(const b of E.shots){ellipse(g,b.x,b.y,b.kind==='pea'?7:6,5,b.kind==='pea'?'#c4dc85':'#e3a96d',C.ink,1.5);}
 for(const e of E.enemies||[])animal(g,e,time);
 if(E.zebra)zebra(g,E.zebra,time);pranks(g,E,time);
 // Draw active hero last for readability when heroes overlap.
 [0,1,2].filter(i=>i!==E.active).concat(E.active).forEach(i=>{g.save();if(E.p[i].invul>0)g.globalAlpha=.65; if(E.won)g.translate(0,-Math.abs(Math.sin((time-(E.celebrationAt||0)/1000)*8+i*.8))*12);croc(g,E.won?{...E.p[i],x:ex.x+5+i*70,face:1,joy:true}:E.p[i],i,time,i===E.active);g.restore();});
 expeditionObjects(g,E,time);
 // Critical controls stay legible even when a hero walks across them.
 for(const sw of L.switches)if(switchOccluders(E,sw).length)drawSwitch(g,E,sw,true);
 if(E.won){const t=time-(E.celebrationAt||0)/1000;for(let j=0;j<45;j++){const age=(t+j*.047)%2.2,x=ex.x+ex.w/2+Math.sin(j*2.4)*age*120,y=ex.y-100-age*170+age*age*92;g.save();g.translate(x,y);g.rotate(j+t*2);rect(g,-3,-3,6,10,1,['#f1c864','#cd8062','#91c6ad'][j%3]);g.restore();}const bannerX=Math.max(camera+150,Math.min(camera+W-150,ex.x+ex.w/2));rect(g,bannerX-145,ex.y-252,290,44,18,'#244a40e8');text(g,'BRAVO L’ÉQUIPE !',bannerX,ex.y-223,22,'#fff0bf');}
 for(const e of E.effects){g.globalAlpha=Math.max(0,e.life/.7);ellipse(g,e.x,e.y,4,4,e.c);}g.globalAlpha=1;
 g.restore();foreground(g,W,H,camera,L.scenery,time);
 // Edge indicators show where the other heroes are waiting.
 for(let i=0;i<3;i++){const p=E.p[i],x=p.x-camera;const y=p.y-cameraY;if(i!==E.active&&(x<20||x>W-20||y<30||y>H-30)){const xx=Math.max(22,Math.min(W-22,x)),yy=Math.max(35,Math.min(H-60,y-40));rect(g,xx-16,yy-16,32,32,12,p.color,C.ink,2);text(g,(y<30?'↑':y>H-30?'↓':x<20?'‹':'›')+['W','X','C'][i],xx,yy+5,12,'#fff8de');}}
}
root.CrocoArt={croc,render,background,elephant,animal,zebra,star,text,rect,ellipse};if(typeof module!=='undefined')module.exports=root.CrocoArt;
})(typeof globalThis!=='undefined'?globalThis:this);
