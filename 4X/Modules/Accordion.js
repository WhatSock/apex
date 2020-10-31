/*!
ARIA Accordion Module 3.0 for Apex 4X
Copyright 2020 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setAccordion" in $A)) {
    $A.addWidgetTypeProfile("AccordionPanel", {
      configure: function(dc) {
        return {
          exposeBounds: true,
          exposeHiddenClose: false,
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
          role: "region"
        };
      }
    });

    $A.extend({
      setAccordion: function(config) {
        var config = config || {},
          selector = config.triggers,
          wheel = [],
          context = config.context || document,
          groupId = $A.genId(),
          accordions = $A.query(selector, context, function(i, o) {
            var isBtn =
                $A.getAttr(o, "role") === "button" ||
                o.nodeName.toLowerCase() === "button"
                  ? true
                  : false,
              isLnk =
                $A.getAttr(o, "role") === "link" ||
                (o.nodeName.toLowerCase() === "a" && $A.getAttr(o, "href"))
                  ? true
                  : false;
            if (!isBtn && !isLnk) {
              $A.setAttr(o, "role", "button");
            }

            var insertId = $A.getAttr(o, "data-insert") || false,
              insertO = insertId && $A.getEl(insertId),
              isInternalId = $A.getAttr(o, "data-controls") || false,
              isInternalO =
                isInternalId &&
                !$A.isPath(isInternalId) &&
                $A.getEl(isInternalId),
              extSrc = ($A.isPath(isInternalId) && isInternalId) || false,
              dcId = o.id || $A.genId(),
              eSrc1,
              eSrc2;
            if (extSrc) {
              extSrc = extSrc.replace("#", " #");
              eSrc1 = extSrc.split(/\s+/)[0];
              var eI = extSrc.indexOf(" ");
              if (eI !== -1) eSrc2 = extSrc.slice(eI + 1);
            }

            $A.setAttr(o, "aria-expanded", "false");

            var ovrs = {
              id: dcId,
              autoRender: $A.getAttr(o, "data-defaultopen") === "true",
              widgetType: "AccordionPanel",
              trigger: o,
              root: insertO,
              append: true,
              allowMultiple: config.allowMultiple === true,
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
              on: "click",
              toggleClass: config.toggleClass || "open",
              isTab: typeof config.isTab === "boolean" ? config.isTab : true,
              isToggle:
                typeof config.isToggle === "boolean" ? config.isToggle : false,
              runAfter: function(dc) {
                $A.setAttr(dc.triggerObj, {
                  "aria-expanded": "true"
                });

                if ($A.isFn(config.callback))
                  config.callback.apply(dc.triggerObj, [dc]);
              },
              runAfterClose: function(dc) {
                $A.setAttr(dc.triggerObj, {
                  "aria-expanded": "false"
                });

                if ($A.isFn(config.callback))
                  config.callback.apply(dc.triggerObj, [dc]);
              }
            };

            wheel.push(ovrs);
          });

        return $A(wheel, config.override || {});
      }
    });
  }
})();
