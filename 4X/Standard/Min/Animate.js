/*@license
Animate Module 1.2 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: Velocity.js, VelocityUI.js
*/
$A.extend({hide:function(n,i,t,l){return this._4X&&(l=t,t=i,i=n,n=this._X),n=$A.morph(n),$A.isFn(t)&&(l=t,t=null),$A.isFn(i)&&(l=i,t=i=null),$A.isNode(n)&&window.Velocity(n,i||"transition.fadeOut",$A.extend({complete:function(){$A.isFn(l)&&l.call(n,n)}},t||{})),$A._XR.call(this,n)},show:function(n,i,t,l){return this._4X&&(l=t,t=i,i=n,n=this._X),n=$A.morph(n),$A.isFn(t)&&(l=t,t=null),$A.isFn(i)&&(l=i,t=i=null),$A.isNode(n)&&window.Velocity(n,i||"transition.fadeIn",$A.extend({complete:function(){$A.isFn(l)&&l.call(n,n)}},t||{})),$A._XR.call(this,n)}});