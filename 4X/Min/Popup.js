/*!
ARIA Popup Module 2.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/
"setPopup"in $A||($A.addWidgetProfile("Popup",{configure:function(e){return{announce:!0,isAlert:!1,exposeBounds:!0,forceFocus:!0,forceFocusWithin:!1,returnFocus:!0,exposeHiddenClose:!0,displayHiddenClose:!0,circularTabbing:!0,preload:!0,preloadImages:!0,preloadCSS:!0,className:"popup",escToClose:!0,on:"click",click:function(e,t){e.stopPropagation()},onCreate:function(e){$A.setAttr(e.trigger,"aria-expanded","false")}}},role:function(e){return{role:"region","aria-label":e.role}},afterRender:function(e,t){$A.setAttr(e.triggerNode,"aria-expanded","true")},afterRemove:function(e,t){$A.setAttr(e.triggerNode,"aria-expanded","false")}}),$A.extend({setPopup:function(e,n){if(this._4X&&(n=e,e=this._X),$A.isPlainObject(e)&&(e=(n=e).trigger||n.content||null),!e)return null;var o=[];return $A.query(e,n.context||document,function(e,t){$A.svgFix(t),o.push($A(t).toDC($A.extend({widgetType:"Popup"},n||{})))}),1===o.length?o[0]:o}}));