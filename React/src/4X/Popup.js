import React, { useEffect } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Popup.css";

// Import the Apex 4X bundle build.
import "apex4x";

const Popup = ({ buttonLabel, popupTitle, popupMessage, config }) => {
  const $A = window.$A;
  const buttonId = $A.genId();
  const popupId = $A.genId();

  useEffect(() => {
    // Initialize or use $A functionalities here
    const triggerButton = $A.get(buttonId);

    $A.setPopup(
      triggerButton,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Popup.txt
          role: popupTitle,
          announce: false,
          animate: {
            onRender: function (dc, wrapper, next) {
              $A.Velocity(wrapper, "transition.fadeIn", {
                complete: function () {
                  // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                  next();
                },
              });
            },
            onRemove: function (dc, wrapper, next) {
              $A.Velocity(wrapper, "transition.fadeOut", {
                complete: function () {
                  // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                  next();
                },
              });
            },
          },
          afterRender: function (dc) {
            // Do something after the popup is rendered.
            $A.announce(popupMessage);
          },
        },
        config || {},
      ),
    );
  }, [$A, buttonLabel, popupTitle, popupMessage, config, buttonId, popupId]);

  return (
    <strong>
      <button className="popupTrigger" id={buttonId} data-controls={popupId}>
        {buttonLabel}
      </button>
      <div className="popup" id={popupId} hidden>
        <button aria-label="Close Popup" className="CloseDC">
          <strong aria-hidden="true">X</strong>
        </button>
        <div>
          <div dangerouslySetInnerHTML={{ __html: popupMessage }} />
        </div>
      </div>
    </strong>
  );
};

export default Popup;
