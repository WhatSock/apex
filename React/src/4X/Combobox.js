import React, { useEffect, useRef } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./Combobox.css";

import ComboboxButton from "./cb/ComboboxButton";
import Input from "./cb/Input";
import Toggle from "./cb/Toggle";
import downIcon from "./img/cb/down.svg";
import upIcon from "./img/cb/up.svg";

// Import the Apex 4X bundle build.
import "apex4x";

const Combobox = ({
  label,
  select,
  required,
  readOnly,
  addToggle,
  toggleLabel,
  preset,
  useButton,
  insertValueAt,
  config,
}) => {
  const $A = window.$A;
  const id = useRef($A.genId()).current;
  const inputId = useRef($A.genId()).current;
  const toggleId = useRef($A.genId()).current;
  if (useButton) readOnly = true;

  useEffect(() => {
    // Initialize or use $A functionalities here
    const input = $A.get(inputId);
    const list = $A.get(id).querySelector("select");
    const insert = $A.get(insertValueAt) || null;

    const CB = new $A.Combobox({
      input: input,
      select: list,
      childNode: insert,
      delay: 200,
      style: { display: "none" },
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
      override: config || {},
    });

    if (addToggle) {
      CB.setAltTrigger($A.get(toggleId));

      // Add logic to process each time the toggle element state changes
      CB.onTriggerChange((img, openState) => {
        if (openState) {
          // Opened
          img.setAttribute("src", upIcon);
        } else {
          // Closed
          img.setAttribute("src", downIcon);
        }
      });
    }

    const presetInit = () => {
      // Default initial presets.
      CB.setDefault(false);
      CB.setShowAllIfEmpty(false);
      CB.setAutoComplete(true);
      if (!$A.isTouch) {
        CB.setPromptText(
          readOnly === true
            ? "Press the down arrow to browse available matches."
            : "First type then press the down arrow to browse available matches",
        );
      }
      if ($A.device.type === "desktop") {
        $A.on("toggletouch", (ev) => {
          CB.setPromptText(
            $A.isTouch
              ? ""
              : readOnly === true
                ? "Press the down arrow to browse available matches."
                : "First type then press the down arrow to browse available matches.",
          );
        });
      }
      CB.setSize(
        $A.device.type === "mobile" ? 3 : $A.device.type === "tablet" ? 5 : 7,
      );
      CB.onOpen((DC) => {
        // Do something.
      });
      CB.onClose((DC) => {
        // Do something.
      });
    };

    presetInit();
    if ($A.isFn(preset)) preset(CB);

    CB.start();
  }, [
    $A,
    id,
    inputId,
    toggleId,
    label,
    toggleLabel,
    addToggle,
    preset,
    config,
    select,
    required,
    readOnly,
    useButton,
    insertValueAt,
  ]);

  return (
    <span className="aria-combobox" id={id}>
      {(useButton && (
        <ComboboxButton label={label} required={required} id={inputId} />
      )) || (
        <Input
          label={label}
          required={required}
          readOnly={readOnly}
          id={inputId}
        />
      )}
      {addToggle && <Toggle label={toggleLabel} id={toggleId} />}
      {select}
    </span>
  );
};

export default Combobox;
