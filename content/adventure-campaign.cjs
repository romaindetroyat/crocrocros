'use strict';
const fs=require('fs'),path=require('path');
const source=require('./campaign.json');
const levels=[],plans=[];
const chapters=['Le départ mouvementé','Les passeurs du marais','Les toits de la canopée','Les souffleurs du canyon','Le moulin indiscipliné','Les jardins suspendus','Le cirque des ricochets','Le grand vol','Les trois tours','La folle traversée'];
const scenes=['harbour','falls','canopy','savannah','mill','ruins','fair','moon','fort','fort'];
let L,P;
function begin(n,name,w,h,brief,family){const chapter=Math.floor((n-1)/10);L={id:'escapade-'+String(n).padStart(3,'0'),revision:200,adventure:true,name,chapter:chapters[chapter],chapterIndex:chapter,scenery:scenes[chapter],theme:['morning','forest','forest','temple','factory','temple','fair','forest','fort','fort'][chapter],width:w,height:h,spawns:[100,170,240].map(x=>({x,y:h-100})),checkpoint:{x:150,y:h-100},exit:{x:w-220,y:h-100,w:160},briefing:brief,intro:'',victory:'Un passage inventé à trois. Et personne laissé derrière !',difficulty:Math.min(10,Math.ceil(n/10))+' / 10',puzzleFamily:family,hints:[],goals:[],zones:[],rallies:[],mirrors:[],winds:[],movers:[],beats:[]};for(const k of ['platforms','bridges','gates','switches','targets','plates','crates','turrets','keys','lifts','ladders','springs','portals','conveyors','stars','signs','pads','blocks','elephants','enemies','reactors'])L[k]=[];P=[];levels.push(L);plans.push({levelId:L.id,steps:P});return L;}
const floor=(x,y,w,h=24)=>L.platforms.push({x,y,w,h,oneway:true});
const cmd=(hero,op,...args)=>P.push({hero,op,args});
const walk=(h,x)=>cmd(h,'walk',x),climb=(h,x,y)=>cmd(h,'climb',x,y),jump=x=>cmd(0,'jump',x),act=h=>cmd(h,'action'),use=h=>cmd(h,'use');
const fire=(x,dir=1)=>cmd(2,'fire',x,dir),wait=(h,what,id,value)=>cmd(h,'wait',what,id,value),board=()=>cmd(1,'board'),crew=(x)=>cmd(1,'crew',x);
const key=(id,x,y,hero=0)=>L.keys.push({id,x,y,hero});
const target=(id,x,y,requires=[])=>L.targets.push({id,x,y,requires,label:({pont:'PASSERELLE',unlock:'CHEMINÉE',land:'BALCON',stay:'ARRIMAGE',sky:'EN HAUT',deep:'EN BAS',brake:'FREIN',wind:'SOUFFLERIE',spring:'TREMPLIN',exit:'PASSAGE',pin:'GOUPILLE'})[id]||'VERROU'});
const lever=(id,x,y,opts={})=>L.switches.push({id,x,y,toggle:true,label:'B · ACTIONNER',...opts});
const ladder=(x,y,h,requires=[])=>L.ladders.push({x,y,h,requires});
const mover=(id,x,y,w,toX,toY,requires=[],speed=130)=>L.movers.push({id,x,y,w,h:20,toX,toY,requires,speed,name:'LA NACELLE'});
const star=(x,y)=>L.stars.push({id:'star-'+L.stars.length,x,y});
const rally=(x,y)=>L.rallies.push({id:'rally-'+L.rallies.length,x,y,w:300});
function finish(hints){L.hints=hints;L.beats.push({x:L.spawns[1].x,y:L.spawns[1].y,r:300,text:L.briefing});P.push({op:'finish',args:[]});}
// Each physical scene defines its own terrain, route transformation and crew decisions.
function ferry(n,name,{span=650,rise=0,reverse=false,gate=true,split=false,roof=false}={}){
 const x0=430,x1=x0+span,y=820,upper=y-rise,w=x1+620;
 begin(n,name,w,1040,'Le bac transporte toute l’équipe. Préparez son trajet, embarquez ensemble et libérez la passerelle depuis l’autre rive.','bac et retour');
 floor(0,y,430);floor(x1+230,upper,w-x1-230);floor(0,990,w);mover('ferry',x0,y,230,x1,upper,['depart'],120);L.movers[0].control='depart';
 lever('depart',x0-30,y,{label:'B · LE BAC ↔'});lever('depart',x1+265,upper,{label:'B · RAPPELER ↔'});
 // Controls travel with neither dock: they can be used while embarking/disembarking.
 if(split){L.spawns[2]={x:x1+365,y:upper};target('pont',x1+465,upper-38);L.bridges.push({id:'approach',x:x1+220,y:upper,w:70,h:18,requires:['pont']});}
 else if(gate){target('pont',x1+450,upper-38);L.gates.push({x:x1+490,y:upper-230,w:35,h:230,requires:['pont']});}
 if(roof){L.turrets.push({id:'rain',x:x1+550,y:upper-40,dir:-1,period:2.6,off:'pont',awakeX:x1+250});}
 L.exit={x:reverse?100:x1+450,y:reverse?y:upper,w:150,direction:reverse?'left':'right',requires:gate||split?['pont']:[]};
 L.spawns[0].y=L.spawns[1].y=y;if(!split)L.spawns[2].y=y;
 star(330,y-33);star(x0+span/2+110,y-rise/2-120);star(x1+350,upper-33);rally(x1+370,upper);
 if(split){fire(x1+350);wait(2,'flag','pont');}
 walk(1,330);if(!split){walk(0,310);walk(2,350);}else walk(0,310);board();walk(1,x0+110);use(1);wait(1,'mover','ferry',1);walk(1,x1+335);
 if(split){walk(2,x1+355);board();}else if(gate){cmd(2,'leave');fire(x1+350);wait(2,'flag','pont');walk(2,x1+350);board();}
 if(reverse){walk(1,x1+110);use(1);wait(1,'mover','ferry',0);walk(1,170);}else walk(1,x1+500);
 finish(['Le bouclier levé accueille les équipiers proches avec B. Ils voyagent avec Croquefort.','Le levier du bac se trouve au bord de chaque quai. B lance ou rappelle la nacelle.','Croqueboum peut descendre avec B et viser la cible depuis la rive ; le dernier opérateur voyage avec le groupe.']);
}
function chimney(n,name,{height=310,second=false,returnHome=false,flip=true,guard=false}={}){
 const y=840,mx=690,top=y-38-height,w=1540;
 begin(n,name,w,1030,'Le tir doit remonter la cheminée. Orientez le réflecteur, observez le trajet de la boulette, puis ouvrez la voie de toute l’équipe.','ricochet et protection');L.spawns.forEach(p=>p.y=y);floor(0,y,w);floor(850,y-height,690);ladder(960,y-height,height,['unlock']);
 L.mirrors.push({id:'mirror',x:mx,y:y-38,slash:!flip,rotatable:true});
 if(second){L.mirrors.push({id:'ceiling',x:mx,y:top,slash:true});target('unlock',1110,top);}else target('unlock',mx,top);
 L.gates.push({x:820,y:y-250,w:35,h:250,requires:['unlock']});key('scout',370,y-233);floor(290,y-200,180);L.pads.push({x:235,y});
 if(guard)L.turrets.push({id:'pea-rain',x:790,y:y-38,dir:-1,period:2.8,off:'unlock',awakeX:500});
 L.targets[0].requires=['scout'];L.exit={x:returnHome?70:1300,y:returnHome?y:y-height,w:160,direction:returnHome?'left':'right',requires:['unlock','scout']};
 star(370,y-233);star(760,y-33);star(1280,y-height-33);rally(1080,y-height);
 walk(1,235);act(1);walk(0,180);jump(235);jump(340);walk(0,370);walk(0,510);wait(0,'ground');
 if(guard){act(1);walk(1,745);}
 if(flip){walk(0,mx);use(0);walk(0,510);}
 fire(550);wait(2,'flag','unlock');
 if(guard)act(1);walk(1,760);walk(0,740);walk(2,780);board();climb(1,960,y-height);walk(1,1280);
 // The scout takes the high optional star; all can stay aboard for the return.
 cmd(0,'leave');walk(0,1280);walk(1,1280);board();
 if(returnHome){climb(1,960,y);walk(1,150);}else walk(1,1390);
 finish(['Croquinet utilise le bouclier comme marchepied pour atteindre le sceau haut.','Un réflecteur incliné / dévie un tir horizontal vers le haut. B retourne le réflecteur.','Une fois le verrou touché, la cheminée ouvre l’échelle. Croquefort peut emmener les deux autres.']);
}
function windride(n,name,{height=360,span=780,split=false,returnHome=false,late=false}={}){
 const y=900,top=y-height,x=480,landing=x+span,w=landing+570;
 begin(n,name,w,1110,'Le courant d’air soulève le bouclier. Embarquez les équipiers, gagnez de la hauteur puis planez jusqu’au balcon.','vol en équipe');
 floor(0,y,650);floor(landing,top,570);floor(0,1060,w);L.winds.push({id:'draft',x:460,y:top-450,w:190,h:height+450,speed:180,requires:late?['wind']:[]});
 if(late){target('wind',360,y-38);fire(260);wait(2,'flag','wind');}
 L.exit={x:returnHome?100:landing+330,y:returnHome?y:top,w:160,direction:returnHome?'left':'right',requires:['land']};target('land',landing+350,top-38);if(split)L.spawns[2]={x:landing+130,y:top};
 L.spawns[0].y=L.spawns[1].y=y;if(!split)L.spawns[2].y=y;
 star(360,y-33);star(540,top-120);star(landing+220,top-33);rally(landing+220,top);
 walk(1,360);walk(0,340);if(!split)walk(2,380);board();walk(1,540);wait(1,'above',null,top-300);walk(1,landing+170);wait(1,'ground');
 if(!split)cmd(2,'leave');fire(landing+230);wait(2,'flag','land');walk(1,landing+220);walk(2,landing+240);board();
 if(returnHome){walk(1,540);wait(1,'above',null,top-150);walk(1,170);wait(1,'ground');}else walk(1,landing+390);
 finish(['A lève le bouclier ; B embarque les amis proches. Le vent ne soulève que le bouclier ouvert.','Restez au centre du courant jusqu’à dépasser le balcon, puis partez à l’horizontale.','Croqueboum descend sur le balcon pour viser son verrou. Croquefort peut récupérer les passagers pour le retour.']);
}
function bridgefall(n,name,{depth=290,split=false,reverse=false,shotFirst=false}={}){
 const y=470,bottom=y+depth,w=1780;
 begin(n,name,w,bottom+230,'Une vieille passerelle peut devenir un ascenseur. Préparez les passagers, libérez son support et utilisez sa nouvelle position.','décor transformable');
 floor(0,y,480);floor(940,bottom,840);floor(0,bottom+150,w);mover('bridge',480,y,460,480,bottom,['support'],150);L.movers[0].name='LE PONT DESCEND';
 floor(0,y+130,480);L.crates.push({id:'support',x:390,y:y+60,w:50,h:70,requires:shotFirst?['pin']:[]});if(shotFirst){target('pin',300,y-38);fire(200);wait(2,'flag','pin');}
 ladder(270,y,depth+150);ladder(1050,bottom,150);L.spawns=[100,180,260].map(x=>({x,y}));if(split)L.spawns[2]={x:1100,y:bottom};
 target('exit',1320,bottom-38);L.exit={x:reverse?80:1560,y:reverse?y:bottom,w:160,direction:reverse?'left':'right',requires:['support','exit']};
 if(reverse){ladder(1460,y,bottom-y,['exit']);floor(940,y,840);L.bridges.push({id:'return',x:480,y,w:460,h:20,requires:['exit']});}
 star(570,y-33);star(1040,bottom-33);star(1540,bottom-33);rally(1090,bottom);
 walk(1,545);if(!split)walk(2,600);climb(0,270,y+130);walk(0,330);cmd(0,'charge',430);walk(0,660);wait(0,'mover','bridge',1);
 if(!split){walk(2,1170);}fire(1190);wait(2,'flag','exit');walk(1,1040);walk(0,1050);climb(0,1050,bottom);walk(0,1020);walk(2,1060);board();walk(1,1540);
 if(reverse){climb(1,1460,y);walk(1,150);}else walk(1,1630);
 finish(['Une charge de Croquinet casse le support. La longue passerelle descend avec ses passagers.','Les autres peuvent embarquer avant la charge ; personne n’a besoin de refaire le chemin à pied.','Sur la rive basse, Croqueboum déverrouille la fin. Observez ce qui change aussi derrière vous.']);
}
function relaylift(n,name,{height=350,returnHome=false,split=true,double=false}={}){
 const y=900,top=y-height,w=1840;
 begin(n,name,w,1110,'Le poste du haut commande la nacelle. Faites monter un éclaireur, organisez la relève et revenez chercher le dernier opérateur.','sauvetage et relève');floor(0,y,650);floor(940,top,900);floor(0,1060,w);floor(300,top,250);ladder(350,top,height);
 L.plates.push({id:'watch',x:400,y:top,w:70,hero:0,label:'CROQUINET · LE BAC'});mover('lift',650,y,290,650,top,['watch'],160);
 target('stay',1270,top-38);L.plates[0].latchWhen=['stay'];L.bridges.push({id:'rescue',x:550,y:top,w:100,h:20,requires:['stay']});L.exit={x:returnHome?80:1580,y:returnHome?y:top,w:160,direction:returnHome?'left':'right',requires:['stay']};
 L.spawns=[100,180,260].map(x=>({x,y}));if(split)L.spawns[2]={x:1000,y:top};
 star(435,top-33);star(740,y-33);star(1510,top-33);rally(1220,top);
 walk(1,760);if(!split)walk(2,815);climb(0,350,top);walk(0,435);wait(1,'mover','lift',1);
 if(split){fire(1140);}else{walk(2,1140);fire(1140);}wait(2,'flag','stay');walk(0,435);walk(0,760);walk(1,760);walk(2,780);board();walk(1,1510);
 if(returnHome){walk(1,760);walk(1,435);climb(1,350,y);walk(1,150);}else walk(1,1650);
 finish(['Croquinet monte seul au poste ; Croquefort attend sur la nacelle.','Le tir sur le verrou fixe la nacelle en haut : le poste peut enfin être libéré.','Le bouclier permet de repartir ensemble. Les trois personnages doivent retrouver la sortie, y compris celui qui tenait le poste.']);
}
function ballast(n,name,{high=270,returnHome=false,second=false}={}){
 const y=840,top=y-high,w=1660;begin(n,name,w,1060,'Un contrepoids peut tenir un poste à votre place. Poussez-le avec Croquefort, puis exploitez le passage qu’il maintient ouvert.','contrepoids et raccourci');L.spawns.forEach(p=>p.y=y);floor(0,y,w);floor(280,top,360);ladder(340,top,high);
 floor(610,y-140,250);ladder(610,y-140,140);ladder(860,y-140,140);L.blocks.push({id:'ballast',x:490,y:y-65,w:75,h:65,minX:410,maxX:780});L.plates.push({id:'weight',x:700,y,w:100,blockOnly:true,acceptBlock:true,label:'CONTREPOIDS'});
 key('seal',580,top-33);L.gates.push({x:530,y:top-130,w:25,h:130,requires:['weight']});target('open',1190,y-38,['weight','seal']);L.gates.push({x:1260,y:y-220,w:30,h:220,requires:['open']});
 if(second){key('second',970,y-233);floor(910,y-200,160);ladder(950,y-200,200,['open']);L.exit.requires=['second'];}
 L.exit={x:returnHome?80:1390,y,w:150,direction:returnHome?'left':'right',requires:second?['open','second']:['open']};star(580,top-33);star(970,y-33);star(1460,y-33);rally(1010,y);
 walk(1,665);wait(1,'flag','weight');climb(0,340,top);walk(0,580);walk(0,900);wait(0,'ground');walk(1,610);walk(2,590);board();climb(1,610,y-140);walk(1,860);climb(1,860,y);cmd(2,'leave');fire(1040);wait(2,'flag','open');
 if(second){climb(0,950,y-200);walk(0,970);walk(0,1130);wait(0,'ground');}walk(0,990);walk(1,1010);walk(2,1030);board();walk(1,1460);if(returnHome){cmd(0,'leave');climb(0,950,y-200);walk(0,970);walk(0,1130);wait(0,'ground');walk(0,1030);walk(1,1010);board();walk(1,150);}finish(['Croquefort pousse le bloc. Il doit rester sur le plateau marqué : les personnages seuls ne suffisent pas.','Le poste libère la galerie de Croquinet. Le sceau haut autorise ensuite le tir sur le verrou.','Le bloc reste en place quand vous partez : c’est votre quatrième équipier.']);
}
function forkshot(n,name,{lower=190,returnHome=false,firstDown=false}={}){
 const y=780,w=1510,mx=620;begin(n,name,w,y+lower+170,'Une boulette, deux directions. La fente du plancher laisse passer les tirs : le réflecteur décide quel verrou recevra le prochain.','aiguillage de tirs');L.spawns.forEach(p=>p.y=y);floor(0,y,540);floor(670,y,840);floor(0,y+lower+60,w);ladder(430,y,lower+60);
 L.mirrors.push({id:'fork',x:mx,y:y-38,slash:!firstDown,rotatable:true});target('sky',mx,y-285,firstDown?['deep']:[]);target('deep',mx,y+lower-20,firstDown?[]:['sky']);L.bridges.push({x:535,y,w:140,h:16,requires:['sky','deep']});L.gates.push({x:1010,y:y-190,w:28,h:190,requires:['sky','deep']});
 L.exit={x:returnHome?80:1260,y,w:160,direction:returnHome?'left':'right',requires:['sky','deep']};star(360,y+lower+27);star(800,y-33);star(1270,y-33);rally(850,y);
 climb(0,430,y+lower+60);walk(0,360);climb(0,430,y);fire(470);wait(2,'flag',firstDown?'deep':'sky');walk(0,490);jump(690);walk(0,675);use(0);walk(0,810);fire(470);wait(2,'flag',firstDown?'sky':'deep');walk(1,800);walk(2,820);walk(0,780);board();walk(1,1330);if(returnHome)walk(1,150);
 finish(['Le réflecteur / renvoie la boulette vers le haut ; l’autre position la renvoie vers le bas.','Croquinet peut sauter la fente et atteindre la manette par la droite. Les deux autres attendent la passerelle.','Observez les petits voyants des cibles : l’ordre dépend de leur verrou. L’étoile basse est un détour facultatif.']);
}
function counterlifts(n,name,{height=300,returnHome=false,roof=false}={}){
 const y=900,top=y-height,w=1770;begin(n,name,w,1110,'Quand une nacelle monte, l’autre descend. L’opérateur voyage avec la sienne : il faudra inverser le mouvement pour le récupérer.','ascenseurs en opposition');L.spawns=[{x:100,y},{x:180,y},{x:1150,y:top}];floor(0,y,350);floor(580,top,470);floor(1330,top,440);floor(0,1060,w);mover('left',350,y,230,350,top,['travel'],155);mover('right',1050,top,280,1050,y,['travel'],155);
 lever('travel',1150,top);lever('travel',850,top);target('lock',1530,top-38);L.exit={x:returnHome?70:1510,y:returnHome?y:top,w:170,direction:returnHome?'left':'right',requires:['lock']};if(returnHome)ladder(630,top,height,['lock']);
 star(450,y-120);star(850,top-33);star(1470,top-33);rally(920,top);
 walk(1,285);walk(0,265);board();walk(1,455);use(2);wait(1,'mover','left',1);walk(1,850);use(1);wait(2,'mover','right',0);walk(2,930);walk(1,910);board();walk(1,1410);cmd(2,'leave');fire(1420);wait(2,'flag','lock');walk(1,1470);walk(2,1490);board();if(returnHome){walk(1,630);climb(1,630,y);walk(1,150);}else walk(1,1580);
 finish(['Le levier de droite descend avec le tireur… mais sa manette reste en haut.','Croquefort emmène Croquinet sur la nacelle gauche. La manette du milieu inverse les deux trajets.','Récupérez Croqueboum sur sa nacelle revenue en haut, puis ouvrez le verrou final.']);
}
function launch(n,name,{span=950,height=240,split=false,unlock=false,returnHome=false}={}){
 const y=900,top=y-height,landing=500+span,w=landing+550;begin(n,name,w,1120,'Un tremplin pour trois ! Le bouclier transforme le grand saut en vol plané. Préparez le départ et choisissez votre point d’atterrissage.','tremplin et vol plané');L.spawns.forEach(p=>p.y=y);floor(0,y,580);floor(landing,top,550);floor(0,1070,w);L.springs.push({x:470,y,w:90,power:1350,requires:unlock?['spring']:[]});if(unlock){target('spring',360,y-38);fire(250);wait(2,'flag','spring');}if(split)L.spawns[0]={x:landing+100,y:top};target('landing',landing+350,top-38);L.exit={x:landing+320,y:top,w:180,requires:['landing']};star(340,y-33);star(760,y-620);star(landing+150,top-33);rally(landing+200,top);
 walk(1,340);if(!split)walk(0,320);walk(2,360);board();walk(1,landing+150);wait(1,'ground');cmd(2,'leave');fire(landing+220);wait(2,'flag','landing');walk(1,landing+150);walk(2,landing+170);if(split)walk(0,landing+130);board();walk(1,landing+390);
 finish(['Le tremplin agit sur Croquefort aussi. Embarquez tout le monde avant de partir.','Gardez le bouclier levé pendant la traversée : il ralentit la descente.','La plate-forme d’arrivée est en hauteur. Si vous tombez en bas, ↶ permet de reprendre le décollage.']);
}
function tableau(n,name,{height=260,mirror=false,returnHome=false}={}){
 const y=850,top=y-height,w=1610;begin(n,name,w,1080,'Trois postes, un seul instant décisif. Placez les crocos là où ils sont utiles : le tir doit partir pendant que les deux autres tiennent le décor.','coordination simultanée');L.spawns.forEach(p=>p.y=y);floor(0,y,w);floor(260,top,300);ladder(320,top,height);L.plates.push({id:'scout-post',x:435,y:top,w:70,hero:0,label:'CROQUINET'},{id:'shelter',x:720,y,w:80,hero:1,roof:true,label:'BOUCLIER LEVÉ'});target('lock',mirror?1130:1240,mirror?top-38:y-38,['scout-post','shelter']);if(mirror)L.mirrors.push({id:'upshot',x:1130,y:y-38,slash:true});L.gates.push({x:1300,y:y-210,w:28,h:210,requires:['lock']});ladder(500,top,height,['lock']);L.exit={x:returnHome?80:1390,y,w:150,direction:returnHome?'left':'right',requires:['lock']};star(470,top-33);star(890,y-33);star(1450,y-33);rally(1130,y);
 climb(0,320,top);walk(0,470);walk(1,760);act(1);fire(950);wait(2,'flag','lock');climb(0,500,y);walk(0,870);walk(1,890);walk(2,910);board();walk(1,1460);if(returnHome)walk(1,150);finish(['Croquinet tient le poste du balcon. Croquefort doit lever son bouclier sur le poste du sol.','Les deux voyants du verrou doivent être allumés au moment où la boulette arrive.','Le verrou reste ouvert après le tir : chacun peut quitter son poste et le groupe peut se reformer.']);
}
function lightwell(n,name,{height=380,turns=3,returnHome=false}={}){
 const y=900,top=y-height,w=1740;begin(n,name,w,1110,'Le chemin de la boulette dessine celui des crocos. Réglez les coudes du faisceau, puis utilisez l’échelle révélée par le tir.','labyrinthe de ricochets');L.spawns.forEach(p=>p.y=y);floor(0,y,w);floor(1000,top,740);ladder(1330,top,height,['lock']);
 L.mirrors.push({id:'m1',x:520,y:y-38,slash:true},{id:'m2',x:520,y:top-110,slash:true},{id:'m3',x:1130,y:top-110,slash:false});target('lock',1130,top-38);L.gates.push({x:1410,y:y-200,w:30,h:200,requires:['lock']});
 // A scaffold gives the scout physical access to the last elbow.
 floor(1150,top-72,100);ladder(1190,top-72,y-(top-72));L.mirrors[2].rotatable=true;L.mirrors[2].slash=true;
 key('prism',1170,top-105);L.targets[0].requires=['prism'];L.exit={x:returnHome?80:1490,y:returnHome?y:top,w:150,direction:returnHome?'left':'right',requires:['lock']};star(1170,top-105);star(760,y-33);star(1540,top-33);rally(1370,top);
 climb(0,1190,top-72);walk(0,1170);use(0);walk(0,1170);climb(0,1190,y);walk(0,760);fire(360);wait(2,'flag','lock');walk(1,760);walk(0,740);walk(2,780);board();climb(1,1330,top);walk(1,1540);if(returnHome){climb(1,1330,y);walk(1,150);}finish(['Suivez le trajet lumineux, de coude en coude. Le dernier réflecteur est à l’envers.','Croquinet rejoint l’échafaudage, prend le prisme et retourne ce dernier coude avec B.','Le tir de Croqueboum doit monter, traverser le vide, puis redescendre sur le verrou.']);
}
function hatch(n,name,{height=280,reverse=false,split=false}={}){
 const y=860,top=y-height,w=1640;begin(n,name,w,1080,'La trappe ouvre un chemin et en ferme un autre. Faites passer le bon équipier avant de changer le décor.','portes complémentaires');L.spawns.forEach(p=>p.y=y);floor(0,y,w);floor(340,top,850);ladder(390,top,height);lever('route',300,y);lever('route',1090,top);L.gates.push({x:600,y:top-170,w:28,h:170,requires:['route']},{x:760,y:y-200,w:28,h:200,requires:[],requiresOff:['route']});key('seal',1000,top-33);target('lock',1280,y-38,['seal']);L.gates.push({x:1370,y:y-190,w:28,h:190,requires:['lock']});ladder(1150,top,height);L.exit={x:reverse?70:1440,y,w:140,direction:reverse?'left':'right',requires:['lock']};star(1000,top-33);star(850,y-33);star(1490,y-33);rally(1210,y);
 walk(1,300);use(1);climb(0,390,top);walk(0,1000);walk(0,1090);use(0);climb(0,1150,y);fire(1140);wait(2,'flag','lock');walk(1,850);walk(0,830);walk(2,870);board();walk(1,1500);if(reverse)walk(1,150);finish(['La position de la manette ouvre la galerie haute ou le couloir bas. Jamais les deux.','Envoyez Croquinet par le haut ; la seconde manette lui permet de rouvrir le chemin des autres.','Rassemblez l’équipe après le verrou. Le raccourci du bas évite de refaire la galerie avec tout le monde.']);
}
function skyrescue(n,name,{height=320,span=700,reverse=false}={}){
 const y=900,top=y-height,landing=600+span,w=landing+550;begin(n,name,w,1120,'Croquinet et Croqueboum sont bloqués sur deux balcons. Croquefort doit organiser sa tournée, puis réunir les compétences pour ouvrir le retour.','sauvetage sur deux balcons');floor(0,y,650);floor(680,top,260);floor(landing,top-160,550);floor(0,1070,w);L.spawns=[{x:800,y:top},{x:160,y},{x:landing+140,y:top-160}];L.winds.push({id:'draft',x:440,y:top-470,w:180,h:height+470,speed:200});key('scout',810,top-33);target('lock',landing+360,top-198,['scout']);L.exit={x:reverse?80:landing+330,y:reverse?y:top-160,w:160,direction:reverse?'left':'right',requires:['lock']};star(320,y-33);star(810,top-33);star(landing+220,top-193);rally(landing+220,top-160);
 walk(1,320);act(1);walk(1,525);wait(1,'above',null,top-120);walk(1,810);wait(1,'ground');board();walk(1,525);wait(1,'above',null,top-360);walk(1,landing+220);wait(1,'ground');fire(landing+220);wait(2,'flag','lock');walk(2,landing+240);board();if(reverse){walk(1,525);walk(1,160);wait(1,'ground');}else walk(1,landing+390);finish(['Le bouclier rejoint d’abord le balcon le plus bas. Approchez Croquinet et embarquez-le avec B.','Repassez dans le courant pour gagner l’altitude du second balcon.','Croqueboum peut ensuite ouvrir le verrou : l’équipe est complète pour la dernière traversée.']);
}
function airlock(n,name,{height=300,returnHome=false}={}){
 const y=900,top=y-height,w=1830;begin(n,name,w,1110,'La même manette alimente deux courants d’air. Montez sur le palier intermédiaire et changez de courant sans perdre les passagers.','relais de souffleries');L.spawns.forEach(p=>p.y=y);floor(0,y,640);floor(750,top,360);floor(1340,top-200,490);floor(0,1060,w);L.winds.push({id:'west',x:450,y:top-250,w:180,h:height+250,speed:190,requiresOff:['east']},{id:'east',x:980,y:top-450,w:160,h:450,speed:190,requires:['east']});lever('east',895,top);target('lock',1630,top-238);L.exit={x:returnHome?90:1580,y:returnHome?y:top-200,w:160,direction:returnHome?'left':'right',requires:['lock']};star(350,y-33);star(895,top-33);star(1520,top-233);rally(880,top);
 walk(1,350);walk(0,330);walk(2,370);board();walk(1,535);wait(1,'above',null,top-110);walk(1,895);wait(1,'ground');use(1);walk(1,1050);wait(1,'above',null,top-310);walk(1,1500);wait(1,'ground');cmd(2,'leave');fire(1510);wait(2,'flag','lock');walk(1,1520);walk(2,1540);board();if(returnHome){walk(1,895);wait(1,'ground');use(1);walk(1,535);walk(1,150);wait(1,'ground');}else walk(1,1660);finish(['Le premier courant est ouvert au départ. Il mène au palier de la manette.','B échange les deux souffleries. Le second courant permet d’atteindre le balcon supérieur.','En cas de détour, le palier central est un point de ralliement pour toute l’équipe.']);
}

function clockwork(n,name,{seconds=19,span=710,rise=180}={}){
 const y=880,top=y-rise,x=430,end=x+span,w=end+620;begin(n,name,w,1110,'La nacelle ne vous attendra pas indéfiniment. Préparez l’équipe avant de lancer le mécanisme, puis tirez sur le frein pour stabiliser l’arrivée.','préparation et course au frein');L.spawns.forEach(p=>p.y=y);floor(0,y,430);floor(end+230,top,390);floor(0,1060,w);mover('clock',430,y,230,end,top,['clock-on'],130);L.movers[0].control='clock-on';L.movers[0].latchWhen=['brake'];lever('clock-on',400,y,{duration:seconds,latchWhen:['brake'],label:'B · '+seconds+' SECONDES'});lever('clock-on',end+265,top,{duration:seconds,latchWhen:['brake'],label:'B · RELANCER'});target('brake',end+450,top-38);L.gates.push({x:end+490,y:top-170,w:30,h:170,requires:['brake']});L.exit={x:end+450,y:top,w:150,requires:['brake']};star(330,y-33);star(430+span/2+110,y-rise/2-120);star(end+340,top-33);rally(end+350,top);
 walk(1,330);walk(0,310);walk(2,350);board();walk(1,525);use(1);wait(1,'mover','clock',1);walk(1,end+330);cmd(2,'leave');fire(end+350);wait(2,'flag','brake');walk(2,end+350);board();walk(1,end+520);finish(['Préparez les passagers avant d’appuyer sur la manette. Le compte à rebours commence seulement à ce moment-là.','Sur l’autre rive, faites descendre Croqueboum et tirez sur le frein. Le chrono s’arrête définitivement.','Si la nacelle repart, les deux manettes permettent de la rappeler. ↶ annule aussi les dernières secondes.']);
}
function portalshot(n,name,{height=300,returnHome=false}={}){
 const y=850,top=y-height,w=1720;begin(n,name,w,1090,'Le portail transporte aussi les boulettes. Réveillez-le, alimentez le verrou à distance puis traversez avec vos passagers.','tir et voyage par portail');L.spawns.forEach(p=>p.y=y);floor(0,y,760);floor(940,top,780);floor(0,1040,w);floor(310,y-200,200);key('power',420,y-233);L.portals.push({id:'beam-door',x:600,y,toX:1080,toY:top,shots:true,dir:1,requires:['power']},{id:'back-door',x:1080,y:top,toX:600,toY:y,shots:true,dir:-1,requires:['power']});target('lock',1430,top-38,['power']);L.targets[0].requiresPortal='beam-door';L.gates.push({x:1490,y:top-190,w:28,h:190,requires:['lock']});L.exit={x:returnHome?80:1500,y:returnHome?y:top,w:150,direction:returnHome?'left':'right',requires:['lock']};star(420,y-233);star(710,y-33);star(1360,top-33);rally(1240,top);
 walk(1,255);act(1);walk(0,200);jump(255);jump(360);walk(0,420);walk(0,710);wait(0,'ground');fire(460);wait(2,'flag','lock');walk(1,510);walk(0,490);walk(2,530);board();walk(1,600);use(1);walk(1,1360);if(returnHome){walk(1,1080);use(1);walk(1,150);}else walk(1,1580);finish(['Le sceau haut réveille les deux portails. Croquinet l’atteint grâce au bouclier.','Une boulette entrée par le portail du bas ressort à l’étage et alimente le verrou. Un tir direct n’a pas cette énergie.','B fait traverser Croquefort et ses passagers ensemble. Le même passage fonctionne dans l’autre sens.']);
}

const sceneTypes={ferry,chimney,windride,bridgefall,relaylift,ballast,forkshot,counterlifts,launch,tableau,lightwell,hatch,skyrescue,airlock,clockwork,portalshot};
const copy=x=>JSON.parse(JSON.stringify(x));
const spatialKeys=new Set(['x','toX','minX','maxX','awakeX']),verticalKeys=new Set(['y','toY']);
function translate(value,dx,dy,ids){if(Array.isArray(value))return value.map(v=>translate(v,dx,dy,ids));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,typeof v==='number'&&spatialKeys.has(k)?v+dx:typeof v==='number'&&verticalKeys.has(k)?v+dy:translate(v,dx,dy,ids)]));return typeof value==='string'&&ids[value]?ids[value]:value;}
function shiftPlan(steps,dx,dy,ids){return steps.filter(s=>s.op!=='finish').map(s=>{const p=copy(s),a=p.args;p.args=translate(a,0,0,ids);if(['walk','jump','fire','charge'].includes(s.op))p.args[0]+=dx;if(s.op==='climb'){p.args[0]+=dx;p.args[1]+=dy;}if(s.op==='wait'&&a[0]==='above')p.args[2]+=dy;return p;});}
function journey(n,name,specs){
 const parts=specs.map(spec=>{const [kind,opts={}]=typeof spec==='string'?[spec]:spec;sceneTypes[kind](n,name,opts);return {l:levels.pop(),p:plans.pop(),kind};});
 const lists=['platforms','bridges','gates','switches','targets','plates','crates','turrets','keys','lifts','ladders','springs','portals','conveyors','stars','signs','pads','blocks','elephants','enemies','reactors','mirrors','winds','movers','rallies','beats'];
 const offsets=[];let dx=0,dy=0;for(let j=0;j<parts.length;j++){const {l}=parts[j];if(j){dx=offsets[j-1].x+parts[j-1].l.width-70;dy=offsets[j-1].y+parts[j-1].l.exit.y-l.spawns[1].y;}offsets.push({x:dx,y:dy});}
 let minY=0;parts.forEach(({l},i)=>{for(const k of lists)for(const obj of l[k]||[])if(Number.isFinite(obj.y))minY=Math.min(minY,obj.y+offsets[i].y);});const globalShift=100-minY;offsets.forEach(o=>o.y+=globalShift);
 begin(n,name,dx+parts.at(-1).l.width,Math.max(...parts.map(({l},i)=>l.height+offsets[i].y)),parts.map(({l},i)=>(i+1)+'. '+l.briefing).join(' '),'grande traversée');const combined=L,plan=P;combined.milestones=[];combined.stageCount=parts.length;combined.route=parts.map(p=>p.kind);combined.goals=[];combined.intro='« On pourrait prendre le chemin facile. » — « Lequel ? »';combined.hints=[];
 parts.forEach(({l,p,kind},i)=>{const o=offsets[i],ids={};for(const k of lists)for(const obj of l[k]||[])if(obj.id)ids[obj.id]='s'+i+'-'+obj.id;const v=translate(l,o.x,o.y,ids);if(i===0){combined.spawns=v.spawns;combined.checkpoint=v.checkpoint;}
 for(const k of lists){let items=v[k]||[];if(k==='beats')items=[];if(k==='stars')items=parts.length===3?items.filter((_,si)=>si===(i===1?1:0)):i===0?items.filter((_,si)=>si===0):items.filter((_,si)=>si!==1);combined[k].push(...items);}
 if(i){plan.push({hero:1,op:'regroup',args:[o.x+170,v.spawns[1].y,v.spawns.map(p=>p.x)]});combined.rallies.push({id:'camp-'+i,x:o.x+170,y:v.spawns[1].y,w:300});}
 plan.push(...shiftPlan(p.steps,o.x,o.y,ids));const milestone='stage-'+i;combined.milestones.push({id:milestone,x:v.exit.x,y:v.exit.y,requires:v.exit.requires||[]});combined.goals.push({id:milestone,text:l.puzzleFamily});combined.hints.push(...l.hints.map(h=>'Passage '+(i+1)+' · '+h));combined.beats.push({x:o.x+250,y:v.spawns[1].y,r:280,text:'Passage '+(i+1)+' / '+parts.length+' · '+l.puzzleFamily});
 if(i===parts.length-1)combined.exit={...v.exit,requires:[...(v.exit.requires||[]),...combined.milestones.slice(0,-1).map(m=>m.id)]};
 });plan.push({op:'finish',args:[]});combined.briefing=parts.map(({l},i)=>'Passage '+(i+1)+' : '+l.puzzleFamily+'.').join(' ')+' Les points de ralliement jalonnent la traversée.';combined.victory='Trois crocos, '+parts.length+' passages transformés et une sacrée traversée.';
}

// Five opening scenes, followed by authored combinations below.
ferry(1,'Le bac n’attend personne',{span:520,gate:true});
chimney(2,'Le petit pois prend l’escalier',{height:280});
windride(3,'Taxi pour trois museaux',{height:320,span:650});
bridgefall(4,'Ce pont a un étage de moins',{depth:260,reverse:true});
relaylift(5,'Et le dernier, on le laisse ?', {height:300,returnHome:true,split:true});
ballast(6,'Le quatrième équipier');
forkshot(7,'En haut, en bas, et dans cet ordre');
counterlifts(8,'Un monte, l’autre descend');
launch(9,'Trois billets pour les nuages',{span:850});
tableau(10,'La photo de famille');
lightwell(11,'La boulette qui prend les virages');
hatch(12,'Une porte peut en cacher une autre');
skyrescue(13,'La tournée du sauveteur');
airlock(14,'Passez-moi le courant');
clockwork(15,'Le bac à retardement');
portalshot(16,'La livraison transdimensionnelle');
// Return journeys change the objective and require retrieving the last operator.
ferry(17,'On a oublié le pique-nique',{span:760,reverse:true});
chimney(18,'Le verrou au coin du plafond',{height:360,second:true,returnHome:true});
bridgefall(19,'D’abord le clou, ensuite le pont',{depth:330,shotFirst:true,reverse:true});
relaylift(20,'Le dernier devient le premier',{height:410,returnHome:true,split:false});
forkshot(21,'Cette fois, commencez par la cave',{lower:230,firstDown:true,returnHome:true});
skyrescue(22,'Tout le monde rentre au marais',{height:350,span:760,reverse:true});
portalshot(23,'Retour à l’expéditeur',{height:360,returnHome:true});
airlock(24,'Coupez le courant en partant',{height:340,returnHome:true});
const routes=[
 ['Le courrier prend le bac','ferry',['chimney',{height:340,second:true}]],
 ['Les plumes et les planches','windride',['bridgefall',{depth:310,shotFirst:true}]],
 ['Service après sauvetage',['relaylift',{split:false}],'portalshot'],
 ['Le poids des bonnes idées','ballast','forkshot'],
 ['Deux étages, trois virages','counterlifts','lightwell'],
 ['La photo des voyageurs','launch',['tableau',{mirror:true}]],
 ['La porte du courant','hatch','airlock'],
 ['La tournée et le tremplin','skyrescue',['launch',{span:1000,unlock:true}]],
 ['Le frein et la cheminée','clockwork','chimney'],
 ['Le portail des passeurs','portalshot',['ferry',{span:780,rise:160}]],
 ['Les trois postes du moulin','tableau',['relaylift',{height:380,split:false}]],
 ['Le plafond mène au ciel','lightwell',['windride',{height:390,span:850,late:true}]],
 ['Le pont au-dessus des portes','bridgefall','hatch'],
 ['L’ascenseur du contrepoids','counterlifts',['ballast',{high:320,second:true}]],
 ['L’aiguillage des souffleurs','forkshot','airlock'],
 ['Les boulettes font du tourisme','chimney','portalshot'],
 ['La nacelle n’a pas le vertige',['ferry',{span:720,rise:260}],'launch'],
 ['Les sauveteurs posent pour la photo','skyrescue',['tableau',{height:320,mirror:true}]],
 ['Le vent a cassé le pont',['windride',{height:420,span:920}],['bridgefall',{depth:380,shotFirst:true}]],
 ['Un aller simple pour les réflecteurs','hatch','lightwell'],
 ['Le contrepoids fait son grand saut',['ballast',{high:320}],'launch'],
 ['Départ différé, arrivée renversée','clockwork',['forkshot',{firstDown:true}]],
 ['La livraison à deux étages','portalshot',['relaylift',{height:420,split:false}]],
 ['Le courant porte conseil','airlock',['chimney',{height:400,second:true}]],
 ['Le poste de guet prend le bac',['relaylift',{height:360,split:false}],['ferry',{span:880,rise:200}]],
 ['Une porte dans les nuages','launch','hatch'],
 ['L’inversion des plafonds','counterlifts',['chimney',{height:380,second:true,guard:true}]],
 ['Le raccourci du pont cassé',['bridgefall',{depth:340,shotFirst:true}],'portalshot'],
 ['La balance du souffleur','ballast',['windride',{height:420,span:900,late:true}]],
 ['Les trois crocos et le chrono','tableau',['clockwork',{seconds:17,span:860,rise:220}]],
 ['Une boulette au fond du puits','lightwell',['forkshot',{lower:270,firstDown:true}]],
 ['Le bac des deux vents',['ferry',{span:920,rise:150}],'airlock'],
 ['Les naufragés de la trappe','skyrescue','hatch'],
 ['La cheminée à contrepoids',['chimney',{height:390,second:true}],['ballast',{high:330,second:true}]],
 ['Le grand saut des miroirs',['launch',{span:1120,unlock:true}],'lightwell'],
 ['La descente du poste de guet',['bridgefall',{depth:400}],['relaylift',{height:450,split:false}]],
 ['La photo au bout du portail','tableau',['portalshot',{height:410}]],
 ['Les ascenseurs prennent le vent','counterlifts',['windride',{height:400,span:980,late:true}]],
 ['L’aiguillage des portes','forkshot','hatch'],
 ['L’équipe passe avant le chrono','skyrescue',['clockwork',{seconds:18,span:900,rise:240}]],
 ['Le courant de la remise',['airlock',{height:350}],['ballast',{high:330,second:true}]],
 ['Le portail du pont suspendu',['portalshot',{height:420}],['bridgefall',{depth:390,shotFirst:true}]],
 ['Un frein pour la galerie','clockwork','hatch'],
 ['Le guetteur des ricochets',['relaylift',{height:430,split:false}],['chimney',{height:420,second:true}]],
 ['Les poutres montent au ciel',['bridgefall',{depth:370}],['windride',{height:430,span:1000,late:true}]],
 ['La porte des trois postes','hatch',['tableau',{height:350,mirror:true}]],
 ['Le contrepoids prend le portail',['ballast',{high:360,second:true}],['portalshot',{height:420}]],
 ['Le tremplin mène au bac',['launch',{span:1150,unlock:true}],['ferry',{span:1000,rise:220}]],
 ['Le miroir du poste de guet','lightwell',['relaylift',{height:440,split:false}]],
 ['Les ascenseurs du grand aiguilleur','counterlifts',['forkshot',{lower:290,firstDown:true}]],
 ['La tournée des portes lumineuses','skyrescue',['portalshot',{height:440}]],
 ['Les trois postes du vent','tableau',['airlock',{height:380}]],
 ['Le bac du dernier réflecteur',['ferry',{span:1020,rise:250}],['lightwell',{height:430}]],
 ['Le frein du contrepoids',['clockwork',{seconds:18,span:960,rise:220}],['ballast',{high:350,second:true}]],
 ['Du sous-sol à la stratosphère',['forkshot',{lower:300,firstDown:true}],['launch',{span:1160,unlock:true}]],
 ['La cheminée du vent contraire',['chimney',{height:440,second:true}],['airlock',{height:370}]],
 ['La relève du vieux pont',['relaylift',{height:460,split:false}],['bridgefall',{depth:410,shotFirst:true}]],
 ['Le portail du grand départ',['portalshot',{height:450}],['launch',{span:1180,unlock:true}]],
 ['Le vent et les trois guetteurs',['windride',{height:450,span:1050,late:true}],['tableau',{height:380,mirror:true}]],
 ['La double galerie du dernier étage','hatch',['chimney',{height:450,second:true,guard:true}]],
 ['Le bac de secours','skyrescue',['ferry',{span:1030,rise:240}]],
 ['Les souffleurs du grand mécanisme',['airlock',{height:400}],['clockwork',{seconds:18,span:1000,rise:220}]],
 ['La passerelle de la photo finale',['bridgefall',{depth:430,shotFirst:true}],['tableau',{height:400,mirror:true}]],
 ['La nacelle des trois coudes','counterlifts',['lightwell',{height:450}]],
 ['Le poste du passage impossible',['relaylift',{height:470,split:false}],['forkshot',{lower:320,firstDown:true}]],
];
for(const [title,...specs] of routes)journey(levels.length+1,title,specs);
const finales=[
 ['La grande lessive du moulin','ballast','airlock','forkshot'],
 ['Les sauveteurs du plafond','skyrescue','lightwell',['bridgefall',{depth:410,shotFirst:true}]],
 ['Le courrier passe partout','portalshot',['ferry',{span:950,rise:220}],['chimney',{height:430,second:true,guard:true}]],
 ['La relève fait son numéro','counterlifts',['relaylift',{height:430,split:false}],'launch'],
 ['Le ciel, le poids et les portes','windride',['ballast',{second:true}],'hatch'],
 ['Les trois poses du voyage','tableau','portalshot','airlock'],
 ['Une seconde pour réfléchir',['clockwork',{seconds:18,span:920,rise:250}],'lightwell','forkshot'],
 ['La grande cascade mécanique',['bridgefall',{depth:430,shotFirst:true}],'launch',['relaylift',{height:440,split:false}]],
 ['Tout le monde à son poste','skyrescue','hatch',['tableau',{height:390,mirror:true}]],
 ['Le dernier détour','counterlifts',['chimney',{height:450,second:true,guard:true}],['portalshot',{height:450}]],
 ['La folle traversée — personne derrière',['ferry',{span:1100,rise:260}],['airlock',{height:420}],['lightwell',{height:470}]],
];
for(const [title,...specs] of finales)journey(levels.length+1,title,specs);
if(levels.length!==100)throw new Error('Expected exactly 100 adventures, got '+levels.length);
for(const [i,l] of levels.entries()){l.questReward=(i+1)%10===0?Math.floor(i/10):undefined;if(!l.route)l.route=[Object.entries(sceneTypes).find(([k])=>l.puzzleFamily===({ferry:'bac et retour',chimney:'ricochet et protection',windride:'vol en équipe',bridgefall:'décor transformable',relaylift:'sauvetage et relève',ballast:'contrepoids et raccourci',forkshot:'aiguillage de tirs',counterlifts:'ascenseurs en opposition',launch:'tremplin et vol plané',tableau:'coordination simultanée',lightwell:'labyrinthe de ricochets',hatch:'portes complémentaires',skyrescue:'sauvetage sur deux balcons',airlock:'relais de souffleries',clockwork:'préparation et course au frein',portalshot:'tir et voyage par portail'})[k])?.[0]||l.puzzleFamily];if(!l.goals.length)l.goals=(l.exit.requires||[]).filter(id=>l.targets.some(t=>t.id===id)||l.keys.some(k=>k.id===id)||l.crates.some(k=>k.id===id)).map((id,j)=>({id,text:j===(l.exit.requires||[]).length-1?'Ouvrir le dernier passage':'Préparer le passage'}));l.victory=['« On n’a perdu personne. » — « J’avais pourtant essayé. »','« Plan parfaitement exécuté. » — « Il y avait un plan ? »','« Trois crocos à l’arrivée. C’est notre chiffre préféré. »'][i%3];}

if(require.main===module){const pack={...source,version:'2.0.0',archiveLevels:source.archiveLevels||source.levels,archiveQuest:source.archiveQuest||source.quest,levels,quest:{title:'La folle traversée',intro:'Le chemin change sous vos pattes. Inventez vos passages, voyagez ensemble et ramenez les trois crocos.',pieces:chapters,milestones:Array.from({length:Math.ceil(levels.length/10)},(_,i)=>i*10+9).filter(i=>i<levels.length)}};fs.writeFileSync(path.join(__dirname,'campaign.json'),JSON.stringify(pack));fs.writeFileSync(path.join(__dirname,'../tests/adventure-plans.json'),JSON.stringify(plans));console.log('Adventure levels:',levels.length);}
module.exports={levels,plans};
