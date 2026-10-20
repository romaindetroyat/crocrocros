#!/usr/bin/env python3
"""Build the zero-dependency PWA and the standalone desktop edition."""
from pathlib import Path
import hashlib,json,re
ROOT=Path(__file__).resolve().parent
src=ROOT/'src'; dist=ROOT/'dist';dist.mkdir(exist_ok=True)
page=(src/'index.html').read_text()
pack=json.loads((ROOT/'content/campaign.json').read_text())
ids=set()
for level in pack['levels']+pack.get('workshop',[]):
    assert level['id'] not in ids, 'Duplicate level ID'
    ids.add(level['id'])
    assert len(level['spawns'])==3 and len(level['stars'])==3
    for key in ['platforms','bridges','gates','switches','targets','plates','crates','turrets','hints','pads','signs']:
        assert isinstance(level[key],list), f'Missing list {key}'
    flags={x['id'] for key in ['switches','targets','plates','keys','crates','enemies','reactors','rules'] for x in level.get(key,[])}
    for item in level.get('ladders',[])+level.get('reactors',[])+level['switches']+level['bridges']+level['gates']+level['targets']+level.get('lifts',[])+level.get('portals',[])+level['crates']+[level['exit']]+level.get('elephants',[]):
        assert all(f in flags for f in item.get('requires',[])+item.get('requiresOff',[])+item.get('latchWhen',[])), 'Unknown mechanism dependency'
    for item in level['plates']:
        assert all(f in flags for f in item.get('latchWhen',[])), 'Unknown latch dependency'
for token,file in [('STYLE','style.css'),('LEVELS','levels.js'),('EXPEDITION','expedition.js'),('WILDLIFE','wildlife.js'),('ENGINE','engine.js'),('ART','art.js'),('MUSIC','music.js'),('APP','app.js')]:
    code=(src/file).read_text()
    if token=='LEVELS':code=code.replace('/*__CAMPAIGN__*/null',json.dumps(pack,ensure_ascii=False).replace('</','<\\/'))
    page=page.replace('/*__'+token+'__*/',code)
(dist/'index.html').write_text(page)
manifest={'id':'./','name':'Les Cro Cro Cros','short_name':'Cro Cro Cros','description':'Trois crocodiles, des énigmes et beaucoup de mauvaise foi.','lang':'fr','start_url':'./','scope':'./','display':'standalone','orientation':'landscape','background_color':'#f7f3e6','theme_color':'#244a40','icons':[{'src':f'icon-{s}.png','sizes':f'{s}x{s}','type':'image/png','purpose':'any maskable'} for s in [192,512]]}
(dist/'manifest.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
version=hashlib.sha256(page.encode()).hexdigest()[:12]
sw="""'use strict';
const CACHE='crocrocros-VERSION';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('crocrocros-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(caches.open(CACHE).then(async cache=>{if(event.request.mode==='navigate')return (await cache.match('./index.html'))||fetch(event.request);return (await cache.match(event.request,{ignoreSearch:true}))||fetch(event.request);}));
});
""".replace('VERSION',version)
(dist/'sw.js').write_text(sw)
# Direct-file edition: all assets embedded, no fetch and no service worker registration.
standalone=re.sub(r'<link rel="manifest"[^>]+>','',page)
standalone=standalone.replace('<script>','<script>window.CROCO_SINGLE_FILE=true;</script><script>',1)
import base64
icon=dist/'icon-192.png'
if icon.exists():standalone=standalone.replace('href="icon-192.png"','href="data:image/png;base64,'+base64.b64encode(icon.read_bytes()).decode()+'"')
(ROOT/'Les_Cro_Cro_Cros.html').write_text(standalone)
print(f'Built PWA: {dist}; standalone HTML; cache {version}')
