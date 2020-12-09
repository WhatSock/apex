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
          announce: false,
          exposeBounds: true,
          preload: true,
          preloadImages: true,
          preloadCSS: true,
          className: "tooltip",
          allowReopen: false,
          escToClose: true,
          returnFocus: false,
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
      onFetch: function(dc, container) {
        if (
          !dc.isFocusOnly &&
          !dc.isResponsive &&
          !dc.isManualOpen &&
          !dc.isAlert &&
          !dc.isIE
        )
          $A.setAttr(
            dc.trigger,
            "aria-description",
            $A.getText($A.morph(container))
          );
      },
      onRender: function(dc, container) {
        if (dc.isError || dc.isResponsive || dc.isIE) {
          dc.isAlert = dc.isResponsive ? false : true;
          dc.speak();
        } else $A.setAttr(dc.target, "aria-describedby", container.id);
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
          o = config.trigger || config.source || null;
        }
        if (!o) return null;
        if (!config) config = {};
        config.isIE = $A.isIE();

        var baseDC = function() {
            return $A.extend(
              {
                widgetType: "Tooltip",
                speak: function(v) {
                  var dc = this;
                  v = v || dc.text();
                  if (dc.isResponsive && !dc.isIE && !$A.isTouch)
                    $A.setAttr(dc.triggerObj, "aria-description", v);
                  else $A.announce(v, true, dc.isAlert);
                  return dc;
                },
                validate: function(dc, target) {
                  if (!target.value) return dc.source;
                  return false;
                },
                validateCondition: function(dc) {
                  if (!dc.isError && !dc.isResponsive) return dc;
                  var v = dc.validate(dc, dc.target);
                  if (v) {
                    if (dc.loaded) dc.speak(v);
                    dc.insert(v);
                  }
                  if ($A.isFn(dc.onValid)) dc.onValid(dc, dc.isValid);
                },
                on: {
                  focus: function(ev, dc) {
                    if (dc.isResponsive) {
                      dc.target = this;
                      dc.validateCondition(dc);
                    } else if (!dc.isError && !dc.isManualOpen) dc.render();
                    else if (dc.isError && !dc.isResponsive) dc.remove();
                  },
                  blur: function(ev, dc) {
                    if (!dc.isError) dc.remove();
                    else if (dc.isError && !dc.isResponsive) {
                      dc.target = this;
                      dc.validateCondition(dc);
                    }
                  },
                  touchstart: function(ev, dc) {
                    if (dc.isResponsive) {
                      dc.target = this;
                      dc.validateCondition(dc);
                    } else if (!dc.isError && !dc.isManualOpen) dc.render();
                    else if (dc.isError && !dc.isResponsive) dc.remove();
                  },
                  click: function(ev, dc) {
                    if (!dc.isError && dc.isManualOpen && !dc.loaded) {
                      dc.render();
                      ev.stopPropagation();
                      ev.preventDefault();
                    } else if (!dc.isError && dc.isManualOpen && dc.loaded) {
                      dc.remove();
                      ev.stopPropagation();
                      ev.preventDefault();
                    }
                  },
                  mouseenter: function(ev, dc) {
                    if (
                      !dc.isError &&
                      !dc.isManualOpen &&
                      !dc.isFocusOnly &&
                      !dc.isResponsive
                    )
                      dc.render();
                  },
                  mouseleave: function(ev, dc) {
                    if (
                      !dc.isError &&
                      !dc.isManualClose &&
                      !dc.isFocusOnly &&
                      !dc.isResponsive
                    )
                      dc.remove();
                  },
                  keyup: function(ev, dc) {
                    if (dc.isResponsive) {
                      dc.target = this;
                      dc.validateCondition(dc);
                    }
                  },
                  change: function(ev, dc) {
                    if (dc.isResponsive) {
                      dc.target = this;
                      dc.validateCondition(dc);
                    }
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
          if (!config.isError && config.isResponsive) config.isError = true;

          if ($A.hasAttr(o, "data-tooltip")) {
            var dt = $A.getAttr(o, "data-tooltip");
            tooltip = {
              target: o,
              trigger: o
            };
            if ($A.isPath(dt)) tooltip.fetch = $A.toFetch(dt);
            else tooltip.source = $A.morph(dt);
          }

          if ($A.hasAttr(o, "data-error")) {
            var de = $A.getAttr(o, "data-error");
            error = {
              target: o,
              trigger: o,
              isError: true
            };
            if ($A.isPath(de)) error.fetch = $A.toFetch(de);
            else error.source = $A.morph(de);
          }

          if (error) dcArray.push($A.toDC($A.extend(baseDC(), error)));

          if (tooltip) {
            dcArray.push($A.toDC($A.extend(baseDC(), tooltip)));
            if (
              tooltip.source &&
              !config.isFocusOnly &&
              !config.isResponsive &&
              !config.isManualOpen &&
              !config.isAlert &&
              !config.isIE
            )
              $A.setAttr(o, "aria-description", $A.getText(tooltip.source));
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
              config.source &&
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
