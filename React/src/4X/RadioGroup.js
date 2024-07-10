import React, { useEffect } from "react";
import "../../node_modules/apex4x/Templates/_common/css/colors.css";
import "./RadioGroup.css";

// Import the Apex 4X bundle build.
import "apex4x";

import Radio from "./Radio";

const RadioGroup = ({ label, groupName, onActivate, radios, config }) => {
  const $A = window.$A;

  useEffect(() => {
    // Initialize or use $A functionalities here

    const handleActivate = (ev, triggerNode, boundTo, checked, set) => {
      if (onActivate) {
        onActivate(ev, triggerNode, boundTo, checked, set);
      }
      ev.preventDefault();
    };

    $A.setRadio(
      `div[data-radio][data-group="${groupName}"]`,
      $A.extend(
        {
          // View config options at:
          // node_modules/apex4x/Help/Module Imports/Widgets/Radio.txt
          toggleClassName: "checked",
          onActivate: handleActivate,
        },
        config || {},
      ),
    );
  }, [$A, label, groupName, onActivate, radios, config]);

  return (
    <div className="aria-radiogroup" role="radiogroup" aria-label={label}>
      <h3>{label}</h3>
      <div>
        {radios.map((radio, i) => (
          <Radio
            key={i}
            label={radio.label}
            value={radio.value}
            checked={radio.checked ? true : false}
            groupName={groupName}
          />
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
