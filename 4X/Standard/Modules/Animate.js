/*@license
Animate Module 1.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: Velocity.js, VelocityUI.js
*/

(function() {
  $A.extend({
    hide: function(o, effect, config, fn) {
      if (this._4X) {
        fn = config;
        config = effect;
        effect = o;
        o = this._X;
      }
      o = $A.morph(o);
      if ($A.isFn(config)) {
        fn = config;
        config = null;
      }
      if ($A.isNode(o)) {
        Velocity(
          o,
          effect || "transition.fadeOut",
          $A.extend(
            {
              complete: function() {
                if ($A.isFn(fn)) fn.call(o, o);
              }
            },
            config || {}
          )
        );
      }
      return $A._XR.call(this, o);
    },
    show: function(o, effect, config, fn) {
      if (this._4X) {
        fn = config;
        config = effect;
        effect = o;
        o = this._X;
      }
      o = $A.morph(o);
      if ($A.isFn(config)) {
        fn = config;
        config = null;
      }
      if ($A.isNode(o)) {
        Velocity(
          o,
          effect || "transition.fadeIn",
          $A.extend(
            {
              complete: function() {
                if ($A.isFn(fn)) fn.call(o, o);
              }
            },
            config || {}
          )
        );
      }
      return $A._XR.call(this, o);
    }
  });
})();
