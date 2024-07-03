import React, { useEffect, useRef } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Switch.css";

// Import the Apex 4X bundle build.
import "apex4x";

const Switch = ({ label, onActivate, on, config }) => {
  const $A = window.$A;
  const id = useRef($A.genId()).current;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const ariaSwitch = $A.get(id);
    ariaSwitch.setAttribute("data-switch", on === "true" ? "true" : "false");

    const handleActivate = (ev, triggerNode, boundCheckbox, on, set) => {
      if (onActivate) {
        onActivate(ev, triggerNode, boundCheckbox, on, set);
      }
      ev.preventDefault();
    };

    $A.setSwitch(
      ariaSwitch,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Switch.txt
          onActivate: handleActivate,
        },
        config || {},
      ),
    );
  }, [$A, id, label, onActivate, on, config]);

  return (
    <div data-switch="" className="aria-switch" id={id}>
      <span className="aria-switch__label">{label}</span>
      <span className="aria-switch__button" aria-hidden="true"></span>
    </div>
  );
};

export default Switch;
