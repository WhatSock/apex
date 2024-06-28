import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ExampleButton from "./ExampleButton";
import ExamplePopup from "./ExamplePopup";

function App() {
  const handleButtonActivate = (ev) => {
    alert("Button activated from App.js!");
  };

  const popupMessage = `
<h1>Information</h1>
<div>Consider yourself informed!</div>
`;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div>
          <ExampleButton
            id="customButton"
            label="What?"
            onActivate={handleButtonActivate}
          />
        </div>

        <div>
          <ExamplePopup
            id="customPopupTrigger"
            label="More Info"
            title="Info Popup"
            message={popupMessage}
          />
        </div>

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
    </div>
  );
}

export default App;
