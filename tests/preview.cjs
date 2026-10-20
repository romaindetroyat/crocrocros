// Actual campaign scenes, driven by normal controls at 60 Hz. Silent preview.
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','Trebuchet MS');
const D=require('../src/levels'),Engine=require('../src/engine'),Art=require('../src/art'),routes=require('./solutions.json');
const scenes=[
 {n:3,label:'Un zèbre curieux : laissez-le vous approcher',match:E=>E.zebra?.caught},
 {n:8,label:'L’éléphant : sautez ou présentez le bouclier',match:E=>E.pranks.some(b=>b.kind==='wave')},
 {n:11,label:'L’hippopotame : un éternuement qui pousse !',play:(E,tick,walk)=>{walk(1,515);tick(440);},match:E=>E.enemies.some(e=>e.kind==='hippo'&&e.phase==='windup')},
 {n:5,label:'Le lionceau se ramasse… puis bondit',play:(E,tick,walk)=>{walk(2,965);tick(420);},match:E=>E.enemies.some(e=>e.kind==='lion'&&e.phase==='windup')},
 {n:4,label:'Noix de coco : le bouclier protège aussi les têtes',play:(E,tick,walk)=>{walk(0,150);tick(1,{action:true});walk(1,470);tick(1,{action:true});let n=0;while(E.enemies[0].phase!=='windup'&&n++<400)tick(1);tick(28);walk(1,525);tick(150);},match:E=>E.enemies.some(e=>e.phase==='windup')},
 {n:2,label:'Cascades, embruns et rochers sculptés',play:(E,tick)=>tick(360),match:E=>E.clock>1.2},
 {n:25,label:'Un manège tourne dans la foire du marais',play:(E,tick)=>tick(360),match:E=>E.clock>1.2}
];
function replay(scene,visit){const E=new Engine(D.levels[scene.n]);let f=0,stop=false;function tick(n,input={}){for(let j=0;j<n&&!stop;j++){E.step(1/60,input);if(visit(E,f++)===false)stop=true;}}function walk(i,x){E.select(i);let n=0;while(!stop&&Math.abs(E.p[i].x-x)>4&&n++<500)tick(1,{right:x>E.p[i].x,left:x<E.p[i].x});tick(2);}
 if(scene.play)scene.play(E,tick,walk);else for(const cmd of routes[scene.n].commands){if(stop)break;if(cmd.select!==undefined)E.select(cmd.select);else tick(cmd.n,cmd.input);}if(!stop)tick(270);}
async function main(){const out=path.resolve(__dirname,'../docs/apercu.mp4'),ff=spawn('ffmpeg',['-y','-v','error','-f','rawvideo','-pix_fmt','rgba','-s','960x540','-r','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});const done=new Promise((res,rej)=>{ff.on('exit',c=>c===0?res():rej(Error('ffmpeg '+c)));ff.on('error',rej);});const c=createCanvas(960,540),g=c.getContext('2d');
 for(const [index,scene]of scenes.entries()){let match=null;replay(scene,(E,f)=>{if(scene.match(E)){match=f;return false;}});if(match===null)throw Error('Missing scene: '+scene.label);const start=Math.max(0,match-40),end=start+270,images=[];let camera=0;
 replay(scene,(E,f)=>{camera+=(Math.max(0,Math.min(E.L.width-1100,E.p[E.active].x-440))-camera)*.18;if(f<start)return;if(f>=end)return false;if(f%2)return;g.setTransform(960/1100,0,0,540/620,0,0);Art.render(g,1100,620,E,camera,f/60);g.setTransform(1,0,0,1,0,0);Art.rect(g,16,15,928,51,16,'#244a40ef');Art.text(g,scene.label,33,47,20,'#fff1c5','left');Art.rect(g,16,505,310,25,8,'#244a40dd');Art.text(g,'Les Cro Cro Cros · v0.7 · aperçu sans son',28,522,12,'#fff1c5','left');images.push(Buffer.from(g.getImageData(0,0,960,540).data));if(Math.abs(f-match-45)<2)fs.writeFileSync(path.join(__dirname,'renders',`v06-scene-${index+1}.png`),c.toBuffer('image/png'));});
 for(const im of images)if(!ff.stdin.write(im))await new Promise(r=>ff.stdin.once('drain',r));console.log('Scene',index+1,images.length,'frames');}
 ff.stdin.end();await done;console.log(out);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
