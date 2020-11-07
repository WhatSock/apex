$A.import(["CurrentDevice", "Combobox"], { defer: true }, function() {
  var search = function(s) {
    if (!s) return;

    s =
      "http://www.goodreads.com/search?utf8=%E2%9C%93&query=" +
      encodeURIComponent(s);
    window.open(s);
  };

  // Create a new ARIA Combobox instance
  var myAuthorCombobox = new $A.Combobox({
    select: $A.getEl("authors"),
    input: $A.getEl("authrEdit"),
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
  myAuthorCombobox.setDefault(false);

  // Use substring match instead of default left-string match
  myAuthorCombobox.setSubstringMatch(true);

  // Enable full listbox content browsing from the keyboard when the down arrow key is pressed. (Applicable only when the value is empty.)
  myAuthorCombobox.setShowAllIfEmpty(true);

  // Set CSS autopositioning relative to the triggering element.
  // Accepted 4X API values between 0-disabled-default and 12
  myAuthorCombobox.setAutoPosition(5);

  // Set a positive or negative top/left offset to be applied to the autoPosition property calculation
  myAuthorCombobox.setOffset({
    top: 7,
    left: 30
  });

  // Process every time a new value is saved
  myAuthorCombobox.onSelect(function(
    optionText,
    optionValue,
    comboboxElement,
    selectElement
  ) {
    comboboxElement.value = optionValue;
    myAuthorCombobox.close();
    // Return the modified value so that the combobox doesn't open again instantly.
    return optionValue;
  });

  // Logic to distinguish between touch screen devices
  if (!$A.isTouch) {
    // For non-touch devices, add screen reader accessible keyboard instructions
    myAuthorCombobox.setPromptText(
      "Type and press the down arrow to browse available matches"
    );
  }

  // Dynamically toggle help text for desktops that support dual touch and keyboard interaction.
  if (window.device.type === "desktop") {
    $A.on("toggletouch", function(ev) {
      myAuthorCombobox.setPromptText(
        $A.isTouch
          ? ""
          : "First type then press the down arrow to browse available matches"
      );
    });
  }

  // Set a default list option display size for standard screens
  myAuthorCombobox.setSize(
    window.device.type === "mobile"
      ? 3
      : window.device.type === "tablet"
      ? 5
      : 7
  );

  // Get the Close icon triggering element for sighted mouse and touch device users
  var mobileCloseIcon = $A.getEl("mobileCloseIcon");

  // Process after the suggestion window is opened
  myAuthorCombobox.onOpen(function(dc) {
    $A.remClass(mobileCloseIcon, "hidden");
  });

  // Process after the suggestion window is closed
  myAuthorCombobox.onClose(function(dc) {
    $A.addClass(mobileCloseIcon, "hidden");
  });

  // Add a click handler to the Close icon
  $A.on(mobileCloseIcon, "click", function(ev) {
    myAuthorCombobox.close();
  });

  // Now fire up the newly instantiated ARIA Combobox
  myAuthorCombobox.start();

  $A.on("#authrBtn", "click", function(ev) {
    search(myAuthorCombobox.combobox.value);
    ev.preventDefault();
  });
});
