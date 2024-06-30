import React, { useEffect } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Checkbox.css";

// Import the Apex 4X bundle build.
import "apex4x";

const Checkbox = ({ label, onActivate, checked, config }) => {
  const $A = window.$A;
  const id = $A.genId();

  useEffect(() => {
    // Initialize or use $A functionalities here
    const ariaCheckbox = $A.get(id);
    ariaCheckbox.setAttribute(
      "data-check",
      checked === "mixed" ? "mixed" : checked === "true" ? "true" : "false",
    );

    const handleActivate = (ev, triggerNode, boundCheckbox, checked, set) => {
      if (onActivate) {
        onActivate(ev, triggerNode, boundCheckbox, checked, set);
      }
      ev.preventDefault();
    };

    $A.setCheckbox(
      ariaCheckbox,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Checkbox.txt
          onActivate: handleActivate,
        },
        config || {},
      ),
    );
  }, [$A, id, label, onActivate, checked, config]);

  return (
    <div data-check="" className="aria-checkbox" id={id}>
      <span>{label}</span>
    </div>
  );
};

export default Checkbox;
