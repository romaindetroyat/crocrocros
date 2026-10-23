'use strict';
// Render actual Web Audio, including the application's effects bus. This catches
// inaudible output, clipped mixes and mute regressions that mocks cannot hear.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.join(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CROCO_CHROME_PATH||'/tmp/croco-browser/chrome-headless-shell-linux64/chrome-headless-shell',args:['--no-sandbox']});
 try{
  const page=await browser.newPage();await page.addScriptTag({content:fs.readFileSync(path.join(root,'src/music.js'),'utf8')});
  const app=fs.readFileSync(path.join(root,'src/app.js'),'utf8'),effectsCode=app.slice(app.indexOf('function tone('),app.indexOf('function music('));
  const results=await page.evaluate(async effectsCode=>{
   const cases=[];for(const theme of ['morning','moon'])for(const volume of [.1,.22,.4])cases.push({theme,volume,seconds:72});
   cases.push({theme:'morning',volume:.4,seconds:12,effects:true},{theme:'moon',volume:.4,seconds:12,effects:true},{theme:'morning',volume:0,seconds:4},{theme:'morning',volume:0,seconds:12,effects:true},{theme:'morning',volume:.4,seconds:5,muteAt:2});
   const results=[];
   for(const c of cases){let now=0;const sampleRate=c.effects?48000:44100,ctx=new OfflineAudioContext(1,sampleRate*c.seconds,sampleRate),clock=new Proxy(ctx,{get(t,p){if(p==='currentTime')return now;if(p==='state')return 'running';const v=t[p];return typeof v==='function'?v.bind(t):v;}}),score=new CrocoMusic(clock),fx=new Function('audio','score','data','audioStart',effectsCode+';return {sound,tone};')(clock,score,{sound:true},()=>{}),events=['jump','star','target','portal','spring','trumpet','stomp','sneeze','animalWarn','coconut','shoot','boing','win','break','shield'];
    for(let frame=0;now<c.seconds-.5;frame++,now=frame/60){score.tick(c.theme,c.muteAt&&now>=c.muteAt?0:c.volume);if(c.effects&&frame%15===0){fx.sound(events[(frame/15)%events.length]);if(frame%60===0){fx.sound('shoot');fx.sound('star');fx.sound('stomp');fx.tone(659.25,.24,'triangle',.05);}}}
    const samples=(await ctx.startRendering()).getChannelData(0);
    function meter(from,to){let sum=0,peak=0,clipped=0;const start=Math.ceil(from*sampleRate),end=Math.floor(to*sampleRate);for(let n=start;n<end;n++){const x=samples[n];if(!Number.isFinite(x))throw Error('Nonfinite audio sample');sum+=x*x;peak=Math.max(peak,Math.abs(x));if(Math.abs(x)>=1)clipped++;}return {rmsDb:sum?20*Math.log10(Math.sqrt(sum/(end-start))):null,peak,peakDb:peak?20*Math.log10(peak):null,clipped};}
    results.push({...c,sampleRate,full:meter(1,c.seconds-.5),...(c.seconds===72?{reprise:meter(36,64)}:{}),...(c.muteAt?{afterMute:meter(c.muteAt+1,c.seconds-.5)}:{})});
   }
   return results;
  },effectsCode);
  for(const r of results){assert.equal(r.full.clipped,0,'no clipping: '+JSON.stringify(r));assert(r.full.peak<.98,'output headroom: '+JSON.stringify(r));if(r.volume===.22){assert(r.full.rmsDb>-27&&r.full.rmsDb<-18,'normal level clearly audible');assert(r.reprise.rmsDb>-28,'flute reprise remains audible');}if(r.volume===0&&!r.effects)assert.equal(r.full.peak,0,'music off is silent');if(r.volume===0&&r.effects)assert(r.full.rmsDb>-35,'effects remain audible when music is off');if(r.afterMute)assert(r.afterMute.peak<.0001,'music mute settles to silence');}
  for(const theme of ['morning','moon']){const music=results.filter(r=>r.theme===theme&&r.seconds===72);assert(music[1].full.rmsDb-music[0].full.rmsDb>5,'distinct quiet and normal settings');assert(music[2].full.rmsDb-music[1].full.rmsDb>3,'distinct normal and loud settings');}
  const report={version:'3.0.1',date:'2026-10-23',browser:await browser.version(),scope:'OfflineAudioContext renders of complete reed/flute cycles, two arrangements, three volume presets, concurrent effects and music mute. No physical headphone or Safari measurement.',results};
  fs.writeFileSync(path.join(__dirname,'audio-output-report.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS actual Web Audio: 6 complete arrangements/presets, 2 concurrent-effect mixes, independent mute, audible effects and fade to silence; no clipping.');console.log(JSON.stringify(results.map(r=>({theme:r.theme,volume:r.volume,effects:!!r.effects,rmsDb:r.full.rmsDb,peak:r.full.peak})),null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
