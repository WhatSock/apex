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
          delay: 0,
          delayTimeout: 0,
          isError: false,
          isFocusOnly: false,
          isResponsive: false,
          isManualOpen: false,
          isManualClose: true,
          isAlert: false,
          exposeBounds: true,
          forceFocus: false,
          returnFocus: false,
          preload: true,
          preloadImages: true,
          preloadCSS: true,
          className: "tooltip",
          allowReopen: false,
          escToClose: true,
          mouseLeave: function(ev, dc) {
            dc.remove();
          },
          click: function(ev, dc) {
            dc.remove();
            ev.stopPropagation();
            ev.preventDefault();
          }
        };
      },
      role: function(dc) {
        return {
          role: "region",
          "aria-label": "Tooltip"
        };
      },
      innerRole: function(dc) {
        return {
          role: "tooltip"
        };
      },
      onRender: function(dc, container) {
        if (
          !(
            !dc.isError &&
            !dc.isFocusOnly &&
            !dc.isResponsive &&
            !dc.isManualOpen &&
            !dc.isAlert &&
            !dc.isIE
          )
        )
          $A.setAttr(dc.target, "aria-describedby", container.id);
        else if (dc.isAlert) $A.announce(container, false, true);
        else if (dc.isIE) $A.announce(container);
      },
      onRemove: function(dc, container) {
        $A.remAttr(dc.target, "aria-describedby");
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
        if (!config) config = {};
        config.isIE = $A.isIE();

        var baseDC = function() {
            return $A.extend(
              {
                widgetType: "Tooltip",
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
                  focus: function(ev, dc) {
                    if (!dc.isError && !dc.isManualOpen)
                      $A.trigger(this, "rendertooltip");
                    else if (dc.isError && !dc.isResponsive) dc.remove();
                  },
                  blur: function(ev, dc) {
                    if (!dc.isError) dc.remove();
                    else if (dc.isError && !dc.isResponsive)
                      $A.trigger(this, "checkvalidate");
                  },
                  touchstart: function(ev, dc) {
                    if (!dc.isError && !dc.isManualOpen)
                      $A.trigger(this, "rendertooltip");
                    else if (dc.isError && !dc.isResponsive) dc.remove();
                  },
                  click: function(ev, dc) {
                    if (!dc.isError && dc.isManualOpen) {
                      $A.trigger(this, "rendertooltip");
                      ev.stopPropagation();
                      ev.preventDefault();
                    } else if (!dc.isError && dc.isManualOpen) {
                      dc.remove();
                      ev.stopPropagation();
                      ev.preventDefault();
                    }
                  },
                  mouseenter: function(ev, dc) {
                    if (!dc.isError && !dc.isManualOpen && !dc.isFocusOnly)
                      $A.trigger(this, "rendertooltip");
                  },
                  mouseleave: function(ev, dc) {
                    if (!dc.isError && !dc.isManualClose && !dc.isFocusOnly)
                      dc.remove();
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
                }
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
              $A.toDC(
                $A.extend(baseDC(), {
                  target: o,
                  trigger: o,
                  source: error,
                  isError: true
                })
              )
            );

          if (tooltip) {
            dcArray.push(
              $A.toDC(
                $A.extend(baseDC(), {
                  target: o,
                  trigger: o,
                  source: tooltip
                })
              )
            );
            if (
              !config.isFocusOnly &&
              !config.isResponsive &&
              !config.isManualOpen &&
              !config.isAlert &&
              !config.isIE
            )
              $A.setAttr(o, "aria-description", $A.getText(tooltip));
          }

          if (!error && !tooltip) {
            dcArray.push(
              $A.toDC(
                $A.extend(baseDC(), {
                  target: o,
                  trigger: o
                })
              )
            );
            if (
              !config.isFocusOnly &&
              !config.isResponsive &&
              !config.isManualOpen &&
              !config.isAlert &&
              !config.isIE
            )
              $A.setAttr(
                o,
                "aria-description",
                $A.getText($A.morph(config.source))
              );
          }
        });

        return dcArray.length === 1 ? dcArray[0] : dcArray;
      }
    });
  }
})();
