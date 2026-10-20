// Reproducible character sheet: the same drawing functions and poses as the game.
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas'),fs=require('node:fs'),path=require('node:path');
GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','Trebuchet MS');
const D=require('../src/levels'),A=require('../src/art');
const c=createCanvas(1440,1030),g=c.getContext('2d');g.fillStyle='#f4eedf';g.fillRect(0,0,c.width,c.height);
A.text(g,'LES CRO CRO CROS',60,70,34,'#244a40','left');A.text(g,'Trois silhouettes, trois couleurs, trois talents.',60,107,20,'#698173','left');
const labels=[['W · CROQUINET','Vert vif · foulard rouge · éclaireur'],['X · CROQUEFORT','Olive doré · casque et bouclier · protecteur'],['C · CROQUEBOUM','Turquoise · lunettes et sacoche · artilleur']];
for(let i=0;i<3;i++){const x=240+i*480;A.rect(g,x-205,145,410,390,25,'#fffaf0','#dfdfcc',1);g.save();g.translate(x-10,430);g.scale(2.5,2.5);A.croc(g,{...D.heroes[i],x:0,y:0,face:1,ground:true,vx:0},i,2);g.restore();A.text(g,labels[i][0],x,480,20,D.heroes[i].color);A.text(g,labels[i][1],x,510,13,'#526d61');}
A.text(g,'Le même trait pour tout le bestiaire',60,591,23,'#244a40','left');
const names=['Hippopotame','Lionceau','Vautour','Zèbre','Éléphant'];for(let i=0;i<5;i++){const x=145+i*285;A.rect(g,x-125,620,250,310,22,'#fffaf0','#dfdfcc',1);g.save();g.translate(x,850);const scale=i===4?1:1.9;g.scale(scale,scale);if(i<3)A.animal(g,{x:0,y:0,homeY:0,kind:['hippo','lion','vulture'][i],dir:1,phase:'patrol',anim:2,asleep:false},2);else if(i===3)A.zebra(g,{x:0,y:0,dir:1,phase:'graze',anim:2,caught:false},2);else A.elephant(g,-20,0,2,true,.85);g.restore();A.text(g,names[i],x,900,19,'#506e60');}
A.text(g,'v0.7 · Dessin vectoriel du jeu · Aucun changement de commandes ni de collisions',60,988,16,'#698173','left');
fs.writeFileSync(path.join(__dirname,'../docs/personnages-v07.png'),c.toBuffer('image/png'));
const poses=createCanvas(1440,600),pg=poses.getContext('2d');pg.fillStyle='#f4eedf';pg.fillRect(0,0,1440,600);const states=[['Course',0,{vx:380,walk:1.4}],['Échelle',0,{climbing:true,climbPhase:1.4}],['Planeur',1,{ground:false,vy:95,roof:true}],['Effort',1,{pushing:true}],['Tir',2,{shoot:.15}],['Échelle',2,{climbing:true,climbPhase:2}]];states.forEach(([label,i,state],k)=>{const x=120+(k%3)*480,y=260+Math.floor(k/3)*290;pg.save();pg.translate(x+70,y);pg.scale(2,2);A.croc(pg,{...D.heroes[i],x:0,y:0,face:1,ground:true,...state},i,2);pg.restore();A.text(pg,label,x+90,y+38,18);});fs.writeFileSync(path.join(__dirname,'renders/poses-v07.png'),poses.toBuffer('image/png'));
console.log('Character design and movement sheets rendered.');
