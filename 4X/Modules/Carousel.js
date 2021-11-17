/*@license
ARIA Carousel Module 1.1 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)
*/

(function() {
  if (!("setCarousel" in $A)) {
    $A.import(["TinySlider.css", "TinySlider"], {
      name: "CarouselModule",
      once: true,
      props: props,
      call: function(props) {
        $A.extend({
          setCarousel: function(config) {
            var container = $A.morph(config.container),
              dc = $A.toDC(container.parentNode),
              TS = $A.tns(config);
            dc.tns = TS;
            return dc;
          }
        });
      }
    });
  }
})();
