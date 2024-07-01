import React, { useEffect } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Toggle.css";

// Import the Apex 4X bundle build.
import "apex4x";

const Toggle = ({ label, onActivate, pressed, config }) => {
  const $A = window.$A;
  const id = $A.genId();

  useEffect(() => {
    // Initialize or use $A functionalities here
    const ariaToggle = $A.get(id);
    ariaToggle.setAttribute(
      "data-toggle",
      pressed === "true" ? "true" : "false",
    );

    const handleActivate = (ev, triggerNode, boundTo, pressed, set) => {
      if (onActivate) {
        onActivate(ev, triggerNode, boundTo, pressed, set);
      }
      ev.preventDefault();
    };

    $A.setToggle(
      ariaToggle,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Button.txt
          toggleClassName: "pressed",
          onActivate: handleActivate,
        },
        config || {},
      ),
    );
  }, [$A, id, label, onActivate, pressed, config]);

  return (
    <div data-toggle="" className="aria-button toggle" id={id}>
      <span>{label}</span>
    </div>
  );
};

export default Toggle;
