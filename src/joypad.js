(function(root){
'use strict';
// One captured pointer owns the pad; action buttons remain independent.
class CrocoJoypad {
 constructor(){this.reset();}
 reset(){this.pointer=null;this.state={left:false,right:false,up:false,down:false};this.pending=null;this.jump=false;}
 direction(x,y,box){const dx=(x-box.left-box.width/2)/(box.width/2),dy=(y-box.top-box.height/2)/(box.height/2),ax=Math.abs(dx),ay=Math.abs(dy);if(Math.hypot(dx,dy)<.22)return {left:false,right:false,up:false,down:false};return {left:dx<0&&ax>=ay*.55,right:dx>0&&ax>=ay*.55,up:dy<0&&ay>=ax*.55,down:dy>0&&ay>=ax*.55};}
 set(next){if(next.up&&!this.state.up)this.jump=true;this.state=next;}
 start(id,x,y,box){if(this.pointer!==null)return false;this.pointer=id;this.set(this.direction(x,y,box));this.pending={...this.state};return true;}
 move(id,x,y,box){if(id!==this.pointer)return false;this.pending=null;this.set(this.direction(x,y,box));return true;}
 end(id,cancel=false){if(id!==this.pointer)return false;this.pointer=null;this.state={left:false,right:false,up:false,down:false};if(cancel){this.pending=null;this.jump=false;}return true;}
 sample(){const s=this.pointer===null&&this.pending?this.pending:this.state,result={...s,jump:this.jump};this.pending=null;this.jump=false;return result;}
}
root.CrocoJoypad=CrocoJoypad;if(typeof module!=='undefined')module.exports=CrocoJoypad;
})(typeof globalThis!=='undefined'?globalThis:this);
