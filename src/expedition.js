(function(root){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x));
const X={
 describe(E,q,depth=0){if(depth>5)return '';if(q===undefined||q===true)return 'Libre';if(q===false)return 'Mur';
  if(typeof q==='string'){const rule=E.L.rules.find(r=>r.id===q);return rule?this.describe(E,rule.when,depth+1):(E.L.targets.find(t=>t.id===q)?.label||E.L.reactors.find(t=>t.id===q)?.label||q);}
  if(q.all)return q.all.map(v=>this.describe(E,v,depth+1)).join(' + ');if(q.any)return q.any.map(v=>this.describe(E,v,depth+1)).join(' / ');if(q.not)return 'Sans '+this.describe(E,q.not,depth+1);
  if(q.slot){const s=E.L.sockets.find(s=>s.id===q.slot),i=E.L.items.find(i=>i.id===q.item);return (i?.name||'Objet')+' → '+(s?.name||q.slot);}
  if(q.mode){const c=E.L.controls.find(c=>c.id===q.mode);return c.name+' : '+(c.labels?.[q.value??1]||q.value||1);}
  if(q.weight)return (E.L.sockets.find(s=>s.id===q.weight)?.name||'Plateau')+' · poids '+(q.min||1);
  if(q.itemAt)return (E.L.items.find(i=>i.id===q.itemAt)?.name||'Objet')+' en '+q.room;return 'Équipe en place';
 },
 init(E){if(!E.L.expedition)return;E.expedition={items:(E.L.items||[]).map(i=>({id:i.id,x:i.x,y:i.y,holder:-1,slot:null})),modes:Object.fromEntries((E.L.controls||[]).map(s=>[s.id,s.initial||0]))};},
 item(E,id){return E.expedition?.items.find(i=>i.id===id);},
 carried(E,hero=E.active){return E.expedition?.items.find(i=>i.holder===hero);},
 test(E,q){
  if(q===undefined||q===true)return true;if(q===false)return false;
  if(typeof q==='string')return !!E.flags[q]||!!E.broken[q];
  if(q.all)return q.all.every(v=>this.test(E,v));if(q.any)return q.any.some(v=>this.test(E,v));if(q.not!==undefined)return !this.test(E,q.not);
  if(q.slot)return E.expedition.items.some(i=>i.slot===q.slot&&(!q.item||q.item===i.id));
  if(q.mode)return E.expedition.modes[q.mode]===(q.value??1);
  if(q.itemAt){const i=this.item(E,q.itemAt),r=E.L.rooms.find(r=>r.id===q.room);return !!i&&i.holder<0&&i.x>r.x+20&&i.x<r.x+r.w-20&&Math.abs(i.y-r.floor)<70;}
  if(q.hero!==undefined){const p=E.p[q.hero],r=E.L.rooms.find(r=>r.id===q.room);return p.x>r.x+20&&p.x<r.x+r.w-20&&Math.abs(p.y-r.floor)<35&&(!q.roof||p.roof);}
  if(q.weight){const s=E.L.sockets.find(s=>s.id===q.weight);if(!s)return false;let w=0;
   for(const p of E.p)if(Math.abs(p.x-s.x)<50&&Math.abs(p.y-s.y)<12)w++;
   for(const i of E.expedition.items)if(i.holder<0&&Math.abs(i.x-s.x)<50&&Math.abs(i.y-s.y)<12)w+=(E.L.items.find(d=>d.id===i.id).weight||1);
   for(const e of E.enemies)if(!e.asleep&&Math.abs(e.x-s.x)<55&&Math.abs(e.homeY-s.y)<12)w+=2;
   return w>=(q.min||1);
  }
  return false;
 },
 sync(E){if(!E.expedition)return;
  for(const i of E.expedition.items){if(i.holder>=0){const p=E.p[i.holder];i.x=p.x;i.y=p.y;}else if(i.slot){const s=E.L.sockets.find(s=>s.id===i.slot);i.x=s.x;i.y=s.y;}}
  // Definitions are acyclic and ordered by the author. No hidden persistent unlocks.
  for(const r of E.L.rules||[])E.flags[r.id]=this.test(E,r.when);
 },
 tick(E,dt){if(!E.expedition)return;
  for(const i of E.expedition.items)if(i.holder<0&&!i.slot){const d=E.L.items.find(d=>d.id===i.id);if(!this.test(E,d.visibleWhen))continue;
   const floor=E.solids(-1).filter(s=>!s.shield&&i.x>s.x-8&&i.x<s.x+s.w+8&&s.y>=i.y-1).sort((a,b)=>a.y-b.y)[0];
   if(floor)i.y=Math.min(floor.y,i.y+320*dt);else if(i.y>E.L.height+50){i.x=d.x;i.y=d.y;}else i.y+=320*dt;
  }
  this.sync(E);
 },
 nearby(E){if(!E.expedition)return null;const p=E.p[E.active],held=this.carried(E),near=o=>Math.abs(o.x-p.x)<64&&Math.abs(o.y-p.y)<44;
  const socket=(E.L.sockets||[]).find(s=>near(s)&&(!held||!s.accept||s.accept.includes(held.id)));
  if(held&&socket&&!E.expedition.items.some(i=>i.slot===socket.id))return {kind:'place',socket,item:held,label:'Installer'};
  const item=E.expedition.items.find(i=>i.holder<0&&near(i)&&this.test(E,E.L.items.find(d=>d.id===i.id).visibleWhen));
  if(!held&&item)return {kind:'take',item,label:item.slot?'Retirer':'Prendre'};
  const other=E.expedition.items.find(i=>i.holder>=0&&i.holder!==E.active&&near(i));
  if(!held&&other)return {kind:'take',item:other,label:'Recevoir'};
  const control=(E.L.controls||[]).find(s=>near(s));if(control)return {kind:'control',control,label:control.verb||'Manœuvrer'};
  if(held)return {kind:'drop',item:held,label:'Poser'};return null;
 },
 interact(E){const n=this.nearby(E);if(!n)return;const p=E.p[E.active];
  if(n.kind==='take'){const d=E.L.items.find(d=>d.id===n.item.id);if(d.heavy&&E.active!==1){E.event('notice','Ce colis est lourd : Croquefort peut le transporter.');return;}n.item.holder=E.active;n.item.slot=null;E.event('notice',d.name+' : à vous de choisir son trajet.');}
  else if(n.kind==='place'){n.item.holder=-1;n.item.slot=n.socket.id;n.item.x=n.socket.x;n.item.y=n.socket.y;E.event('notice',n.socket.message||'Objet installé. Observez les passages.');}
  else if(n.kind==='drop'){n.item.holder=-1;n.item.slot=null;n.item.x=p.x;n.item.y=p.y;E.event('notice','Objet posé. Un autre croco peut le reprendre.');}
  else if(n.kind==='control'){const c=n.control;if(!this.test(E,c.when)){E.event('notice',c.locked||'Le mécanisme a besoin de sa pièce.');return;}const next=(E.expedition.modes[c.id]+1)%(c.states||2);E.expedition.modes[c.id]=next;E.event('notice',(c.name||'Mécanisme')+' : '+(c.labels?.[next]||next));}
  this.sync(E);E.event('cargo');
 },
 dropOnHit(E,hero){const i=this.carried(E,hero);if(!i)return;i.holder=-1;i.slot=null;i.x=E.p[hero].x;i.y=E.p[hero].y;},
 valid(s,L){if(!L.expedition)return !s;const num=v=>Number.isFinite(v);if(!s||!Array.isArray(s.items)||s.items.length!==L.items.length||!s.modes)return false;
  const owners=new Set(),slots=new Set();for(let j=0;j<s.items.length;j++){const i=s.items[j];if(i.id!==L.items[j].id||!num(i.x)||i.x<0||i.x>L.width||!num(i.y)||i.y<0||i.y>L.height+130||!Number.isInteger(i.holder)||i.holder< -1||i.holder>2)return false;
   if(i.holder>=0){if(owners.has(i.holder)||i.slot!==null)return false;owners.add(i.holder);}
   if(i.slot!==null){const slot=L.sockets.find(s=>s.id===i.slot);if(!slot||slots.has(i.slot)||i.holder>=0||(slot.accept&&!slot.accept.includes(i.id)))return false;slots.add(i.slot);}
  }
  return Object.keys(s.modes).length===L.controls.length&&L.controls.every(c=>Number.isInteger(s.modes[c.id])&&s.modes[c.id]>=0&&s.modes[c.id]<(c.states||2));
 },
 snapshot(E){return E.expedition?copy(E.expedition):undefined;},
 restore(E,s){if(E.L.expedition){E.expedition=copy(s);this.sync(E);}}
};root.CrocoExpedition=X;if(typeof module!=='undefined')module.exports=X;
})(typeof globalThis!=='undefined'?globalThis:this);
