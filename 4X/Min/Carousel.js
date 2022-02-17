/*@license
ARIA Carousel Module 1.1 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: TinySlider.css, TinySlider.js
*/
"setCarousel"in $A||$A.import(["TinySlider.css","TinySlider"],{name:"CarouselModule",once:!0,props:props,call:function(e){$A.extend({setCarousel:function(e){var n=$A.morph(e.container),o=$A.toDC(n.parentNode),r=$A.tns(e);return o.tns=r,o}})}});