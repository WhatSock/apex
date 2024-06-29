import React, { useEffect } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Button.css";

// Import the Apex 4X bundle build.
import "apex4x";

const Button = ({ label, onActivate, config }) => {
  const $A = window.$A;
  const id = $A.genId();

  useEffect(() => {
    // Initialize or use $A functionalities here
    const ariaButton = $A.get(id);

    const handleActivate = (ev) => {
      if (onActivate) {
        onActivate(ev);
      }
      ev.preventDefault();
    };

    $A.setButton(
      ariaButton,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Button.txt
          onActivate: handleActivate,
        },
        config || {},
      ),
    );
  }, [$A, id, label, onActivate, config]);

  return (
    <div className="aria-button" id={id}>
      {label}
    </div>
  );
};

export default Button;
