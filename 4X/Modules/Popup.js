/*@license
ARIA Popup Module 2.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)
*/

(function () {
  if (!("setPopup" in $A)) {
    $A.addWidgetProfile("Popup", {
      configure: function (dc) {
        return {
          announce: true,
          isAlert: false,
          exposeBounds: true,
          forceFocus: true,
          forceFocusWithin: false,
          returnFocus: true,
          exposeHiddenClose: true,
          displayHiddenClose: true,
          circularTabbing: true,
          preload: true,
          preloadImages: true,
          preloadCSS: true,
          className: "popup",
          escToClose: true,
          on: "click",
          click: function (ev, dc) {
            ev.stopPropagation();
          },
          onCreate: function (dc) {
            $A.setAttr(dc.trigger, "aria-expanded", "false");
          },
        };
      },
      role: function (dc) {
        return {
          role: "region",
          "aria-label": dc.role,
        };
      },
      afterRender: function (dc, container) {
        $A.setAttr(dc.triggerNode, "aria-expanded", "true");
      },
      afterRemove: function (dc, container) {
        $A.setAttr(dc.triggerNode, "aria-expanded", "false");
      },
    });

    $A.extend({
      setPopup: function (o, config) {
        if (this._4X) {
          config = o;
          o = this._X;
        }

        if ($A.isPlainObject(o)) {
          config = o;
          o = config.trigger || config.content || null;
        }
        if (!o) return null;

        var dcArray = [];
        $A.query(o, config.context || document, function (i, o) {
          $A.svgFix(o);
          dcArray.push(
            $A(o).toDC(
              $A.extend(
                {
                  widgetType: "Popup",
                },
                config || {},
              ),
            ),
          );
        });

        return dcArray.length === 1 ? dcArray[0] : dcArray;
      },
    });
  }
})();
