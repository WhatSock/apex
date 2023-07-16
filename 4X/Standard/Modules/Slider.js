/*@license
ARIA Slider Module 1.3 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: CurrentDevice.js, Dragdealer.js
*/

(function () {
  if (!("Slider" in $A)) {
    $A.extend({
      Slider: function (o, config) {
        if ($A.isPlainObject(o)) {
          config = o;
          o = config.slideBar || null;
        }
        if (!o) return null;
        o = config.slideBar = $A.morph(o);
        var handle = $A.first(o);
        if (!handle) return null;
        var that = this,
          getReverseCurrent = function (i) {
            return config.max - ($A.isNum(i) ? i : config.current) + 1;
          };

        that.getPercent = function () {
          return Math.round((config.valueNow / config.valueMax) * 100) + "%";
        };

        that.computeSteps = function () {
          config.min = 1;
          if (config.valueMin <= 0) {
            var os = Math.abs(config.valueMin) + 1;
            config.max = os + config.valueMax;
          } else if (config.valueMin > 1) {
            config.max = config.valueMax - config.valueMin + 1;
          } else {
            config.max = config.valueMax;
          }
          config.current = that.getCurrent();
        };

        that.getValue = function (i) {
          return Math.round(
            config.valueMin +
              ((config.valueReverse
                ? getReverseCurrent($A.isNum(i) ? i : config.current)
                : $A.isNum(i)
                ? i
                : config.current) -
                1),
          );
        };

        that.getCurrent = function () {
          var c = 1;
          if (config.valueMin <= 0) {
            var os = Math.abs(config.valueMin) + 1;
            if (config.valueNow < 0)
              c = Math.abs(config.valueMin) - Math.abs(config.valueNow) + 1;
            else c = os + config.valueNow;
          } else if (config.valueMin > 1) {
            if (config.valueNow === config.valueMin) c = 1;
            else if (config.valueNow > config.valueMin)
              c = config.valueNow - config.valueMin + 1;
          } else {
            c = config.min;
          }
          return config.valueReverse ? getReverseCurrent(c) : c;
        };

        that.refreshValues = function () {
          var dir = config.orientation(o);
          $A.setAttr(handle, {
            "aria-orientation": dir,
            "aria-valuemin": config.valueMin,
            "aria-valuemax": config.valueMax,
            "aria-valuenow": config.valueNow,
            "aria-valuetext": config.valueChange(
              config.valueNow,
              config.valueMin,
              config.valueMax,
              that,
            ),
          });
        };

        config = $A.extend(
          true,
          {
            label: null,
            description: null,
            slideBar: null,
            valueMin: 0,
            valueMax: 100,
            valueNow: 0,
            valueReverse: false,
            decreaseBtn: ".slider.decrease.button",
            decreaseBtnLabel: "Decrease",
            increaseBtn: ".slider.increase.button",
            increaseBtnLabel: "Increase",
            orientation: function (o) {
              var d = $A.width(o) > $A.height(o) ? "horizontal" : "vertical";
              config.isVertical = d === "vertical";
              return d;
            },
            dragStart: function (
              x,
              y,
              valueNow,
              valueMin,
              valueMax,
              sliderInstance,
            ) {},
            dragging: function (
              x,
              y,
              valueNow,
              valueMin,
              valueMax,
              sliderInstance,
            ) {},
            dragEnd: function (
              x,
              y,
              valueNow,
              valueMin,
              valueMax,
              sliderInstance,
            ) {},
            valueChange: function (
              valueNow,
              valueMin,
              valueMax,
              sliderInstance,
            ) {
              return sliderInstance.getPercent();
            },
            dragdealer: {
              disabled: false,
              snap: false,
              slide: false,
              loose: false,
              handleClass: "handle",
              css3: true,
            },
          },
          config || {},
        );

        $A.setAttr(handle, {
          role: "slider",
          "aria-description": $A.isStr(config.description)
            ? config.description
            : " ",
          tabindex: 0,
        });
        if ($A.isStr(config.label))
          $A.setAttr(handle, "aria-label", config.label);

        that.computeSteps();
        that.refreshValues();

        var init = false,
          fn = function (c, vn) {
            config.valueNow = Math.round(vn);
            $A.setAttr(handle, {
              "aria-valuenow": config.valueNow,
              "aria-valuetext": config.valueChange(
                config.valueNow,
                config.valueMin,
                config.valueMax,
                that,
              ),
            });
          },
          dd = new $A.Dragdealer(
            o,
            $A.extend(
              {
                horizontal: !config.isVertical,
                vertical: config.isVertical,
                x: 0,
                y: 0,
                steps: config.max,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                callback: function (x, y) {
                  var c = this.getStep()[config.isVertical ? 1 : 0],
                    vn = that.getValue(c);
                  fn(c, vn);
                },
                dragStartCallback: function (x, y) {
                  this.options.dragging = true;
                  config.dragStart.call(
                    that,
                    x,
                    y,
                    that.getValue(this.getStep()[config.isVertical ? 1 : 0]),
                    config.valueMin,
                    config.valueMax,
                    that,
                  );
                },
                dragStopCallback: function (x, y) {
                  this.options.dragging = false;
                  var c = (config.current =
                      this.getStep()[config.isVertical ? 1 : 0]),
                    vn = that.getValue(c);
                  fn(c, vn);
                  config.dragEnd.call(
                    that,
                    x,
                    y,
                    vn,
                    config.valueMin,
                    config.valueMax,
                    that,
                  );
                },
                animationCallback: function (x, y) {
                  if (init && this.options.dragging) {
                    var c = this.getStep()[config.isVertical ? 1 : 0],
                      vn = that.getValue(c);
                    if (c !== config.current) config.current = c;
                    fn(c, vn);
                    config.dragging.call(
                      that,
                      x,
                      y,
                      vn,
                      config.valueMin,
                      config.valueMax,
                      that,
                    );
                  }
                },
              },
              config.dragdealer || {},
            ),
          );
        init = true;

        that.dd = dd;

        that.disable = function (b) {
          dd[b ? "disable" : "enable"]();
          $A.setAttr(handle, {
            "aria-disabled": b ? "true" : "false",
            tabindex: b ? -1 : 0,
          });
        };

        that.setMin = function (i) {
          if ($A.isNum(i)) config.valueMin = i;
          that.computeSteps();
          that.refreshValues();
        };

        that.setMax = function (i) {
          if ($A.isNum(i)) config.valueMax = i;
          that.computeSteps();
          that.refreshValues();
        };

        that.setValue = function (i) {
          if ($A.isNum(i)) config.valueNow = Math.round(i);
          config.current = that.getCurrent();
          if (config.isVertical) dd.setStep(1, config.current);
          else dd.setStep(config.current, 1);
        };

        that.setCurrent = function (i) {
          if ($A.isNum(i)) config.current = Math.round(i);
          config.valueNow = that.getValue();
          if (config.isVertical) dd.setStep(1, config.current);
          else dd.setStep(config.current, 1);
        };

        that.setValueChange = function (f) {
          if ($A.isFn(f)) config.valueChange = f;
          that.refreshValues();
        };

        that.back = function (m) {
          if (config.current > config.min) that.setCurrent(config.current - 1);
        };

        that.next = function (m) {
          if (config.current < config.max) that.setCurrent(config.current + 1);
        };

        that.home = function (m) {
          that.setCurrent(config.min);
        };

        that.end = function (m) {
          that.setCurrent(config.max);
        };

        that.pageDown = function (m) {
          var r = config.current - Math.round(config.max * 0.1);
          config.current = r < config.min ? config.min : r;
          that.setCurrent(config.current);
        };

        that.pageUp = function (m) {
          var r = config.current + Math.round(config.max * 0.1);
          config.current = r > config.max ? config.max : r;
          that.setCurrent(config.current);
        };

        $A.on(
          handle,
          {
            keydown: function (ev) {
              var k = $A.keyEvent(ev);
              if ((k >= 37 && k <= 40) || (k >= 33 && k <= 36)) {
                dd.options.kb = true;
                if (config.isVertical) {
                  if (k === 37 || k === 38) that.back(true);
                  else if (k === 39 || k === 40) that.next(true);
                  else if (k === 35) that.end(true);
                  else if (k === 36) that.home(true);
                  else if (k === 34) that.pageUp(true);
                  else if (k === 33) that.pageDown(true);
                } else {
                  if (k === 37 || k === 40) that.back(true);
                  else if (k === 38 || k === 39) that.next(true);
                  else if (k === 35) that.end(true);
                  else if (k === 36) that.home(true);
                  else if (k === 33) that.pageUp(true);
                  else if (k === 34) that.pageDown(true);
                }
                ev.stopPropagation();
                ev.preventDefault();
              }
            },
            keyup: function (ev) {},
            touchstart: function (ev) {
              dd.options.touched = true;
            },
          },
          ".ariaslider",
        );

        if (
          $A.isTouch ||
          window.device.type === "mobile" ||
          window.device.type === "tablet"
        ) {
          $A(config.slideBar.parentNode.querySelector(config.decreaseBtn))
            .on(
              "click",
              function (ev) {
                that.back();
                ev.stopPropagation();
                ev.preventDefault();
              },
              ".ariaslider",
            )
            .setAttr({
              role: "button",
              "aria-label": config.decreaseBtnLabel,
              "aria-description": config.label,
            });

          $A(config.slideBar.parentNode.querySelector(config.increaseBtn))
            .on(
              "click",
              function (ev) {
                that.next();
                ev.stopPropagation();
                ev.preventDefault();
              },
              ".ariaslider",
            )
            .setAttr({
              role: "button",
              "aria-label": config.increaseBtnLabel,
              "aria-description": config.label,
            });
        }

        that.setCurrent();

        if (dd.disabled || $A.getAttr(handle, "aria-disabled") === "true")
          that.disable(true);

        return that;
      },
    });
  }
})();
