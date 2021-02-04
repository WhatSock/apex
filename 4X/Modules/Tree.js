/*!
ARIA Tree Module 3.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
  */

(function() {
  if (!("setTree" in $A)) {
    $A.import("RovingTabIndex", {
      name: "TreeModule",
      props: props,
      once: true,
      call: function(props) {
        $A.addWidgetProfile("Tree", {
          configure: function(dc) {
            return {
              toggleHide: true,
              preload: true,
              preloadImages: true,
              preloadCSS: true,
              className: "tree",
              escToClose: true,
              click: function(ev, dc) {
                ev.stopPropagation();
              },
              storeData: true
            };
          },
          role: function(dc) {
            return {
              role: dc.isTop ? "tree" : "group"
            };
          },
          afterRender: function(dc) {
            $A.setAttr(dc.triggerNode, "aria-expanded", "true");
          },
          afterRemove: function(dc) {
            $A.setAttr(dc.triggerNode, "aria-expanded", "false");
          }
        });

        $A.extend({
          setTree: function(o, config) {
            if (this._4X) {
              config = o;
              o = this._X;
            }

            if ($A.isPlainObject(o)) {
              config = o;
              o = config.content || null;
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
              genTree = function(o, p, list, top) {
                if (!$A.isDOMNode(o)) return;
                var ref =
                  list ||
                  $A.getAttr(o, "data-controls") ||
                  $A.next(o, function(e) {
                    if (e.nodeName.toLowerCase() === tag.parent) return true;
                  });
                ref = $A.morph(ref);
                if (!$A.isDOMNode(ref)) return;
                $A.setAttr(o, "aria-expanded", "false");
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
                      isTop: top,
                      on: "opentree",
                      widgetType: "Tree",
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
                    genTree(o, DC.RTI);
                    $A.setAttr(o, "role", "treeitem");
                  },
                  "array"
                );

                $A.updateDisabled(mItems);

                return DC;
              };

            $A.query(o, function(i, o) {
              var gen = function(m) {
                var DC = genTree(o, null, m, true);
              };
              var p =
                  (config.fetch && config.fetch.url) ||
                  $A.getAttr(o, "data-controls"),
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
