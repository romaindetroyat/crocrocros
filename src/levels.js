(function(root){
'use strict';
// Author levels in content/campaign.json. The build embeds that pack here.
const data=(typeof module!=='undefined'&&module.exports)?require('../content/campaign.json'):/*__CAMPAIGN__*/null;
root.CROCO_DATA=data;
if(typeof module!=='undefined')module.exports=data;
})(typeof globalThis!=='undefined'?globalThis:this);
