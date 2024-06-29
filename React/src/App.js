import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Button from "./4X/Button";
import Checkbox from "./4X/Checkbox";
import Popup from "./4X/Popup";

function App() {
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
        <Button
          label="What?"
          onActivate={(ev) => {
            alert("Button activated from App.js!");
          }}
          config={
            {
              // Optional config overrides.
            }
          }
        />
      </div>

      <h2>ARIA Checkbox</h2>
      <div>
        <Checkbox
          label="Subscribe"
          checked="false"
          onActivate={(ev, triggerNode, boundCheckbox, checked, set) => {
            // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
            // if 0, the checked state is "false".
            // if 1, the checked state is "true".
            // if 2, the checked state is "mixed".
            // The 'set' argument is a function that will set the checkable item to a new state.
            // The new value must be a string consisting of "false", "true", or "mixed".
            if (checked) {
              set("false");
              // Do something.
            } else {
              set("true");
              // Do something else.
            }
          }}
          config={
            {
              // Optional config overrides.
            }
          }
        />
      </div>

      <h2>ARIA Popup</h2>
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
            }
          }
        />
      </div>
    </div>
  );
}

export default App;
