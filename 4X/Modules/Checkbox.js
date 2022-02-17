/*@license
ARIA Checkbox Module 1.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: Button.js
*/

(function() {
  if (!("setCheckbox" in $A)) {
    $A.import("Button", {
      name: "CheckboxModule",
      props: props,
      once: true,
      call: function(props) {
        // The Checkbox module is an alias of the Button module.
      }
    });
  }
})();
