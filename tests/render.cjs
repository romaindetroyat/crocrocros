// Render real game artwork for visual QA without a browser dependency.
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','Trebuchet MS');
const fs=require('node:fs'),path=require('node:path');
const D=require('../src/levels.js'),E=require('../src/engine.js'),A=require('../src/art.js');
const out=path.join(__dirname,'renders');fs.mkdirSync(out,{recursive:true});
for(let i=0;i<D.levels.length;i++){
 const c=createCanvas(1280,720),g=c.getContext('2d'),engine=new E(D.levels[i]);engine.step(1/60);g.scale(1280/1100,720/620);A.render(g,1100,620,engine,0,1);
 fs.writeFileSync(path.join(out,`level-${i+1}.png`),c.toBuffer('image/png'));
}
for(const size of [192,512]){const c=createCanvas(size,size),g=c.getContext('2d');g.fillStyle='#244a40';g.fillRect(0,0,size,size);g.save();g.translate(size*.45,size*.72);g.scale(size/175,size/175);A.croc(g,{...D.heroes[0],x:0,y:0,face:1,roof:false},0,1);g.restore();fs.writeFileSync(path.join(__dirname,'../dist',`icon-${size}.png`),c.toBuffer('image/png'));}
// Portrait viewport and assembled three-character promo.
{const c=createCanvas(430,620),g=c.getContext('2d'),engine=new E(D.levels[0]);engine.step(1/60);A.render(g,430,620,engine,0,1);fs.writeFileSync(path.join(out,'portrait.png'),c.toBuffer('image/png'));}
{const c=createCanvas(1200,630),g=c.getContext('2d');A.background(g,1200,630,0,'morning',0);g.fillStyle='#829d65';g.beginPath();g.ellipse(840,530,390,110,0,0,Math.PI*2);g.fill();A.text(g,'Les Cro Cro Cros',70,155,58,'#244a40','left');A.text(g,'Trois museaux. Un seul cerveau.',75,212,26,'#54795d','left');A.text(g,'LE GRAND DÉPART',77,290,16,'#8a7950','left');A.text(g,'3 héros · 37 énigmes · 1 aventure',77,330,18,'#54795d','left');[0,1,2].forEach(i=>{g.save();g.translate(660+i*185,510);g.scale(2.7,2.7);A.croc(g,{...D.heroes[i],x:0,y:0,face:1,roof:false},i,1);g.restore();});fs.writeFileSync(path.join(out,'cover.png'),c.toBuffer('image/png'));}
console.log('Artwork rendered; PWA icons generated.');
