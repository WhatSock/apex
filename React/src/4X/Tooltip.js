import React, { useEffect, useRef } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Tooltip.css";

// Import the Apex 4X bundle build.
import "apex4x";

const Tooltip = ({ trigger, message, config }) => {
  const $A = window.$A;
  const id = useRef($A.genId()).current;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const triggerElement = $A.get(trigger);
    const tooltip = $A.get(id);
    $A.insert(message, tooltip);

    $A.setTooltip(
      triggerElement,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Tooltip.txt
          content: tooltip,
          autoCloseSameWidget: true,
          className: "tooltip",
          animate: {
            onRender: function (dc, wrapper, next) {
              $A.Velocity(wrapper, "transition.fadeIn", {
                complete: function () {
                  // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                  next();
                },
              });
            },
            onRemove: function (dc, wrapper, next) {
              $A.Velocity(wrapper, "transition.fadeOut", {
                complete: function () {
                  // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                  next();
                },
              });
            },
          },
        },
        config || {},
      ),
    );
  }, [$A, id, trigger, message, config]);

  return <div hidden id={id} />;
};

export default Tooltip;
