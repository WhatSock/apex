/*!
ARIA Footnote Module 3.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
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
          setFootnotes: function(o, config) {
            if (this._4X) {
              config = o;
              o = this._X;
            }
            if ($A.isPlainObject(o)) {
              config = o;
              o = config.footnotes || null;
            }
            if (!o) return null;
            o = $A.setSkipLink(o, config);
            if (this._4X) {
              this._X = o;
              return this;
            } else return o;
          }
        });
      }
    });
  }
})();
