import React, { useEffect } from "react";

// Import the Apex 4X bundle build.
import "apex4x";

const Radio = ({ label, value, checked, groupName }) => {
  const $A = window.$A;
  const id = $A.genId();

  useEffect(() => {
    // Initialize or use $A functionalities here
    const ariaRadio = $A.get(id);
    $A.data(ariaRadio, "value", value);
    $A.data(ariaRadio, "groupName", groupName);
  }, [$A, id, label, value, checked, groupName]);

  return (
    <div
      data-radio={checked ? "true" : "false"}
      className="aria-radio"
      id={id}
      data-name={groupName}
      data-value={value}
    >
      <span>{label}</span>
    </div>
  );
};

export default Radio;
