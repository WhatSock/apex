/*!
ARIA Listbox Module 3.0 for Apex 4X
Copyright 2020 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
	*/

(function() {
  if (!("Listbox" in $A)) {
    $A.import("RovingTabIndex", {
      name: "ListBoxModule",
      props: props,
      once: true,
      call: function(props) {
        $A.extend({
          Listbox: function(config) {
            var config = config || {},
              that = this;

            that.grabText = config.grabText || "Grabbable";
            that.grabbedText = config.grabbedText || "Grabbed";
            that.dropText = config.dropText || "Droppable";

            that.selectText = config.selectText || "Selected";
            that.unselectText = config.unselectText || "Not Selected";

            that.parentTag =
              config.parentTag || '<ul class="aria-listbox"></ul>';
            that.childTag =
              config.childTag ||
              '<li role="none"><a href="#"><span class="lbl">{OPTION-TEXT}</span></a></li>';
            that.activeElementSelector =
              config.activeElementSelector || "a[href]";
            that.toggleClass = config.toggleClass || "selected";

            that.update = function() {
              that.optionNodes = that.select.nodeType
                ? that.select.querySelectorAll("option")
                : [];
              that.options = [];
              if (that.select.nodeType) {
                $A.empty(that.listbox);
                $A.loop(
                  that.optionNodes,
                  function(i, o) {
                    var name = $A.getText(o),
                      c = that.childTag.replace("{OPTION-TEXT}", name);
                    c = $A.toNode(c, true);
                    var a = c.querySelector(that.activeElementSelector);
                    $A.data(a, "_Index", i);
                    $A.bindObjects(a, o);
                    that.options.push(a);
                    $A.append(c, that.listbox);
                  },
                  "array"
                );
              } else {
                that.options = that.listbox.querySelectorAll(
                  that.activeElementSelector
                );
                $A.loop(
                  that.options,
                  function(i, o) {
                    $A.data(o, "_Index", i);
                  },
                  "array"
                );
              }
              that.setFlags();
              that.setListbox();
              that.setRoles();
              that.setEvents();
              that.setSelected();
            };

            that.setRoles = function() {
              $A.remAttr(
                that.listbox.querySelectorAll(
                  '*[role="listbox"], *[role="option"]'
                ),
                "role"
              );
              $A.setAttr(that.listbox, "role", "listbox");
              $A.setAttr(that.options, "role", "option");
              that.check(that.options);
              that.setGrab();
            };

            that.setFlags = function() {
              var select = that.select.nodeType ? that.select : config;
              that.multiple = select.multiple ? true : false;
              that.required = select.required ? true : false;
              that.disabled = select.disabled ? true : false;
              that.checkable = config.checkable ? true : false;
              that.sortable = config.sortable ? true : false;
              if (that.sortable) that.multiple = that.checkable = false;
              if (that.checkable) that.multiple = false;
            };

            that.setListbox = function() {
              if (that.multiple)
                $A.setAttr(that.listbox, "aria-multiselectable", "true");
              if (that.required)
                $A.setAttr(that.listbox, "aria-required", "true");
              if (that.disabled)
                $A.setAttr(that.listbox, "aria-disabled", "true");
              $A.setAttr(
                that.listbox,
                "aria-label",
                config.label ||
                  (that.select.nodeType
                    ? $A.getAccName
                      ? $A.getAccName(that.select).name
                      : ""
                    : "")
              );
            };

            that.setSelected = function() {
              if (that.select.nodeType) {
                $A.loop(
                  that.optionNodes,
                  function(i, o) {
                    that.toggleSelect(
                      $A.boundTo(o),
                      o.selected ? true : false,
                      false,
                      that.multiple,
                      true
                    );
                  },
                  "array"
                );
              }
            };

            that.setEvents = function() {
              if (that.RTI) that.RTI.off();
              if (that.disabled) return;
              var x = 0,
                n = that.listbox.querySelector(
                  '*[role="option"][aria-selected="true"]'
                );
              if ($A.isDOMNode(n)) x = $A.data(n, "_Index");
              that.RTI = new $A.RovingTabIndex(
                $A.extend(
                  {
                    container: that.listbox,
                    nodes: that.options,
                    orientation: $A.isNum(config.orientation)
                      ? config.orientation
                      : 2,
                    autoSwitch:
                      [].indexOf(config.autoSwitch) !== -1
                        ? config.autoSwitch
                        : "off",
                    autoLoop: false,
                    startIndex: x
                  },
                  {
                    onShiftUp: function(event, option, RTI, DC, pressed) {
                      if (that.multiple) {
                        that.toggleSelect(option, true);
                      }
                    },
                    onShiftDown: function(event, option, RTI, DC, pressed) {
                      if (that.multiple) {
                        that.toggleSelect(option, true);
                      }
                    },

                    onCtrlShiftUp: function(event, option, RTI, DC, pressed) {
                      that.RTI["onShiftUp"].call(
                        this,
                        event,
                        option,
                        RTI,
                        DC,
                        pressed
                      );
                    },
                    onCtrlShiftDown: function(event, option, RTI, DC, pressed) {
                      that.RTI["onShiftDown"].call(
                        this,
                        event,
                        option,
                        RTI,
                        DC,
                        pressed
                      );
                    },

                    onShiftEnd: function(event, option, RTI, DC, pressed) {
                      if (that.multiple) {
                        var s = that.options.slice($A.data(option, "_Index"));
                        $A.loop(
                          s,
                          function(i, o) {
                            that.toggleSelect(o, true);
                          },
                          "array"
                        );
                      }
                    },
                    onShiftHome: function(event, option, RTI, DC, pressed) {
                      if (that.multiple) {
                        var s = that.options.slice(
                          0,
                          $A.data(option, "_Index") + 1
                        );
                        $A.loop(
                          s,
                          function(i, o) {
                            that.toggleSelect(o, true);
                          },
                          "array"
                        );
                      }
                    },

                    onCtrlShiftEnd: function(event, option, RTI, DC, pressed) {
                      that.RTI["onShiftEnd"].call(
                        this,
                        event,
                        option,
                        RTI,
                        DC,
                        pressed
                      );
                    },
                    onCtrlShiftHome: function(event, option, RTI, DC, pressed) {
                      that.RTI["onShiftHome"].call(
                        this,
                        event,
                        option,
                        RTI,
                        DC,
                        pressed
                      );
                    },

                    onPageUp: function(event, option, RTI, DC, pressed) {
                      var d = Math.round(that.options.length * 0.1);
                      if (!d) d = 1;
                      var i = that.index - d;
                      if (i < 0) i = 0;
                      that.RTI.focus(i);
                    },
                    onPageDown: function(event, option, RTI, DC, pressed) {
                      var d = Math.round(that.options.length * 0.1);
                      if (!d) d = 1;
                      var i = that.index + d;
                      if (i >= that.options.length) i = that.options.length - 1;
                      that.RTI.focus(i);
                    },

                    onSpace: function(event, option, RTI, DC, pressed) {
                      that.RTI.onClick.call(
                        this,
                        event,
                        option,
                        RTI,
                        DC,
                        pressed
                      );
                      if ($A.isIE()) {
                        $A.announce($A.getAttr(option, "aria-description"));
                      }
                    },
                    onCtrlSpace: function(event, option, RTI, DC, pressed) {
                      that.toggleSelect(option);
                      if ($A.isIE()) {
                        $A.announce($A.getAttr(option, "aria-description"));
                      }
                    },
                    onCtrlShiftSpace: function(
                      event,
                      option,
                      RTI,
                      DC,
                      pressed
                    ) {
                      $A.loop(
                        that.options,
                        function(i, o) {
                          that.toggleSelect(o, false);
                        },
                        "array"
                      );
                      if (that.checkable) that.check(that.options, "false");
                      if (that.sortable) {
                        that.toggleGrab.grabbed = undefined;
                        that.setGrab();
                      }
                      if ($A.isIE()) {
                        $A.announce($A.getAttr(option, "aria-description"));
                      }
                    },

                    onEsc: function(event, option, RTI, DC) {
                      if (that.sortable) {
                        that.toggleGrab.grabbed = undefined;
                        that.setGrab();
                      }
                      if ($A.isIE()) {
                        $A.announce($A.getAttr(option, "aria-description"));
                      }
                    },

                    onFocus: function(event, option, RTI, DC) {
                      that.index = $A.data(option, "_Index");
                      if (!that.multiple) that.toggleSelect(option, true);
                      if ($A.isIE()) {
                        $A.announce($A.getAttr(option, "aria-description"));
                      }
                    },

                    onClick: function(event, option, RTI, DC, pressed) {
                      if (that.multiple) that.toggleSelect(option);
                      else if (that.sortable) that.toggleGrab(option);
                    },

                    onSelectAll: function(event, option, RTI, DC, pressed) {
                      if (that.multiple) {
                        $A.loop(
                          that.options,
                          function(i, o) {
                            that.toggleSelect(o, true);
                          },
                          "array"
                        );
                      }
                    }
                  },
                  config.handlers || {}
                )
              );
              $A(that.listbox)
                .setAttr("tabindex", "0")
                .on("focus click", function(ev) {
                  if (that.options.length) {
                    that.RTI.focus();
                    $A.setAttr(that.listbox, "tabindex", "-1");
                  }
                });
            };

            that.toggleSelect = function(o, state, skip, recur, fromOption) {
              if (!recur && !that.multiple) {
                $A.loop(
                  that.listbox.querySelectorAll(
                    '*[role="option"][aria-selected="true"]'
                  ),
                  function(i, O) {
                    if (O !== o) that.toggleSelect(O, false, false, true);
                  },
                  "array"
                );
              }
              if ($A.data(o, "_Index") >= 0) {
                if (typeof state !== "boolean")
                  state = $A.data(o, "_Selected") ? false : true;
                $A.data(o, "_Selected", state);
                if (fromOption) {
                  that.RTI.activate($A.data(o, "_Index"));
                }
                $A.setAttr(o, "aria-selected", state ? "true" : "false");
                if (that.multiple)
                  $A.setAttr(
                    o,
                    "aria-description",
                    state ? that.selectText : that.unselectText
                  );
                $A.toggleClass(o, that.toggleClass, state, function(state) {
                  if (!skip && $A.isFn(config.callback))
                    config.callback.call(o, state, o);
                });
              }
            };

            that.setGrab = function(skip) {
              if (that.sortable) {
                $A.remAttr(that.options, [
                  "aria-grabbed",
                  "aria-dropeffect",
                  "aria-description"
                ]);
                if (!skip)
                  $A.setAttr(that.options, {
                    "aria-grabbed": "false",
                    "aria-description": that.grabText
                  });
              }
            };

            that.toggleGrab = function(o) {
              if (that.sortable) {
                that.setGrab(true);
                if (!that.toggleGrab.grabbed) {
                  that.toggleGrab.grabbed = o;
                  $A.loop(
                    that.options,
                    function(i, n) {
                      var a = {};
                      if (n === o) {
                        a["aria-grabbed"] = "true";
                        a["aria-description"] = that.grabbedText;
                      } else {
                        a["aria-dropeffect"] = "move";
                        a["aria-description"] = that.dropText;
                      }
                      $A.setAttr(n, a);
                    },
                    "array"
                  );
                } else {
                  var x = $A.data(o, "_Index");
                  if (that.select.nodeType)
                    $A.before(
                      $A.boundTo(that.toggleGrab.grabbed),
                      $A.boundTo(o)
                    );
                  else $A.before(that.toggleGrab.grabbed, o);
                  that.update();
                  that.RTI.focus(that.select.nodeType ? x : o);
                  that.toggleGrab.grabbed = undefined;
                }
              }
            };

            that.check = function(o, v) {
              if (that.checkable) {
                if ($A.isArray(o)) {
                  for (var i = 0; i < o.length; i++) that.check(o[i], v);
                  return;
                }
                var val = "false";
                if (v === true || v === "true") val = "true";
                else if (v === "mixed") val = "mixed";
                $A.data(o, "_Checked", val);
                $A.setAttr(o, "aria-checked", val);
              }
            };

            that.checkValue = function(o) {
              if (o && that.checkable) {
                return $A.data(o, "_Checked");
              } else if (that.select.nodeType) {
                if (o) return $A.getAttr($A.boundTo(o), "value");
                else {
                  var s = [];
                  $A.loop(
                    that.optionNodes,
                    function(i, n) {
                      if (n.selected) s.push(n);
                    },
                    "array"
                  );
                  return s;
                }
              }
              return that.listbox.querySelectorAll(
                '*[role="option"][aria-selected="true"]'
              );
            };

            that.select = config.select
              ? $A.morph(config.select)
              : { nodeType: false };
            that.listbox = $A.morph(
              config.listbox ? config.listbox : that.parentTag
            );

            that.update();

            if (that.select.nodeType) {
              $A(that.listbox).on(
                "attributechange",
                function(
                  mutation,
                  targetNode,
                  attributeName,
                  attributeValue,
                  oldValue,
                  boundNode
                ) {
                  if (
                    $A.getAttr(targetNode, "role") === "option" &&
                    boundNode &&
                    $A.data(targetNode, "_Selected") !==
                      (boundNode.selected ? true : false)
                  ) {
                    boundNode.selected = $A.data(targetNode, "_Selected");
                  }
                },
                {
                  subtree: true,
                  attributeFilter: ["aria-selected"]
                }
              );

              $A.on(that.select, "change", function(ev) {
                var ix = -1;
                $A.loop(
                  that.optionNodes,
                  function(i, o) {
                    that.toggleSelect(
                      $A.boundTo(o),
                      o.selected ? true : false,
                      false,
                      that.multiple,
                      true
                    );
                    if (ix < 0 && o.selected) ix = i;
                  },
                  "array"
                );
                that.RTI.activate(ix >= 0 ? ix : 0);
              });

              if (!config.preventInsert) {
                if (
                  !config.insertAction ||
                  ["insert", "before", "after", "prepend", "append"].indexOf(
                    config.insertAction
                  ) === -1
                )
                  config.insertAction = "insert";
                if (config.context) {
                  $A[config.insertAction](
                    that.listbox,
                    $A.morph(config.context)
                  );
                } else if (that.select.nodeType) {
                  $A.before(that.listbox, that.select);
                }
              }

              if (!config.showSelect) that.select.hidden = true;
            }

            return that;
          }
        });
      }
    });
  }
})();
