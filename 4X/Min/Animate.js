/*@license
Animate Module 1.1 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: Velocity.js, VelocityUI.js
*/
$A.import(["Velocity","VelocityUI"],{name:"AnimateModule",once:!0,props:props,call:function(n){$A.extend({hide:function(n,i,t,e){return this._4X&&(e=t,t=i,i=n,n=this._X),n=$A.morph(n),$A.isFn(t)&&(e=t,t=null),$A.isFn(i)&&(e=i,t=i=null),$A.isNode(n)&&Velocity(n,i||"transition.fadeOut",$A.extend({complete:function(){$A.isFn(e)&&e.call(n,n)}},t||{})),$A._XR.call(this,n)},show:function(n,i,t,e){return this._4X&&(e=t,t=i,i=n,n=this._X),n=$A.morph(n),$A.isFn(t)&&(e=t,t=null),$A.isFn(i)&&(e=i,t=i=null),$A.isNode(n)&&Velocity(n,i||"transition.fadeIn",$A.extend({complete:function(){$A.isFn(e)&&e.call(n,n)}},t||{})),$A._XR.call(this,n)}})}});