/*!
ARIA Accordion Module 3.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setAccordion" in $A)) {
    $A.import("RovingTabIndex", {
      name: "AccordionModule",
      props: props,
      once: true,
      call: function(props) {
        $A.addWidgetProfile("Accordion", {
          configure: function(dc) {
            return {
              exposeBounds: true,
              exposeHiddenClose: false,
              ariaControls: true,
              ariaLabelledby: true,
              isToggle: false,
              allowMultiple: false,
              escToClose: true,
              returnFocus: false,
              click: function(ev, dc) {
                ev.stopPropagation();
              },
              onCreate: function(dc) {
                $A.setAttr(dc.trigger, "aria-expanded", "false");
              }
            };
          },
          role: function(dc) {
            return {
              role: "region"
            };
          },
          duringRender: function(dc, container) {
            $A.setAttr(dc.triggerObj, "aria-expanded", "true");
          },
          beforeRemove: function(dc, container) {
            $A.setAttr(dc.triggerObj, "aria-expanded", "false");
          }
        });

        $A.extend({
          setAccordion: function(o, config) {
            if (this._4X) {
              config = o;
              o = this._X;
            }

            if ($A.isPlainObject(o)) {
              config = o;
              o = config.trigger || config.source || null;
            }
            if (!o) return null;

            var dcArray = [],
              active = null,
              triggers = $A.query(o, function(i, o) {
                var panelContainer = $A.getEl($A.getAttr(o, "data-insert")),
                  dc = $A(o).toDC(
                    $A.extend(
                      {
                        widgetType: "Accordion",
                        root: panelContainer
                      },
                      config || {}
                    )
                  );
                dcArray.push(dc);
                if ($A.getAttr(o, "data-active") === "true") active = dc;
              });

            $A.map({
              siblings: dcArray
            });

            if (config.singleTabStop)
              var RTI = new $A.RovingTabIndex(
                $A.extend(
                  {
                    nodes: triggers,
                    orientation: 2,
                    autoSwitch: config.autoSwitch || "full",
                    autoLoop: true,
                    onClick: function(ev, triggerNode, RTI, DC, pressed) {
                      DC.render();
                    },
                    onSpace: function(ev, triggerNode, RTI, DC, pressed) {
                      DC.render();
                    },
                    onEnter: function(ev, triggerNode, RTI, DC, pressed) {
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
