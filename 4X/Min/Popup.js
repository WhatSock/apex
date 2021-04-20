/*!
ARIA Popup Module 2.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)
*/
"setPopup"in $A||($A.addWidgetProfile("Popup",{configure:function(e){return{announce:!0,isAlert:!1,exposeBounds:!0,forceFocus:!0,forceFocusWithin:!1,returnFocus:!0,exposeHiddenClose:!0,displayHiddenClose:!0,circularTabbing:!0,preload:!0,preloadImages:!0,preloadCSS:!0,className:"popup",escToClose:!0,on:"click",click:function(e,t){e.stopPropagation()},onCreate:function(e){$A.setAttr(e.trigger,"aria-expanded","false")}}},role:function(e){return{role:"region","aria-label":e.role}},afterRender:function(e,t){$A.setAttr(e.triggerNode,"aria-expanded","true")},afterRemove:function(e,t){$A.setAttr(e.triggerNode,"aria-expanded","false")}}),$A.extend({setPopup:function(e,n){if(this._4X&&(n=e,e=this._X),$A.isPlainObject(e)&&(e=(n=e).trigger||n.content||null),!e)return null;var r=[];return $A.query(e,n.context||document,function(e,t){$A.svgFix(t),r.push($A(t).toDC($A.extend({widgetType:"Popup"},n||{}))),$A.remAttr(t,["controls"])}),1===r.length?r[0]:r}}));