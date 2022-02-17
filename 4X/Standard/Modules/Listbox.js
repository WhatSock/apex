/*@license
ARIA Listbox Module 3.1 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: RovingTabIndex.js
  */

(function() {
  if (!("setListbox" in $A)) {
    var isIE = $A.isIE();

    $A.addWidgetProfile("Listbox", {
      configure: function(dc) {
        return {
          preload: true,
          preloadImages: true,
          preloadCSS: true,
          className: "aria-listbox",
          storeData: true
        };
      },
      afterRender: function(dc) {
        dc.update();
        $A.loop(
          dc.RTI.nodes,
          function(i, o) {
            dc.getState(
              o,
              $A.getAttr(o, "aria-checked"),
              $A.hasAttr(o, "aria-checked"),
              false,
              dc.RTI.nodes
            );
          },
          "array"
        );
      }
    });

    $A.extend({
      setListbox: function(o, config) {
        if (this._4X) {
          config = o;
          o = this._X;
        }

        if ($A.isPlainObject(o)) {
          config = o;
          o = config.select || config.listbox || null;
        }
        config = config || {};

        var tag = $A.extend(
            true,
            {
              parent: "ul",
              child: "button",
              parse: function(ref) {
                return ref.querySelectorAll(tag.child);
              },
              build: {
                parent: '<ul class="aria-listbox"></ul>',
                child:
                  '<li><button class="option"><span class="lbl">{OPTION-TEXT}</span></button></li>'
              }
            },
            config.tag || {}
          ),
          getState = function(o, attributeValue, hasAttribute, write, nodes) {
            if (hasAttribute) {
              var c = 0;
              if (attributeValue === "true") c = 1;
              else if (attributeValue === "mixed") c = 2;
              else attributeValue = "false";
              $A.data(o, "check", c);
              if (write) {
                $A.setAttr(o, "aria-checked", attributeValue);
              }
              return c;
            } else {
              var s = $A.data(o, "check");
              if ($A.isNum(s)) return s;
            }
            return false;
          },
          genListbox = function(ref) {
            if (!$A.isNode(ref)) return;
            if (!ref.id) ref.id = $A.genId();

            $A.svgFix(ref);

            DC = $A.toDC(
              $A.extend(
                {
                  content: ref,
                  trigger: init.select,
                  on: {},
                  widgetType: "Listbox",
                  toggleHide: true,
                  getState: getState
                },
                config
              )
            );

            init.update();
          },
          DC = null,
          init = {
            update: function() {
              init.optionNodes = init.select.nodeType
                ? init.select.querySelectorAll("option")
                : [];
              init.options = [];
              if (init.select.nodeType) {
                $A.empty(init.listbox);
                $A.loop(
                  init.optionNodes,
                  function(i, o) {
                    var name = $A.getText(o),
                      c = tag.build.child.replace("{OPTION-TEXT}", name);
                    c = $A.toNode(c, true);
                    var a = c.querySelector(tag.child);
                    if ($A.isNode(a)) {
                      $A.bindObjects(a, o);
                      init.options.push(a);
                      $A.append(c, init.listbox);
                    }
                  },
                  "array"
                );
                $A.on(init.select, "change", function(ev) {
                  var ix = -1;
                  $A.loop(
                    init.optionNodes,
                    function(i, o) {
                      init.toggleSelect(
                        $A.boundTo(o),
                        o.selected ? true : false,
                        false,
                        init.multiple,
                        true
                      );
                      if (ix < 0 && o.selected) ix = i;
                    },
                    "array"
                  );
                  DC.RTI.activate(ix >= 0 ? ix : 0);
                });
              } else init.options = tag.parse(init.listbox);
              $A.loop(
                init.options,
                function(i, o) {
                  var check = getState(
                      o,
                      $A.getAttr(o, "data-check"),
                      init.checkable || $A.hasAttr(o, "data-check")
                    ),
                    n =
                      ($A.hasAttr(o, "data-controls") &&
                        $A.morph($A.getAttr(o, "data-controls"))) ||
                      ($A.isFn(o.querySelector) && o.querySelector("input")) ||
                      false;
                  if (check !== false) {
                    if ($A.isNode(n)) {
                      if (!$A.hasBound(o)) $A.bindObjects(n, o);
                      if (n.checked) check = 1;
                      else if (check) n.checked = true;
                    }
                    var c = "false";
                    if (check === 1) c = "true";
                    else if (check === 2) c = "mixed";
                    $A.setAttr(o, {
                      "aria-checked": c
                    });
                  }
                  var select =
                    $A.hasAttr(o, "data-select") ||
                    ($A.isNode($A.boundTo(o)) && $A.boundTo(o).selected);
                  $A.setAttr(o, "aria-selected", select ? "true" : "false");
                  $A.data(o, "_Selected", select);
                  $A.closest(o, function(o) {
                    if (o === init.listbox) return true;
                    $A.setAttr(o, "role", "presentation");
                  });
                  $A.on(
                    o,
                    "attributeChange",
                    function(
                      MutationObject,
                      o,
                      attributeName,
                      attributeValue,
                      attributePriorValue,
                      boundNode,
                      SavedData
                    ) {
                      if (attributeName === "aria-checked") {
                        if ($A.isNode(n)) {
                          var check = getState(o, attributeValue, true);
                          n.checked = check ? true : false;
                        }
                      } else if (attributeName === "aria-selected") {
                        $A.data(o, "_Selected", attributeValue === "true");
                        if (
                          boundNode &&
                          $A.data(o, "_Selected") !==
                            (boundNode.selected ? true : false)
                        ) {
                          boundNode.selected = $A.data(o, "_Selected");
                        }
                      }
                    },
                    {
                      attributeFilter: ["aria-checked", "aria-selected"]
                    }
                  );
                },
                "array"
              );
              $A.updateDisabled(init.options);
              init.setFlags();
              init.setListbox();
              init.setRoles();
              init.setEvents();
              init.setSelected();
            },
            setFlags: function() {
              var select = init.select.nodeType ? init.select : config;
              init.multiple = select.multiple
                ? true
                : !init.select.nodeType &&
                  init.listbox &&
                  (config.multiselect ||
                    $A.getAttr(init.listbox, "aria-multiselectable") ===
                      "true");
              init.required = select.required ? true : false;
              init.disabled = select.disabled ? true : false;
              init.checkable = config.checkable ? true : false;
              init.sortable = config.sortable ? true : false;
              if (init.sortable) init.multiple = init.checkable = false;
              if (init.checkable) init.multiple = false;
            },
            setListbox: function() {
              if (init.multiple)
                $A.setAttr(init.listbox, "aria-multiselectable", "true");
              if (init.required)
                $A.setAttr(init.listbox, "aria-required", "true");
              if (init.disabled)
                $A.setAttr(init.listbox, "aria-disabled", "true");
              var hiddenName = "";
              if (init.select.nodeType && $A.isHidden(init.select)) {
                var tmp = init.select.cloneNode();
                tmp.hidden = false;
                hiddenName =
                  $A.isFn(window.getAccName) && window.getAccName(tmp).name;
              }
              $A.setAttr(
                init.listbox,
                "aria-label",
                config.label ||
                  hiddenName ||
                  (init.select.nodeType
                    ? $A.isFn(window.getAccName)
                      ? window.getAccName(init.select).name
                      : ""
                    : "")
              );
            },
            setRoles: function() {
              $A.remAttr(
                init.listbox.querySelectorAll(
                  '*[role="listbox"], *[role="option"]'
                ),
                "role"
              );
              $A.setAttr(init.listbox, "role", "listbox");
              $A.setAttr(init.options, "role", "option");
              init.setGrab();
            },
            setSelected: function() {
              if (init.select.nodeType) {
                $A.loop(
                  init.optionNodes,
                  function(i, o) {
                    init.toggleSelect(
                      $A.boundTo(o),
                      o.selected ? true : false,
                      false,
                      init.multiple,
                      true
                    );
                  },
                  "array"
                );
              }
            },
            setEvents: function() {
              if (DC.RTI) DC.RTI.off();
              if (DC.disabled) return;
              var x = 0,
                n = init.listbox.querySelector(
                  '*[role="option"][aria-selected="true"]'
                );
              if ($A.isNode(n)) x = $A.inArray(n, init.options) || 0;
              DC.RTI = new $A.RovingTabIndex(
                $A.extend(
                  {
                    container: init.listbox,
                    nodes: init.options,
                    orientation: $A.isNum(config.orientation)
                      ? config.orientation
                      : 2,
                    autoSwitch:
                      [].indexOf(config.autoSwitch) !== -1
                        ? config.autoSwitch
                        : "off",
                    autoLoop: false,
                    startIndex: x,
                    DC: DC,

                    onShiftUp: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      if (init.multiple) {
                        init.toggleSelect(option, true);
                      }
                      ev.preventDefault();
                    },
                    onShiftDown: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      if (init.multiple) {
                        init.toggleSelect(option, true);
                      }
                      ev.preventDefault();
                    },

                    onCtrlShiftUp: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      RTI["onShiftUp"].call(
                        this,
                        ev,
                        option,
                        RTI,
                        DC,
                        arrowKeyCode,
                        isTop,
                        isBottom
                      );
                      ev.preventDefault();
                    },
                    onCtrlShiftDown: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      RTI["onShiftDown"].call(
                        this,
                        ev,
                        option,
                        RTI,
                        DC,
                        arrowKeyCode,
                        isTop,
                        isBottom
                      );
                      ev.preventDefault();
                    },

                    onShiftEnd: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      if (init.multiple) {
                        var s = init.options.slice(RTI.index);
                        $A.loop(
                          s,
                          function(i, o) {
                            init.toggleSelect(o, true);
                          },
                          "array"
                        );
                      }
                      ev.preventDefault();
                    },
                    onShiftHome: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      if (init.multiple) {
                        var s = init.options.slice(0, RTI.index + 1);
                        $A.loop(
                          s,
                          function(i, o) {
                            init.toggleSelect(o, true);
                          },
                          "array"
                        );
                      }
                      ev.preventDefault();
                    },

                    onCtrlShiftEnd: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      RTI["onShiftEnd"].call(
                        this,
                        ev,
                        option,
                        RTI,
                        DC,
                        arrowKeyCode,
                        isTop,
                        isBottom
                      );
                      ev.preventDefault();
                    },
                    onCtrlShiftHome: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      RTI["onShiftHome"].call(
                        this,
                        ev,
                        option,
                        RTI,
                        DC,
                        arrowKeyCode,
                        isTop,
                        isBottom
                      );
                      ev.preventDefault();
                    },

                    onPageUp: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      var d = Math.round(init.options.length * 0.1);
                      if (!d) d = 1;
                      var i = init.index - d;
                      if (i < 0) i = 0;
                      RTI.focus(i);
                      ev.preventDefault();
                    },
                    onPageDown: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      var d = Math.round(init.options.length * 0.1);
                      if (!d) d = 1;
                      var i = init.index + d;
                      if (i >= init.options.length) i = init.options.length - 1;
                      RTI.focus(i);
                      ev.preventDefault();
                    },

                    onSpace: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      if (init.sortable) init.toggleGrab(option);
                      else RTI.onClick.apply(option, arguments);
                      if (isIE) {
                        setTimeout(function() {
                          $A.announce($A.getAttr(option, "aria-description"));
                        }, 1);
                      }
                      ev.preventDefault();
                    },
                    onCtrlSpace: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      if (init.sortable) init.toggleGrab(option);
                      else RTI.onClick.apply(option, arguments);
                      if (isIE) {
                        setTimeout(function() {
                          $A.announce($A.getAttr(option, "aria-description"));
                        }, 1);
                      }
                      ev.preventDefault();
                    },
                    onCtrlShiftSpace: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      $A.loop(
                        init.options,
                        function(i, o) {
                          init.toggleSelect(o, false);
                        },
                        "array"
                      );
                      if (init.checkable) init.check(init.options, "false");
                      if (init.sortable) {
                        init.toggleGrab.grabbed = undefined;
                        init.setGrab();
                      }
                      if (isIE) {
                        setTimeout(function() {
                          $A.announce($A.getAttr(option, "aria-description"));
                        }, 1);
                      }
                      ev.preventDefault();
                    },

                    onEsc: function(ev, option, RTI, DC) {
                      if (init.sortable) {
                        init.toggleGrab.grabbed = undefined;
                        init.setGrab();
                      }
                      if (isIE) {
                        setTimeout(function() {
                          $A.announce($A.getAttr(option, "aria-description"));
                        }, 1);
                      }
                      ev.preventDefault();
                    },

                    onFocus: function(ev, option, RTI, DC) {
                      init.index = RTI.index;
                      if (!init.multiple) init.toggleSelect(option, true);
                      if (isIE) {
                        setTimeout(function() {
                          $A.announce($A.getAttr(option, "aria-description"));
                        }, 1);
                      }
                      ev.stopPropagation();
                    },

                    onClick: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      var that = option,
                        isDisabled = $A.isDisabled(that),
                        check = getState(that);
                      if (!$A.isNum(check) && init.multiple)
                        check = $A.getAttr(that, "aria-selected") === "true";
                      if (!isDisabled && init.sortable) init.toggleGrab(that);
                      if (!isDisabled && $A.isFn(config.onActivate)) {
                        config.onActivate.apply(that, [
                          ev,
                          option,
                          RTI,
                          DC || $A.boundTo(that),
                          check,
                          function(attributeValue) {
                            if ($A.hasAttr(option, "aria-checked"))
                              getState(
                                option,
                                attributeValue,
                                true,
                                true,
                                RTI.nodes
                              );
                            else if (attributeValue)
                              $A.setAttr(
                                option,
                                "aria-selected",
                                attributeValue === "true" ? "true" : "false"
                              );
                          }
                        ]);
                      }
                      ev.preventDefault();
                    },

                    onSelectAll: function(
                      ev,
                      option,
                      RTI,
                      DC,
                      arrowKeyCode,
                      isTop,
                      isBottom
                    ) {
                      if (init.multiple) {
                        $A.loop(
                          init.options,
                          function(i, o) {
                            init.toggleSelect(o, true);
                          },
                          "array"
                        );
                      }
                      ev.preventDefault();
                    }
                  },
                  config.extendRTI || {}
                )
              );

              $A(init.listbox)
                .setAttr("tabindex", "0")
                .on("focus click", function(ev) {
                  if (init.options.length) {
                    if (!$A.isTouch) DC.RTI.focus();
                    $A.setAttr(init.listbox, "tabindex", "-1");
                  }
                });
            },
            toggleClassName: "selected",
            selectText: "Selected",
            unselectText: "Not Selected",
            toggleSelect: function(o, state, skip, recur, fromOption) {
              if (!recur && !init.multiple) {
                $A.loop(
                  init.listbox.querySelectorAll(
                    '*[role="option"][aria-selected="true"]'
                  ),
                  function(i, O) {
                    if (O !== o) init.toggleSelect(O, false, false, true);
                  },
                  "array"
                );
              }
              if (!$A.isBool(state))
                state = $A.data(o, "_Selected") ? false : true;
              $A.data(o, "_Selected", state);
              if (fromOption) {
                DC.RTI.activate(o);
              }
              $A.setAttr(o, "aria-selected", state ? "true" : "false");
              $A.toggleClass(o, init.toggleClassName, state, function(
                state
              ) {});
            },
            grabText: "Grabbable",
            grabbedText: "Grabbed",
            dropText: "Droppable",
            setGrab: function(skip) {
              if (init.sortable) {
                $A.remAttr(init.options, [
                  "aria-grabbed",
                  "aria-dropeffect",
                  "aria-description"
                ]);
                if (!skip)
                  $A.setAttr(init.options, {
                    "aria-grabbed": "false"
                  });
                if (isIE)
                  $A.setAttr(init.options, {
                    "aria-description": init.grabText
                  });
              }
            },
            toggleGrab: function(o) {
              if (init.sortable) {
                init.setGrab(true);
                if (!init.toggleGrab.grabbed) {
                  init.toggleGrab.grabbed = o;
                  $A.loop(
                    init.options,
                    function(i, n) {
                      var a = {};
                      if (n === o) {
                        a["aria-grabbed"] = "true";
                        if (isIE) a["aria-description"] = init.grabbedText;
                      } else {
                        a["aria-dropeffect"] = "move";
                        if (isIE) a["aria-description"] = init.dropText;
                      }
                      $A.setAttr(n, a);
                    },
                    "array"
                  );
                } else {
                  var x = $A.inArray(o, DC.RTI.nodes) || 0;
                  if (init.select.nodeType)
                    $A.before(
                      $A.boundTo(init.toggleGrab.grabbed),
                      $A.boundTo(o)
                    );
                  else $A.before(init.toggleGrab.grabbed, o);
                  init.update();
                  DC.RTI.focus(init.select.nodeType ? x : o);
                  init.toggleGrab.grabbed = undefined;
                }
              }
            },
            check: function(o, v) {
              getState(o, v, true, true, DC.RTI.nodes);
            },
            value: function(o) {
              var checked = init.listbox.querySelectorAll(
                '*[role="option"][aria-checked="true"]'
              );
              if (checked && checked.length) return checked;
              else if (init.select.nodeType) {
                if ($A.isNode(o)) return $A.getAttr($A.boundTo(o), "value");
                else return init.select.value;
              } else
                return init.listbox.querySelectorAll(
                  '*[role="option"][aria-selected="true"]'
                );
            }
          };
        o = $A.morph(o);

        var gen = function(o) {
          if ($A.isNative(o)) init.select = o;
          else if (config.select && $A.isNative($A.morph(config.select)))
            init.select = $A.morph(config.select);
          else init.select = { nodeType: false };
          config.select = init.select;
          var ref = $A.getAttr(init.select, "data-controls");
          if (ref && $A.isNode($A.morph(ref))) init.listbox = $A.morph(ref);
          else if (!$A.isNative(o)) init.listbox = o;
          else if (config.listbox && $A.morph(config.listbox))
            init.listbox = $A.morph(config.listbox);
          else init.listbox = $A.morph(tag.build.parent);
          config.listbox = init.listbox;
          if ($A.isNode(init.select) && !$A.isWithin(init.listbox))
            $A(init.listbox).before(init.select);
          init = $A.extend(init, config);
          config = $A.extend(config, init);
          genListbox(init.listbox);
        };

        var p = config.fetch && config.fetch.url,
          s =
            (config.fetch && config.fetch.data && config.fetch.data.selector) ||
            $A.getSelectorFromURI(p),
          isP = s && $A.isPath(p) ? true : false;
        config.fetch = null;
        if (isP) {
          $A.load(
            p,
            config.root,
            {
              selector: s
            },
            function(c) {
              gen(c);
            }
          );
        } else gen(o);

        return $A._XR.call(this, DC);
      }
    });
  }
})();
