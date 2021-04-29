/*@license
ARIA Radio Module 1.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)
*/

(function() {
  if (!("setRadio" in $A)) {
    $A.import("Button", {
      name: "RadioModule",
      props: props,
      once: true,
      call: function(props) {
        // The Radio module is an alias of the Button module.
      }
    });
  }
})();
