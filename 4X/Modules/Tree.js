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
          afterRender: function(dc) {
            $A.setAttr(dc.triggerNode, "aria-expanded", "true");
            $A.data(dc.triggerNode, "expanded", true);
          },
          beforeRemove: function(dc) {
            $A.loop(
              dc.RTI.children,
              function(i, o) {
                o.DC.remove();
              },
              "map"
            );
          },
          afterRemove: function(dc) {
            $A.setAttr(dc.triggerNode, "aria-expanded", "false");
            $A.data(dc.triggerNode, "expanded", false);
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

            var main = null,
              multiselect = config.multiselect === true,
              tag = $A.extend(
                true,
                {
                  parent: "ul",
                  child: "a",
                  parse: function(ref) {
                    if ($A.isIE()) {
                      var mItems = [];
                      $A.query(ref.children, function(i, o) {
                        var c = $A.first(o, function(e) {
                          if (e.nodeName.toLowerCase() === tag.child)
                            return true;
                        });
                        if ($A.isDOMNode(c)) mItems.push(c);
                      });
                      return mItems;
                    } else
                      return ref.querySelectorAll(":scope > * > " + tag.child);
                  }
                },
                config.tag || {}
              ),
              genTree = function(o, p, list, top, level, triggerIndex) {
                var ref =
                  list ||
                  ($A.isDOMNode(o) &&
                    ($A.getAttr(o, "data-controls") ||
                      $A.next(o, function(e) {
                        if (e.nodeName.toLowerCase() === tag.parent)
                          return true;
                      })));
                if (ref) ref = $A.morph(ref);
                if (!$A.isDOMNode(ref)) return;
                if (o) {
                  $A.setAttr(o, "aria-expanded", "false");
                  $A.data(o, "expanded", false);
                  if (!ref.id) ref.id = $A.genId();
                  $A.setAttr(o, "aria-owns", ref.id);
                }
                var mItems = tag.parse(ref);
                $A.setAttr(ref, "role", top ? "tree" : "group");

                var DC = $A.toDC(
                  $A.extend(
                    {
                      trigger: o,
                      triggerIndex: triggerIndex,
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
                      autoLoop: false,
                      isTree: true,
                      onClick: function(ev, triggerNode, RTI, DC) {
                        var that = this,
                          isDisabled = $A.isDisabled(that),
                          check = $A.data(triggerNode, "check") || false;
                        if (!$A.isNum(check) && multiselect)
                          check =
                            $A.getAttr(triggerNode, "aria-selected") === "true";
                        if (!isDisabled && $A.isDC(DC)) DC.toggle();
                        else if (!isDisabled && $A.isFn(config.onActivate)) {
                          config.onActivate.apply(that, [
                            ev,
                            triggerNode,
                            RTI,
                            DC,
                            check,
                            function(attributeValue) {
                              if ($A.isNum($A.data(triggerNode, "check"))) {
                                var c = 0,
                                  v = "false";
                                if (attributeValue === "true") {
                                  c = 1;
                                  v = "true";
                                } else if (attributeValue === "mixed") {
                                  c = 2;
                                  v = "mixed";
                                }
                                $A.data(triggerNode, "check", c);
                                $A.setAttr(triggerNode, "aria-checked", v);
                              } else if (multiselect) {
                                $A.setAttr(
                                  triggerNode,
                                  "aria-selected",
                                  attributeValue === "true" ? "true" : "false"
                                );
                              }
                            }
                          ]);
                        } else {
                          if (!isDisabled && that.href)
                            location.href = that.href;
                        }
                        ev.preventDefault();
                      },
                      onSpace: function(ev, triggerNode, RTI, DC) {
                        RTI.onClick.apply(this, arguments);
                        ev.preventDefault();
                      },
                      onEnter: function(ev, triggerNode, RTI, DC) {
                        RTI.onClick.apply(this, arguments);
                        ev.preventDefault();
                      },
                      onFocus: function(ev, triggerNode, RTI, DC) {
                        $A.query('*[tabindex="0"]', main, function(i, o) {
                          if (o !== triggerNode) $A.setAttr(o, "tabindex", -1);
                        });
                        if (!$A.isTouch && !multiselect) {
                          $A.query('*[aria-selected="true"]', main, function(
                            i,
                            o
                          ) {
                            if (o !== triggerNode)
                              $A.setAttr(o, "aria-selected", "false");
                          });
                          $A.setAttr(triggerNode, "aria-selected", "true");
                        }
                      },
                      onRight: function(
                        ev,
                        triggerNode,
                        RTI,
                        DC,
                        arrowKey,
                        isTop,
                        isBottom
                      ) {
                        var that = this,
                          isDisabled = $A.isDisabled(that);
                        if (!isDisabled && $A.isDC(DC)) {
                          if (DC.loaded) {
                            if (DC.RTI.nodes.length) {
                              DC.RTI.focus(0);
                            }
                          } else DC.render();
                        }
                        ev.preventDefault();
                      },
                      onUp: function(
                        ev,
                        triggerNode,
                        RTI,
                        DC,
                        arrowKey,
                        isTop,
                        isBottom
                      ) {
                        var get = function(RTI, trigger) {
                            var r = RTI.children.get(trigger) || {};
                            if (
                              $A.isDC(r.DC) &&
                              r.DC.loaded &&
                              r.nodes.length &&
                              r.children.has(r.nodes[r.nodes.length - 1]) &&
                              r.children.get(r.nodes[r.nodes.length - 1]).DC
                                .loaded
                            )
                              return get(r, r.nodes[r.nodes.length - 1]);
                            else if (
                              $A.isDC(r.DC) &&
                              r.DC.loaded &&
                              r.nodes.length
                            )
                              return r;
                            else return null;
                          },
                          r = get(RTI, RTI.nodes[RTI.index - 1]);
                        if (r && r.nodes.length) {
                          r.focus(r.nodes.length - 1);
                          return false;
                        } else if (isTop && RTI.parent) {
                          RTI.parent.focus(RTI.trigger);
                          return false;
                        }
                      },
                      onLeft: function(
                        ev,
                        triggerNode,
                        RTI,
                        DC,
                        arrowKey,
                        isTop,
                        isBottom
                      ) {
                        if ($A.isDC(DC) && DC.loaded) DC.remove();
                        else if (RTI.parent) RTI.parent.focus(RTI.trigger);
                        ev.preventDefault();
                      },
                      onCtrlLeft: function(
                        ev,
                        triggerNode,
                        RTI,
                        DC,
                        arrowKey,
                        isTop,
                        isBottom
                      ) {
                        if (RTI.parent) {
                          RTI.DC.remove();
                          RTI.parent.focus(RTI.parent.index);
                        } else {
                          $A.loop(
                            RTI.children,
                            function(i, c) {
                              if ($A.isDC(c.DC)) c.DC.remove();
                            },
                            "map"
                          );
                        }
                        ev.preventDefault();
                      },
                      onCtrlRight: function(
                        ev,
                        triggerNode,
                        RTI,
                        DC,
                        arrowKey,
                        isTop,
                        isBottom
                      ) {
                        var get = function(r) {
                          $A.loop(
                            r.children,
                            function(i, c) {
                              if ($A.isDC(c.DC))
                                c.DC.render(function() {
                                  get(c);
                                });
                            },
                            "map"
                          );
                        };
                        get(RTI);
                        ev.preventDefault();
                      },
                      onDown: function(
                        ev,
                        triggerNode,
                        RTI,
                        DC,
                        arrowKey,
                        isTop,
                        isBottom
                      ) {
                        if ($A.isDC(DC) && DC.loaded) {
                          DC.RTI.focus(0);
                          return false;
                        } else if (isBottom) {
                          var r = RTI,
                            get = function(p) {
                              if (!p.parent) {
                                r = null;
                                return -1;
                              }
                              if (
                                p.DC.triggerIndex + 1 <=
                                p.parent.nodes.length - 1
                              ) {
                                r = p.parent;
                                return p.DC.triggerIndex + 1;
                              }
                              return get(p.parent);
                            },
                            i = get(RTI);
                          if (r && i !== -1) r.focus(i);
                          return false;
                        }
                      },
                      onEsc: function(ev, triggerNode, RTI, DC) {
                        if (RTI.parent) {
                          RTI.DC.remove();
                          RTI.parent.focus(RTI.parent.index);
                        } else {
                          $A.loop(
                            RTI.children,
                            function(i, c) {
                              if ($A.isDC(c.DC)) c.DC.remove();
                            },
                            "map"
                          );
                        }
                        ev.preventDefault();
                      },
                      onHome: function(
                        ev,
                        triggerNode,
                        RTI,
                        DC,
                        arrowKey,
                        isTop,
                        isBottom
                      ) {
                        RTI.top.focus(0);
                        return false;
                      },
                      onEnd: function(
                        ev,
                        triggerNode,
                        RTI,
                        DC,
                        arrowKey,
                        isTop,
                        isBottom
                      ) {
                        var get = function(RTI, trigger) {
                            var r = RTI.children.get(trigger) || {};
                            if (
                              $A.isDC(r.DC) &&
                              r.DC.loaded &&
                              r.nodes.length &&
                              r.children.has(r.nodes[r.nodes.length - 1]) &&
                              r.children.get(r.nodes[r.nodes.length - 1]).DC
                                .loaded
                            )
                              return get(r, r.nodes[r.nodes.length - 1]);
                            else if (
                              $A.isDC(r.DC) &&
                              r.DC.loaded &&
                              r.nodes.length
                            )
                              return r;
                            else return RTI;
                          },
                          r = get(
                            RTI.top,
                            RTI.top.nodes[RTI.top.nodes.length - 1]
                          );
                        if (r && r.nodes.length) {
                          r.focus(r.nodes.length - 1);
                          return false;
                        }

                        return false;
                      }
                    },
                    config.extendRTI || {}
                  )
                );

                $A.loop(
                  mItems,
                  function(i, o) {
                    genTree(o, DC.RTI, null, false, level + 1, i);
                    $A.setAttr(o, {
                      role: "treeitem",
                      "aria-level": level
                    });
                    if ($A.hasAttr(o, "check")) {
                      var c = 0,
                        attributeValue = $A.getAttr(o, "check");
                      if (attributeValue === "true") c = 1;
                      else if (attributeValue === "mixed") c = 2;
                      $A.data(o, "check", c);
                      $A.setAttr(o, {
                        "aria-checked":
                          !c || (c >= 1 && c <= 2)
                            ? "false"
                            : c === 1
                            ? "true"
                            : "mixed"
                      });
                      $A(o).on(
                        "attributeChange",
                        function(
                          MutationObject,
                          targetElement,
                          attributeName,
                          attributeValue,
                          attributePriorValue,
                          BoundObjectOrDC,
                          SavedData
                        ) {
                          var c = 0;
                          if (attributeValue === "true") c = 1;
                          else if (attributeValue === "mixed") c = 2;
                          $A.data(o, "check", c);
                        },
                        {
                          attributeFilter: ["aria-checked"]
                        }
                      );
                    }
                    $A.closest(o, function(o) {
                      if (o === ref) return true;
                      $A.setAttr(o, "role", "presentation");
                    });
                  },
                  "array"
                );

                $A.updateDisabled(mItems);

                if (top) {
                  if (
                    !multiselect &&
                    $A.getAttr(ref, "aria-multiselectable") === "true"
                  )
                    multiselect = true;
                  else if (multiselect)
                    $A.setAttr(ref, "aria-multiselectable", "true");
                  else {
                    var a = $A.inArray(
                      ref.querySelector('*[aria-selected="true"]'),
                      mItems
                    );
                    if (a >= 0) DC.RTI.activate(a);
                  }
                }

                return DC;
              };

            var gen = function(l, i) {
              genTree(null, null, l, true, 1, i);
            };

            o = $A.morph(o);
            main = o;

            $A.query(o, function(i, o) {
              var p = config.fetch && config.fetch.url,
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
                    gen(c, i);
                  }
                );
              } else {
                gen(o, i);
              }
            });

            return $A._XR.call(this, o);
          }
        });
      }
    });
  }
})();
