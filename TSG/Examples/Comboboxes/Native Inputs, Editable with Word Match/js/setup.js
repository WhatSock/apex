$A.import(["CurrentDevice", "Combobox"], { defer: true }, function() {
  var search = function(s) {
    if (!s) return;

    s = "https://www.google.com/search?q=" + encodeURIComponent(s);
    window.open(s);
  };

  // Create a new ARIA Combobox instance
  var myHardwareCombobox = new $A.Combobox({
    select: $A.getEl("devicesId"),
    input: $A.getEl("hardwareEdit"),
    delay: 1000,
    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeOut", {
          complete: function() {
            complete();
          }
        });
      }
    }
  });

  // Disable auto population of default value
  myHardwareCombobox.setDefault(false);

  // Use word match instead of default left-string match
  myHardwareCombobox.setWordMatch(true);

  // Process every time a new value is saved
  myHardwareCombobox.onSelect(function(
    optionText,
    optionValue,
    comboboxElement,
    selectElement
  ) {
    comboboxElement.value = optionText;
    myHardwareCombobox.close();
    // Return the value so that the combobox doesn't open again instantly.
    return optionText;
  });

  // Logic to distinguish between touch screen devices
  if (!$A.isTouch) {
    // For non-touch devices, add screen reader accessible keyboard instructions
    myHardwareCombobox.setPromptText(
      "Type keywords and press the down arrow to browse available matches"
    );
  }

  // Dynamically toggle help text for desktops that support dual touch and keyboard interaction.
  if (window.device.type === "desktop") {
    $A.on("toggletouch", function(ev) {
      myHardwareCombobox.setPromptText(
        $A.isTouch
          ? ""
          : "First type then press the down arrow to browse available matches"
      );
    });
  }

  // Set a default list option display size for standard screens
  myHardwareCombobox.setSize(
    window.device.type === "mobile"
      ? 3
      : window.device.type === "tablet"
      ? 5
      : 7
  );

  // Disable the offscreen Close link for mobile touch screen users
  // False/null/'' to disable, or text string such as 'Close Dropdown' to set as text.
  myHardwareCombobox.setCloseText(false);

  // Set container element to render suggestions listbox within, instead of using auto-DOM-insertion.
  myHardwareCombobox.dc.root = "#autoSuggest";

  // Now fire up the newly instantiated ARIA Combobox
  myHardwareCombobox.start();

  $A.on("#hardwareBtn", "click", function(ev) {
    search(myHardwareCombobox.combobox.value);
    ev.preventDefault();
  });
});
