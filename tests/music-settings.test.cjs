'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.join(__dirname,'..'),key='crocrocros.marais75.v1';
(async()=>{
 const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html');r.end(fs.readFileSync(path.join(root,'Les_Cro_Cro_Cros.html')));});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:process.env.CROCO_CHROME_PATH||'/tmp/croco-browser/chrome-headless-shell-linux64/chrome-headless-shell',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{const Base=window.AudioContext;window.AudioContext=class extends Base{constructor(...args){super(...args);window.testAudio=this;}};});
  const base='http://127.0.0.1:'+server.address().port;await page.goto(base);assert.equal(await page.evaluate(()=>CROCO_VERSION),'3.0.1');
  await page.locator('#settingsHome').click();assert.equal(await page.locator('#settingMusic').innerText(),'Normale');
  for(const [label,value]of [['Forte',.4],['Coupée',0],['Discrète',.1],['Normale',.22]]){await page.locator('#settingMusic').click();assert.equal(await page.locator('#settingMusic').innerText(),label);assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).musicVolume,key),value);}
  await page.reload();await page.locator('#settingsHome').click();assert.equal(await page.locator('#settingMusic').innerText(),'Normale');
  const saved={format:'crocrocros-save',version:1,completed:{'marais-001':{stars:2,time:18}},current:null,sound:true,musicVolume:.1};
  await page.locator('#importInput').setInputFiles({name:'crocos-save.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});await page.locator('#importYes').click();await page.locator('#settingsHome').click();assert.equal(await page.locator('#settingMusic').innerText(),'Discrète');assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).completed,key),saved.completed);
  await page.locator('#settingMusic').click();await page.locator('#settingsClose').click();await page.locator('#continueBtn').click();await page.locator('#begin').click();await page.waitForFunction(()=>window.testAudio?.state==='running'&&window.testAudio.currentTime>.15);
  await page.locator('#soundBtn').tap();await page.waitForFunction(()=>window.testAudio.state==='suspended');await page.reload();await page.locator('#settingsHome').click();assert.equal(await page.locator('#settingSound').innerText(),'Coupé');await page.locator('#settingSound').click();await page.locator('#settingsClose').click();await page.locator('#continueBtn').click();await page.waitForFunction(()=>window.testAudio?.state==='running');await page.locator('#pauseBtn').tap();await page.waitForFunction(()=>window.testAudio.state==='suspended');await page.locator('#resume').click();await page.waitForFunction(()=>window.testAudio.state==='running');
  // Old saves keep both their selection and progress; sound-off never becomes on.
  await page.close();const muted=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true});muted.on('pageerror',e=>errors.push(e.message));await muted.addInitScript(({key,saved})=>localStorage.setItem(key,JSON.stringify({...saved,musicVolume:0,sound:false})),{key,saved});await muted.goto(base);await muted.locator('#settingsHome').click();assert.equal(await muted.locator('#settingMusic').innerText(),'Coupée');assert.equal(await muted.locator('#settingSound').innerText(),'Coupé');assert.deepEqual(errors,[]);await muted.screenshot({path:'/tmp/croco-volume-settings.png'});
  console.log('PASS mobile music presets, persisted selection, save import, preserved progress/mute, real AudioContext start, pause, reload and resume; no browser errors.');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
