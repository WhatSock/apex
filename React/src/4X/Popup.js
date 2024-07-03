import React, { useEffect, useRef } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Popup.css";
import closeIcon from "./img/ic_close.svg";

// Import the Apex 4X bundle build.
import "apex4x";

const Popup = ({ buttonLabel, popupTitle, popupMessage, config }) => {
  const $A = window.$A;
  const buttonId = useRef($A.genId()).current;
  const popupId = useRef($A.genId()).current;
  const messageId = useRef($A.genId()).current;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const triggerButton = $A.get(buttonId);
    const message = $A.get(messageId);
    $A.insert(popupMessage, message);

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
            $A.announce(message);
          },
        },
        config || {},
      ),
    );
  }, [
    $A,
    buttonLabel,
    popupTitle,
    popupMessage,
    config,
    buttonId,
    popupId,
    messageId,
  ]);

  return (
    <span>
      <button className="popupTrigger" id={buttonId} data-controls={popupId}>
        {buttonLabel}
      </button>
      <div className="popup" id={popupId} hidden>
        <button className="CloseDC">
          <img src={closeIcon} alt="Close Popup" title="Close Popup" />
        </button>
        <h3>{popupTitle}</h3>
        <div id={messageId} />
      </div>
    </span>
  );
};

export default Popup;
