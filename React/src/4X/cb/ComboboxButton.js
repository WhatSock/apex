import React, { useEffect, useRef } from "react";
import "./ComboboxButton.css";

// Import the Apex 4X bundle build.
import "apex4x";

const ComboboxButton = ({ label, required, clsName, id }) => {
  const $A = window.$A;
  const labelId = useRef($A.genId()).current;

  useEffect(() => {
    // Initialize or use $A functionalities here
  }, [$A, id, labelId, label, required, clsName]);

  return (
    <span
      className={clsName || "aria-combobox button"}
      aria-labelledby={labelId}
      aria-readonly="true"
      aria-required={required === true ? "true" : "false"}
      id={id}
    >
      <span id={labelId} className="label">
        {label}
      </span>
      <sup></sup>
    </span>
  );
};

export default ComboboxButton;
