/*!
ARIA TabList Module 2.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setTabList" in $A)) {
    $A.import("RovingTabIndex", {
      name: "TabListModule",
      props: props,
      once: true,
      call: function(props) {
        $A.addWidgetProfile("TabList", {
          configure: function(dc) {
            return {
              exposeBounds: true,
              isTab: true,
              ariaControls: true,
              ariaLabelledby: true,
              isToggle: false,
              allowMultiple: false,
              isFocusable: true,
              returnFocus: false,
              on: "activatetab",
              click: function(ev, dc) {
                ev.stopPropagation();
              }
            };
          },
          role: function(dc) {
            return {
              role: "tabpanel"
            };
          },
          duringRender: function(dc, container) {
            $A.setAttr(dc.triggerObj, {
              "aria-expanded": "true",
              "aria-selected": "true"
            });
          },
          afterRender: function(dc, container) {
            $A.setAttr(dc.triggerObj, {
              "aria-describedby": dc.containerId
            });
          },
          afterRemove: function(dc, container) {
            $A.setAttr(dc.triggerObj, {
              "aria-expanded": "false",
              "aria-selected": "false"
            });
            $A.remAttr(dc.triggerObj, "aria-describedby");
          }
        });

        $A.extend({
          setTabList: function(o, config) {
            if (this._4X) {
              config = o;
              o = this._X;
            }

            if ($A.isPlainObject(o)) {
              config = o;
              o = config.trigger || config.source || null;
            }
            if (!o) return null;
            var container = null,
              flag = false;

            var dcArray = [],
              active = null,
              startIndex = 0,
              triggers = $A.query(o, function(i, o) {
                var tree = [];
                if (!$A.isDOMNode(container))
                  container = $A.closest(o, function(n) {
                    if ($A.getAttr(n, "role") === "tablist") return true;
                    tree.push(n);
                  });
                if ($A.isDOMNode(container) && tree.length)
                  $A.setAttr(tree, "role", "presentation");
                $A.setAttr(o, {
                  "aria-expanded": "false",
                  "aria-selected": "false"
                });
                if ($A.getAttr(o, "role") !== "tab") flag = true;
                var panelContainer = $A.getEl($A.getAttr(o, "data-root")),
                  dc = $A(o).toDC(
                    $A.extend(
                      {
                        widgetType: "TabList",
                        root: panelContainer,
                        append: true
                      },
                      config || {}
                    )
                  );
                dcArray.push(dc);
                if ($A.getAttr(o, "data-active") === "true") {
                  active = dc;
                  startIndex = i;
                }
              });

            if (flag && $A.isDOMNode(container)) {
              $A.remAttr(container.querySelectorAll('*[role="tab"]'), "role");
              $A.setAttr(triggers, "role", "tab");
            }

            $A.map({
              siblings: dcArray
            });
            $A.updateDisabled(dcArray);

            var RTI = new $A.RovingTabIndex(
              $A.extend(
                {
                  nodes: triggers,
                  startIndex: startIndex,
                  orientation: 1,
                  autoSwitch: config.autoSwitch || "full",
                  autoLoop: true,
                  onClick: function(ev, tabNode, RTI, DC, pressed) {
                    DC.render();
                  },
                  onSpace: function(ev, tabNode, RTI, DC, pressed) {
                    DC.render();
                  },
                  onEnter: function(ev, tabNode, RTI, DC, pressed) {
                    DC.render();
                  }
                },
                config.extendRTI || {}
              )
            );

            if ($A.isDC(active)) active.render();

            return dcArray.length === 1 ? dcArray[0] : dcArray;
          }
        });
      }
    });
  }
})();
