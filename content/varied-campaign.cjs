'use strict';
// Explicit puzzle specifications: wiring, melodies, positions, weights and routes.
// Every replacement has a replay through the same physics/input API as the player.
module.exports=function(api){
 const {begin,done,at,control,target,plate,item,socket,goal,mode,all,any,weight,link,turn,shoot,go,step,take,put}=api;
 const get=()=>api.level();
 function edges(map){const rows=map.split('/'),out=[];for(let y=0;y<rows.length;y++)for(let x=0;x<rows[y].length;x++){const a=rows[y][x];if(a==='.')continue;for(const [dx,dy] of [[1,0],[0,1]]){const b=rows[y+dy]?.[x+dx];if(b&&b!=='.')out.push(a+b);}}return out;}
 function start(n,name,map,kind,brief){const ids=[...map].filter(c=>/[A-Z]/.test(c)),end=ids.at(-1);begin(n,map,edges(map).join(','),end,brief);const L=get();L.name=name;L.revision=120;L.puzzleFamily=kind;L.intro='« '+name+' ? » — « Cette fois, on commence par observer. »';L.victory='Une autre façon de coopérer. Les trois crocos ont trouvé le passage.';return L;}
 function finish(){const L=get();done();
  // Open terraces and irregular outlines replace the enclosing roof on top rooms.
  const exposed=L.rooms.filter(r=>!L.rooms.some(t=>t.col===r.col&&t.row===r.row-1));
  L.platforms=L.platforms.filter(p=>!exposed.some(r=>p.x===r.x&&p.y===r.floor-336&&p.w===700));
  L.hints[0]=L.briefing;L.hints[1]='Les mécanismes montrent leur état. Le plan et le dézoom « Tout » permettent de préparer les positions de chacun.';
 }
 function circuit(n,name,map,masks,initial,desired,places){
  const count=Math.max(...masks,initial,desired).toString(2).length;
  const labels=Array.from({length:count},(_,i)=>String(i+1));
  const L=start(n,name,map,'circuits',`Chaque levier inverse plusieurs lampes : les numéros sont indiqués au-dessus. Il faut obtenir ${labels.map((s,i)=>s+' '+(desired&(1<<i)?'allumée':'éteinte')).join(', ')}. Un second appui annule le premier. Aucun objet à transporter.`);
  const rooms=L.rooms.map(r=>r.id),lampRoom=rooms.at(-1);
  for(let i=0;i<count;i++)control('lamp'+i,lampRoom,String(i+1),{dx:100+i*105,y:at(lampRoom).y-140,readOnly:true,kind:'lamp',want:(desired>>i)&1,initial:(initial>>i)&1});
  for(let i=0;i<masks.length;i++)control('lever'+i,places[i%places.length],String.fromCharCode(65+i),{dx:150+Array.from({length:i},(_,j)=>places[j%places.length]).filter(r=>r===places[i%places.length]).length*190,verb:'Inverser',flips:labels.flatMap((_,j)=>masks[i]&(1<<j)?['lamp'+j]:[]),labels:['repos','inversé']});
  const queue=[{bits:initial,route:[]}],seen=new Set([initial]);let solution;
  while(queue.length){const q=queue.shift();if(q.bits===desired){solution=q.route;break;}masks.forEach((mask,i)=>{const bits=q.bits^mask;if(!seen.has(bits)){seen.add(bits);queue.push({bits,route:[...q.route,i]});}});}
  if(!solution?.length)throw Error('Invalid circuit '+n);L.minimumSwitches=solution.length;
  const needs=labels.map((_,i)=>mode('lamp'+i,(desired>>i)&1));goal(...needs);
  solution.forEach((i,j)=>turn(j%3,'lever'+i));L.hints[1]='Cherchez les lampes qui ne sont commandées que par un seul levier. Les leviers peuvent être annulés.';finish();
 }
 function melody(n,name,map,order,places,roles=false){
  const L=start(n,name,map,'séquences',`La partition est ${order.split('').join(' → ')}. Retrouvez ces cloches et jouez-les dans cet ordre avec B (F au clavier). Une fausse note remet la partition à zéro ; vous pouvez recommencer sans pénalité.${roles?' Chaque cloche porte aussi le repère de son musicien.':''}`);
  const notes=[...new Set(order)];L.sequences=[{id:'score',order:[...order]}];control('score','A','Partition',{states:order.length+1,kind:'score',readOnly:true,dx:350});
  notes.forEach((note,i)=>control('note-'+note,places[i], 'Cloche '+note,{dx:170+notes.slice(0,i).filter((_,j)=>places[j]===places[i]).length*210,sequence:'score',note,verb:'Jouer',hero:roles?i%3:undefined,labels:['prête','prête']}));
  goal(mode('score',order.length));for(const note of order){const i=notes.indexOf(note);turn(roles?i%3:0,'note-'+note);}finish();
 }
 function relay(n,name,map,stages,separate=false){
  const L=start(n,name,map,'postes simultanés','Deux crocos doivent tenir leurs postes pendant que Croqueboum vise le sceau. Les postes sont vivants : partir les désactive. Une cible validée reste acquise, puis les rôles se déplacent pour la suivante. Repérez les numéros sur les plateaux.');
  if(separate)L.spawns=stages[0].map((r,i)=>at(r,100+i*65));
  const flags=[];stages.forEach(([r0,r1,rt],i)=>{const p='relay'+i;plate(p+'a',r0,{dx:170+i*85,name:'Poste '+(i+1)+' · Croquinet'});plate(p+'b',r1,{dx:410-i*65,name:'Poste '+(i+1)+' · Croquefort'});target(p,rt,all(weight(p+'a'),weight(p+'b'),{hero:0,room:r0},{hero:1,room:r1},...flags),{name:'SCEAU '+(i+1),rule:'Deux postes occupés'});flags.push(p);step(0,'stand',p+'a');step(1,'stand',p+'b');shoot(p);});goal(...flags);finish();
 }
 function balance(n,name,map,weights,left,rooms){
  const total=weights.reduce((a,b)=>a+b,0),L=start(n,name,map,'balances',`Répartissez toutes les masses entre les plateaux Gauche et Droite : ${weights.join(', ')}. Les deux côtés doivent peser ${total/2}. Les masses marquées « lourd » nécessitent Croquefort ; les plus légères peuvent être confiées aux autres. Le cadran montre les deux totaux.`);
  const stores=rooms.filter(r=>r!=='A'&&r!==L.endRoom);if(!stores.length)stores.push(L.rooms.find(r=>r.id!=='A'&&r.id!==L.endRoom).id);const slots=[[],[]];weights.forEach((w,i)=>{item('mass'+i,stores[i%stores.length],w+' kg',{dx:140+Math.floor(i/stores.length)*150,kind:'weight',weight:w,heavy:w>=3});});
  for(let side=0;side<2;side++)for(let j=0;j<weights.length;j++){const id=(side?'right':'left')+j;socket(id,side?L.endRoom:'A',null,(side?'Droite ':'Gauche ')+(j+1),{dx:80+j*120});slots[side].push(id);}
  L.balances=[{id:'balance',name:'La balance',...at(L.endRoom,350),left:slots[0],right:slots[1],total}];goal({balance:'balance'});
  let li=0,ri=0;weights.forEach((w,i)=>{const h=w>=3?1:i%3;take(h,'mass'+i);put(h,left.includes(i)?slots[0][li++]:slots[1][ri++]);});finish();
 }
 function junction(n,name,map,branches,order,post=false){
  const L=start(n,name,map,'aiguillages',`Croquinet commande les aiguillages au centre. Chaque position ouvre une branche différente. Envoyez Croqueboum valider ses cibles et préparez son retour avant de changer de branche.${post?' Croquefort doit en plus tenir le poste du centre pendant les tirs.':''} Les cibles validées rendent leur accès permanent.`);
  const routes=branches.map(r=>{const queue=[['A']],seen=new Set(['A']);while(queue.length){const path=queue.shift();if(path.at(-1)===r)return path;for(const e of L.connections){const b=e.a===path.at(-1)?e.b:e.b===path.at(-1)?e.a:null;if(b&&!seen.has(b)){seen.add(b);queue.push([...path,b]);}}}throw Error(n+' branch '+r);});
  if(new Set(routes.map(p=>p[1])).size!==branches.length)throw Error('Branches must be independent '+n);
  control('route','A','Aiguillage',{states:branches.length+1,hero:0,verb:'Aiguiller',dx:310,labels:['garage',...branches.map(b=>'vers '+b)]});if(post){plate('guard','A',{dx:530,name:'Poste du chef de gare'});step(1,'stand','guard');}
  branches.forEach((r,i)=>{target('signal'+i,r,post?weight('guard'):true,{name:'SIGNAL '+r});link(routes[i][0]+routes[i][1],any(mode('route',i+1),'signal'+i));});
  let state=0;for(const i of order){while(state!==i+1){turn(0,'route');state=(state+1)%(branches.length+1);}shoot('signal'+i);go(2,'A');}goal(...branches.map((_,i)=>'signal'+i));finish();
 }
 // These specs intentionally interleave different cognitive and physical tasks.
 circuit(7,'Les lampes qui se contrarient','AB',[3,6,4],0,5,['A','A','B']);
 melody(9,'Le carillon du départ','A/B','ABA',['A','B']);
 relay(12,'La photo des trois postes','AB/C.',[['A','B','C']]);
 balance(16,'Un kilo de plumes','AB/C.',[1,2,3],[0,1],['B']);
 junction(17,'Le petit chef de gare','.B./CAD',['B','C','D'],[1,0,2]);
 circuit(19,'Le phare éteint','A./BC',[3,5,6,4],7,5,['A','B']);
 melody(21,'L’écho de la tour','A/B/C','ACBA',['A','B','C']);
 relay(23,'Personne ne bouge !','.B/AC',[['A','B','C']]);
 circuit(24,'Les trois lucioles','AB./.CD',[1,3,6],0,7,['A','C','D']);
 balance(27,'Deux rives, même poids','AB/CD',[2,3,5],[0,1],['B','C']);
 junction(28,'Le quai oublié','B../ACD/E..',['B','D','E'],[2,0,1]);
 melody(31,'Le tambour des racines','AB./.CD','ABCA',['B','C','D']);
 relay(32,'Les vigies séparées','AB./.CD',[['A','D','B'],['C','B','D']],true);
 circuit(34,'Le quatrième fil','.AB/CD.',[3,6,12,8],1,0,['A','B','C','D']);
 balance(36,'Les cailloux du canyon','A../BCD',[1,3,4],[0,1],['B','C','D']);
 junction(38,'La gare aux deux étages','.BC/DA./.E.',['C','D','E'],[0,2,1],true);
 melody(39,'La réponse des falaises','A./BC/.D','ABACB',['A','C','D']);
 relay(42,'Le triangle immobile','.A./BCD',[['B','D','A'],['A','C','D']],true);
 circuit(43,'La panne en cascade','ABC/.D.',[7,3,12,10],3,1,['A','B','C','D']);
 balance(46,'Le pesage du moulin','AB/CD/.E',[2,2,4],[0,1],['B','C','D']);
 junction(47,'Le répartiteur des combles','.B../CAEF/.D..',['B','C','F','D'],[2,0,3,1]);
 melody(49,'Une note de trop','AB./.C./.DE','ABCBAC',['A','C','E']);
 relay(51,'Les deux rivages','AB/CD/EF',[['A','F','C'],['D','B','E']],true);
 circuit(53,'Les lanternes du bassin','A.B/CDE',[3,5,10,12,16],4,27,['A','B','D']);
 balance(54,'L’eau à mi-hauteur','AB./.CD/.E.',[1,1,2,4],[0,1,2],['B','C','D','E']);
 junction(57,'Les quatre bassins','..B../..C../DEAFG/..H..',['B','D','G','H'],[3,1,0,2],true);
 melody(58,'Les cloches sous la pluie','AB/CD/.E','ACABCB',['B','C','E'],true);
 relay(61,'Le salut à trois','A.B/CDE',[['A','B','D'],['C','E','B']],true);
 circuit(62,'Le chapiteau dans le noir','ABCD/.E..',[3,6,12,24,16],31,10,['A','B','C','D','E']);
 balance(64,'Les haltères du clown','AB./.CD/..E',[1,2,3,6],[0,1,2],['A','B','C','D']);
 junction(66,'La piste aux trois entrées','.B./CAD/.E.',['B','C','D','E'],[2,3,0,1],true);
 melody(68,'L’orchestre désaccordé','A../BCD/.E.','ABCACBA',['A','D','E'],true);
 relay(69,'Le trapèze des vigies','AB./.CD/.EF',[['A','F','B'],['C','B','E'],['D','E','F']],true);
 circuit(74,'Les balises du grand vent','AB./.CD/..E',[7,14,28,17,3],9,3,['A','B','C','D','E']);
 balance(76,'Le vent dans la balance','A.B/CDE/.F.',[2,3,4,5],[0,3],['A','B','D','F']);
 junction(81,'Le poste frontière','B../ACD/E../F..',['B','D','F'],[1,2,0],true);
 melody(82,'La serrure qui chante','AB./.CD/EF.','ABDCABCD',['A','B','D','F'],true);
 relay(83,'Les trois balcons','AB./.CD/..E',[['A','E','B'],['C','B','D'],['D','A','E']],true);
 circuit(86,'Un fil traverse la ville','AB.C/.DEF',[3,6,12,24,48,33],42,21,['A','B','C','D','E','F']);
 melody(87,'Les sonneurs de minuit','A.B/CDE/.F.','ACDBACBD',['A','B','E','F'],true);
 relay(88,'Le relais des remparts','ABCD/.E.F',[['A','F','B'],['D','B','E'],['C','E','F']],true);
 circuit(89,'La constellation inversée','AB./.CD/EF.',[7,14,28,56,49,35],63,21,['A','B','C','D','E','F']);
 melody(92,'Le concert des trois crocos','A.B/CDE/F.G','ABCADBACD',['B','C','E','G'],true);
 relay(94,'Une pause, trois postes','AB./.CD',[['A','D','B'],['C','B','D']],true);
 junction(96,'Les derniers embranchements','..B./..C./DEAF/..G./..H.',['B','D','F','H'],[1,3,0,2],true);
 relay(98,'Le grand relais sans colis','AB.C/DEFG/.HI.',[['A','C','F'],['D','G','B'],['H','B','I']],true);
};
