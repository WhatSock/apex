/*@license
ARIA Footnote Module 3.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: SmoothScroll.js
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
            $A.query(o, config.context || document, function(i, o) {
              $A(o).flowsTo($A.getAttr(o, "href"));
              $A.svgFix(o);
            });
            o = $A.setSkipLink(o, config);
            return $A._XR.call(this, o);
          }
        });
      }
    });
  }
})();
