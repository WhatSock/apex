/*@license
Animate Module 1.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: Velocity.js, VelocityUI.js
*/
$A.extend({hide:function(n,t,i,e){return this._4X&&(e=i,i=t,t=n,n=this._X),n=$A.morph(n),$A.isFn(i)&&(e=i,i=null),$A.isNode(n)&&Velocity(n,t||"transition.fadeOut",$A.extend({complete:function(){$A.isFn(e)&&e.call(n,n)}},i||{})),$A._XR.call(this,n)},show:function(n,t,i,e){return this._4X&&(e=i,i=t,t=n,n=this._X),n=$A.morph(n),$A.isFn(i)&&(e=i,i=null),$A.isNode(n)&&Velocity(n,t||"transition.fadeIn",$A.extend({complete:function(){$A.isFn(e)&&e.call(n,n)}},i||{})),$A._XR.call(this,n)}});