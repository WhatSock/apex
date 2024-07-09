import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Datepicker from "./4X/Datepicker";
import Button from "./4X/Button";
import Checkbox from "./4X/Checkbox";
import Switch from "./4X/Switch";
import Toggle from "./4X/Toggle";
import Menu from "./4X/Menu";
import RadioGroup from "./4X/RadioGroup";
import Popup from "./4X/Popup";
import Dialog from "./4X/Dialog";
import Tooltip from "./4X/Tooltip";

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
      <main>
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
          <a
            href="https://whatsock.com/Templates/Switches/#configure"
            target=""
          >
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

        <h2>ARIA Menu</h2>
        <div>
          <a href="https://whatsock.com/Templates/Menus/#configure" target="">
            Config Options...
          </a>
        </div>

        <div>
          <Menu
            buttonLabel="Simple Example"
            menuList={`
<ul hidden class="top menu">
  <li>
    <a href="#" class="has-submenu">
      Social Media
    </a>
    <ul hidden class="menu">
      <li>
        <a href="https://twitter.com" class="link">
          Twitter (X)
        </a>
      </li>
      <li>
        <a href="https://fb.com" class="link">
          Facebook (Meta)
        </a>
      </li>
    </ul>
  </li>
  <li>
    <a href="https://google.com" class="link">
      Google
    </a>
  </li>
</ul>
`}
            onActivate={(
              ev,
              triggerNode,
              RTI,
              boundElement,
              checked,
              set,
              isRadio,
            ) => {
              if (
                $A(triggerNode).hasAttr("href") &&
                $A(triggerNode).getAttr("href").indexOf("https://") !== -1
              )
                RTI.DC.top.remove(() => {
                  window.location.href = triggerNode.href;
                });
            }}
            config={
              {
                // Optional config overrides.
                // View config options at:
                // node_modules/apex4x/Help/Module Imports/Widgets/Menu.txt
              }
            }
          />
        </div>

        <div>
          <Menu
            buttonLabel="Settings"
            menuList={`
                <ul hidden class="top menu">
                  <li>
                    <a href="#" class="has-submenu">Profile</a>
                    <ul hidden class="menu">
                      <li>
                        <a href="#" class="has-submenu">Personal</a>
                        <ul hidden class="menu">
                          <li>
                            <a href="#" class="link" id="personal-name">Name</a>
                          </li>
                          <li>
                            <a href="#" class="link" id="personal-interests"
                              >Interests</a
                            >
                          </li>
                          <li>
                            <a href="#" class="link" id="personal-education"
                              >Education</a
                            >
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="#" class="has-submenu">Business</a>
                        <ul hidden class="menu">
                          <li>
                            <a href="#" class="link" id="business-name">Name</a>
                          </li>
                          <li>
                            <a href="#" class="link" id="business-contact"
                              >Contact</a
                            >
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#" class="has-submenu">Checkable Options</a>
                    <ul hidden class="menu">
                      <li>
                        <a data-check href="#" class="link" id="settings-editor"
                          >Editor</a
                        >
                      </li>
                      <li>
                        <a
                          data-check="true"
                          href="#"
                          class="link"
                          id="settings-cookies"
                          >Cookies</a
                        >
                      </li>
                      <li>
                        <a
                          data-check="mixed"
                          href="#"
                          class="link"
                          id="settings-toolbar"
                          >Toolbar</a
                        >
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="#" class="has-submenu">Radio Options</a>
                    <ul hidden class="menu">
                      <li>
                        <a
                          data-radio
                          href="#"
                          class="link"
                          id="account-username"
                          >Username</a
                        >
                      </li>
                      <li>
                        <a
                          data-radio="true"
                          href="#"
                          class="link"
                          id="account-password"
                          >Password</a
                        >
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      aria-disabled="true"
                      title="Disabled"
                      href="#"
                      class="has-submenu"
                      >Services</a
                    >
                    <ul hidden class="menu">
                      <li>
                        <a href="#" class="link" id="services-campaigns"
                          >Campaigns</a
                        >
                      </li>
                      <li>
                        <a href="#" class="link" id="services-payments"
                          >Payments</a
                        >
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      aria-disabled="true"
                      href="#"
                      class="link"
                      id="properties"
                      >Properties...</a
                    >
                  </li>
                  <li>
                    <a href="https://google.com/" class="link" id="help"
                      >Help...</a
                    >
                  </li>
                </ul>
`}
            onActivate={(
              ev,
              triggerNode,
              RTI,
              boundElement,
              checked,
              set,
              isRadio,
            ) => {
              // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
              // if 0, the checked state is "false".
              // if 1, the checked state is "true".
              // if 2, the checked state is "mixed".
              // The 'set' argument is a function that will set the checkable item to a new state.
              // The new value must be a string consisting of "false", "true", or "mixed".
              if ($A.isNum(checked)) {
                if (checked === 0 || isRadio) {
                  set("true");
                  RTI.DC.top.remove(() => {
                    alert(
                      "The new checked state for " +
                        triggerNode.id +
                        " is 'true'",
                    );
                  });
                } else if (checked === 1) {
                  set("mixed");
                  RTI.DC.top.remove(() => {
                    alert(
                      "The new checked state for " +
                        triggerNode.id +
                        " is 'mixed'",
                    );
                  });
                } else if (checked === 2) {
                  set("false");
                  RTI.DC.top.remove(() => {
                    alert(
                      "The new checked state for " +
                        triggerNode.id +
                        " is 'false'",
                    );
                  });
                }
              } else if (
                $A(triggerNode).hasAttr("href") &&
                $A(triggerNode).getAttr("href").indexOf("https://") !== -1
              )
                RTI.DC.top.remove(() => {
                  window.location.href = triggerNode.href;
                });
              else
                RTI.DC.top.remove(() => {
                  alert(triggerNode.id);
                });
            }}
            config={
              {
                // Optional config overrides.
                // View config options at:
                // node_modules/apex4x/Help/Module Imports/Widgets/Menu.txt
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

        <h2>ARIA Tooltip</h2>
        <div>
          <a
            href="https://whatsock.com/Templates/Tooltips/#configure"
            target=""
          >
            Config Options...
          </a>
        </div>
        <div>
          <div>
            <button
              id="trigger1id"
              className="action-btn"
              onClick={(ev) => {
                alert("Do something else.");
              }}
            >
              Action
            </button>
            <Tooltip
              trigger="trigger1id"
              message={`<p>WOW!</p>`}
              config={{
                // Optional config overrides.
                // View config options at:
                // node_modules/apex4x/Help/Module Imports/Widgets/Tooltip.txt
                autoPosition: 4,
                delay: 600,
                // delayTimeout: 3000,
                animate: {
                  onRender: function (dc, wrapper, next) {
                    $A.Velocity(wrapper, "transition.bounceLeftIn", {
                      complete: function () {
                        // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                        next();
                      },
                    });
                  },
                  onRemove: function (dc, wrapper, next) {
                    $A.Velocity(wrapper, "transition.bounceRightOut", {
                      complete: function () {
                        // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                        next();
                      },
                    });
                  },
                },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
