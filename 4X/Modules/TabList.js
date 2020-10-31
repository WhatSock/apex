/*!
ARIA TabList Module 2.0 for Apex 4X
Copyright 2020 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setTabList" in $A)) {
    $A.import("RovingTabIndex", {
      name: "TabListModule",
      once: true,
      props: props,
      call: function(props) {
        $A.addWidgetTypeProfile("TabPanel", {
          configure: function(dc) {
            return {
              exposeBounds: true,
              isTab: true,
              ariaControls: true,
              ariaLabelledby: true,
              isToggle: false,
              allowMultiple: false,
              click: function(ev, dc) {
                ev.stopPropagation();
              }
            };
          },
          role: function(dc) {
            return {
              role: "tabpanel"
            };
          }
        });

        $A.extend({
          setTabList: function(config) {
            var config = config || {},
              tabList = config.tabList;
            if ($A.isStr(tabList))
              tabList = $A.query(tabList, config.context || document);
            if ($A.isArray(tabList)) {
              for (var i = 0; i < tabList.length; i++) {
                config.tabList = tabList[i];
                $A.setTabList(config);
              }
              return false;
            }
            if (
              !tabList ||
              tabList.nodeType !== 1 ||
              $A.getAttr(tabList, "role") !== "tablist"
            ) {
              alert(
                "Error: TabList requires a valid DOM-node container element with role='tablist'."
              );
              return false;
            }
            var tabs = $A.query('*[role="tab"]', tabList);
            if (!tabs.length) {
              alert(
                "Error: No focusable active elements with role='tab' were found within the TabList container element."
              );
              return false;
            }
            var ariaOrientation =
                $A.getAttr(tabList, "aria-orientation") || false,
              RTI = null,
              renderId = false,
              wheel = [],
              updateDisabled = function(nodes) {
                $A.loop(
                  nodes,
                  function(i, o) {
                    $A.data(
                      o,
                      "disabled",
                      $A.getAttr(o, "aria-disabled") === "true"
                    );
                  },
                  "array"
                );
              };

            $A.loop(
              tabs,
              function(i, o) {
                $A.setAttr(o, {
                  "aria-posinset": i + 1,
                  "aria-setsize": tabs.length,
                  "aria-expanded": "false",
                  "aria-selected": "false"
                });
                if (!o.id) o.id = $A.genId();

                var insertId = $A.getAttr(o, "data-insert") || false,
                  insertO = insertId && $A.getEl(insertId),
                  isInternalId = $A.getAttr(o, "data-controls") || false,
                  isInternalO =
                    !$A.isPath(isInternalId) && $A.getEl(isInternalId),
                  extSrc = ($A.isPath(isInternalId) && isInternalId) || false,
                  eSrc1,
                  eSrc2;
                if (extSrc) {
                  extSrc = extSrc.replace("#", " #");
                  eSrc1 = extSrc.split(/\s+/)[0];
                  var eI = extSrc.indexOf(" ");
                  if (eI !== -1) eSrc2 = extSrc.slice(eI + 1);
                }

                var ovrs = {
                  id: o.id,
                  autoRender: $A.getAttr(o, "data-defaultopen") === "true",
                  trigger: o,
                  root: insertO,
                  append: true,
                  preload: config.preload === true,
                  preloadImages: config.preloadImages === true,
                  preloadCSS: config.preloadCSS === true,
                  mode: extSrc ? 1 : 0,
                  source: extSrc
                    ? ""
                    : (function() {
                        return isInternalO && isInternalO.parentNode
                          ? isInternalO.parentNode.removeChild(isInternalO)
                          : isInternalO;
                      })(),
                  fetch: {
                    url: eSrc1 || "",
                    data: {
                      selector: eSrc2 || ""
                    },
                    success: function(content, promise, dc) {
                      dc.source = content;
                      dc.mode = 0;
                    }
                  },
                  on: {
                    activatetab: function(ev, dc) {
                      dc.render();
                    }
                  },
                  widgetType: "TabPanel",
                  runDuring: function(dc) {
                    dc.setAttr({
                      tabindex: config.disableTabPanelFocus ? "-1" : "0",
                      "aria-describedby": dc.containerId
                    });
                  },
                  runAfter: function(dc) {
                    $A.loop(
                      tabs,
                      function(j, tab) {
                        $A.setAttr(tab, {
                          "aria-selected":
                            tab === dc.triggerObj ? "true" : "false",
                          "aria-expanded":
                            tab === dc.triggerObj ? "true" : "false"
                        });
                      },
                      "array"
                    );

                    if ($A.isFn(config.callback))
                      config.callback.apply(dc.triggerObj, [dc, dc.loaded]);
                  },
                  runAfterClose: function(dc) {
                    $A.setAttr(dc.triggerObj, {
                      "aria-selected": "false",
                      "aria-expanded": "false"
                    });
                    if ($A.isFn(config.callback))
                      config.callback.apply(dc.triggerObj, [dc, dc.loaded]);
                  },
                  tabs: tabs
                };

                if (ovrs.autoRender) renderId = i;

                wheel.push(ovrs);
              },
              "array"
            );

            updateDisabled(tabs);

            var orientation = ariaOrientation
              ? ariaOrientation === "vertical"
                ? 2
                : ariaOrientation === "horizontal"
                ? 1
                : 0
              : 0;

            RTI = new $A.RovingTabIndex(
              $A.extend(
                {
                  container: tabList,
                  nodes: tabs,
                  orientation: orientation,
                  autoSwitch: config.autoSwitch || "full",
                  autoLoop: true,
                  onClick: function(ev, tabNode, RTI, DC, pressed) {
                    if (!$A.data(tabNode, "disabled")) {
                      $A.trigger(tabNode, "activatetab");
                    }
                  },
                  onSpace: function(ev, tabNode, RTI, DC, pressed) {
                    RTI.onClick.call(tabNode, ev, tabNode, RTI, DC, pressed);
                  },
                  onEnter: function(ev, tabNode, RTI, DC, pressed) {
                    RTI.onClick.call(tabNode, ev, tabNode, RTI, DC, pressed);
                  }
                },
                config.extendRTI || {}
              )
            );

            return $A(wheel, config.override || {});
          }
        });
      }
    });
  }
})();
