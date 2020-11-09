/*!
ARIA Footnote Module 3.0 for Apex 4X
Copyright 2020 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setFootnotes" in $A)) {
    $A.import("SmoothScroll", {
      name: "FootnoteModule",
      props: props,
      once: true,
      call: function(props) {
        $A.extend({
          setFootnotes: function(config) {
            if (!$A.isPlainObject(config) || !config.footnotes) return null;
            return $A.setSkipLink(config.footnotes, config);
          }
        });
      }
    });
  }
})();
