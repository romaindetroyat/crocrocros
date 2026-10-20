(function(root){
'use strict';
// Instrumental arrangement of the traditional Ah ! Les crocodiles melody.
// Melody references and attribution: MUSIQUE.md. No recorded samples or network.
// Eight sixteenth-note slots per 2/4 bar; zero means sustain, not a new attack.
const verse=[
 [65,0,0,0,65,0,0,69],[72,0,0,0,0,0,70,0],
 [69,0,67,0,69,0,70,0],[69,0,0,0,67,0,0,0],
 [67,0,0,0,67,0,0,69],[67,0,0,0,0,0,67,0],
 [69,0,67,0,69,0,71,0],[72,0,0,0,0,0,0,0]
];
const refrain=[
 [65,0,69,0,69,0,69,0],[65,0,69,0,69,0,69,0],
 [65,0,69,0,69,0,69,0],[70,0,0,0,67,0,0,0],
 [64,0,67,0,67,0,67,0],[64,0,67,0,67,0,67,0],
 [72,0,70,0,69,0,67,0],[69,0,0,0,0,0,0,0]
];
const phrases=[...verse,...verse,...refrain,...refrain.slice(0,7),[65,0,0,0,0,0,0,0]];
const chords=[[41,45,48],[36,40,43],[46,50,53]];
const harmony=[0,0,1,0,1,1,1,1,0,0,1,0,1,1,1,1,0,0,0,2,1,1,1,0,0,0,0,2,1,1,1,0];
class Music {
 constructor(ctx){this.ctx=ctx;this.step=0;this.round=0;this.next=0;this.gain=ctx.createGain();this.gain.gain.value=.22;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=2400;filter.Q.value=.4;this.gain.connect(filter).connect(ctx.destination);
 const real=new Float32Array([0,1,.3,.12,.05,.02]),imag=new Float32Array(6);this.reed=ctx.createPeriodicWave(real,imag);this.noise=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.12),ctx.sampleRate);const noise=this.noise.getChannelData(0);let seed=7123;for(let i=0;i<noise.length;i++){seed=(seed*1664525+1013904223)>>>0;noise[i]=(seed/4294967296*2-1)*(1-i/noise.length);}}
 voice(note,at,duration,volume,kind='reed'){const c=this.ctx,o=c.createOscillator(),v=c.createGain();if(kind==='reed')o.setPeriodicWave(this.reed);else o.type=kind;o.frequency.setValueAtTime(440*Math.pow(2,(note-69)/12),at);v.gain.setValueAtTime(0,at);v.gain.linearRampToValueAtTime(volume,at+.02);v.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(v).connect(this.gain);o.start(at);o.stop(at+duration+.02);}
 brush(at){const s=this.ctx.createBufferSource(),v=this.ctx.createGain(),f=this.ctx.createBiquadFilter();s.buffer=this.noise;f.type='bandpass';f.frequency.value=1200;f.Q.value=.7;v.gain.value=.025;s.connect(f).connect(v).connect(this.gain);s.start(at);}
 tick(level,volume=.22){const c=this.ctx;if(c.state!=='running')return;this.gain.gain.setTargetAtTime(volume,c.currentTime,.1);if(!volume){this.next=0;return;}
 const quiet=level==='temple'||level==='moon',beat=60/(quiet?112:120)/4,transpose=0;
 if(this.next<c.currentTime-.15)this.next=c.currentTime+.04;
 while(this.next<c.currentTime+.12){const bar=Math.floor(this.step/8)%32,slot=this.step%8,chord=chords[harmony[bar]],note=phrases[bar][slot],at=this.next,soft=this.round%2===1;
 if(note){let span=1;while(slot+span<8&&!phrases[bar][slot+span])span++;this.voice(note+transpose+(soft?12:0),at,beat*span*.84,soft?.055:.085,soft?'sine':'reed');}
 if(slot===0||slot===4)this.voice(chord[slot===0?0:2]+transpose,at,.27,quiet?.07:.105,'triangle');
 if(slot===2||slot===6){chord.slice(1).forEach(n=>this.voice(n+12+transpose,at,.15,.025,'triangle'));if(!quiet)this.brush(at);}
 if(soft&&slot===7&&bar%4===2)this.voice(chord[2]+24,at,.14,.025,'sine');
 this.step++;if(this.step===256){this.step=0;this.round++;}this.next+=beat;}}

}
root.CrocoMusic=Music;if(typeof module!=='undefined')module.exports={Music,phrases,chords};
})(typeof globalThis!=='undefined'?globalThis:this);
