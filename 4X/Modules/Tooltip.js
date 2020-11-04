/*!
ARIA Tooltip Module 2.0 for Apex 4X
Copyright 2020 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setTooltip" in $A)) {
    $A.addWidgetTypeProfile("Tooltip", {
      configure: function(dc) {
        return {
          delay: 1000,
          isAlert: false,
          exposeBounds: true,
          forceFocus: false,
          returnFocus: false,
          preload: true,
          preloadImages: true,
          preloadCSS: true,
          className: "tooltip",
          allowReopen: false,
          isResponsive: false,
          manualOpen: false,
          manualClose: true,
          escToClose: true,
          validate: function(target) {
            if (!target.value) return "Field is required.";
          },
          validateCondition: function() {
            var dc = this;
            if (!dc.isError) return dc;
            var v = dc.validate(dc.target);
            if ($A.isStr(v) && v.length) {
              if (dc.loaded) dc.insert(v);
              else {
                dc.source = v;
                dc.render();
              }
            }
          },
          on: {
            rendertooltip: function(ev, dc) {
              dc.render();
            },
            mouseenter: function(ev, dc) {
              if (!dc.isError && !dc.manualOpen)
                $A.trigger(this, "rendertooltip");
            },
            focus: function(ev, dc) {
              if (!dc.isError && !dc.manualOpen)
                $A.trigger(this, "rendertooltip");
              else if (dc.isError && !dc.isResponsive && dc.loaded) dc.remove();
            },
            blur: function(ev, dc) {
              if (!dc.isError && !dc.manualClose) dc.remove();
              else if (dc.isError && !dc.isResponsive)
                $A.trigger(this, "checkvalidate");
            },
            touchstart: function(ev, dc) {
              if (!dc.isError && !dc.manualOpen)
                $A.trigger(this, "rendertooltip");
              else if (dc.isError && !dc.isResponsive && dc.loaded) dc.remove();
            },
            click: function(ev, dc) {
              if (!dc.isError && dc.manualOpen && !dc.loaded)
                $A.trigger(this, "rendertooltip");
              else if (!dc.isError && dc.manualOpen && dc.loaded) dc.remove();
            },
            mouseleave: function(ev, dc) {
              if (!dc.isError && !dc.manualClose) dc.remove();
            },
            checkvalidate: function(ev, dc) {
              dc.target = this;
              dc.validateCondition();
            },
            keydown: function(ev, dc) {
              if (dc.isError && dc.isResponsive)
                $A.trigger(this, "checkvalidate");
            },
            change: function(ev, dc) {
              if (dc.isError && dc.isResponsive)
                $A.trigger(this, "checkvalidate");
            }
          },
          mouseLeave: function(ev, dc) {
            dc.remove();
          },
          click: function(ev, dc) {
            dc.remove();
          }
        };
      },
      role: function(dc) {
        return {
          role: "region",
          "aria-label": "Tooltip"
        };
      },
      onRender: function(dc, container) {
        var desc =
          (!dc.isError && !dc.isResponsive && $A.getText(container)) || null;
        if (desc && dc.target) $A.setAttr(dc.target, "aria-description", desc);
      },
      onRemove: function(dc, container) {
        // Do something before removing.
      }
    });

    $A.extend({
      setTooltip: function(o, config) {
        if (this._4X) {
          config = o;
          o = this._X;
        }

        if ($A.isPlainObject(o)) {
          config = o;
          o = config.trigger || null;
        }
        if (!o) return null;

        var baseDC = function() {
            return $A.extend(
              {
                widgetType: "Tooltip"
              },
              config || {}
            );
          },
          dcArray = [];

        $A.query(o, function(i, o) {
          var tooltip = null,
            error = null;
          if ($A.hasAttr(o, "data-tooltip"))
            tooltip = $A.morph($A.getAttr(o, "data-tooltip")) || null;
          if ($A.hasAttr(o, "data-error"))
            error = $A.morph($A.getAttr(o, "data-error")) || null;

          if (error)
            dcArray.push(
              $A(o).toDC(
                $A.extend(baseDC(), {
                  target: o,
                  source: error,
                  isError: true
                })
              )
            );

          if (tooltip)
            dcArray.push(
              $A(o).toDC(
                $A.extend(baseDC(), {
                  target: o,
                  source: tooltip
                })
              )
            );

          if (!error && !tooltip)
            dcArray.push(
              $A(o).toDC(
                $A.extend(baseDC(), {
                  target: o
                })
              )
            );
        });

        return dcArray.length === 1 ? dcArray[0] : dcArray;
      }
    });
  }
})();
