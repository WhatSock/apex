import React, { useEffect } from "react";
import "apex4x";

const ExampleButton = ({ id, label, onActivate }) => {
  const $A = window.$A;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const myButton = $A.get(id);

    const handleActivate = (ev) => {
      if (onActivate) {
        onActivate(ev);
      }
      ev.preventDefault();
    };

    $A.setButton(myButton, {
      onActivate: handleActivate,
    });

    return () => {
      // Do something on unmount
    };
  }, [$A, id, label, onActivate]);

  return (
    <div className="aria-button" id={id}>
      {label}
    </div>
  );
};

export default ExampleButton;
