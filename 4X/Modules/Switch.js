/*!
ARIA Switch Module 1.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setSwitch" in $A)) {
    $A.import("Button", {
      name: "SwitchModule",
      props: props,
      once: true,
      call: function(props) {
        // The Switch module is an alias of the Button module.
      }
    });
  }
})();
