/* Campaign authoring source. Every recipe is chosen, ordered and named by hand.
   No random levels. Geometry, art and wording are original to Les Cro Cro Cros. */
const fs=require('node:fs'),path=require('node:path');
const old=require('../tests/fixtures/campaign-v02.json');
const specs=[
['STRT','Trois museaux, une idée','boost'],
['GR8T','Service d’étage','lift','cover'],
['TLPT','La porte qui fait pouf','portal','charge'],
['GRND','Le détour utile','boost','reverse'],
['LLM0','Les roseaux ont des oreilles','ladder','bridge'],
['FL0T','Le capitaine en haut','portal','boost'],
['TRSS','L’éclaireur et les deux autres','boost','lift'],
['PRHS','La passerelle à petits pois','cover','bridge'],
['CVRN','La grotte des ascenseurs','lift','relay'],
['BBLS','Les nénuphars rebondissants','spring','portal'],
['VLCN','Chaud devant, froid derrière','cover','charge','spring'],
['QCKS','Sable à contresens','belt','bridge'],
['PHR0','Le temple des trois poids','relay','ladder'],
['C1R0','Le concierge du pharaon','lift','combination'],
['SPKS','Les dents de la porte','reverse','relay'],
['JMNN','Le trousseau partagé','portal','ladder','cover'],
['TTRS','Briques et bonnes manières','boost','charge','combination'],
['JLLY','La fabrique de confiture','belt','cover'],
['PLNG','Monte-charge, descends-croco','lift','spring'],
['BTRY','La pile à trois pattes','ladder','portal','relay'],
['JNKR','Le grand rendez-vous','portal','lift','reverse'],
['CBLT','Un tapis très contrariant','belt','lift','cover'],
['H0PP','Les ressorts du règlement','spring','bridge'],
['SMRT','Chauffeur, si tu nous entends','lift','bridge'],
['V8TR','Inspection des machines','belt','ladder','combination'],
['NFL8','La foire des ventres ronds','spring','ladder'],
['WKYY','Le stand de tir biscornu','relay','spring'],
['CMB0','A, puis B, puis tout le monde','bridge','combination'],
['8BLL','Trois tickets pour la sortie','boost','portal','ladder'],
['TRDR','La clé du marchand de clés','portal','combination','reverse'],
['FNTM','Le fantôme du nénuphar','spring','boost','charge'],
['WRLR','Le tourniquet des museaux','lift','portal','bridge'],
['TRPD','Le piège du garde-manger','relay','armour'],
['TFFF','Personne au même endroit','portal','reverse','relay'],
['FRGT','Mais on est déjà passés ici !','combination','portal','bridge'],
['4RN4','La revue du régiment','belt','spring','relay'],
['MSTR','Le coffre du général Crognon','bridge','relay','armour']
];
const chapterNames=['Le port des étourdis','Les marais à ressorts','Les ruines du museau','La fabrique des bêtises','La foire aux détours','Le fort du général'];
const themes=['morning','forest','temple','factory','fair','fort'];
const help={
boost:['À quoi peut servir un bouclier qui regarde le ciel ?','Placez Croquefort près du bord de la terrasse. Espace lève son bouclier.','Croquinet saute sur le bouclier, puis sur la terrasse. La clé rouge ouvre le passage pour les trois.'],
lift:['Quelqu’un doit rester aux commandes du monte-charge.','La dalle jaune reconnaît Croquefort. Envoyez Croqueboum sur le plateau suspendu.','Croquefort reste sur la dalle pendant que Croqueboum monte chercher la clé bleue. Elle maintient l’ascenseur en haut et ouvre la porte.'],
cover:['Une cible grise attend un signal. Regardez ses voyants.','La dalle jaune alimente la cible. Le bouclier doit rester devant Croquefort pour arrêter les graines.','Croquefort tient la dalle face à la fleur. Croqueboum tire depuis son abri. La cible verrouille le passage en position ouverte.'],
reverse:['Un seul côté de cette cible est vulnérable.','Croquinet doit d’abord démolir la caisse. La petite flèche indique le sens du tir.','Passez Croqueboum à droite de la cible. Faites un pas à gauche, puis Espace.'],
portal:['Les deux arches turquoise communiquent.','Une arche pâle attend un tir sur sa cible. Espace près d’une arche active vous fait traverser ; la clé jaune attend Croquefort.','Croqueboum tire sur la cible pour alimenter l’arche. Croquefort la traverse, prend la clé jaune, puis revient par l’arche du haut.'],
charge:['Le bois ne résiste pas longtemps à un museau décidé.','Seul Croquinet peut casser les caisses : rapprochez-vous et chargez vers elles.','Cassez les caisses avant de tirer sur la cible. La porte vérifie les deux opérations.'],
ladder:['Les trois crocos savent grimper aux cordages.','Maintenez ↑ près de l’échelle ; sur écran tactile, maintenez le bouton de saut.','Croqueboum grimpe, ramasse la clé bleue puis tire sur la cible à sa hauteur. Descendez ensuite par le bord droit.'],
spring:['Un nénuphar à ressort se déclenche tout seul.','Croqueboum a besoin du ressort pour atteindre la terrasse. Décalez-vous vers la droite pendant le rebond.','Atterrissez sur la terrasse, récupérez la clé bleue et tirez vers la cible. Le bord droit permet de redescendre.'],
bridge:['Le pont A et le pont B ne peuvent pas être ouverts ensemble… au début.','Croquinet commande les deux leviers. A seul ouvre la première travée, B seul ouvre la seconde. L’îlot central est sûr.','A actif : faites traverser les deux autres jusqu’à l’îlot. Désactivez A et activez B. Croquefort traverse vers la dalle jaune ; Croqueboum tire sur la cible depuis l’îlot. Les deux ponts restent ouverts : ramenez Croquinet.'],
relay:['Il faut occuper deux endroits à la fois avant de tirer.','Le bouclier levé aide Croquinet à gagner la dalle rouge en hauteur. Ensuite Croquefort descend tenir la dalle jaune.','Laissez Croquinet sur sa dalle et Croquefort sur la sienne. Croqueboum tire depuis la gauche. La cible libère les deux équipiers.'],
belt:['Le tapis n’est pas d’accord avec votre destination.','Maintenez la direction contre le tapis. Croquinet doit charger à proximité de la caisse.','Après la caisse, récupérez la clé rouge et tirez sur la cible avec Croqueboum.'],
combination:['Trois leviers, mais tous ne doivent pas être allumés.','Les panneaux indiquent A + C. Le voyant barré doit rester éteint.','Activez A et C, laissez B éteint, puis tirez sur la cible. Si B est allumé, Espace le désactive.'],
armour:['Le coffre du général a deux verrous très différents.','Croquefort alimente la cible depuis la dalle. Croqueboum retire le blindage en tirant.','Quand la cible est verte, Croquinet peut charger le coffre. Tant qu’il est gris, même sa meilleure grimace n’y fera rien.']
};
function chapter(i){return i<4?0:i<12?1:i<17?2:i<25?3:i<33?4:5;}
const levels=[],routes=[];
for(let n=0;n<specs.length;n++){
 const [code,name,...recipe]=specs[n],ci=chapter(n);
 const L={id:n<3?`marais-0${n+1}`:`expedition-${String(n+1).padStart(2,'0')}`,revision:3,chapter:chapterNames[ci],name,subtitle:'Personne ne reste derrière',theme:themes[ci],sourceCode:code,par:100+recipe.length*70,
 intro:['« J’ai un plan. » — « C’est déjà suspect. »','Le régiment est passé par ici. Ou par là. Enfin, il est passé.','« On appelle ça une promenade ? » — « Une promenade avec procédures. »'][n%3],
 briefing:recipe.length===1?'Une première mission pour découvrir comment les trois museaux se complètent.':'Observez chaque mécanisme avant de déplacer toute l’équipe. Les clés sont partagées ; les leviers marqués ↔ peuvent se désactiver.',
 spawns:[{x:70,y:520},{x:125,y:520},{x:180,y:520}],platforms:[],bridges:[],gates:[],switches:[],targets:[],plates:[],crates:[],turrets:[],keys:[],lifts:[],ladders:[],springs:[],portals:[],conveyors:[],stars:[],signs:[],pads:[],hints:[]};
 let o=0,steps=[],bonus=[];
 for(let m=0;m<recipe.length;m++){
  const type=recipe[m],p=`m${m}-`,id=t=>p+t,w=type==='bridge'?900:type==='relay'?780:720;
  const add=(k,v)=>L[k].push(v),ground=(x,width)=>add('platforms',{x:o+x,y:520,w:width,h:160});
  const gate=(req,x=610)=>add('gates',{x:o+x,y:250,w:28,h:270,requires:req.map(id)});
  const key=(x,y,hero)=>add('keys',{id:id('key'),x:o+x,y,hero});
  const target=(x=500,y=482,req=[],extra={})=>add('targets',{id:id('shot'),x:o+x,y,label:'TIR',requires:req.map(id),...extra});
  const upper=(x,y,width)=>add('platforms',{x:o+x,y,w:width,h:18,oneway:true});
  const crate=(x=280,extra={})=>add('crates',{id:id('crate'),x:o+x,y:440,w:50,h:80,...extra});
  if(type!=='bridge')ground(0,w);
  if(type==='boost'||type==='relay'){
   upper(275,340,225);bonus.push({x:o+430,y:300});
   add('pads',{x:o+235,y:520});
   add('signs',{x:o+210,y:520,text:'BOUCLIER ↑'});
   if(type==='boost'){key(415,307,0);if(n===0){target(520,482,['key']);gate(['key','shot']);}else gate(['key']);}
   else {add('plates',{id:id('high'),x:o+395,y:340,w:70,hero:0,label:'CROQUINET',latchWhen:[id('shot')]});add('plates',{id:id('low'),x:o+400,y:520,w:80,hero:1,label:'CROQUEFORT',latchWhen:[id('shot')]});target(550,482,['high','low']);gate(['shot'],660);}
  }else if(type==='lift'){
   add('plates',{id:id('low'),x:o+195,y:520,w:50,hero:1,label:'ASCENSEUR',latchWhen:[id('key')]});
   add('lifts',{id:id('lift'),x:o+260,y:520,w:120,h:16,toY:300,speed:105,requires:[id('low')]});upper(380,300,155);key(455,267,2);gate(['key']);bonus.push({x:o+500,y:255});
  }else if(type==='cover'||type==='armour'){
   add('plates',{id:id('low'),x:o+355,y:520,w:80,hero:1,label:'CROQUEFORT',latchWhen:[id('shot')]});target(510,482,['low']);
   if(type==='cover'){add('turrets',{id:id('flower'),x:o+525,y:480,dir:-1,off:id('shot'),period:1.8,awakeX:o+300});gate(['shot']);}
   else {crate(555,{requires:[id('shot')]});gate(['crate']);}
   bonus.push({x:o+395,y:400});
  }else if(type==='portal'){
   upper(300,280,240);key(440,247,1);
   target(360,482);add('portals',{id:id('in'),x:o+230,y:520,toX:o+345,toY:280,requires:[id('shot')]});add('portals',{id:id('out'),x:o+505,y:280,toX:o+480,toY:520});gate(['key']);bonus.push({x:o+400,y:235});
  }else if(type==='charge'||type==='reverse'||type==='belt'){
   crate();if(type==='belt'){add('conveyors',{x:o+205,y:520,w:300,speed:-95});key(440,487,0);}
   target(type==='reverse'?460:520,482,[],type==='reverse'?{hitDirection:-1}:{});gate(type==='belt'?['crate','key','shot']:['crate','shot']);bonus.push({x:o+390,y:380});
  }else if(type==='ladder'||type==='spring'){
   upper(330,300,215);key(410,267,2);target(505,262,['key']);gate(['shot']);bonus.push({x:o+480,y:225});
   if(type==='ladder'){add('ladders',{x:o+350,y:300,h:220});add('signs',{x:o+215,y:520,text:'↑ / ↓ GRIMPER'});}
   else {add('springs',{x:o+245,y:520,w:65});add('signs',{x:o+165,y:520,text:'REBOND →'});}
  }else if(type==='bridge'){
   ground(0,300);ground(450,100);ground(700,200);
   for(const [label,x] of [['A',130],['B',235]])add('switches',{id:id(label),x:o+x,y:520,label:label+' ↔',toggle:true});
   add('bridges',{id:id('bridgeA'),x:o+300,y:520,w:150,h:18,requires:[id('A')],requiresOff:[id('B')],latchWhen:[id('shot')]});add('bridges',{id:id('bridgeB'),x:o+550,y:520,w:150,h:18,requires:[id('B')],requiresOff:[id('A')],latchWhen:[id('shot')]});
   add('plates',{id:id('low'),x:o+710,y:520,w:70,hero:1,label:'VERROU',latchWhen:[id('shot')]});target(775,482,['low']);gate(['shot'],825);bonus.push({x:o+500,y:420});add('signs',{x:o+500,y:520,text:'ÎLOT REFUGE'});
  }else if(type==='combination'){
   for(const [label,x] of [['A',140],['B',250],['C',360]])add('switches',{id:id(label),x:o+x,y:520,label:label+' ↔',toggle:true});
   target(520,482,['A','C'],{requiresOff:[id('B')]});gate(['shot']);bonus.push({x:o+470,y:380});add('signs',{x:o+480,y:365,text:'A + C · PAS B'});
  }
  L.hints.push(...(n===0?[...help[type],'Après la clé, Croqueboum tire sur la cible au sol. Les trois crocos peuvent alors sortir.']:help[type]).map((t,i)=>`${recipe.length>1?`Passage ${m+1} · `:''}${t}`));
  steps.push({type,offset:o,width:w});o+=w;
 }
 L.width=o+240;L.platforms.push({x:o,y:520,w:240,h:160});L.exit={x:o+35,y:520,w:170};L.checkpoint={x:recipe.length>1?steps[1].offset+60:110,y:520};
 // Three optional stars: challenging height, a route observation and a final flourish.
 const pts=[bonus[0],bonus[1]||{x:280,y:430},bonus[2]||{x:o-60,y:410}];L.stars=pts.map((p,i)=>({id:`star-${i+1}`,...p}));
 levels.push(L);routes.push({levelId:L.id,steps});
}
require('./handcrafted.cjs')(levels,routes);
require('./elephant-chapter.cjs')(levels,routes);
old.heroes.forEach((h,i)=>{h.speed=[380,290,325][i];h.skin=['#85b94b','#b49b4c','#4bafaa'][i];h.color=['#e16b4b','#dfb44e','#4d9cc4'][i];});
const quest={title:'La bannière du retour',intro:'Un grand barrissement a dispersé le régiment et déchiré sa bannière. Retrouvez ses six morceaux, traversez le pays des éléphants et ramenez tout le monde au marais.',milestones:[2,5,11,19,27,36],pieces:['Le museau','Les roseaux','La lune','La rivière','Le soleil','Les trois étoiles']};
quest.milestones.forEach((n,i)=>levels[n].questReward=i);
fs.writeFileSync(path.join(__dirname,'campaign.json'),JSON.stringify({version:7,quest,heroes:old.heroes,levels},null,2));
fs.writeFileSync(path.join(__dirname,'../tests/recipes.json'),JSON.stringify(routes,null,2));
const doc=['# Les Cro Cro Cros — carnet d’adaptation v0.5','',
'37 parcours compacts originaux, organisés suivant les 37 étapes de référence. Les correspondances ci-dessous sont une trame de travail : les cartes, distances, objets et séquences ne reproduisent pas exactement les niveaux de The Lost Vikings. Les systèmes de combat, de bombes et de magnétisme sont simplifiés en mécanismes de coopération.','',
'## Sources consultées','',
'- JBennetch, guide complet : https://gamefaqs.gamespot.com/pc/564577-the-lost-vikings/faqs/10400',
'- kidalpha, second guide (incomplet) : https://gamefaqs.gamespot.com/snes/588450-the-lost-vikings/faqs/49502',
'- Blizzard, présentation rétrospective : https://news.blizzard.com/fr-fr/article/23609765/the-lost-vikings-et-notre-amour-insoupconne-pour-les-jeux-de-reflexion-multijoueur','',
'Consultés le 19 octobre 2026. Aucun texte de solution, plan, graphisme ou son du jeu original n’est incorporé au jeu. Les codes servent uniquement à identifier les correspondances dans ce carnet.','',
'## Nos parcours et leur solution','',
'Les solutions suivantes décrivent exclusivement nos nouvelles cartes. W / X / C sélectionnent les personnages. Espace actionne aussi les leviers et les arches de téléportation. ↑ / ↓ permettent de grimper aux échelles. Les clés colorées se ramassent avec le croco de la même couleur et profitent à toute l’équipe.',''];
for(let i=0;i<levels.length;i++){doc.push(`### ${String(i+1).padStart(2,'0')} · ${levels[i].name} — repère ${specs[i][0]}`,'');if(levels[i].handcrafted){doc.push(...levels[i].hints.map((h,j)=>`${j+1}. ${h}`),'');}else for(const [m,type]of specs[i].slice(2).entries())doc.push(`${m+1}. ${help[type][2]}`);doc.push('','Amenez ensuite les trois crocodiles sous l’arche de sortie.','');}
fs.writeFileSync(path.join(__dirname,'../CARNET_ADAPTATION.md'),doc.join('\n'));
console.log(`Authored ${levels.length} compact levels in six chapters.`);
