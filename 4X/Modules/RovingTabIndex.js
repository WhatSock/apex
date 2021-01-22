/*!
Roving TabIndex Module 1.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("RovingTabIndex" in $A)) {
    $A.import("AccName", {
      name: "RovingTabIndexModule",
      props: props,
      once: true,
      call: function(props) {
        $A.extend({
          RovingTabIndex: function(options) {
            var that = this;
            that.typed = "";
            that.lastTyped = "";
            that.nodes = options.nodes;
            that.container = options.container || false;
            that.orientation =
              options.orientation &&
              options.orientation >= 0 &&
              options.orientation <= 2
                ? options.orientation
                : 0;
            that.autoSwitch = options.autoSwitch || "off";
            that.index =
              options.startIndex && options.startIndex >= 0
                ? options.startIndex
                : 0;
            that.parent =
              options.parent &&
              options.parent.nodes &&
              options.parent.nodes.length
                ? options.parent
                : false;
            that.children = new Map();
            that.trigger =
              options.trigger && options.trigger.nodeType === 1
                ? options.trigger
                : false;
            that.autoLoop = options.autoLoop || false;

            $A.loop(
              options,
              function(n, f) {
                if (n.slice(0, 2) === "on" && $A.isFn(f)) that[n] = f;
              },
              "object"
            );

            if (that.parent && that.trigger)
              that.parent.children.set(that.trigger, that);
            that.dc = that.DC = options.dc || options.DC || false;
            if (
              options.breakPoint &&
              (options.breakPoint.horizontal > 1 ||
                options.breakPoint.vertical > 1)
            ) {
              that.breakPoint = {
                horizontal:
                  options.breakPoint.horizontal > 1
                    ? options.breakPoint.horizontal
                    : 0,
                vertical:
                  options.breakPoint.vertical > 1
                    ? options.breakPoint.vertical
                    : 0,
                horizontalStop: options.breakPoint.horizontalStop
                  ? true
                  : false,
                verticalStop: options.breakPoint.verticalStop ? true : false
              };
            } else that.breakPoint = false;

            that.activate = function(o) {
              var i = 0;
              if ($A.isNum(o)) i = that.nodes[o] ? o : 0;
              else i = $A.inArray(o, that.nodes) || 0;
              if (that.nodes[i]) {
                that.index = i;
                $A.loop(
                  that.nodes,
                  function(a, n) {
                    $A.setAttr(n, {
                      tabindex: i === a ? "0" : "-1"
                    });
                  },
                  "array"
                );
              }
              return that;
            };

            that.setFocus = function(ev, instance, isClick) {
              instance = instance || that;
              var l = this;
              instance.activate(l);
              if (!isClick) l.focus();
              return instance;
            };

            that.focus = function(i) {
              var inst = that;
              if (!$A.isNum(i)) {
                i = $A.data(i, "RTI-Index") || 0;
                inst = $A.data(i, "RTI") || that;
              } else i = i || 0;
              if (inst.nodes.length && inst.nodes[i]) {
                inst.activate(i);
                inst.nodes[inst.index].focus();
              }
              return inst;
            };

            that.off = function() {
              $A.off(that.nodes, ".RovingTabIndex");
              return that;
            };

            that.on = function() {
              var grid = [],
                oI = 0,
                gI = 0,
                max = 0,
                keyReset = null,
                map = new Map();

              // Prevent duplicate bindings
              that.off();

              $A.loop(
                that.nodes,
                function(i, o) {
                  $A.data(o, "RTI", that);
                  $A.data(o, "RTI-Index", i);
                  $A.data(
                    o,
                    "AccName",
                    $A.getAccName
                      ? $A.getAccName(o).name.toLowerCase()
                      : $A.getText(o).toLowerCase()
                  );

                  if (that.breakPoint) {
                    if (!grid[gI]) grid[gI] = [];
                    grid[gI].push(o);

                    map.set(o, {
                      i: i,
                      x: oI,
                      y: gI
                    });
                    max = gI;
                    if (that.breakPoint.horizontal === oI) {
                      oI = 0;
                      gI++;
                    } else oI++;
                  }

                  var pressed = {},
                    changePressed = function(ev) {
                      pressed.alt = ev.altKey;
                      pressed.ctrl = ev.ctrlKey;
                      pressed.shift = ev.shiftKey;
                    };

                  $A.on(
                    o,
                    {
                      click: function(ev, dc) {
                        that.boundDC = dc;
                        var keys = [],
                          child = that.children.get(o);
                        that.index = i;
                        that.setFocus.apply(that.nodes[that.index], [ev, that]);
                        keys.push("Click");
                        keys.push("Open");
                        $A.loop(
                          keys,
                          function(i, k) {
                            if ($A.isFn(that["on" + k]))
                              that["on" + k].call(o, ev, o, that, dc, pressed);
                          },
                          "array"
                        );
                        ev.stopPropagation();
                        ev.preventDefault();
                      },
                      keydown: function(ev, dc) {
                        changePressed(ev);

                        if (
                          that.autoSwitch === "semi" ||
                          that.autoSwitch === "full"
                        ) {
                          var mode = $A.getOrientation(that.nodes);
                          if (mode.orientation === "vertical")
                            that.orientation = 2;
                          else if (mode.orientation === "horizontal")
                            that.orientation =
                              that.autoSwitch === "full" && mode.lineWrap
                                ? 0
                                : 1;
                        }

                        var k = $A.keyEvent(ev),
                          oMap = map.get(o),
                          child = null,
                          breakPointBack = function() {
                            if (
                              that.breakPoint.horizontal &&
                              k === 37 &&
                              (that.orientation === 0 || that.orientation === 1)
                            ) {
                              if (
                                oMap.x > 0 ||
                                (oMap.x === 0 &&
                                  oMap.y > 0 &&
                                  !that.breakPoint.horizontalStop)
                              )
                                that.index--;
                              else if (
                                oMap.x === 0 &&
                                oMap.y === 0 &&
                                $A.isFn(that.onBounds)
                              )
                                that.onBounds.apply(o, [ev, o, that, k]);
                            } else if (
                              that.breakPoint.vertical &&
                              k === 38 &&
                              (that.orientation === 0 || that.orientation === 2)
                            ) {
                              if (oMap.y > 0)
                                that.index = map[grid[oMap.y - 1][oMap.x]].i;
                              else if (oMap.y === 0 && $A.isFn(that.onBounds))
                                that.onBounds.apply(o, [ev, o, that, k]);
                            }
                          },
                          breakPointForward = function() {
                            if (
                              that.breakPoint.horizontal &&
                              k === 39 &&
                              (that.orientation === 0 || that.orientation === 1)
                            ) {
                              if (
                                oMap.x < that.breakPoint.horizontal ||
                                (oMap.x === that.breakPoint.horizontal &&
                                  oMap.y < max &&
                                  !that.breakPoint.horizontalStop)
                              )
                                that.index++;
                              else if (
                                oMap.x === that.breakPoint.horizontal &&
                                oMap.y === max &&
                                $A.isFn(that.onBounds)
                              )
                                that.onBounds.apply(o, [ev, o, that, k]);
                            } else if (
                              that.breakPoint.vertical &&
                              k === 40 &&
                              (that.orientation === 0 || that.orientation === 2)
                            ) {
                              if (oMap.y < max)
                                that.index = map[grid[oMap.y + 1][oMap.x]].i;
                              else if (oMap.y === max && $A.isFn(that.onBounds))
                                that.onBounds.apply(o, [ev, o, that, k]);
                            }
                          },
                          keys = [];
                        that.boundDC = dc;

                        // 37 left, 38 up, 39 right, 40 down, 35 end, 36 home
                        if (k >= 35 && k <= 40) {
                          var x = that.index,
                            pass = false;

                          if (
                            !pressed.alt &&
                            !pressed.ctrl &&
                            !pressed.shift &&
                            ((k === 39 && that.orientation === 2) ||
                              (k === 40 && that.orientation === 1))
                          ) {
                            child = that.children.get(o);
                            keys.push("Open");
                            pass = true;
                          } else if (
                            !pressed.alt &&
                            !pressed.ctrl &&
                            !pressed.shift &&
                            ((k === 37 && that.orientation === 2) ||
                              (k === 38 && that.orientation === 1))
                          ) {
                            keys.push("Close");
                            pass = true;
                          } else if (
                            (k === 37 &&
                              (that.orientation === 0 ||
                                that.orientation === 1)) ||
                            (k === 38 &&
                              (that.orientation === 0 ||
                                that.orientation === 2))
                          ) {
                            if (that.breakPoint) {
                              breakPointBack();
                            } else
                              that.index =
                                that.index === 0
                                  ? that.autoLoop
                                    ? that.nodes.length - 1
                                    : x
                                  : that.index - 1;

                            if (!pressed.alt && !pressed.ctrl && !pressed.shift)
                              keys.push("Up");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              !pressed.shift
                            )
                              keys.push("CtrlUp");
                            else if (
                              !pressed.alt &&
                              !pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("ShiftUp");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("CtrlShiftUp");
                          } else if (
                            (k === 39 &&
                              (that.orientation === 0 ||
                                that.orientation === 1)) ||
                            (k === 40 &&
                              (that.orientation === 0 ||
                                that.orientation === 2))
                          ) {
                            if (that.breakPoint) {
                              breakPointForward();
                            } else
                              that.index =
                                that.index === that.nodes.length - 1
                                  ? that.autoLoop
                                    ? 0
                                    : x
                                  : that.index + 1;

                            if (!pressed.alt && !pressed.ctrl && !pressed.shift)
                              keys.push("Down");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              !pressed.shift
                            )
                              keys.push("CtrlDown");
                            else if (
                              !pressed.alt &&
                              !pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("ShiftDown");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("CtrlShiftDown");
                          } else if (k === 35) {
                            if (
                              that.breakPoint &&
                              that.breakPoint.horizontal > 0 &&
                              oMap.x < that.breakPoint.horizontal
                            )
                              that.index =
                                map[grid[oMap.y][that.breakPoint.horizontal]].i;
                            else that.index = that.nodes.length - 1;

                            if (!pressed.alt && !pressed.ctrl && !pressed.shift)
                              keys.push("End");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              !pressed.shift
                            ) {
                              keys.push("CtrlEnd");
                              pass = true;
                            } else if (
                              !pressed.alt &&
                              !pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("ShiftEnd");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("CtrlShiftEnd");
                          } else if (k === 36) {
                            if (
                              that.breakPoint &&
                              that.breakPoint.horizontal > 0 &&
                              oMap.x > 0
                            )
                              that.index = map[grid[oMap.y][0]].i;
                            else that.index = 0;

                            if (!pressed.alt && !pressed.ctrl && !pressed.shift)
                              keys.push("Home");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              !pressed.shift
                            ) {
                              keys.push("CtrlHome");
                              pass = true;
                            } else if (
                              !pressed.alt &&
                              !pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("ShiftHome");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("CtrlShiftHome");
                          }

                          if (!pass && that.index !== x)
                            that.setFocus.apply(that.nodes[that.index], [
                              ev,
                              that
                            ]);

                          ev.stopPropagation();
                          ev.preventDefault();
                        } else if (
                          k === 27 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          keys.push("Esc");
                          keys.push("Close");
                          ev.stopPropagation();
                          ev.preventDefault();
                        } else if (k === 46) {
                          if (!pressed.alt && !pressed.ctrl && !pressed.shift)
                            keys.push("Delete");
                          else if (
                            !pressed.alt &&
                            pressed.ctrl &&
                            !pressed.shift
                          )
                            keys.push("CtrlDelete");
                          else if (
                            !pressed.alt &&
                            !pressed.ctrl &&
                            pressed.shift
                          )
                            keys.push("ShiftDelete");
                          else if (
                            !pressed.alt &&
                            pressed.ctrl &&
                            pressed.shift
                          )
                            keys.push("CtrlShiftDelete");

                          ev.stopPropagation();
                          ev.preventDefault();
                        } else if (k === 33 || k === 34) {
                          if (!pressed.alt && !pressed.ctrl && !pressed.shift)
                            keys.push(k === 33 ? "PageUp" : "PageDown");
                          else if (
                            pressed.alt &&
                            !pressed.ctrl &&
                            !pressed.shift
                          )
                            keys.push(k === 33 ? "AltPageUp" : "AltPageDown");
                          else if (
                            !pressed.alt &&
                            pressed.ctrl &&
                            !pressed.shift
                          )
                            keys.push(k === 33 ? "CtrlPageUp" : "CtrlPageDown");
                          else if (
                            !pressed.alt &&
                            !pressed.ctrl &&
                            pressed.shift
                          )
                            keys.push(
                              k === 33 ? "ShiftPageUp" : "ShiftPageDown"
                            );
                          else if (
                            !pressed.alt &&
                            pressed.ctrl &&
                            pressed.shift
                          )
                            keys.push(
                              k === 33 ? "CtrlShiftPageUp" : "CtrlShiftPageDown"
                            );
                        } else if (k === 13 || k === 32) {
                          if (k === 13) {
                            child = that.children.get(o);

                            if (!pressed.alt && !pressed.ctrl && !pressed.shift)
                              keys.push("Enter");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              !pressed.shift
                            )
                              keys.push("CtrlEnter");
                            else if (
                              !pressed.alt &&
                              !pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("ShiftEnter");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("CtrlShiftEnter");
                            keys.push("Open");
                          } else if (k === 32) {
                            if (!pressed.alt && !pressed.ctrl && !pressed.shift)
                              keys.push("Space");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              !pressed.shift
                            )
                              keys.push("CtrlSpace");
                            else if (
                              !pressed.alt &&
                              !pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("ShiftSpace");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("CtrlShiftSpace");
                          }

                          ev.stopPropagation();
                          ev.preventDefault();
                        } else if (
                          ((k >= 48 && k <= 57) || (k >= 65 && k <= 90)) &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          if (that.keyReset) clearTimeout(that.keyReset);
                          that.keyReset = setTimeout(function() {
                            that.typed = "";
                          }, 1000);

                          var move = function() {
                            if (that.lastTyped === k)
                              that.typed = String.fromCharCode(k);
                            else that.typed += String.fromCharCode(k);

                            var b = 0,
                              i = (that.index += 1),
                              e = that.nodes.length - 1,
                              f = false;

                            for (i; i <= e; i++) {
                              var name =
                                $A.data(that.nodes[i], "AccName") || "";
                              if (
                                name.indexOf(that.typed.toLowerCase()) === 0
                              ) {
                                f = true;
                                that.focus(i);
                                break;
                              }
                            }

                            if (!f) {
                              for (b; b < that.index; b++) {
                                var name =
                                  $A.data(that.nodes[b], "AccName") || "";
                                if (
                                  name.indexOf(that.typed.toLowerCase()) === 0
                                ) {
                                  that.focus(b);
                                  break;
                                }
                              }
                            }
                          };

                          move();
                          that.lastTyped = k;

                          ev.stopPropagation();
                          ev.preventDefault();
                        }

                        $A.loop(
                          keys,
                          function(i, k) {
                            if ($A.isFn(that["on" + k]))
                              that["on" + k].call(o, ev, o, that, dc, pressed);
                          },
                          "array"
                        );
                      },
                      keyup: function(ev, dc) {
                        changePressed(ev);
                        var keys = [];
                        if (
                          ev.key === "a" &&
                          !pressed.alt &&
                          pressed.ctrl &&
                          !pressed.shift
                        ) {
                          keys.push("SelectAll");
                        } else if (
                          ev.key === "c" &&
                          !pressed.alt &&
                          pressed.ctrl &&
                          !pressed.shift
                        ) {
                          keys.push("Copy");
                        } else if (
                          ev.key === "x" &&
                          !pressed.alt &&
                          pressed.ctrl &&
                          !pressed.shift
                        ) {
                          keys.push("Cut");
                        } else if (
                          ev.key === "v" &&
                          !pressed.alt &&
                          pressed.ctrl &&
                          !pressed.shift
                        ) {
                          keys.push("Paste");
                        }
                        $A.loop(
                          keys,
                          function(i, k) {
                            if ($A.isFn(that["on" + k]))
                              that["on" + k].call(o, ev, o, that, dc, pressed);
                          },
                          "array"
                        );
                      },
                      focus: function(ev, dc) {
                        that.boundDC = dc;
                        var keys = [];
                        keys.push("Focus");
                        $A.loop(
                          keys,
                          function(i, k) {
                            if ($A.isFn(that["on" + k]))
                              that["on" + k].call(o, ev, o, that, dc, pressed);
                          },
                          "array"
                        );
                      }
                    },
                    ".RovingTabIndex"
                  );

                  $A.setAttr(o, {
                    tabindex: i === that.index ? 0 : -1
                  });
                },
                "array"
              );
            };

            that.on();

            return that;
          }
        });
      }
    });
  }
})();
