/*@license
Roving TabIndex Module 1.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: AccName.js
*/

(function () {
  if (!("RovingTabIndex" in $A)) {
    $A.import("AccName", {
      name: "RovingTabIndexModule",
      props: props,
      once: true,
      call: function (props) {
        $A.extend({
          RovingTabIndex: function (config) {
            var that = this;
            that.typed = "";
            that.lastTyped = "";
            that.nodes = config.nodes;
            that.container = config.container || false;
            that.orientation =
              config.orientation &&
              config.orientation >= 0 &&
              config.orientation <= 2
                ? config.orientation
                : 0;
            that.autoSwitch = config.autoSwitch || "off";
            that.index =
              config.startIndex && config.startIndex >= 0
                ? config.startIndex
                : 0;
            that.parent =
              config.parent && config.parent.nodes && config.parent.nodes.length
                ? config.parent
                : false;
            that.top = that;
            while (that.top.parent) that.top = that.top.parent;
            that.children = new Map();
            that.trigger =
              config.trigger && config.trigger.nodeType === 1
                ? config.trigger
                : false;
            that.autoLoop = config.autoLoop || false;

            $A.loop(
              config,
              function (n, f) {
                if (n.slice(0, 2) === "on" && $A.isFn(f)) that[n] = f;
              },
              "object",
            );
            that.isTree = config.isTree === true;

            if (that.parent && that.trigger)
              that.parent.children.set(that.trigger, that);
            that.dc = that.DC = config.dc || config.DC || null;
            if (
              config.breakPoint &&
              (config.breakPoint.horizontal > 1 ||
                config.breakPoint.vertical > 1)
            ) {
              that.breakPoint = {
                horizontal:
                  config.breakPoint.horizontal > 1
                    ? config.breakPoint.horizontal
                    : 0,
                vertical:
                  config.breakPoint.vertical > 1
                    ? config.breakPoint.vertical
                    : 0,
                horizontalStop: config.breakPoint.horizontalStop ? true : false,
                verticalStop: config.breakPoint.verticalStop ? true : false,
              };
            } else that.breakPoint = false;

            that.activate = function (i) {
              var inst = that;
              if ($A.isNum(i)) {
                i = that.nodes[i] || null;
                inst = $A.data(i, "RTI") || that;
              }
              if (!i) i = inst.nodes[0] || null;
              if ($A.isNode(i) && $A.isNum($A.data(i, "RTI-Index")))
                inst = $A.data(i, "RTI");
              else return inst;
              if ($A.isHidden(i)) return inst;
              inst.index = $A.data(i, "RTI-Index");
              $A.loop(
                inst.nodes,
                function (a, n) {
                  $A.setAttr(n, {
                    tabindex: i === n ? 0 : -1,
                  });
                },
                "array",
              );
              return inst;
            };

            that.setFocus = function (ev, instance, isClick) {
              instance = instance || that;
              var l = this;
              instance.activate(l);
              if (!isClick) l.focus();
              return instance;
            };

            that.focus = function (i) {
              var inst = that;
              if ($A.isNum(i)) {
                i = that.nodes[i] || null;
                inst = $A.data(i, "RTI") || that;
              }
              if (!i) i = inst.nodes[0] || null;
              if ($A.isNode(i) && $A.isNum($A.data(i, "RTI-Index")))
                inst = $A.data(i, "RTI");
              else return inst;
              if ($A.isHidden(i)) return inst;
              inst.activate(i);
              i.focus();
              return inst;
            };

            that.off = function () {
              $A.off(that.nodes, ".RovingTabIndex");
              return that;
            };

            that.on = function () {
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
                function (i, o) {
                  $A.data(o, "RTI", that);
                  $A.data(o, "RTI-Index", i);
                  $A.data(
                    o,
                    "AccName",
                    $A
                      .trim(
                        ($A.isFn($A.getAccName) && $A.getAccName(o).name) ||
                          $A.getText(o),
                      )
                      .toLowerCase(),
                  );

                  if (that.breakPoint) {
                    if (!grid[gI]) grid[gI] = [];
                    grid[gI].push(o);

                    map.set(o, {
                      i: i,
                      x: oI,
                      y: gI,
                    });
                    max = gI;
                    if (that.breakPoint.horizontal === oI) {
                      oI = 0;
                      gI++;
                    } else oI++;
                  }

                  var pressed = {},
                    changePressed = function (ev) {
                      pressed.alt = ev.altKey;
                      pressed.ctrl = ev.ctrlKey;
                      pressed.shift = ev.shiftKey;
                    };

                  var fire = function (keys, ev, o, DC, arrowKey) {
                    DC = DC || $A.boundTo(o);
                    var stop = false;
                    $A.loop(
                      keys,
                      function (i, k) {
                        if ($A.isFn(that["on" + k]))
                          var cancel =
                            that["on" + k].call(
                              o,
                              ev,
                              o,
                              that,
                              DC,
                              arrowKey,
                              that.index === 0,
                              that.index === that.nodes.length - 1,
                            ) === false;
                        if (cancel) stop = true;
                      },
                      "array",
                    );
                    return stop;
                  };

                  $A.on(
                    o,
                    {
                      click: function (ev, DC) {
                        var child = that.children.get(o),
                          dc = (child && child.DC) || DC;
                        that.index = i;
                        that.setFocus.apply(that.nodes[that.index], [ev, that]);

                        if (
                          (that.DC && (that.DC.loading || that.DC.closing)) ||
                          (dc && (dc.loading || dc.closing))
                        ) {
                          ev.preventDefault();
                          ev.stopPropagation();
                          return false;
                        }

                        fire(["Click", "Open"], ev, o, dc, 0);
                      },
                      touchstart: function (ev, DC) {
                        var child = that.children.get(o),
                          dc = (child && child.DC) || DC;
                        that.index = i;
                        that.setFocus.apply(that.nodes[that.index], [ev, that]);

                        if (
                          (that.DC && (that.DC.loading || that.DC.closing)) ||
                          (dc && (dc.loading || dc.closing))
                        ) {
                          ev.preventDefault();
                          ev.stopPropagation();
                          return false;
                        }

                        fire(["TouchStart"], ev, o, dc, 0);
                      },
                      keydown: function (ev, DC) {
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
                          arrowKey = 0,
                          oMap = map.get(o),
                          child = that.children.get(o),
                          dc = (child && child.DC) || DC,
                          breakPointBack = function () {
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
                          breakPointForward = function () {
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
                          keys = [],
                          cancel = false,
                          stop = false;

                        if (
                          (that.DC && (that.DC.loading || that.DC.closing)) ||
                          (dc && (dc.loading || dc.closing))
                        ) {
                          ev.preventDefault();
                          ev.stopPropagation();
                          return false;
                        }

                        // 37 left, 38 up, 39 right, 40 down, 35 end, 36 home
                        if (k >= 35 && k <= 40) {
                          arrowKey = k >= 37 && k <= 40 ? k : 0;
                          var x = that.index,
                            pass = false;

                          if (arrowKey) {
                            that.arrowPressed = true;
                            keys.push("Arrow");
                          }

                          if (k === 37) {
                            if (!pressed.alt && !pressed.ctrl && !pressed.shift)
                              keys.push("Left");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              !pressed.shift
                            )
                              keys.push("CtrlLeft");
                            else if (
                              !pressed.alt &&
                              !pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("ShiftLeft");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("CtrlShiftLeft");
                          } else if (k === 38) {
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
                          } else if (k === 39) {
                            if (!pressed.alt && !pressed.ctrl && !pressed.shift)
                              keys.push("Right");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              !pressed.shift
                            )
                              keys.push("CtrlRight");
                            else if (
                              !pressed.alt &&
                              !pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("ShiftRight");
                            else if (
                              !pressed.alt &&
                              pressed.ctrl &&
                              pressed.shift
                            )
                              keys.push("CtrlShiftRight");
                          } else if (k === 40) {
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
                          }
                          cancel = fire(keys, ev, o, dc, arrowKey);
                          keys = [];
                          if (cancel) stop = true;
                          if (
                            !pressed.alt &&
                            !pressed.ctrl &&
                            !pressed.shift &&
                            ((k === 39 && that.orientation === 2) ||
                              (k === 40 && that.orientation === 1))
                          ) {
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
                            if (that.index === 0)
                              cancel = fire(["Top"], ev, o, dc, arrowKey);
                            if (cancel) stop = true;

                            if (that.breakPoint) {
                              breakPointBack();
                            } else if (!stop)
                              that.index =
                                that.index === 0
                                  ? that.autoLoop
                                    ? that.nodes.length - 1
                                    : x
                                  : that.index - 1;
                          } else if (
                            (k === 39 &&
                              (that.orientation === 0 ||
                                that.orientation === 1)) ||
                            (k === 40 &&
                              (that.orientation === 0 ||
                                that.orientation === 2))
                          ) {
                            if (that.index === that.nodes.length - 1)
                              cancel = fire(["Bottom"], ev, o, dc, arrowKey);
                            if (cancel) stop = true;

                            if (that.breakPoint) {
                              breakPointForward();
                            } else if (!stop)
                              that.index =
                                that.index === that.nodes.length - 1
                                  ? that.autoLoop
                                    ? 0
                                    : x
                                  : that.index + 1;
                          } else if (k === 35) {
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
                            cancel = fire(keys, ev, o, dc, arrowKey);
                            keys = [];
                            if (cancel) stop = true;

                            if (
                              !stop &&
                              that.breakPoint &&
                              that.breakPoint.horizontal > 0 &&
                              oMap.x < that.breakPoint.horizontal
                            )
                              that.index =
                                map[grid[oMap.y][that.breakPoint.horizontal]].i;
                            else if (!stop) that.index = that.nodes.length - 1;
                          } else if (k === 36) {
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
                            cancel = fire(keys, ev, o, dc, arrowKey);
                            keys = [];
                            if (cancel) stop = true;

                            if (
                              !stop &&
                              that.breakPoint &&
                              that.breakPoint.horizontal > 0 &&
                              oMap.x > 0
                            )
                              that.index = map[grid[oMap.y][0]].i;
                            else if (!stop) that.index = 0;
                          }

                          if (!stop && !pass && that.index !== x)
                            that.setFocus.apply(that.nodes[that.index], [
                              ev,
                              that,
                            ]);

                          ev.stopPropagation();
                          ev.preventDefault();
                        } else if (k === 9 && !pressed.alt && !pressed.ctrl) {
                          if (pressed.shift) keys.push("ShiftTab");
                          else keys.push("Tab");
                        } else if (
                          k === 27 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          keys.push("Esc");
                          keys.push("Close");
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
                              k === 33 ? "ShiftPageUp" : "ShiftPageDown",
                            );
                          else if (
                            !pressed.alt &&
                            pressed.ctrl &&
                            pressed.shift
                          )
                            keys.push(
                              k === 33
                                ? "CtrlShiftPageUp"
                                : "CtrlShiftPageDown",
                            );
                        } else if (k === 13 || k === 32) {
                          if (k === 13) {
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
                        } else if (
                          ((k >= 48 && k <= 57) || (k >= 65 && k <= 90)) &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          if (that.keyReset) clearTimeout(that.keyReset);
                          that.keyReset = setTimeout(function () {
                            that.typed = "";
                          }, 1000);

                          var move = function () {
                            if (that.lastTyped === k)
                              that.typed = String.fromCharCode(k);
                            else that.typed += String.fromCharCode(k);

                            var nodes = that.isTree
                                ? that.top.treeNodes
                                : that.nodes,
                              b = 0,
                              bI = that.isTree
                                ? $A.data(o, "RTI-TreeIndex")
                                : that.index,
                              i = bI + 1,
                              e = nodes.length - 1,
                              f = false,
                              node,
                              name,
                              hidden;

                            for (i; i <= e; i++) {
                              node = nodes[i];
                              name = $A.data(node, "AccName") || "";
                              hidden = $A.isHidden(node);
                              if (
                                !hidden &&
                                name.indexOf(that.typed.toLowerCase()) === 0
                              ) {
                                f = true;
                                that.focus(node);
                                break;
                              }
                            }

                            if (!f) {
                              for (b; b < bI; b++) {
                                node = nodes[b];
                                name = $A.data(node, "AccName") || "";
                                hidden = $A.isHidden(node);
                                if (
                                  !hidden &&
                                  name.indexOf(that.typed.toLowerCase()) === 0
                                ) {
                                  that.focus(node);
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

                        fire(keys, ev, o, dc, arrowKey);
                      },
                      keyup: function (ev, DC) {
                        changePressed(ev);
                        var keys = [],
                          child = that.children.get(o),
                          dc = (child && child.DC) || DC,
                          k = $A.keyEvent(ev),
                          arrowKey = k >= 37 && k <= 40 ? k : 0;

                        if (
                          (that.DC && (that.DC.loading || that.DC.closing)) ||
                          (dc && (dc.loading || dc.closing))
                        ) {
                          ev.preventDefault();
                          ev.stopPropagation();
                          return false;
                        }

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

                        fire(keys, ev, o, dc, arrowKey);
                      },
                      focus: function (ev, DC) {
                        var child = that.children.get(o),
                          dc = (child && child.DC) || DC;

                        that.index = i;
                        that.setFocus.apply(that.nodes[that.index], [ev, that]);
                        fire(["Focus"], ev, o, dc, 0);
                      },
                    },
                    ".RovingTabIndex",
                  );

                  $A.setAttr(o, {
                    tabindex: i === that.index ? 0 : -1,
                  });
                },
                "array",
              );
            };

            if (that.isTree) {
              that.top.treeNodes = [];
              var get = function (nodes, RTI) {
                if (nodes.length) {
                  $A.loop(
                    nodes,
                    function (i, n) {
                      var child = RTI.children.get(n),
                        tI = RTI.top.treeNodes.length;
                      $A.data(n, "RTI-TreeIndex", tI);
                      RTI.top.treeNodes[tI] = n;
                      if (child && $A.isArray(child.nodes))
                        get(child.nodes, child);
                    },
                    "array",
                  );
                }
              };
              get(that.top.nodes, that.top);
            }

            that.on();

            return that;
          },
        });
      },
    });
  }
})();
