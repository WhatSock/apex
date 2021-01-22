/*!
ARIA Menu Module 3.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
  */

(function() {
  if (!("setMenu" in $A)) {
    $A.import(["RovingTabIndex", "SmoothScroll"], {
      name: "MenuModule",
      props: props,
      once: true,
      call: function(props) {
        $A.addWidgetProfile("Menu", {
          configure: function(dc) {
            return {
              forceFocus: true,
              forceFocusWithin: true,
              returnFocus: true,
              preload: true,
              preloadImages: true,
              preloadCSS: true,
              className: "menu",
              escToClose: true,
              on: "click",
              click: function(ev, dc) {
                ev.stopPropagation();
              },
              onCreate: function(dc) {},
              storeData: true
            };
          },
          role: function(dc) {
            return {
              role: "menu"
            };
          },
          afterRender: function(dc, container) {},
          afterRemove: function(dc, container) {}
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
                  child: "> li > a"
                },
                config.tag || {}
              ),
              genMenu = function(o, p) {
                if (!$A.isDOMNode(o)) return;
                var ref = $A.morph(
                  $A.getAttr(o, "data-controls") || $A.next(o)
                );
                if (
                  !$A.isDOMNode(ref) ||
                  ref.nodeName.toLowerCase() !== tag.parent
                )
                  return;
                $A.setAttr(o, "aria-haspopup", "true");

                var mItems = ref.querySelectorAll(tag.child);

                var DC = $A.toDC(
                  $A.extend(
                    {
                      trigger: o,
                      source: ref.parentNode.removeChild(ref),
                      widgetType: "Menu"
                    },
                    config.override || {}
                  )
                );

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
                      onOpen: function(ev, triggerNode, RTI, DC, pressed) {
                        if ($A.isDC(DC)) DC.render();
                      },
                      onSpace: function(ev, triggerNode, RTI, DC, pressed) {
                        if ($A.isDC(DC)) DC.render();
                      },
                      onEnter: function(ev, triggerNode, RTI, DC, pressed) {
                        if ($A.isDC(DC)) DC.render();
                      },
                      onClose: function(ev, triggerNode, RTI, DC, pressed) {
                        if ($A.isDC(RTI.DC)) RTI.DC.remove();
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
              };

            $A.query(o, function(i, o) {
              genMenu(o);
            });
            if (this._4X) {
              this._X = o;
              return this;
            } else return o;
          }
        });
      }
    });
  }
})();
