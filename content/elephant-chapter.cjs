/* Authored rooms: the elephant's trunk is a gate or a lift with the SAME
   geometry/collision rules as the visible mechanism. No hidden damage. */
module.exports=function(levels,routes){
 function base(i,name,width){const L={...levels[i],revision:5,name,width,handcrafted:true,spawns:[{x:70,y:520},{x:125,y:520},{x:180,y:520}],checkpoint:{x:110,y:520},exit:{x:width-215,y:520,w:180}};for(const k of ['platforms','bridges','gates','switches','targets','plates','crates','turrets','keys','lifts','ladders','springs','portals','conveyors','stars','signs','pads','blocks','elephants'])L[k]=[];levels[i]=L;routes[i]={levelId:L.id,custom:i+1};return L;}
 const floor=(L,x,w,y=520,h=160)=>L.platforms.push({x,y,w,h,oneway:h<40});
 const stars=(L,pts)=>L.stars=pts.map(([x,y],i)=>({id:`star-${i+1}`,x,y}));
 let L=base(6,'Chut… de grandes oreilles',1420);
 floor(L,0,1420);floor(L,195,365,320,18);L.ladders=[{x:230,y:320,h:200}];
 L.plates=[{id:'lookout',x:395,y:320,w:75,hero:0,label:'W',latchWhen:['bell']},{id:'shelter',x:700,y:520,w:75,hero:1,roof:true,label:'X · BOUCLIER ↑',latchWhen:['bell']}];
 L.gates=[{x:775,y:385,w:35,h:135,requires:['shelter'],latchWhen:['bell'],elephant:true},{x:1170,y:230,w:28,h:290,requires:['bell']}];
 L.elephants=[{x:655,y:520,radius:360,requires:['shelter'],latchWhen:['bell'],label:'LAISSEZ PASSER…'}];
 L.targets=[{id:'bell',x:1000,y:482,label:'CLOCHE · TIR ←',hitDirection:-1,requires:['lookout','shelter']}];
 stars(L,[[430,280],[1090,410],[1320,410]]);
 L.briefing='Une trompe barre le chemin. Croquefort peut la soutenir avec son bouclier, mais il ne pourra pas rester là pour toujours. La cloche de l’autre côté fera reculer le géant.';
 L.hints=['La cloche est blindée à gauche. Et ses deux voyants attendent les bonnes positions.','Croquinet tient la dalle rouge en haut. Croquefort, sur la dalle jaune, lève son bouclier pour soutenir la trompe.','Faites passer Croqueboum sous la trompe, puis à droite de la cloche. Il tire vers la gauche pendant que les deux autres tiennent leurs postes. La cloche libère tout le monde.'];
 L.intro='« Ce n’est pas une montagne. La montagne vient d’éternuer. »';L.difficulty='Sang-froid';L.victory='Vous avez soutenu la trompe, contourné la cloche, puis libéré les deux gardiens. Le géant vous salue !';
 L=base(7,'L’ascenseur à trompe',1280);floor(L,0,1280);floor(L,650,350,290,18);
 L.switches=[{id:'call',x:240,y:520,label:'TROMPE ↔',toggle:true}];
 L.lifts=[{id:'trunk',x:500,y:520,w:130,h:16,toY:290,speed:110,requires:['call'],elephant:true}];
 L.elephants=[{x:410,y:520,radius:260,lift:'trunk',requires:['call'],label:'ALLER… ET RETOUR'}];
 L.keys=[{id:'gold',x:810,y:257,hero:1}];L.plates=[{id:'scout',x:335,y:520,w:70,hero:0,label:'W',latchWhen:['finish']}];
 L.targets=[{id:'finish',x:970,y:252,label:'CALME + CLÉ',requires:['gold','scout'],requiresOff:['call']}];L.gates=[{x:1030,y:230,w:28,h:290,requires:['finish']}];
 stars(L,[[810,250],[920,250],[1160,410]]);L.intro='« Il nous aide ? » — « Ne lui dis surtout pas qu’on a peur. »';
 L.briefing='La trompe monte quand la cloche sonne. Deux crocos doivent gagner la corniche, mais la cible ne fonctionne que dans le silence. Organisez les voyages.';
 L.hints=['Celui qui récupère la clé jaune n’est pas celui qui tire. La trompe doit redescendre entre les voyages.','Croquinet commande le levier. Faites monter Croquefort chercher la clé, redescendez la trompe, puis faites monter Croqueboum.','Les deux passagers quittent le plateau vers la corniche de droite. Croquinet éteint ensuite le levier et tient la dalle rouge. Croqueboum tire : clé partagée, dalle occupée et cloche silencieuse sont nécessaires.'];
 L.difficulty='Organisation';L.victory='Deux passagers, deux voyages et un dernier instant de silence : l’éléphant vous a fait confiance.';
 L=base(8,'Le détour du retour',1210);floor(L,0,1210);floor(L,0,325,320,18);floor(L,780,350,340,18);L.exit={x:65,y:320,w:195,requires:['home']};
 L.ladders=[{x:160,y:320,h:200}];L.keys=[{id:'red',x:1020,y:307,hero:0}];L.plates=[{id:'guard',x:970,y:520,w:85,hero:1,label:'X',latchWhen:['home']}];
 L.targets=[{id:'home',x:230,y:282,label:'RETOUR · TIR ←',hitDirection:-1,requires:['red','guard']}];
 L.portals=[{id:'shortcut',x:1050,y:520,toX:190,toY:320,requires:['home']}];L.pads=[{x:740,y:520}];
 L.elephants=[{x:710,y:520,radius:290,requires:['home'],label:'UNE GRANDE OMBRE'}];
 stars(L,[[1020,300],[900,410],[270,280]]);L.intro='« La sortie était derrière nous ? Depuis LE DÉBUT ? »';
 L.briefing='La sortie est en haut, à gauche, mais le sceau rouge est tout à droite. Un signal de l’autre rive réveillera le raccourci. Pensez au trajet de retour des deux éclaireurs.';
 L.hints=['Vous pouvez atteindre la sortie dès le début, mais son sceau manque encore. Le raccourci turquoise n’est pas alimenté.','Croquefort aide Croquinet à grimper sur la corniche de droite grâce au bouclier levé près des fleurs. Croquinet prend le sceau. Croquefort tient ensuite la dalle jaune au sol.','Croqueboum monte à l’échelle de gauche et tire vers la gauche sur la cible, depuis son côté droit. Le signal ouvre la sortie et le raccourci au pied de la corniche droite. Les deux éclaireurs peuvent l’emprunter pour rentrer.'];
 L.difficulty='Prévoir le retour';L.victory='La solution allait dans les deux sens. Même les éclaireurs sont rentrés sans refaire tout le chemin.';
 L=base(9,'Les trois étages du silence',1170);floor(L,0,1170);floor(L,0,325,200,18);floor(L,0,400,360,18);floor(L,680,365,200,18);floor(L,420,95,420,18);
 L.spawns=[{x:80,y:200},{x:80,y:520},{x:80,y:360}];
 L.ladders=[{x:280,y:200,h:320},{x:440,y:420,h:100}];L.blocks=[{id:'ballast',x:350,y:464,w:56,h:56,minX:350,maxX:500}];
 L.plates=[{id:'weight',x:500,y:520,w:65,hero:1,acceptBlock:true,label:'CONTREPOIDS'},{id:'lookout',x:245,y:200,w:75,hero:0,label:'W',latchWhen:['finish']}];
 L.lifts=[{id:'lift',x:550,y:520,w:130,h:16,toY:200,speed:115,requires:['weight','lookout'],latchWhen:['finish']}];
 L.bridges=[{id:'upper',x:325,y:200,w:355,h:18,requires:['finish']}];L.keys=[{id:'blue',x:810,y:167,hero:2}];
 L.targets=[{id:'finish',x:995,y:162,label:'TROIS SIGNES',requires:['weight','lookout','blue']}];L.gates=[{x:850,y:350,w:28,h:170,requires:['finish']}];
 stars(L,[[810,160],[1000,160],[1060,410]]);L.intro='« Personne ne bouge ! » — « Mais c’est précisément le problème. »';
 L.briefing='Trois étages, un monte-charge et une dalle que personne ne veut quitter. Regardez où faire passer le tireur avant de déplacer le contrepoids.';
 L.hints=['Croqueboum peut descendre du bord de sa terrasse. Il doit atteindre le monte-charge avant le déplacement du contrepoids.','Croquefort pousse le contrepoids vers la dalle au sol. Croquinet tient la dalle rouge du dernier étage : le monte-charge peut monter.','Croqueboum récupère la clé bleue sur la corniche, puis tire sur la cible. Le pont du haut libère Croquinet. Croquefort utilise la petite échelle pour passer au-dessus du contrepoids ; tout le monde rejoint la sortie au sol par la droite.'];
 L.difficulty='Synthèse avancée';L.victory='Vous avez préparé le passage avant de verrouiller le mécanisme. Le dernier signal a réuni les trois étages.';

 L=base(10,'Le grand saut de Croquefort',1435);floor(L,0,340);floor(L,800,635);floor(L,0,340,210,18);
 L.spawns=[{x:75,y:520},{x:190,y:210},{x:135,y:520}];L.ladders=[{x:150,y:210,h:310}];
 L.switches=[{id:'bridge',x:950,y:520,label:'SAUVETAGE'}];L.bridges=[{id:'river',x:340,y:520,w:460,h:18,requires:['bridge']}];
 L.keys=[{id:'gold',x:870,y:487,hero:1}];L.crates=[{id:'crate',x:1040,y:440,w:55,h:80}];L.targets=[{id:'finish',x:1150,y:482,label:'SORTIE',requires:['gold','crate']}];L.gates=[{x:1190,y:230,w:28,h:290,requires:['finish']}];
 L.signs=[{x:265,y:210,text:'X · BOUCLIER ↑'},{x:860,y:385,text:'LE PONT EST ICI'}];stars(L,[[650,290],[950,410],[1335,410]]);
 L.intro='« Ce bouclier fait aussi parachute ? » — « On va le savoir. »';L.difficulty='Maîtrise aérienne';
 L.briefing='La rivière est trop large pour un saut. Croquefort doit se laisser tomber de la falaise, bouclier au-dessus de la tête, et planer vers l’autre rive. Les deux autres comptent sur lui pour ouvrir le pont.';
 L.hints=['Espace lève le bouclier de Croquefort. Au bord de la falaise, continuez vers la droite : sa chute devient très lente.','Gardez le bouclier levé et maintenez → pour traverser le vide. ↑ ne fait pas sauter Croquefort : il doit partir du bord.','Sur l’autre rive, Croquefort récupère la clé jaune et actionne le levier. Le pont permet aux deux autres de traverser. Croquinet casse la caisse, Croqueboum active la cible.'];
 L.victory='Un long vol, un pont de secours, puis deux équipiers sauvés. Ce bouclier mérite une médaille.';
 L=base(11,'La ronde des gros dodos',1220);floor(L,0,1220);floor(L,195,405,320,18);L.ladders=[{x:230,y:320,h:200}];
 L.enemies=[{id:'upperCrab',kind:'lion',x:510,y:320,minX:430,maxX:555,speed:76,dir:-1},{id:'lowerCrab',kind:'hippo',x:740,y:520,minX:650,maxX:790,speed:95,dir:-1}];
 L.keys=[{id:'red',x:500,y:287,hero:0}];L.gates=[{x:870,y:230,w:28,h:290,requires:['red','upperCrab','lowerCrab']}];stars(L,[[500,280],[750,410],[1100,410]]);
 L.intro='« Ils ne sont pas méchants. Juste TRÈS encombrants. »';L.difficulty='Escorte et observation';
 L.briefing='Un lionceau et un hippopotame montent la garde, un à chaque étage. Le bouclier frontal les repousse, une boulette ou une charge les assomme. Organisez l’escorte jusqu’au sceau rouge.';
 L.hints=['Les animaux reviennent sur leurs pas. Observez leur patrouille depuis une position sûre.','Croquefort bloque un animal seulement s’il lui fait face, bouclier devant lui. Croqueboum peut alors tirer depuis derrière son protecteur.','Montez sur la corniche avec le protecteur et le tireur. Assommez le lionceau, puis récupérez le sceau avec Croquinet. Redescendez par l’échelle pour approcher l’hippopotame en formation. Les deux animaux endormis et le sceau ouvrent la porte.'];
 L.victory='Deux gros dodos, trois museaux intacts. Le bouclier a protégé le tireur, et le tireur a ouvert la route.';
 // An early encounter makes the mobile threat visible before the advanced chapter.
 levels[2].enemies=[{id:'riverCrab',kind:'hippo',x:920,y:520,minX:880,maxX:950,speed:65,dir:-1}];levels[2].revision=5;
 levels[2].briefing+=' Un hippopotame patrouille près de la caisse : bloquez-le de face avec Croquefort et assommez-le avec une boulette.';
 for(let i=12;i<levels.length;i++){const l=levels[i];l.enemies=[];for(const t of l.turrets){l.enemies.push({id:t.id+'-crab',kind:i>20?'vulture':'lion',x:t.x-40,y:520,minX:t.x-85,maxX:t.x-20,speed:70+i,dir:-1});}if(l.enemies.length)l.revision=5;}
 for(let i=12;i<levels.length;i++){const l=levels[i];for(const [m,step] of (routes[i].steps||[]).entries()){if(!['belt','armour','ladder','spring'].includes(step.type))continue;const upper=['ladder','spring'].includes(step.type);l.enemies.push({id:`m${m}-patrol`,kind:upper?'vulture':i%2?'hippo':'lion',x:step.offset+(upper?505:560),y:upper?300:520,minX:step.offset+(upper?470:550),maxX:step.offset+(upper?515:580),speed:65+i,dir:-1});}if(l.enemies.length)l.revision=5;}
 levels[4].enemies=[{id:'islandPrankster',kind:'vulture',x:610,y:520,minX:525,maxX:635,speed:72,dir:-1}];
 levels[5].enemies=[{id:'workshopCub',kind:'lion',x:1100,y:320,minX:1020,maxX:1190,speed:85,dir:-1}];
 const scenery=['harbour','canopy','falls','mill','moon','savannah','savannah','canopy','moon','ruins','falls','savannah','ruins','moon','falls','ruins','moon','mill','harbour','mill','falls','mill','canopy','mill','fort','fair','moon','fair','harbour','fair','ruins','fair','moon','fort','falls','fort','savannah'];
 levels.forEach((l,i)=>{l.revision=6;l.scenery=scenery[i];const bonus=l.stars[2];if(bonus.y===410&&l.platforms.some(p=>p.y===520&&bonus.x>p.x&&bonus.x<p.x+p.w))l.zebra={x:bonus.x,y:520,starId:bonus.id,minX:Math.max(bonus.x-130,...l.gates.map(g=>g.x<bonus.x?g.x+g.w+50:0)),maxX:Math.min(l.width-65,bonus.x+100)};if(l.zebra)l.hints.push('Le zèbre saute par-dessus un poursuivant seul. Placez un croco de chaque côté, resserrez la tenaille, puis appuyez sur Espace près de lui.');if(l.enemies?.some(e=>e.kind==='vulture'))l.hints.push('Le vautour monte avec sa noix de coco avant de la lâcher. Le bouclier levé protège les têtes ; profitez de son repos pour tirer.');l.questStage=i<3?0:i<6?1:i<12?2:i<20?3:i<28?4:5;});
 levels[1].elephants=[{x:980,y:520,radius:310,requires:['signal'],label:'LES GRANDES OREILLES'}];
 levels[4].elephants=[{x:1015,y:520,radius:300,requires:['finish'],label:'NE PAS RÉVEILLER'}];
};
