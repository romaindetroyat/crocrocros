'use strict';
const B=require('./author75.cjs');
const {begin,floor,ladder,lever,gate,target,key,star,plate,mover,rule,cmd,walk,climb,jump,act,use,fire,wait,toggle,shoot,together,done}=B;
// The animals activate machinery by their own physical actions. They are never targets to kill.
function elephant(id,x,y,requires){B.L.elephants.push({id,x,y,radius:430,requires,scale:1});}
function hippo(id,x,y,calmWhen){B.L.enemies.push({id,kind:'hippo',x,y,minX:x,maxX:x,speed:0,dir:1,essential:true,lookOverBlocks:true,calmWhen});}
function bird(id,x,y,calmWhen){B.L.enemies.push({id,kind:'vulture',x,y,minX:x-12,maxX:x+12,speed:16,dir:1,hover:120,essential:true,calmWhen});}
function reactor(id,kind,x,y,requires=[],w=80){B.L.reactors.push({id,kind,x,y,w,h:60,requires,label:{wave:'ONDE DU SOL',gust:'SOUFFLE',coconut:'PANIER',pounce:'BOND DU LION'}[kind]});}
// 16: stand beyond the receiver, so the shield does not absorb the useful wave first.
{
 begin(16,'Le pied qui réveille le moulin','Intercepter une onde après son récepteur','Basile voudrait aider le moulin. Son pas est assez lourd pour réveiller la roue : trouvez où vous placer.');
 floor(0,800,1600);floor(320,590,260);ladder(370,590,800,{requires:['roue']});elephant('basile',250,800,['roue']);reactor('roue','wave',615,800);gate(1080,800,['roue']);target('cloche',1020,800,['roue']);
 star(720,800,'Le bon côté du récepteur');star(505,590,'Le balcon du meunier');star(1280,800,'La roue réveillée');
 walk(1,720);cmd(1,'face',-1);wait(1,'flag','roue');climb(0,370,590);walk(0,505);climb(0,370,800);shoot(880,'cloche');done(['Placez-vous à droite du récepteur marqué d’une onde.','Basile tape quand un croco se tient devant lui. Croquefort regarde vers la gauche.','Le récepteur doit recevoir l’onde avant le bouclier. Le balcon s’ouvre ensuite.'],['roue','cloche']);
}
// 17: use the upper bypass to stand on the correct side of the sneeze-powered weight.
{
 begin(17,'À tes souhaits, la balance','Contourner un contrepoids avant de le faire pousser par le vent','Hortense éternue. Son souffle pourrait placer le contrepoids, à condition de ne pas rester du mauvais côté.');
 floor(0,800,1600);floor(420,650,540);ladder(430,650,800);ladder(920,650,800);hippo('hortense',600,800,['peson']);B.L.blocks.push({id:'chariot',x:640,y:735,w:50,h:65,minX:640,maxX:840,windOnly:true});plate('peson',765,800,undefined,{blockOnly:true,acceptBlock:true});gate(1160,800,['peson']);
 star(350,800,'Le chemin du haut');star(870,650,'La corniche');star(1300,800,'Un contrepoids bien garé');
 walk(0,350);climb(1,430,650);walk(1,920);climb(1,920,800);walk(1,825);cmd(1,'face',-1);wait(1,'flag','peson');walk(1,1300);for(const i of [0,2]){climb(i,430,650);walk(i,870);climb(i,920,800);}
 done(['Le chariot porte un moulinet : seul le souffle le pousse.','La passerelle permet de contourner Hortense et le chariot.','Attirez l’éternuement depuis la droite, puis laissez le poids sur son plateau.'],['peson']);
}
// 18: a high basket catches the projectile before it reaches the bait; then rescue the roost.
{
 begin(18,'La livraison de Paulette','Faire tomber un projectile dans un panier suspendu','Paulette livre les noix de coco par les airs. Placez-vous sous le panier pour lui montrer l’adresse.');
 floor(0,800,1600);floor(300,565,240);ladder(420,565,800,{requires:['panier']});bird('paulette',700,800,['panier']);reactor('panier','coconut',640,650,[],120);gate(1110,800,['panier']);target('corde',1050,800,['panier']);
 star(460,800,'Le quai des livraisons');star(460,565,'La visite au nid');star(1300,800,'Le panier plein');
 walk(0,460);walk(0,700);wait(0,'flag','panier');climb(0,420,565);walk(0,460);climb(0,420,800);shoot(930,'corde');done(['Le panier est au-dessus de vos têtes. Une boulette verte ne le remplit pas.','Attendez sous le panier : Paulette vise le croco, le panier intercepte sa noix.','Le contenu débloque l’échelle et la corde du passage.'],['panier','corde']);
}
// 19: the receiver is in the arc of a pounce, not under the lion's resting position.
{
 begin(19,'Le lion saute la sonnette','Utiliser la trajectoire d’un bond pour toucher une sonnette haute','Léon ne sait pas sonner. Il sait bondir. Aidez-le à prévenir les habitants du verger.');
 floor(0,800,1600);floor(380,600,600);ladder(420,600,800);ladder(920,600,800);B.L.enemies.push({id:'leon',kind:'lion',x:650,y:800,minX:650,maxX:820,speed:42,dir:1,essential:true,calmWhen:['sonnette']});reactor('sonnette','pounce',650,750,[],200);gate(1100,800,['sonnette']);target('accueil',1030,800,['sonnette']);
 star(520,600,'Au-dessus des pommiers');star(850,800,'Le public du grand saut');star(1300,800,'Les voisins prévenus');
 climb(1,420,600);climb(1,920,800);walk(1,900);cmd(1,'face',-1);wait(1,'flag','sonnette');climb(0,420,600);walk(0,520);climb(0,420,800);shoot(900,'accueil');done(['Le lion vise le croco qu’on contrôle.','Placez Croquefort à droite de la sonnette, bouclier tourné vers Léon.','La sonnette se trouve sur le trajet en l’air. Après le bond réussi, Léon se repose.'],['sonnette','accueil']);
}
// 20: a reversible bridge carries its reflector; geometry, not a switch label, aligns the shot.
{
 begin(20,'La tortue et le rayon de lune','Garer un réflecteur mobile sous sa cible','Tortille transporte le miroir du phare. Faites-lui trouver le bon mouillage, puis envoyez la lumière vers la lanterne.',1720,1100,850);
 floor(0,850,1720);floor(1100,500,620);ladder(1410,500,850,{requires:['phare']});lever('appel',360,850,{kind:'frog',verb:'Coasser',label:'B · APPELER TORTILLE'});mover('tortille',470,800,200,900,800,['appel'],{kind:'turtle',speed:105});B.L.mirrors.push({id:'miroir-coquille',x:570,y:762,slash:true,mover:'tortille'});target('phare',1000,500-50,[],{label:'LA LANTERNE'});gate(1260,850,['phare']);
 star(310,850,'Le premier appel');star(1140,850,'Le bon mouillage');star(1560,500,'Le sommet du phare');
 walk(0,310);toggle(0,360);wait(0,'mover','tortille',1);floor(350,800,120);ladder(380,800,850);climb(2,380,800);shoot(400,'phare');climb(2,380,850);together(1130);for(const i of [0,1,2]){walk(i,1410);climb(i,1410,500);walk(i,1560);}B.L.exit={x:1500,y:500,w:150,direction:'right'};
 done(['Tortille porte un réflecteur : sa position compte autant que son inclinaison.','Appelez-la avec la grenouille, puis tirez depuis la petite marche de gauche.','Au mouillage de droite, le miroir est exactement sous la lanterne.'],['phare'],1570,500);
}
module.exports={elephant,hippo,bird,reactor};
// 21: the first wave opens access to a tuning plate; the second needs a different operator.
{
 begin(21,'Basile, joue-la encore','Transformer une première onde en accès au poste qui autorise la seconde','Le carillon a deux notes. Il faut accorder la seconde depuis le balcon pendant que Basile frappe.');
 floor(0,800,1600);floor(330,590,310);ladder(380,590,800,{requires:['grave']});elephant('basile',250,800,['aigu']);reactor('grave','wave',570,800,[],55);reactor('aigu','wave',660,800,['accord'],45);plate('accord',515,590,0);target('carillon',1020,800,['grave','aigu']);gate(1100,800,['carillon']);star(720,800,'Le public du carillon');star(585,590,'Le bout du balcon');star(1300,800,'Le concert prêt');
 walk(1,720);cmd(1,'face',-1);wait(1,'flag','grave');climb(0,380,590);walk(0,585);walk(0,515);cmd(1,'frames',180);wait(1,'flag','aigu');shoot(875,'carillon');climb(0,380,800);done(['La première note libère le balcon.','Croquinet tient le poste d’accord ; Croquefort attire le second pas depuis la droite.','Après la deuxième note, le tireur fixe l’accord du carillon.'],['carillon']);
}
// 22: approach the hippo from both sides; the first weight opens the only safe bypass.
{
 begin(22,'L’éternuement à double service','Choisir successivement les deux directions d’une même force','Deux paniers attendent leurs contrepoids. Hortense ne souffle que du côté où elle vous regarde.',1740);
 floor(0,800,1740);floor(410,600,800);ladder(430,600,800,{requires:['gauche']});ladder(1170,600,800);hippo('hortense',770,800,['gauche','droite']);B.L.blocks.push({id:'g',x:670,y:735,w:50,h:65,minX:570,maxX:670,windOnly:true},{id:'d',x:820,y:735,w:50,h:65,minX:820,maxX:920,windOnly:true});plate('gauche',595,800,undefined,{blockOnly:true,acceptBlock:true});plate('droite',945,800,undefined,{blockOnly:true,acceptBlock:true});gate(1370,800,['gauche','droite']);star(530,800,'Le panier de gauche');star(1090,600,'La passerelle de service');star(1510,800,'Les deux paniers équilibrés');
 walk(1,540);wait(1,'flag','gauche');climb(1,430,600);walk(1,1090);climb(1,1170,800);walk(1,1000);cmd(1,'face',-1);wait(1,'flag','droite');for(const i of [0,2]){climb(i,430,600);climb(i,1170,800);}done(['Commencez par le contrepoids de gauche : il ouvre l’échelle.','Contournez Hortense par le haut, puis attirez son souffle vers l’autre panier.','Ne poussez pas vous-même ces chariots à moulinets. Leur place libère toute l’équipe.'],['gauche','droite']);
}
// 23: choose which basket receives a falling nut; the lower receiver must be enabled first.
{
 begin(23,'Deux paniers et un bec','Préparer le deuxième récepteur avant de laisser passer la prochaine noix','Le panier du haut commande le volet du bas. Paulette livre à l’étage qu’on lui prépare.',1680,1120,900);
 floor(0,900,1680);floor(300,650,260);ladder(400,650,900,{requires:['haut']});bird('paulette',770,900,['bas']);reactor('haut','coconut',710,735,[],120);reactor('bas','coconut',710,785,['volet'],120);lever('volet',470,650,{toggle:false,hero:0,label:'B · PANIER BAS'});gate(1170,900,['bas']);target('recolte',1090,900,['bas']);star(480,650,'Le volet du grenier');star(920,900,'La seconde livraison');star(1390,900,'La réserve remplie');
 walk(1,770);wait(1,'flag','haut');climb(0,400,650);toggle(0,470);climb(0,400,900);cmd(1,'frames',240);wait(1,'flag','bas');shoot(960,'recolte');done(['La première noix remplit le panier du haut et libère son grenier.','Croquinet ouvre le volet bas avant la livraison suivante.','Attendez à nouveau sous les paniers. Le haut, déjà rempli, laisse passer la noix.'],['recolte']);
}
// 24: a compact parity puzzle; each frog also changes one neighbour. The visual score stays visible.
{
 begin(24,'Le chœur qui chante de travers','Inverser des voisins pour obtenir une configuration, sans appuyer partout au hasard','Les grenouilles allument leurs lanternes deux par deux. La partition demande seulement celle du milieu.');
 floor(0,800,1600);floor(760,570,340);ladder(810,570,800,{requires:['accord']});lever('rose',340,800,{kind:'frog',flips:['bleue'],label:'ROSE + BLEUE'});lever('bleue',535,800,{kind:'frog',flips:['verte'],label:'BLEUE + VERTE'});lever('verte',730,800,{kind:'frog',flips:['rose'],label:'VERTE + ROSE'});B.L.initialFlags={rose:true,bleue:false,verte:false};rule('accord',{all:[{not:'rose'},'bleue',{not:'verte'}]},'Une seule voix : la bleue');target('partition',1150,800,['accord']);gate(1230,800,['partition']);star(965,570,'Le pupitre du chef');star(610,800,'Les trois voix');star(1380,800,'La partition accordée');B.L.signs.push({x:540,y:800,text:'PARTITION : ○ ROSE  ● BLEUE  ○ VERTE'});
 toggle(0,340);wait(0,'flag','accord');climb(0,810,570);walk(0,965);climb(0,810,800);shoot(1000,'partition');done(['Chaque grenouille change sa lanterne et celle indiquée à côté.','La rose est allumée au départ. La partition demande uniquement la bleue.','La rose échange exactement ces deux lanternes. Fixez ensuite l’accord par un tir.'],['partition']);
}
// 25: the boat reverses with the water gate. Park the shooter before returning for the scout.
{
 begin(25,'Le dernier invité de Tortille','Utiliser deux états d’un passage pour organiser une relève avec retour','La petite écluse partage l’eau entre Tortille et la porte du verger. Croquinet attend au débarcadère supérieur.',1880,1160,900);
 floor(0,900,440);floor(1040,650,840);floor(0,1080,1880);floor(0,650,440);ladder(330,650,900);B.L.spawns[0]={x:180,y:650};lever('ecluse',320,900,{label:'B · ÉCLUSE ↔'});lever('ecluse',1260,650,{label:'B · ÉCLUSE ↔'});mover('tortille',440,900,600,440,650,['ecluse'],{kind:'turtle',speed:135});gate(1370,650,[],{requiresOff:['ecluse']});target('amarre',1550,650,[],{requiresOff:['ecluse']});B.L.bridges.push({x:430,y:650,w:620,h:22,requires:['amarre']});star(710,900,'Le premier embarquement');star(1110,650,'Le quai du tireur');star(1700,650,'Le dernier invité');
 walk(1,600);walk(2,710);climb(0,330,900);toggle(0,320);wait(1,'mover','tortille',1);walk(2,1250);walk(1,1200);toggle(2,1260);wait(2,'mover','tortille',0);shoot(1450,'amarre');climb(0,330,650);walk(0,1110);for(const i of [0,1,2])walk(i,1700);B.L.exit={x:1630,y:650,w:160,direction:'right'};done(['Faites monter les deux passagers avec l’écluse, depuis la manette du bas.','Le tireur coupe l’écluse depuis la rive haute : la porte du verger s’ouvre.','Son tir installe une passerelle permanente pour Croquinet.'],['amarre'],1720,650);
}
