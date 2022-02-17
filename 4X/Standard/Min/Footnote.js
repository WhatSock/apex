/*@license
ARIA Footnote Module 3.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: SmoothScroll.js
*/
"setFootnotes"in $A||$A.extend({setFootnotes:function(t,n){return this._4X&&(n=t,t=this._X),$A.isPlainObject(t)&&(t=(n=t).footnotes||null),t?($A.query(t,n.context||document,function(t,n){$A(n).flowsTo($A.getAttr(n,"href")),$A.svgFix(n)}),t=$A.setSkipLink(t,n),$A._XR.call(this,t)):null}});