/*@license
ARIA Tooltip Module 2.2 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)
*/

(function () {
  if (!("setTooltip" in $A)) {
    $A.addWidgetProfile("Tooltip", {
      configure: function (dc) {
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
          allowRerender: false,
          escToClose: true,
          returnFocus: false,
          mouseLeave: function (ev, dc) {
            dc.remove();
          },
          click: function (ev, dc) {
            dc.remove();
            ev.stopPropagation();
            ev.preventDefault();
          },
          onCreate: function (dc) {
            if (
              dc.isManualOpen &&
              $A.isNode(dc.triggerNode) &&
              (dc.triggerNode.getAttribute("role") === "button" ||
                (!dc.triggerNode.hasAttribute("role") &&
                  dc.triggerNode.nodeName.toLowerCase() === "button"))
            )
              dc.triggerNode.setAttribute("aria-pressed", "false");
          },
        };
      },
      role: function (dc) {
        return {
          role: "region",
          "aria-label": dc.isError && !dc.isResponsive ? "Error" : "Tooltip",
        };
      },
      innerRole: function (dc) {
        return {
          role: "tooltip",
        };
      },
      afterFetch: function (dc, container) {
        if (
          !dc.isError &&
          !dc.isFocusOnly &&
          !dc.isResponsive &&
          !dc.isManualOpen &&
          !dc.isAlert &&
          !dc.isIE
        ) {
          dc.noRepeat = true;
          $A.setAttr(
            dc.target,
            "aria-description",
            $A.getText($A.morph(container)),
          );
        }
      },
      afterRender: function (dc, container) {
        if (dc.isError || dc.isResponsive || dc.isIE) {
          dc.speak();
        } else if (!dc.noRepeat)
          $A.setAttr(dc.target, "aria-describedby", container.id);
        if (
          dc.isManualOpen &&
          $A.isNode(dc.triggerNode) &&
          (dc.triggerNode.getAttribute("role") === "button" ||
            (!dc.triggerNode.hasAttribute("role") &&
              dc.triggerNode.nodeName.toLowerCase() === "button"))
        )
          dc.triggerNode.setAttribute("aria-pressed", "true");
      },
      afterRemove: function (dc, container) {
        $A.remAttr(dc.target, "aria-describedby");
        if (
          dc.isManualOpen &&
          $A.isNode(dc.triggerNode) &&
          (dc.triggerNode.getAttribute("role") === "button" ||
            (!dc.triggerNode.hasAttribute("role") &&
              dc.triggerNode.nodeName.toLowerCase() === "button"))
        )
          dc.triggerNode.setAttribute("aria-pressed", "false");
      },
    });

    $A.extend({
      setTooltip: function (o, config) {
        if (this._4X) {
          config = o;
          o = this._X;
        }

        if ($A.isPlainObject(o)) {
          config = o;
          o = config.trigger || config.content || null;
        }
        if (!o) return null;
        if (!config) config = {};
        config.isIE = $A.isIE();

        var baseDC = function (trigger) {
            return $A.extend(
              {
                widgetType: "Tooltip",
                speak: function (v) {
                  var dc = this;
                  v = v || dc.text();
                  if (!dc.noRepeat) {
                    $A.announce.clear();
                    setTimeout(function () {
                      $A.announce(v, dc.suppressRepeat, dc.isAlert);
                    }, 1);
                  }
                  return dc;
                },
                validate: function (dc, target) {
                  if (!target.value) {
                    dc.isValid = false;
                    return dc.content;
                  }
                  dc.isValid = true;
                },
                validateCondition: function (dc) {
                  if (!dc.isError && !dc.isResponsive) return dc;
                  var v = dc.validate(dc, dc.target) || false;
                  if (v && !$A.isBool(v)) {
                    if (!!dc.loaded) dc.speak(v);
                    dc.insert(v);
                  }
                  if ($A.isFn(dc.onValidate)) dc.onValidate(dc, dc.target);
                },
                on: {
                  focus: function (ev, dc) {
                    if (
                      !dc.isError &&
                      !dc.isResponsive &&
                      !dc.isManualOpen &&
                      this === trigger
                    )
                      dc.render();
                    else if (dc.isError || dc.isResponsive) {
                      if (dc.isError) dc.remove();
                      dc.validate(dc, dc.target);
                      if ($A.isFn(dc.onValidate)) dc.onValidate(dc, dc.target);
                    }
                  },
                  blur: function (ev, dc) {
                    if (!dc.isError) {
                      if (!$A.isTouch) dc.remove();
                    } else if (!dc.isResponsive) {
                      dc.validateCondition(dc);
                    }
                  },
                  touchstart: function (ev, dc) {
                    if (!dc.isError && !dc.isResponsive && !dc.isManualOpen)
                      dc.render();
                    else if (dc.isError || dc.isResponsive) {
                      if (dc.isError) dc.remove();
                      dc.validate(dc, dc.target);
                      if ($A.isFn(dc.onValidate)) dc.onValidate(dc, dc.target);
                    }
                  },
                  click: function (ev, dc) {
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
                  mouseenter: function (ev, dc) {
                    if (
                      !dc.isError &&
                      !dc.isManualOpen &&
                      !dc.isFocusOnly &&
                      !dc.isResponsive
                    )
                      dc.render();
                  },
                  mouseleave: function (ev, dc) {
                    if (
                      !dc.isError &&
                      !dc.isManualClose &&
                      !dc.isFocusOnly &&
                      !dc.isResponsive
                    )
                      dc.remove();
                  },
                  keyup: function (ev, dc) {
                    if (dc.isResponsive && dc.target.value !== dc.value) {
                      dc.value = dc.target.value;
                      dc.validateCondition(dc);
                    } else if (dc.isError || dc.isResponsive) {
                      dc.validate(dc, dc.target);
                      if ($A.isFn(dc.onValidate)) dc.onValidate(dc, dc.target);
                    }
                  },
                  change: function (ev, dc) {
                    if (dc.isResponsive && dc.target.value !== dc.value) {
                      dc.value = dc.target.value;
                      dc.validateCondition(dc);
                    } else if (dc.isError || dc.isResponsive) {
                      dc.validate(dc, dc.target);
                      if ($A.isFn(dc.onValidate)) dc.onValidate(dc, dc.target);
                    }
                  },
                },
              },
              config || {},
            );
          },
          dcArray = [];

        $A.query(o, config.context || document, function (i, o) {
          var tooltip = null,
            error = null,
            id = config.id || o.id || $A.genId();

          if (!config.isError && config.isResponsive) config.isError = true;

          if ($A.hasAttr(o, "data-tooltip")) {
            var dt = $A.getAttr(o, "data-tooltip");
            tooltip = {
              id: id + "T",
              target: o,
              trigger: o,
            };
            if ($A.isPath(dt)) tooltip.fetch = $A.toFetch(dt);
            else tooltip.content = $A.morph(dt);
          }

          if ($A.hasAttr(o, "data-error")) {
            var de = $A.getAttr(o, "data-error");
            error = {
              id: id + "E",
              target: o,
              trigger: o,
              isError: true,
            };
            if ($A.isPath(de)) error.fetch = $A.toFetch(de);
            else error.content = $A.morph(de);
          }

          if (error) dcArray.push($A.toDC($A.extend(baseDC(o), error)));

          if (tooltip) {
            dcArray.push($A.toDC($A.extend(baseDC(o), tooltip)));
            if (
              tooltip.content &&
              !config.isFocusOnly &&
              !config.isError &&
              !config.isResponsive &&
              !config.isManualOpen &&
              !config.isAlert &&
              !config.isIE
            )
              $A.setAttr(o, "aria-description", $A.getText(tooltip.content));
          }

          if (!error && !tooltip) {
            dcArray.push(
              $A.toDC(
                $A.extend(baseDC(o), {
                  id: id,
                  target: o,
                  trigger: o,
                }),
              ),
            );
            if (
              config.content &&
              !config.isFocusOnly &&
              !config.isError &&
              !config.isResponsive &&
              !config.isManualOpen &&
              !config.isAlert &&
              !config.isIE
            )
              $A.setAttr(
                o,
                "aria-description",
                $A.getText($A.morph(config.content)),
              );
          }
        });

        return dcArray.length === 1 ? dcArray[0] : dcArray;
      },
    });
  }
})();
