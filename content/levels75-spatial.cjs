'use strict';
const B=require('./author75.cjs'),{elephant,hippo,bird,reactor}=require('./levels75-animals.cjs');
const {begin,floor,ladder,lever,gate,target,key,star,plate,mover,rule,cmd,walk,climb,jump,act,use,fire,wait,toggle,shoot,together,done}=B;
// 26: the powered lift and unpowered bridge share their supply. Park the whole crew before cutting it.
{
 begin(26,'Le pont préfère le silence','Couper volontairement le courant après avoir mis l’équipe en sûreté','Le moteur soulève la nacelle, mais tient aussi la passerelle repliée. Il faudra choisir le bon moment pour l’arrêter.',1740,1120,850);
 floor(0,850,360);floor(650,600,300);floor(1220,600,520);floor(0,1070,1740);mover('monte-charge',360,850,290,360,600,['moteur']);lever('moteur',315,850,{label:'B · MOTEUR ↔'});target('frein',900,600,['equipe'],{flips:['moteur'],label:'COUPER LE MOTEUR'});plate('poste-a',710,600,0);plate('poste-b',810,600,1);rule('equipe',{all:['poste-a','poste-b']},'Les passagers sont à quai');B.L.bridges.push({x:940,y:600,w:290,h:22,requires:['frein'],requiresOff:['moteur']});star(500,850,'Avant le départ');star(720,600,'Le quai de sûreté');star(1490,600,'Le pont au repos');
 walk(1,500);walk(2,550);toggle(0,315);wait(1,'mover','monte-charge',1);walk(1,810);walk(2,760);toggle(0,315);wait(0,'mover','monte-charge',0);walk(0,500);
 // Recall switch is also available from the deck; the operator rides this second journey.
 B.L.movers[0].control='moteur';use(0);wait(0,'mover','monte-charge',1);walk(0,710);shoot(760,'frein');B.L.exit={x:1500,y:600,w:160,direction:'right'};done(['La passerelle reste repliée tant que le moteur tourne.','Faites d’abord rejoindre le quai central aux trois crocos : les deux postes confirment leur sécurité.','Le tir sur le frein coupe le moteur et déplie le passage.'],['frein'],1570,600);
}
// 27: a scout replaces a temporary ballast so the strong croc can clear the firing line.
{
 begin(27,'Prends ma place, je pousse','Remplacer un poids par un équipier avant de déplacer ce poids hors d’un tir','Le contrepoids ouvre le grenier, mais bouche le tir qui commande la sortie. Quelqu’un doit prendre sa place.',1760,1100,800);
 floor(0,800,1760);floor(380,570,1030);ladder(420,570,800,{heroes:[0,1]});ladder(900,570,800,{heroes:[0,1]});ladder(1370,570,800,{requires:['sortie']});B.L.blocks.push({id:'caisse',x:500,y:735,w:60,h:65,minX:500,maxX:1130});plate('presence',745,800,undefined,{w:150,x:670,acceptBlock:true});key('sceau',570,570);gate(530,570,['presence'],{h:180,y:390});target('sortie',1030,800,['presence','sceau']);gate(1490,800,['sortie']);star(570,570,'Le sceau du grenier');star(830,570,'La relève');star(1610,800,'Le passage dégagé');
 walk(1,675);wait(1,'flag','presence');climb(0,420,570);walk(0,570);walk(0,830);climb(0,900,800);walk(0,795);walk(1,1095);shoot(880,'sortie');for(const i of [0,1]){climb(i,900,570);climb(i,1370,800);}B.L.ladders.push({x:980,y:570,h:230,requires:['sortie']});climb(2,980,570);climb(2,1370,800);done(['Le poids ouvre d’abord le grenier à Croquinet.','Après avoir pris le sceau, Croquinet peut tenir le grand plateau depuis son bord droit.','Croquefort continue alors à pousser : le poids dépasse la cible et libère le tir.'],['sortie']);
}
// 28: a shield becomes a steerable reflector. Its actual position determines which bell rings.
{
 begin(28,'Le bouclier fait des reflets','Employer le protecteur comme réflecteur mobile pour deux rayons verticaux','Le bouclier poli peut renvoyer une boulette vers le haut. Les deux lanternes ne sont pas au-dessus du même endroit.');B.L.shieldMirror=true;
 floor(0,800,1600);floor(300,751,190);ladder(345,751,800);floor(620,510,430);ladder(1010,510,800,{requires:['gauche','droite']});target('gauche',650,590);target('droite',950,590);gate(1220,800,['gauche','droite']);star(400,751,'Le pas de tir');star(740,510,'Le jardin des lanternes');star(1370,800,'Deux reflets pour la fête');
 walk(1,650);act(1);climb(2,345,751);shoot(400,'gauche');walk(1,950);shoot(400,'droite');act(1);climb(2,345,800);climb(0,1010,510);walk(0,740);climb(0,1010,800);done(['Le bouclier levé réfléchit les boulettes vers le haut, à la hauteur de son bord.','Croqueboum tire depuis la marche. Croquefort se place sous chaque lanterne.','Une fois les deux lanternes allumées, le balcon secret devient accessible.'],['gauche','droite']);
}
// 29: three locks need opposite ray directions. The scout must go around the gate, not shoot it twice.
{
 begin(29,'Le courrier arrive par derrière','Utiliser le sens d’un tir et le retour d’un portail pour atteindre un verrou blindé','Le guichet accepte le courrier par l’arrière. Le portail du grenier peut lui apporter votre boulette.',1720,1100,850);
 floor(0,850,1720);floor(300,590,410);ladder(360,590,850);lever('courrier',610,590,{hero:0,toggle:false,label:'B · OUVRIR LE GUICHET'});B.L.portals.push({id:'entree',x:600,y:850,toX:1420,toY:850,dir:-1,shots:true,requires:['courrier']},{id:'retour',x:1420,y:850,toX:600,toY:850,dir:1,requires:['poste']});target('poste',1130,850,['courrier'],{hitDirection:-1,requiresPortal:'entree',label:'PAR L’ARRIÈRE'});gate(900,850,['poste']);star(565,590,'Le guichet du grenier');star(740,850,'Le courrier parti');star(1510,850,'La bonne entrée');
 climb(0,360,590);walk(0,565);toggle(0,610);climb(0,360,850);shoot(450,'poste');done(['Le poste est blindé du côté gauche. Une boulette directe ne suffit pas.','Croquinet ouvre le guichet depuis le grenier.','Le portail renvoie le tir vers la gauche, derrière le blindage.'],['poste']);
}
// 30: shared compact site. A wave enables a falling nut; the basket latches the return lift.
{
 begin(30,'Tout le monde au pique-nique','Faire coopérer deux animaux pour fixer le trajet de retour du dernier opérateur','Basile débloque le panier de Paulette. Le panier arrime le monte-charge pour que le dernier croco puisse venir manger.',1820,1180,900);
 floor(0,900,1820);floor(1130,580,690);floor(310,680,250);ladder(350,680,900);elephant('basile',190,900,['onde']);reactor('onde','wave',510,900,['accord'],55);plate('accord',480,680,0);bird('paulette',820,900,['panier']);reactor('panier','coconut',760,735,['onde'],120);mover('table',900,900,230,900,580,['panier']);B.L.plates[0].latchWhen=['panier'];B.L.bridges.push({x:550,y:680,w:350,h:22,requires:['panier']});ladder(960,580,900,{requires:['panier']});target('nappe',1510,580,['panier']);star(480,680,'L’accord du panier');star(820,900,'Le panier pique-nique');star(1620,580,'La grande table');
 climb(0,350,680);walk(0,480);walk(1,620);cmd(1,'face',-1);wait(1,'flag','onde');walk(1,820);wait(1,'flag','panier');for(const i of [0,1,2]){if(i===0)climb(0,350,900);climb(i,960,580);}shoot(1380,'nappe');B.L.exit={x:1640,y:580,w:150,direction:'right'};done(['Croquinet tient l’accord sur le balcon ; Croquefort attire le pas de Basile à droite du récepteur.','Le panier autorisé peut recevoir la noix de Paulette.','Le panier fixe le monte-charge et libère l’opérateur. La table attend toute l’équipe.'],['nappe'],1700,580);
}
