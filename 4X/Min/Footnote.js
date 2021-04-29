/*@license
ARIA Footnote Module 3.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)
*/
"setFootnotes"in $A||$A.import("SmoothScroll",{name:"FootnoteModule",props:props,once:!0,call:function(t){$A.extend({setFootnotes:function(t,o){return this._4X&&(o=t,t=this._X),$A.isPlainObject(t)&&(t=(o=t).footnotes||null),t?($A.query(t,o.context||document,function(t,o){$A(o).flowsTo($A.getAttr(o,"href")),$A.svgFix(o)}),t=$A.setSkipLink(t,o),$A._XR.call(this,t)):null}})}});