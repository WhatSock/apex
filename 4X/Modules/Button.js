/*!
ARIA Button Module 1.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)
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
                  var role = $A.getAttr(o, "role"),
                    isRadio = role === "radio",
                    isSwitch = role === "switch",
                    isToggle = $A.hasAttr(o, "aria-pressed"),
                    c = 0;
                  if (attributeValue === "true") c = 1;
                  else if (
                    !isRadio &&
                    !isToggle &&
                    !isSwitch &&
                    attributeValue === "mixed"
                  )
                    c = 2;
                  else attributeValue = "false";
                  $A.data(o, "check", c);
                  if (write) {
                    if (isRadio && $A.isArray(nodes))
                      $A.loop(
                        nodes,
                        function(i, n) {
                          if (n !== o) $A.setAttr(n, "aria-checked", "false");
                        },
                        "array"
                      );
                    $A.setAttr(
                      o,
                      isToggle ? "aria-pressed" : "aria-checked",
                      attributeValue
                    );
                    if (attributeValue === "mixed") {
                      $A.remClass(
                        o,
                        config.toggleClassName || "pressed checked"
                      );
                      $A.toggleClass(
                        o,
                        config.partialClassName || "partially-checked",
                        true
                      );
                    } else {
                      $A.remClass(
                        o,
                        config.partialClassName || "partially-checked"
                      );
                      $A.toggleClass(
                        o,
                        config.toggleClassName ||
                          (isToggle ? "pressed" : "checked"),
                        attributeValue === "true"
                      );
                    }
                  }
                  return c;
                }
                return false;
              },
              btns = [];

            $A.query(o, config.context || document, function(i, o) {
              var r =
                  ($A.isNode(o) &&
                    (($A.hasAttr(o, "controls") &&
                      $A.morph($A.getAttr(o, "controls"))) ||
                      ($A.isFn(o.querySelector) &&
                        o.querySelector("input")))) ||
                  false,
                n = $A.isNative(r) ? r : $A.isNative(o) ? o : null,
                s =
                  $A.isNode(r) && !$A.isNative(r)
                    ? r
                    : !$A.isNative(o)
                    ? o
                    : null,
                x = !$A.isNode(n) && $A.isNode(r) && s !== o ? r : null;
              if (x === s) s = o;
              $A.remAttr([o, s, n, x], "controls");
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
                  ),
                  press = getState(
                    s,
                    $A.getAttr(s, "toggle"),
                    $A.hasAttr(s, "toggle")
                  ),
                  swich = getState(
                    s,
                    $A.getAttr(s, "switch"),
                    $A.hasAttr(s, "switch")
                  ),
                  isRequired = $A.hasAttr(s, "required"),
                  isDisabled = $A.hasAttr(s, "disabled");
                $A.remAttr(s, ["disabled", "required"]);
                if ($A.isNum(radio)) {
                  $A.setAttr(s, {
                    role: "radio",
                    "aria-checked": radio ? "true" : "false"
                  });
                  btns.push(s);
                } else if ($A.isNum(check) || $A.isNum(swich)) {
                  if ($A.isNode(n) && n.checked) check = 1;
                  if ($A.isNode(x)) {
                    if (!x.id) x.id = $A.genId();
                    $A.setAttr(s, {
                      "aria-flowto": x.id,
                      "aria-controls": x.id
                    });
                  }
                  var c = "false";
                  if (check === 1) c = "true";
                  else if (!$A.isNum(swich) && check === 2) c = "mixed";
                  $A.setKBA11Y(
                    s,
                    $A.isNum(swich) ? "switch" : "checkbox",
                    function(ev, dc) {
                      var o = this,
                        isDisabled = $A.isDisabled(o),
                        check = getState(
                          o,
                          $A.getAttr(o, "aria-checked"),
                          $A.hasAttr(o, "aria-checked")
                        );
                      if (!isDisabled && $A.isFn(config.onActivate))
                        config.onActivate.apply(o, [
                          ev,
                          o,
                          dc || n,
                          check,
                          function(attributeValue) {
                            getState(o, attributeValue, true, true);
                          }
                        ]);
                    }
                  );
                  $A.setAttr(s, {
                    "aria-checked": c
                  });
                } else {
                  if (press !== false) {
                    $A.setAttr(s, "aria-pressed", press ? "true" : "false");
                    if ($A.isNode(x)) {
                      if (!x.id) x.id = $A.genId();
                      $A.setAttr(s, {
                        "aria-flowto": x.id,
                        "aria-controls": x.id
                      });
                    }
                  }
                  $A.setKBA11Y(s, "button", function(ev, dc) {
                    var o = this,
                      isDisabled = $A.isDisabled(o),
                      press = getState(
                        o,
                        $A.getAttr(o, "aria-pressed"),
                        $A.hasAttr(o, "aria-pressed")
                      ),
                      args =
                        press !== false
                          ? [
                              ev,
                              o,
                              dc || x,
                              press,
                              function(attributeValue) {
                                getState(o, attributeValue, true, true);
                              }
                            ]
                          : [ev, o, dc || x];
                    if (!isDisabled && $A.isFn(config.onActivate))
                      config.onActivate.apply(o, args);
                  });
                }
                if (
                  radio !== false ||
                  check !== false ||
                  press !== false ||
                  swich !== false
                ) {
                  $A.on(
                    s,
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
                      if ($A.isNode(n)) {
                        var check = getState(o, attributeValue, true);
                        n.checked = check ? true : false;
                      }
                    },
                    {
                      attributeFilter: ["aria-checked", "aria-pressed"]
                    }
                  );
                }
                $A.svgFix(s);
                if (config.label) $A.setAttr(s, "aria-label", config.label);
                if (
                  ($A.isNode(n) && n.required) ||
                  config.required ||
                  isRequired
                ) {
                  $A.setAttr(s, "aria-required", "true");
                  if ($A.isNode(n) && !n.required) n.required = true;
                }
                if (
                  ($A.isNode(n) && n.disabled) ||
                  config.disabled ||
                  isDisabled
                ) {
                  $A.setAttr(s, "aria-disabled", "true");
                  if ($A.isNode(n) && !n.disabled) n.disabled = true;
                }
                $A.updateDisabled(s);
              }
              $A.remAttr([o, s, n, x], ["check", "radio", "switch", "toggle"]);
            });

            if (btns.length) {
              var container =
                (config.container && $A.morph(config.container)) ||
                $A.closest(btns[0], function(n) {
                  if ($A.getAttr(n, "role") === "radiogroup") return true;
                });

              if (!$A.isNode(container)) {
                (function(triggers) {
                  var f = [],
                    l = [];
                  $A.closest(triggers[0], function(n) {
                    if ($A.isNode(n)) f.push(n);
                    if (n === document.body) return true;
                  });
                  $A.closest(triggers[triggers.length - 1], function(n) {
                    if ($A.isNode(n)) l.push(n);
                    if (n === document.body) return true;
                  });
                  f = f.reverse();
                  l = l.reverse();
                  var c = null;
                  for (var i = 0; i < f.length; i++) {
                    if (f[i] === l[i]) c = f[i];
                    else if (f[i] !== l[i]) break;
                  }
                  container = c;
                })(btns);
              }
              $A.setAttr(container, "role", "radiogroup");

              var RTI = new $A.RovingTabIndex(
                $A.extend(
                  {
                    nodes: btns,
                    startIndex: 0,
                    orientation: 0,
                    autoLoop: true,
                    onClick: function(ev, radio, RTI, nativeInput) {
                      var o = radio,
                        isDisabled = $A.isDisabled(o),
                        check = getState(
                          o,
                          $A.getAttr(o, "aria-checked"),
                          $A.hasAttr(o, "aria-checked")
                        );
                      if (!isDisabled && $A.isFn(config.onActivate))
                        config.onActivate.apply(o, [
                          ev,
                          o,
                          nativeInput,
                          check,
                          function(attributeValue) {
                            getState(o, attributeValue, true, true, RTI.nodes);
                          }
                        ]);
                    },
                    onSpace: function(ev, radio, RTI, nativeInput) {
                      RTI.onClick.apply(radio, arguments);
                    },
                    onFocus: function(ev, radio, RTI, nativeInput) {
                      if (RTI.arrowPressed && !$A.isTouch)
                        RTI.onClick.apply(radio, arguments);
                    }
                  },
                  config.extendRTI || {}
                )
              );
            }

            return $A._XR.call(this, o);
          }
        });

        // Set related module aliases
        $A.extend({
          setCheckbox: $A["setButton"],
          setRadio: $A["setButton"],
          setSwitch: $A["setButton"]
        });
      }
    });
  }
})();
