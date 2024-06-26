$A.import(["CurrentDevice", "Combobox"], { defer: true }, function () {
  // Create a new ARIA Combobox instance
  var myStateCombobox = new $A.Combobox({
    select: $A.get("states"),
    input: $A.get("stt"),
    delay: 200,
    style: { display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },
  });

  // Disable auto population of default value
  myStateCombobox.setDefault(false);

  // Enable full listbox content browsing from the keyboard when the down arrow key is pressed. (Applicable only when the value is empty.)
  myStateCombobox.setShowAllIfEmpty(true);

  // Set CSS autopositioning relative to the triggering element.
  // Accepted 4X API values between 0-disabled-default and 12
  myStateCombobox.setAutoPosition(5);

  // Set a positive or negative top/left offset to be applied to the autoPosition property calculation
  myStateCombobox.setOffset({
    top: 5,
    left: 10,
  });

  // Force the highlighted value to be automatically saved when focus moves away from the Combobox
  myStateCombobox.setAutoComplete(true);

  // Logic to distinguish between touch screen devices
  if (!$A.isTouch) {
    // For non-touch devices, add screen reader accessible keyboard instructions
    myStateCombobox.setPromptText(
      "First type then press the down arrow to browse available matches",
    );
  }

  // Dynamically toggle help text for desktops that support dual touch and keyboard interaction.
  if (window.device.type === "desktop") {
    $A.on("toggletouch", function (ev) {
      myStateCombobox.setPromptText(
        $A.isTouch
          ? ""
          : "First type then press the down arrow to browse available matches",
      );
    });
  }

  // Set a default list option display size for standard screens
  myStateCombobox.setSize(
    window.device.type === "mobile"
      ? 3
      : window.device.type === "tablet"
        ? 5
        : 7,
  );

  // Get the Close icon triggering element for sighted mouse and touch device users
  var stateCloseIcon = $A.get("mobileCloseIcon");

  // Process after the suggestion window is opened
  myStateCombobox.onOpen(function (dc) {
    $A.remClass(stateCloseIcon, "hidden");
  });

  // Process after the suggestion window is closed
  myStateCombobox.onClose(function (dc) {
    $A.addClass(stateCloseIcon, "hidden");
  });

  // Add a click handler to the Close icon
  $A.on(stateCloseIcon, "click", function (ev) {
    myStateCombobox.close();
  });

  // Now fire up the newly instantiated ARIA Combobox
  myStateCombobox.start();

  var myCountryCombobox = new $A.Combobox({
    select: $A.get("countries"),
    input: $A.get("ctry"),
    delay: 200,
    style: { display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },
  });

  myCountryCombobox.setAutoPosition(5);

  myCountryCombobox.setOffset({
    top: 5,
    left: 10,
  });

  // Specify a dedicated toggle element for the Country ARIA Combobox
  myCountryCombobox.setAltTrigger($A.get("ctryIcon"));

  // Add logic to process each time the toggle element state changes
  myCountryCombobox.onTriggerChange(function (toggleObj, openState) {
    if (openState) {
      // Opened
      $A.setAttr(toggleObj, "src", "img/up.png");
    } else {
      // Closed
      $A.setAttr(toggleObj, "src", "img/down.png");
    }
  });

  myCountryCombobox.setAutoComplete(true);

  // Logic to distinguish between touch screen devices
  if (!$A.isTouch) {
    // For non-touch devices, add screen reader accessible keyboard instructions
    myCountryCombobox.setPromptText(
      "Press the down arrow to browse available options",
    );
  }

  // Dynamically toggle help text for desktops that support dual touch and keyboard interaction.
  if (window.device.type === "desktop") {
    $A.on("toggletouch", function (ev) {
      myCountryCombobox.setPromptText(
        $A.isTouch ? "" : "Press the down arrow to browse available options",
      );
    });
  }

  // Set a default list option display size for standard screens
  myCountryCombobox.setSize(
    window.device.type === "mobile"
      ? 3
      : window.device.type === "tablet"
        ? 5
        : 7,
  );

  myCountryCombobox.start();

  $A.on("#frm1", "submit", function (ev) {
    var f = this,
      s = "";
    $A.query('input[type="text"]', f, function (i, o) {
      s += o.name + "=" + o.value + "\n";
    });
    alert(s);
    ev.preventDefault();
  });
});
