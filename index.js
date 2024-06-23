// Apex 4X usage examples after installing 4X via "npm install apex4x" within a local project.

// Option 1: Import using bundled 4X build
import "./Bundle/4X.js"; // Runs current 4X build from root
// import "./node_modules/apex4x/Bundle/4X.js"; // Runs latest 4X build via NPM install within WebserverRun.sh

/*
// Option 2: Import 4X core plus desired modules.
// import "./4X/4X.js"; // Runs current minified 4X core from root
import {$A} from "./node_modules/apex4x/4X/4X.Max.Export.js"; // Runs latest 4X core via NPM install within WebserverRun.sh
import "./node_modules/apex4x/4X/Standard/Modules/Velocity.js";
import "./node_modules/apex4x/4X/Standard/Modules/VelocityUI.js";
import "./node_modules/apex4x/4X/Standard/Modules/Tooltip.js";
import "./node_modules/apex4x/4X/Standard/Modules/Beep.js";
*/

import "./Templates/_common/_doc_files/autosize.js";

autosize(document.querySelectorAll("textarea"));
var textarea = $A.get("testScript"); // Get element with id "testScript"
$A.on("button.testBtn", "click", function (ev) {
  var code = textarea.value;
  try {
    var f = new Function("window,document,$A", code);
    f.call(window, window, document, $A);
    $A.beep();
  } catch (e) {
    throw e;
  }
});

$A.get("version").innerHTML = $A._version;
