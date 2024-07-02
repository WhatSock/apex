import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Button from "./4X/Button";
import Checkbox from "./4X/Checkbox";
import Switch from "./4X/Switch";
import Toggle from "./4X/Toggle";
import RadioGroup from "./4X/RadioGroup";
import Popup from "./4X/Popup";

// Import the Apex 4X bundle build.
import "apex4x";

function App() {
  const $A = window.$A;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <h2>ARIA Button</h2>
      <div>
        <a
          href="https://whatsock.com/Templates/Accordions/#configure"
          target=""
        >
          Config Options...
        </a>
      </div>
      <div>
        <Button
          label="What?"
          onActivate={(ev) => {
            alert("Button activated from App.js!");
          }}
          config={
            {
              // Optional config overrides.
              // View config options at:
              // node_modules/apex4x/Help/Module Imports/Widgets/Button.txt
            }
          }
        />
      </div>

      <h2>ARIA Checkbox</h2>
      <div>
        <a
          href="https://whatsock.com/Templates/Checkboxes/#configure"
          target=""
        >
          Config Options...
        </a>
      </div>
      <div>
        <Checkbox
          label="Subscribe"
          checked="mixed"
          onActivate={(ev, triggerNode, boundCheckbox, checked, set) => {
            // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
            // if 0, the checked state is "false".
            // if 1, the checked state is "true".
            // if 2, the checked state is "mixed".
            // The 'set' argument is a function that will set the checkable item to a new state.
            // The new value must be a string consisting of "false", "true", or "mixed".
            if (checked === 1) {
              set("false");
            } else if (checked === 2) {
              set("true");
            } else if (checked === 0) {
              set("mixed");
            }
          }}
          config={
            {
              // Optional config overrides.
              // View config options at:
              // node_modules/apex4x/Help/Module Imports/Widgets/Checkbox.txt
            }
          }
        />
      </div>

      <h2>ARIA Switch</h2>
      <div>
        <a href="https://whatsock.com/Templates/Switches/#configure" target="">
          Config Options...
        </a>
      </div>
      <div>
        <Switch
          label="Thermostat"
          on="false"
          onActivate={(ev, triggerNode, boundCheckbox, on, set) => {
            // 'on' reflects the current attribute value for the checkable item, and is always a number if applicable.
            // if 0, the toggle state is "false".
            // if 1, the toggle state is "true".
            // The 'set' argument is a function that will set the checkable item to a new state.
            // The new value must be a string consisting of "false" or "true".
            if (on) {
              set("false");
            } else {
              set("true");
              window.Velocity(triggerNode, "callout.bounce");
            }
            ev.preventDefault();
          }}
          config={
            {
              // Optional config overrides.
              // View config options at:
              // node_modules/apex4x/Help/Module Imports/Widgets/Switch.txt
            }
          }
        />
      </div>

      <h2>ARIA Toggle</h2>
      <div>
        <a href="https://whatsock.com/Templates/Buttons/#configure" target="">
          Config Options...
        </a>
      </div>
      <div>
        <Toggle
          label="FAVORITE"
          pressed="true"
          onActivate={(ev, triggerNode, boundTo, pressed, set) => {
            // 'pressed' reflects the current attribute value for the toggleable item, and is always a number if applicable.
            // if 0, the pressed state is "false".
            // if 1, the pressed state is "true".
            // The 'set' argument is a function that will set the toggleable item to a new state.
            // The new value must be a string consisting of "false" or "true".
            if (pressed) {
              set("false");
            } else {
              set("true");
            }
            ev.preventDefault();
          }}
          config={
            {
              // Optional config overrides.
              // View config options at:
              // node_modules/apex4x/Help/Module Imports/Widgets/Button.txt
            }
          }
        />
      </div>

      <h2>ARIA RadioGroup</h2>
      <div>
        <a href="https://whatsock.com/Templates/Radios/#configure" target="">
          Config Options...
        </a>
      </div>
      <div>
        <RadioGroup
          groupName="uniqueSharedGroupName1"
          label="Rate your experience."
          radios={[
            { label: "Horrible", value: "radio-value1-horrible" },
            { label: "Shrug", value: "radio-value2-shrug" },
            { label: "Okay", value: "radio-value3-okay" },
            { label: "GNARLY!", value: "radio-value4-gnarly", checked: true },
          ]}
          onActivate={(ev, ariaRadio, boundTo, checked, set) => {
            // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
            // if 0, the checked state is "false".
            // if 1, the checked state is "true".
            // The 'set' argument is a function that will set the checkable item to a new state.
            // The new value must be a string consisting of "false" or "true".
            set("true"); // All other radios in the same group will be set to "false".
            let currentValue = $A.data(ariaRadio, "value");
            let currentRadioGroupName = $A.data(ariaRadio, "groupName");
            console.log(
              `The currently checked radio's value is "${currentValue}" within the radiogroup named "${currentRadioGroupName}".`,
            );
            ev.preventDefault();
          }}
          config={
            {
              // Optional config overrides.
              // View config options at:
              // node_modules/apex4x/Help/Module Imports/Widgets/Radio.txt
            }
          }
        />
      </div>

      <h2>ARIA Popup</h2>
      <div>
        <a href="https://whatsock.com/Templates/Popups/#configure" target="">
          Config Options...
        </a>
      </div>
      <div>
        <Popup
          buttonLabel="More Info"
          popupTitle="Info Popup"
          popupMessage={`
<h1>Information</h1>
<div>Consider yourself informed!</div>
`}
          config={
            {
              // Optional config overrides.
              // View config options at:
              // node_modules/apex4x/Help/Module Imports/Widgets/Popup.txt
            }
          }
        />
      </div>
    </div>
  );
}

export default App;
