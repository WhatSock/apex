/*!
ARIA Menu Module 3.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
  */

(function() {
  if (!("setMenu" in $A)) {
    $A.import("RovingTabIndex", {
      name: "MenuModule",
      props: props,
      once: true,
      call: function(props) {
        $A.addWidgetProfile("Menu", {
          configure: function(dc) {
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
              click: function(ev, dc) {
                ev.stopPropagation();
              },
              storeData: true
            };
          },
          role: function(dc) {
            return {
              role: "menu",
              "aria-orientation": $A.getOrientation(dc.RTI.nodes).orientation
            };
          },
          afterRender: function(dc) {
            if (!$A.isTouch) {
              setTimeout(function() {
                $A.announce(
                  dc[
                    dc.getAttr("aria-orientation") === "horizontal"
                      ? "horizontalHelpTip"
                      : "verticalHelpTip"
                  ]
                );
              }, 1);
            }
          }
        });

        $A.extend({
          setMenu: function(o, config) {
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

            var tag = $A.extend(
                {
                  parent: "ul",
                  child: "a"
                },
                config.tag || {}
              ),
              genMenu = function(o, p, list) {
                if (!$A.isDOMNode(o)) return;
                var ref =
                  list ||
                  $A.getAttr(o, "data-menu") ||
                  $A.next(o, function(e) {
                    if (e.nodeName.toLowerCase() === tag.parent) return true;
                  });
                ref = $A.morph(ref);
                if (!$A.isDOMNode(ref)) return;
                $A.setAttr(o, "aria-haspopup", "true");
                var mItems = [];

                if ($A.isIE()) {
                  $A.query(ref.children, function(i, o) {
                    var c = $A.first(o, function(e) {
                      if (e.nodeName.toLowerCase() === tag.child) return true;
                    });
                    if ($A.isDOMNode(c)) mItems.push(c);
                  });
                } else
                  mItems = ref.querySelectorAll(":scope > * > " + tag.child);

                var DC = $A.toDC(
                  $A.extend(
                    {
                      trigger: o,
                      content: ref,
                      on: "openmenu",
                      widgetType: "Menu",
                      toggleHide: true
                    },
                    config
                  )
                );

                if (p)
                  DC.map({
                    parent: p.DC
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
                      onOpen: function(ev, triggerNode, RTI, DC, arrowKey) {
                        var that = this,
                          isDisabled = $A.isDisabled(that);
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
                          var args = arguments;
                          if ($A.isDC(RTI.DC))
                            RTI.DC.top.remove(function() {
                              config.onActivate.apply(that, args);
                            });
                          else config.onActivate.apply(that, args);
                        } else {
                          if ($A.isDC(RTI.DC))
                            RTI.DC.top.remove(function() {
                              if (that.href) location.href = that.href;
                            });
                        }
                      },
                      onSpace: function(ev, triggerNode, RTI, DC) {
                        if ($A.isDC(DC)) DC.render();
                        ev.preventDefault();
                      },
                      onEnter: function(ev, triggerNode, RTI, DC) {
                        if ($A.isDC(DC)) DC.render();
                        ev.preventDefault();
                      },
                      onClose: function(ev, triggerNode, RTI, DC, arrowKey) {
                        if ($A.isDC(RTI.DC) && RTI.parent)
                          RTI.DC.remove(function() {
                            setTimeout(function() {
                              $A.announce(
                                RTI.parent.DC[
                                  RTI.parent.DC.getAttr("aria-orientation") ===
                                  "horizontal"
                                    ? "horizontalHelpTip"
                                    : "verticalHelpTip"
                                ]
                              );
                            }, 1);
                          });
                        ev.preventDefault();
                      },
                      onEsc: function(ev, triggerNode, RTI, DC) {
                        if ($A.isDC(RTI.DC)) RTI.DC.remove();
                        ev.preventDefault();
                      },
                      onShiftTab: function(ev, triggerNode, RTI, DC) {
                        if ($A.isDC(RTI.DC)) RTI.DC.top.remove();
                        ev.preventDefault();
                      },
                      onTab: function(ev, triggerNode, RTI, DC) {
                        if ($A.isDC(RTI.DC)) RTI.DC.top.remove();
                        ev.preventDefault();
                      }
                    },
                    config.extendRTI || {}
                  )
                );

                $A.loop(
                  mItems,
                  function(i, o) {
                    genMenu(o, DC.RTI);
                    var role = (
                        $A.getAttr(o, "role") ||
                        $A.getAttr(o, "data-role") ||
                        ""
                      ).toLowerCase(),
                      checked = (
                        $A.getAttr(o, "aria-checked") ||
                        $A.getAttr(o, "data-checked") ||
                        "false"
                      ).toLowerCase();
                    if (role.indexOf("radio") !== -1)
                      $A.setAttr(o, {
                        role: "menuitemradio",
                        "aria-checked": checked
                      });
                    else if (role.indexOf("checkbox") !== -1)
                      $A.setAttr(o, {
                        role: "menuitemcheckbox",
                        "aria-checked": checked
                      });
                    else $A.setAttr(o, "role", "menuitem");
                  },
                  "array"
                );

                $A.updateDisabled(mItems);

                return DC;
              };

            $A.query(o, function(i, o) {
              var gen = function(m) {
                var DC = genMenu(o, null, m);
                $A.on(window.document, "click.closemenus", function() {
                  DC.remove();
                });
                if (!config.rightClick) config.leftClick = true;
                var e;
                if (config.leftClick) {
                  e = {
                    keydown: function(ev, dc) {
                      var k = $A.keyEvent(ev);
                      if (k === 40 || k === 13 || k === 32) {
                        dc.render();
                        ev.stopPropagation();
                        ev.preventDefault();
                      }
                    },
                    click: function(ev, dc) {
                      dc.render();
                      ev.stopPropagation();
                      ev.preventDefault();
                    }
                  };
                }
                if (config.rightClick) {
                  e = {
                    contextmenu: function(ev, dc) {
                      ev.preventDefault();
                    },
                    mouseup: function(ev, dc) {
                      var btn = -1;
                      if (!$A.isNum(ev.which))
                        btn = ev.button < 2 ? 1 : ev.button === 4 ? 3 : 2;
                      else btn = ev.which < 2 ? 1 : ev.which === 2 ? 3 : 2;
                      if (btn === 2) {
                        dc.render();
                        ev.preventDefault();
                      }
                    },
                    keydown: function(ev, dc) {
                      var k = $A.keyEvent(ev);
                      if (k === 93 || (ev.shiftKey && k === 121)) {
                        dc.render();
                        ev.preventDefault();
                      }
                    }
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
                    selector: s
                  },
                  function(c) {
                    gen(c);
                  }
                );
              } else {
                gen(config.content ? $A.morph(config.content) : null);
              }
            });
            return $A._XR.call(this, o);
          }
        });
      }
    });
  }
})();
