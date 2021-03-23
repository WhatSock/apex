/*!
ARIA Button Module 1.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setButton" in $A)) {
    $A.import("RovingTabIndex", {
      name: "ButtonModule",
      props: props,
      once: true,
      call: function(props) {
        $A.extend({
          setButton: function(o, config) {
            if (this._4X) {
              config = o;
              o = this._X;
            }

            if ($A.isPlainObject(o)) {
              config = o;
              o = config.trigger || null;
            }

            var getState = function(
                o,
                attributeValue,
                hasAttribute,
                write,
                nodes
              ) {
                if (hasAttribute) {
                  var isRadio = $A.getAttr(o, "role") === "radio",
                    c = 0;
                  if (attributeValue === "true") c = 1;
                  else if (!isRadio && attributeValue === "mixed") c = 2;
                  else attributeValue = "false";
                  $A.data(o, "check", c);
                  if (write) {
                    if (isRadio && $A.isArray(nodes))
                      $A.setAttr(nodes, "aria-checked", "false");
                    $A.setAttr(o, "aria-checked", attributeValue);
                  }
                  return c;
                }
                var s = $A.data(o, "check");
                if (!$A.isNum(s)) return false;
                return s;
              },
              btns = [];

            $A.query(o, config.context || document, function(i, o) {
              var r =
                  ($A.isNode(o) &&
                    $A.hasAttr(o, "controls") &&
                    $A.morph($A.getAttr(o, "controls"))) ||
                  false,
                n = $A.isNative(r) ? r : $A.isNative(o) ? o : null,
                s = !$A.isNative(r) ? r : !$A.isNative(o) ? o : null;
              if ($A.isNode(s)) {
                if ($A.isNode(n) && $A.isNode(s)) $A.bindObjects(n, s);
                var radio = getState(
                    s,
                    $A.getAttr(s, "radio"),
                    $A.hasAttr(s, "radio")
                  ),
                  check = getState(
                    s,
                    $A.getAttr(s, "check"),
                    $A.hasAttr(s, "check")
                  );
                if ($A.isNum(radio)) {
                  $A.setAttr(s, {
                    role: "radio",
                    "aria-checked": radio ? "true" : "false"
                  });
                  btns.push(s);
                } else if ($A.isNum(check)) {
                  var c = "false";
                  if (check === 1) c = "true";
                  else if (check === 2) c = "mixed";
                  $A.setAttr(s, {
                    role: "checkbox",
                    "aria-checked": c
                  });
                } else {
                  $A.setKBA11Y(btns, "button", function(ev) {});
                }
                if (radio !== false || check !== false) {
                  $A(s).on(
                    "attributeChange",
                    function(
                      MutationObject,
                      o,
                      attributeName,
                      attributeValue,
                      attributePriorValue,
                      DC,
                      SavedData
                    ) {
                      getState(o, attributeValue, true);
                    },
                    {
                      attributeFilter: ["aria-checked"]
                    }
                  );
                }
                $A.svgFix(s);
                if ($A.isNode(n) && n.disabled)
                  $A.setAttr(s, "aria-disabled", "true");
                $A.updateDisabled(s);
              }
            });

            return $A._XR.call(this, o);
          }
        });
      }
    });
  }
})();
