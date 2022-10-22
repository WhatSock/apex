/*@license
ARIA Smooth Scroll and Skip Link Module 1.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: Animate.js
*/

(function () {
  if (!("scrollTo" in $A)) {
    $A.extend({
      isScrolling: false,
      scrollTo: function (o, config, fn) {
        if (this._4X) {
          fn = config;
          config = o;
          o = this._X;
        }
        if ($A.isFn(config)) {
          fn = config;
          config = null;
        }
        if (!$A.isNode(o)) o = $A.morph(o);
        if ($A.isNode(o)) {
          $A.isScrolling = true;
          window.Velocity(
            o,
            "scroll",
            $A.extend(
              {
                duration: 700,
                easing: "ease-in",
                complete: function () {
                  $A.isScrolling = false;
                  if ($A.isFn(fn)) fn.call(o, o, fn.target);
                },
              },
              config || {}
            )
          );
        }
        return $A._XR.call(this, o);
      },
      moveTo: function (o, config, fn) {
        if (this._4X) {
          fn = config;
          config = o;
          o = this._X;
        }
        o = $A.morph(o);
        if ($A.isNode(o)) {
          $A.scrollTo(
            o,
            config,
            fn ||
              function (o) {
                $A.focus(o);
              }
          );
        }
        return $A._XR.call(this, o);
      },
      skipTo: function (o, targ, config, fn) {
        if (this._4X) {
          fn = config;
          config = targ;
          targ = o;
          o = this._X;
        }
        o = $A.morph(o);
        targ = $A.morph(targ);
        if ($A.isNode(o) && $A.isNode(targ)) {
          o = $A.setSkipLink(
            o,
            $A.extend(
              {
                target: targ,
                skipReturn: true,
                callback: fn,
              },
              config || {}
            )
          );
        }
        return $A._XR.call(this, o);
      },
      setSkipLink: function (l, config, c, skipReturn) {
        if (this._4X) {
          c = config;
          config = l;
          l = this._X;
        }
        if (!config) config = {};
        var fn = config.callback || null,
          offscreen = config.isOffScreen || false,
          styleObj = config.style || {},
          c = config.context || c,
          skip = skipReturn || config.skipReturn ? true : false;
        if (!$A.isNode(c, null, document)) c = document;
        $A.query(l, c, function (i, o) {
          var t = config.target || $A.getAttr(o, "href");
          if ($A.isSelector(t)) t = c.querySelector(t);
          if ($A.isNode(t) && !$A.data(o, "_isBoundFn")) {
            $A.data(o, "_isBoundFn", true);
            $A.bindObjects(o, t);
            $A.on(o, {
              click: function (ev) {
                $A.bindObjects(o, t);
                if ($A.isFn(fn)) fn.target = t;
                $A.moveTo(t, config.override || {}, fn);
                ev.preventDefault();
              },
            });
            if (offscreen) {
              $A.setOffScreen(o);
              $A.on(o, {
                focus: function (ev) {
                  $A.css(o, $A.extend({}, $A.sraCSSClear, styleObj || {}));
                },
                blur: function (ev) {
                  $A.setOffScreen(o);
                },
              });
            }
            if (!skip && $A.isFocusable(t))
              $A.on(t, {
                click: function (ev) {
                  if ($A.isFn(fn)) fn.target = $A.boundTo(t);
                  $A.moveTo($A.boundTo(t), config.override || {}, fn);
                  ev.preventDefault();
                },
              });
          }
        });

        return $A._XR.call(this, l);
      },
    });
  }
})();
