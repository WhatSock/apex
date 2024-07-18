import React, { useEffect } from "react";

// Import the Apex 4X bundle build.
import "apex4x";

const Input = ({ label, required, readOnly, name, clsName, id }) => {
  const $A = window.$A;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const input = $A.get(id);
    input.required = required === true;
    input.readOnly = readOnly === true;
  }, [$A, id, label, required, readOnly, name, clsName]);

  return (
    <label className={clsName || "aria-combobox-input"} htmlFor={id}>
      {label}:
      <input type="text" id={id} name={name} />
    </label>
  );
};

export default Input;
