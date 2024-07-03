import React, { useEffect, useRef } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Dialog.css";
import closeIcon from "./img/ic_close.svg";

// Import the Apex 4X bundle build.
import "apex4x";

const Dialog = ({ buttonLabel, dialogTitle, dialogMessage, config }) => {
  const $A = window.$A;
  const buttonId = useRef($A.genId()).current;
  const dialogId = useRef($A.genId()).current;
  const messageId = useRef($A.genId()).current;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const triggerButton = $A.get(buttonId);
    const message = $A.get(messageId);
    $A.insert(dialogMessage, message);

    $A.setDialog(
      triggerButton,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Dialog.txt
          role: dialogTitle,
          animate: {
            onRender: function (dc, wrapper, next) {
              $A.Velocity(wrapper, "transition.slideDownIn", {
                complete: function () {
                  // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                  next();
                },
              });
            },
            onRemove: function (dc, wrapper, next) {
              $A.Velocity(wrapper, "transition.slideDownOut", {
                complete: function () {
                  // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                  next();
                },
              });
            },
          },
          afterRender: function (dc) {
            // Do something after the dialog is rendered.
            // $A.announce(message);
          },
        },
        config || {},
      ),
    );
  }, [
    $A,
    buttonLabel,
    dialogTitle,
    dialogMessage,
    config,
    buttonId,
    dialogId,
    messageId,
  ]);

  return (
    <span>
      <button id={buttonId} className="dialog-button" data-controls={dialogId}>
        <span>{buttonLabel}</span>
      </button>
      <div hidden id={dialogId}>
        <button className="CloseDC">
          <img src={closeIcon} alt="Close Dialog" title="Close Dialog" />
        </button>
        <h1>{dialogTitle}</h1>
        <div id={messageId} />
      </div>
    </span>
  );
};

export default Dialog;
