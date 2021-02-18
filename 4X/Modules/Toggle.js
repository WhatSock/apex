/*!
Toggle Module 3.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("Toggle" in $A))
    $A.extend({
      Toggle: function(trigger, config) {
        var config = config || {},
          t = $A.isStr(trigger) ? $A.get(trigger) : trigger,
          that = this,
          tRole = $A.getAttr(t, "role"),
          isCheckbox =
            tRole === "checkbox" || tRole === "switch" ? true : false,
          sraText = $A.create("span", null, $A.sraCSS),
          sAP = config.suppressARIAPressed ? true : false;

        if (!config.noToggle && config.noARIA) {
          if (!config.roleText) config.roleText = "Toggle";

          if (!config.stateText) config.stateText = "Pressed";

          t.appendChild(sraText);
        }

        var toggle = function(state) {
          var cr = true;

          if (config.callback && $A.isFn(config.callback))
            cr = config.callback.apply(t, [state]);

          if (cr) {
            if (!config.noToggle && config.noARIA)
              sraText.innerHTML = state
                ? "&nbsp;" + config.roleText + "&nbsp;" + config.stateText
                : "&nbsp;" + config.roleText;
            else if (!config.noToggle) {
              if (!sAP)
                $A.setAttr(
                  t,
                  isCheckbox ? "aria-checked" : "aria-pressed",
                  state ? "true" : "false"
                );
            }
            that.state = state;
          }
        };
        var nn = t.nodeName.toLowerCase();

        if (
          !(
            (nn === "input" &&
              ($A.getAttr(t, "type") === "button" ||
                $A.getAttr(t, "type") === "image")) ||
            (nn === "a" && $A.getAttr(t, "href")) ||
            nn === "button"
          )
        )
          $A.setAttr(t, "tabindex", "0");

        $A.off(t, "click keydown");

        $A.on(t, {
          keydown: function(ev) {
            var k = $A.keyEvent(ev);

            if (k === 13 || k === 32) {
              ev.preventDefault();
              ev.stopPropagation();

              if (
                !(
                  t.nodeName.toLowerCase() === "input" &&
                  t.type === "image" &&
                  k === 32
                )
              )
                $A.trigger(t, "click");
            }
          },
          click: function(ev) {
            toggle.apply(t, [that.state ? false : true]) ? true : false;
            ev.preventDefault();
          }
        });
        that.set = function(state) {
          toggle.apply(t, [state]);
        };

        if (!config.noToggle) toggle.apply(t, [config.state ? true : false]);

        return config.fn && $A.isFn(config.fn)
          ? config.fn.call(that, that)
          : that;
      }
    });
})();
