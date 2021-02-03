/*!
ARIA Smooth Scroll and Skip Link Module 1.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("scrollTo" in $A)) {
    $A.import("Animate", {
      name: "SmoothScrollModule",
      props: props,
      once: true,
      call: function(props) {
        $A.extend({
          isScrolling: false,
          scrollTo: function(o, config, fn) {
            if (this._4X) {
              fn = config;
              config = o;
              o = this._X;
            }
            if ($A.isFn(config)) {
              fn = config;
              config = null;
            }
            if (!$A.isDOMNode(o)) o = $A.morph(o);
            if ($A.isDOMNode(o)) {
              $A.isScrolling = true;
              window.Velocity(
                o,
                "scroll",
                $A.extend(
                  {
                    duration: 700,
                    easing: "ease-in",
                    complete: function() {
                      $A.isScrolling = false;
                      if ($A.isFn(fn)) fn.call(o, o, fn.target);
                    }
                  },
                  config || {}
                )
              );
            }
            return $A._XR.call(this, o);
          },
          moveTo: function(o, config, fn) {
            if (this._4X) {
              fn = config;
              config = o;
              o = this._X;
            }
            o = $A.morph(o);
            if ($A.isDOMNode(o)) {
              $A.scrollTo(
                o,
                config,
                fn ||
                  function(o) {
                    $A.focus(o);
                  }
              );
            }
            return $A._XR.call(this, o);
          },
          skipTo: function(o, targ, config, fn) {
            if (this._4X) {
              fn = config;
              config = targ;
              targ = o;
              o = this._X;
            }
            o = $A.morph(o);
            targ = $A.morph(targ);
            if ($A.isDOMNode(o) && $A.isDOMNode(targ)) {
              o = $A.setSkipLink(
                o,
                $A.extend(
                  {
                    target: targ,
                    skipReturn: true,
                    callback: fn
                  },
                  config || {}
                )
              );
            }
            return $A._XR.call(this, o);
          },
          setSkipLink: function(l, config, c, skipReturn) {
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
            if (!$A.isDOMNode(c, null, document)) c = document;
            $A.query(l, c, function(i, o) {
              var t = config.target || $A.getAttr(o, "href");
              if ($A.isSelector(t)) t = c.querySelector(t);
              if ($A.isDOMNode(t) && !$A.data(o, "_isBoundFn")) {
                $A.data(o, "_isBoundFn", true);
                $A.bindObjects(o, t);
                $A.on(o, {
                  click: function(ev) {
                    $A.bindObjects(o, t);
                    if ($A.isFn(fn)) fn.target = t;
                    $A.moveTo(t, config.override || {}, fn);
                    ev.preventDefault();
                  }
                });
                if (offscreen) {
                  $A.setOffScreen(o);
                  $A.on(o, {
                    focus: function(ev) {
                      $A.css(o, $A.extend({}, $A.sraCSSClear, styleObj || {}));
                    },
                    blur: function(ev) {
                      $A.setOffScreen(o);
                    }
                  });
                }
                if (!skip && $A.isFocusable(t))
                  $A.on(t, {
                    click: function(ev) {
                      if ($A.isFn(fn)) fn.target = $A.boundTo(t);
                      $A.moveTo($A.boundTo(t), config.override || {}, fn);
                      ev.preventDefault();
                    }
                  });
              }
            });

            return $A._XR.call(this, l);
          }
        });
      }
    });
  }
})();
