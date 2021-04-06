/*!
ARIA Footnote Module 3.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/
"setFootnotes"in $A||$A.import("SmoothScroll",{name:"FootnoteModule",props:props,once:!0,call:function(o){$A.extend({setFootnotes:function(o,t){return this._4X&&(t=o,o=this._X),$A.isPlainObject(o)&&(o=(t=o).footnotes||null),o?($A.query(o,t.context||document,function(o,t){$A.svgFix(t)}),o=$A.setSkipLink(o,t),$A._XR.call(this,o)):null}})}});