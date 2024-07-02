import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Datepicker from "./4X/Datepicker";
import Button from "./4X/Button";
import Checkbox from "./4X/Checkbox";
import Switch from "./4X/Switch";
import Toggle from "./4X/Toggle";
import RadioGroup from "./4X/RadioGroup";
import Popup from "./4X/Popup";
import Dialog from "./4X/Dialog";

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

      <h2>ARIA Datepicker</h2>
      <div>
        <a
          href="https://whatsock.com/Templates/Datepickers/#configure"
          target=""
        >
          Config Options...
        </a>
      </div>
      <div>
        <Datepicker
          label="Date of birth:"
          placeholder="MM/DD/YYYY"
          inputName="birthDate"
          config={{
            // Optional config overrides.

            // Using a token system, set a specific date string format to be used when setting the selected value into the calendar input box
            // 'YYYY': 4 digit year, 2019
            // 'YY': 2 digit year, 19
            // 'MMMM': Full name of month, January, etc.
            // 'dddd': Full name of weekday, Monday, etc.
            // 'MM': 2 digit month, 01, etc.
            // 'DD': 2 digit day, 01, etc.
            // 'Do': getDateOrdinalSuffix, 1st, 2nd, 3rd.
            // 'M': 1 or 2 digit month, 1 through 12
            // 'D': 1 or 2 digit day, 1 through 31.

            inputDateFormat: "MM/DD/YYYY",
            // View config options at:
            // node_modules/apex4x/Help/Module Imports/Widgets/Datepicker.txt
          }}
        />
      </div>
      <div>
        <Datepicker
          label="Credit card expiration date:"
          placeholder="MM/YY"
          inputName="expirationDate"
          config={{
            // Optionally hide individual dates to render month / year selector only.
            monthOnly: true,
            inputDateFormat: "MM/YY",
            // Optionally convert the static year field into a year selector dropdown.
            //    yearSelect: true,
            yearSelectMin: new Date().getFullYear(),
            yearSelectMax: new Date().getFullYear() + 5,
            // Optionally convert the static month field into a month selector dropdown.
            //    monthSelect: true,
            // Force the month/year select dropdown to render instead of a button.
            //    forceSelect: true,
            helpText:
              "Press the Spacebar on the Year or Month selector to open available options, use the Up and Down arrow keys to navigate, and Enter to save the current selection and close the calendar.",
          }}
        />
      </div>

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
              $A.Velocity(triggerNode, "callout.bounce");
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
          popupTitle="Information"
          popupMessage={`
<div class="message">
<p>Consider yourself informed!</p>
<p>So there...</p>
</div>
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

      <h2>ARIA Dialog</h2>
      <div>
        <a href="https://whatsock.com/Templates/Dialogs/#configure" target="">
          Config Options...
        </a>
      </div>
      <div>
        <Dialog
          buttonLabel="Login"
          dialogTitle="Login"
          dialogMessage={`
<div class="message">
                <form id="lbForm">
                  <p>
                    <label for="uname">Username:</label>
                    <input type="text" id="uname" name="uname" />
                  </p>
                  <p>
                    <label for="pass">Password:</label>
                    <input type="password" id="pass" name="pass" />
                  </p>
                  <p className="buttons-bar">
                    <input type="submit" id="lbSubmit" value="OK" />
                    <input
                      type="reset"
                      class="lbClose CloseDC"
                      id="lbCancel"
                      value="Cancel"
                    />
                  </p>
                </form>
</div>
`}
          config={{
            // Optional config overrides.

            // Specify the role name for the dialog that will be conveyed to screen reader users.
            role: "Login",

            // Set the class name for the top level container element
            className: "modal",

            // Set the class name for the close button.
            // This must match the class name for any close links or buttons within the dialog content, which will cause close event binding to automatically occur when the content is rendered.
            closeClassName: "CloseDC",

            // Optionally specify if the dialog is an alert message.
            // If true, a system alert will be fired when the dialog is rendered that will instantly convey the dialog content to screen reader users.
            isAlert: false,

            // Specify if the dialog is a modal dialog.
            isModal: true,

            // Optionally run a script after the dialog finishes rendering.
            afterRender: function (DC) {
              // DC.container includes the rendered dialog content.
              let frm = $A.get("lbForm");
              $A(frm).on("submit", (ev) => {
                if (!frm.uname.value) {
                  alert("Woops! You forgot your username...");
                  frm.uname.focus();
                } else if (!frm.pass.value) {
                  alert("Woops! You forgot your password...");
                  frm.pass.focus();
                } else {
                  alert("WOW!");
                  DC.remove();
                }
                ev.preventDefault();
              });
            },

            // Optionally run a script after the dialog is removed.
            afterRemove: function (DC) {
              // Do something.
            },

            // View config options at:
            // node_modules/apex4x/Help/Module Imports/Widgets/Dialog.txt
          }}
        />
      </div>
    </div>
  );
}

export default App;
