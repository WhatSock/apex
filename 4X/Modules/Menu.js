/*@license
ARIA Menu Module 3.3 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: RovingTabIndex.js
  */

(function () {
  if (!("setMenu" in $A)) {
    $A.import("RovingTabIndex", {
      name: "MenuModule",
      props: props,
      once: true,
      call: function (props) {
        var menuPfl = {
          configure: function (dc) {
            return {
              horizontalHelpTip:
                "To move through items, press left or right arrow.",
              verticalHelpTip: "To move through items, press up or down arrow.",
              toggleHide: true,
              forceFocus: true,
              forceFocusWithin: true,
              returnFocus: true,
              preload: true,
              preloadImages: true,
              preloadCSS: true,
              className: "menu",
              escToClose: true,
              click: function (ev, dc) {
                ev.stopPropagation();
              },
              storeData: true,
            };
          },
          role: function (dc) {
            return {
              role: "menu",
              "aria-orientation": $A.getOrientation(dc.RTI.nodes).orientation,
            };
          },
          afterRender: function (dc) {
            if (!$A.isTouch) {
              setTimeout(function () {
                $A.announce(
                  dc[
                    dc.getAttr("aria-orientation") === "horizontal"
                      ? "horizontalHelpTip"
                      : "verticalHelpTip"
                  ],
                );
              }, 1);
            }
          },
          beforeRemove: function (dc) {
            $A.loop(
              dc.RTI.children,
              function (i, o) {
                o.DC.remove();
              },
              "map",
            );
          },
        };
        $A.addWidgetProfile("Menu", menuPfl);
        $A.addWidgetProfile("SubMenu", menuPfl);

        var isIE = $A.isIE();

        $A.extend({
          setMenu: function (o, config) {
            if (this._4X) {
              config = o;
              o = this._X;
            }

            if ($A.isPlainObject(o)) {
              config = o;
              o = config.trigger || null;
            }
            if (!o) return null;
            config = config || {};

            var main = null,
              tag = $A.extend(
                true,
                {
                  parent: "ul",
                  child: "a",
                  parse: function (ref) {
                    if (isIE) {
                      var mItems = [];
                      $A.query(ref.children, function (i, o) {
                        var c = $A.first(o, function (e) {
                          if (e.nodeName.toLowerCase() === tag.child)
                            return true;
                        });
                        if ($A.isNode(c)) mItems.push(c);
                      });
                      return mItems;
                    } else
                      return ref.querySelectorAll(":scope > * > " + tag.child);
                  },
                },
                config.tag || {},
              ),
              getState = function (
                o,
                attributeValue,
                hasAttribute,
                write,
                nodes,
              ) {
                if (hasAttribute) {
                  var isRadio = $A.getAttr(o, "role") === "menuitemradio",
                    c = 0;
                  if (attributeValue === "true") c = 1;
                  else if (!isRadio && attributeValue === "mixed") c = 2;
                  else attributeValue = "false";
                  $A.data(o, "check", c);
                  if (write) {
                    if (isRadio && $A.isArray(nodes))
                      $A.loop(
                        nodes,
                        function (i, n) {
                          if ($A.hasAttr(n, "aria-checked") && n !== o)
                            $A.setAttr(n, "aria-checked", "false");
                        },
                        "array",
                      );
                    $A.setAttr(o, "aria-checked", attributeValue);
                  }
                  return c;
                } else {
                  var s = $A.data(o, "check");
                  if ($A.isNum(s)) return s;
                }
                return false;
              },
              genMenu = function (o, p, list, isTopMenu) {
                if (!$A.isNode(o)) return;
                var ref =
                  list ||
                  $A.getAttr(o, "data-menu") ||
                  $A.next(o, function (e) {
                    if (e.nodeName.toLowerCase() === tag.parent) return true;
                  });
                ref = $A.morph(ref);
                if (!$A.isNode(ref)) return;
                $A.setAttr(o, "aria-haspopup", "true");
                var mItems = tag.parse(ref);

                $A.svgFix(ref);

                var DC = $A.toDC(
                  $A.extend(
                    {
                      trigger: o,
                      content: ref,
                      on: "openmenu",
                      widgetType: isTopMenu ? "Menu" : "SubMenu",
                      autoCloseSameWidget: isTopMenu ? true : false,
                      toggleHide: true,
                      getState: getState,
                    },
                    config,
                  ),
                );

                if (p)
                  DC.map({
                    parent: p.DC,
                  });

                DC.RTI = new $A.RovingTabIndex(
                  $A.extend(
                    {
                      DC: DC,
                      parent: p,
                      trigger: o,
                      nodes: mItems,
                      startIndex: 0,
                      orientation: 2,
                      autoSwitch: config.autoSwitch || "semi",
                      autoLoop: true,
                      onOpen: function (ev, triggerNode, RTI, DC, arrowKey) {
                        var that = this,
                          isDisabled = $A.isDisabled(that),
                          check = getState(triggerNode);
                        if (isDisabled && !arrowKey) {
                          if ($A.isDC(RTI.DC)) RTI.DC.top.remove();
                          return;
                        }
                        if ($A.isDC(DC)) {
                          DC.render();
                          ev.preventDefault();
                        } else if (arrowKey) {
                          return;
                        } else if ($A.isFn(config.onActivate)) {
                          config.onActivate.apply(that, [
                            ev,
                            triggerNode,
                            RTI,
                            DC || $A.boundTo(triggerNode),
                            check,
                            function (attributeValue) {
                              var r = $A.getAttr(triggerNode, "role"),
                                isRadio = ["menuitemradio"].indexOf(r) !== -1,
                                isCheckbox =
                                  ["menuitemcheckbox"].indexOf(r) !== -1;
                              if (isRadio || isCheckbox)
                                getState(
                                  triggerNode,
                                  attributeValue,
                                  true,
                                  true,
                                  isRadio ? RTI.nodes : null,
                                );
                            },
                            $A.getAttr(triggerNode, "role") === "menuitemradio",
                          ]);
                        }
                      },
                      onSpace: function (ev, triggerNode, RTI, DC) {
                        if ($A.isDC(DC)) DC.render();
                        ev.preventDefault();
                      },
                      onEnter: function (ev, triggerNode, RTI, DC) {
                        if ($A.isDC(DC)) DC.render();
                        ev.preventDefault();
                      },
                      onClose: function (ev, triggerNode, RTI, DC, arrowKey) {
                        if ($A.isDC(RTI.DC) && RTI.parent)
                          RTI.DC.remove(function () {
                            setTimeout(function () {
                              $A.announce(
                                RTI.parent.DC[
                                  RTI.parent.DC.getAttr("aria-orientation") ===
                                  "horizontal"
                                    ? "horizontalHelpTip"
                                    : "verticalHelpTip"
                                ],
                              );
                            }, 1);
                          });
                        ev.preventDefault();
                      },
                      onEsc: function (ev, triggerNode, RTI, DC) {
                        if ($A.isDC(RTI.DC)) RTI.DC.remove();
                        ev.preventDefault();
                      },
                      onShiftTab: function (ev, triggerNode, RTI, DC) {
                        if ($A.isDC(RTI.DC)) RTI.DC.top.remove();
                        ev.preventDefault();
                      },
                      onTab: function (ev, triggerNode, RTI, DC) {
                        if ($A.isDC(RTI.DC)) RTI.DC.top.remove();
                        ev.preventDefault();
                      },
                    },
                    config.extendRTI || {},
                  ),
                );

                $A.loop(
                  mItems,
                  function (i, o) {
                    genMenu(o, DC.RTI);
                    var radio = getState(
                        o,
                        $A.getAttr(o, "data-radio"),
                        $A.hasAttr(o, "data-radio"),
                      ),
                      check = getState(
                        o,
                        $A.getAttr(o, "data-check"),
                        $A.hasAttr(o, "data-check"),
                      ),
                      n =
                        ($A.isFn(o.querySelector) &&
                          o.querySelector("input")) ||
                        false;
                    if ($A.isNum(radio)) {
                      if (n && n.checked) radio = 1;
                      $A.setAttr(o, {
                        role: "menuitemradio",
                        "aria-checked": radio ? "true" : "false",
                      });
                    } else if ($A.isNum(check)) {
                      if (n && n.checked) check = 1;
                      var c = "false";
                      if (check === 1) c = "true";
                      else if (check === 2) c = "mixed";
                      $A.setAttr(o, {
                        role: "menuitemcheckbox",
                        "aria-checked": c,
                      });
                    } else $A.setAttr(o, "role", "menuitem");
                    if (radio !== false || check !== false) {
                      $A(o).on(
                        "attributeChange",
                        function (
                          MutationObject,
                          o,
                          attributeName,
                          attributeValue,
                          attributePriorValue,
                          DC,
                          SavedData,
                        ) {
                          if ($A.isNode(n)) {
                            var check = getState(o, attributeValue, true);
                            n.checked = check ? true : false;
                          }
                        },
                        {
                          attributeFilter: ["aria-checked"],
                        },
                      );
                    }
                    $A.closest(o, function (o) {
                      if (o === ref) return true;
                      $A.setAttr(o, "role", "presentation");
                    });
                  },
                  "array",
                );

                $A.updateDisabled(mItems);

                return DC;
              };

            var DC = null;

            $A.query(o, config.context || document, function (i, o) {
              var gen = function (m) {
                DC = genMenu(o, null, m, true);
                $A.on(window.document, "click.closemenus", function () {
                  DC.top.remove();
                });
                if (!config.rightClick) config.leftClick = true;
                var e;
                if (config.leftClick) {
                  e = {
                    keydown: function (ev, dc) {
                      var k = $A.keyEvent(ev);
                      if (k === 40 || k === 13 || k === 32) {
                        dc.render();
                        ev.stopPropagation();
                        ev.preventDefault();
                      }
                    },
                    click: function (ev, dc) {
                      dc.render();
                      ev.stopPropagation();
                      ev.preventDefault();
                    },
                  };
                }
                if (config.rightClick) {
                  e = {
                    contextmenu: function (ev, dc) {
                      ev.preventDefault();
                    },
                    mouseup: function (ev, dc) {
                      var btn = -1;
                      if (!$A.isNum(ev.which))
                        btn = ev.button < 2 ? 1 : ev.button === 4 ? 3 : 2;
                      else btn = ev.which < 2 ? 1 : ev.which === 2 ? 3 : 2;
                      if (btn === 2) {
                        dc.render();
                        ev.preventDefault();
                      }
                    },
                    keydown: function (ev, dc) {
                      var k = $A.keyEvent(ev);
                      if (k === 93 || (ev.shiftKey && k === 121)) {
                        dc.render();
                        ev.preventDefault();
                      }
                    },
                  };
                }
                $A.on(o, e);
              };
              var p =
                  (config.fetch && config.fetch.url) ||
                  $A.getAttr(o, "data-menu"),
                s =
                  (config.fetch &&
                    config.fetch.data &&
                    config.fetch.data.selector) ||
                  $A.getSelectorFromURI(p),
                isP = s && $A.isPath(p) ? true : false;
              config.fetch = null;
              if (isP) {
                config.toggleHide = false;
                var d = $A.toNode();
                $A.load(
                  p,
                  d,
                  {
                    selector: s,
                  },
                  function (c) {
                    main = c;
                    gen(main);
                  },
                );
              } else {
                gen(main);
              }
            });

            return $A._XR.call(this, DC);
          },
        });
      },
    });
  }
})();
