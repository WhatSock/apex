import React, { useEffect } from "react";
import "../node_modules/apex4x/Templates/Popups/Internal/css/customize.css";
import "apex4x";

const ExamplePopup = ({ id, label, message, title }) => {
  const $A = window.$A;
  const containerId = $A.genId();

  useEffect(() => {
    // Initialize or use $A functionalities here
    const myButton = $A.get(id);
    $A.setPopup(myButton, {
      role: title,
      isAlert: false,
      circularTabbing: true,
      style: { display: "none" },
      animate: {
        onRender: function (dc, wrapper, next) {
          window.Velocity(wrapper, "transition.fadeIn", {
            complete: function () {
              // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
              next();
            },
          });
        },
        onRemove: function (dc, wrapper, next) {
          window.Velocity(wrapper, "transition.fadeOut", {
            complete: function () {
              // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
              next();
            },
          });
        },
      },
      afterRender: function (dc) {
        // Do something after the popup is rendered.
      },
    });
  }, [$A, id, message, title]);

  return (
    <strong>
      <button className="popupTrigger" id={id} data-controls={containerId}>
        {label}
      </button>
      <div className="popup" id={containerId} hidden>
        <button aria-label="Close" className="CloseDC">
          X
        </button>
        <div>
          <div dangerouslySetInnerHTML={{ __html: message }} />
        </div>
      </div>
    </strong>
  );
};

export default ExamplePopup;
