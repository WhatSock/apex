import React, { useEffect } from "react";
import "./Toggle.css";
import icon from "../img/cb/down.svg";

// Import the Apex 4X bundle build.
import "apex4x";

const Toggle = ({ label, id }) => {
  const $A = window.$A;

  useEffect(() => {
    // Initialize or use $A functionalities here
  }, [$A, id, label]);

  return (
    <img
      id={id}
      title={label}
      alt={label}
      src={icon}
      className="aria-combobox-toggle"
    />
  );
};

export default Toggle;
