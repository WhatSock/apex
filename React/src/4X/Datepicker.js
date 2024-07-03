import React, { useEffect, useRef } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Datepicker.css";
import icon from "./img/datepicker/calendar-button.svg";

// Import the Apex 4X bundle build.
import "apex4x";

const Datepicker = ({ label, placeholder, inputName, config }) => {
  const $A = window.$A;
  const inputId = useRef($A.genId()).current;
  const toggleId = useRef($A.genId()).current;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const input = $A.get(inputId);
    const toggle = $A.get(toggleId);

    $A.setDatepicker(
      $A.extend(
        {
          toggle: toggle,
          input: input,
          // Optionally convert the static year field into a year selector dropdown.
          yearSelect: true,
          yearSelectMin: 1900,
          yearSelectMax: new Date().getFullYear() + 5,
          // Optionally convert the static month field into a month selector dropdown.
          monthSelect: true,
          // Force the month/year select dropdown to render instead of a button.
          forceSelect: true,
          style: { position: "absolute", zIndex: 1, display: "none" },
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
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Datepicker.txt
        },
        config || {},
      ),
    );
  }, [$A, inputId, toggleId, label, placeholder, inputName, config]);

  return (
    <div className="dateField">
      <div className="dateField--flex-item">
        <label htmlFor={inputId}>{label}</label>
        <input
          placeholder={placeholder}
          id={inputId}
          type="text"
          name={inputName}
        />
        <button id={toggleId} className="accCalendar aria-date-picker">
          <img src={icon} alt="Calendar" title="Calendar" />
        </button>
      </div>
    </div>
  );
};

export default Datepicker;
