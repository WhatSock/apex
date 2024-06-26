$A.import(["CurrentDevice", "Combobox"], { defer: true }, function () {
  // Create a new ARIA Combobox instance
  var myLangCB = new $A.Combobox({
    select: $A.get("languagesId"),
    input: $A.get("langBtnId"),
    childNode: $A.get("langChild"),
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

  // Set CSS autopositioning relative to the triggering element.
  // Accepted 4X API values between 0-disabled-default and 12
  myLangCB.setAutoPosition(5);

  // Set a positive or negative top/left offset to be applied to the autoPosition property calculation
  myLangCB.setOffset({
    top: 5,
    left: 10,
  });

  // Logic to distinguish between touch screen devices
  if (!$A.isTouch) {
    // For non-touch devices, add screen reader accessible keyboard instructions
    myLangCB.setPromptText("Press the down arrow to browse available options");
  }

  // Dynamically toggle help text for desktops that support dual touch and keyboard interaction.
  if (window.device.type === "desktop") {
    $A.on("toggletouch", function (ev) {
      myLangCB.setPromptText(
        $A.isTouch ? "" : "Press the down arrow to browse available options",
      );
    });
  }

  // Set a default list option display size for standard screens
  myLangCB.setSize(
    window.device.type === "mobile"
      ? 3
      : window.device.type === "tablet"
        ? 5
        : 7,
  );

  // Set specific text for the hidden Close link encountered by screen reader users
  myLangCB.setCloseText("Close Language Selector");

  // Process after the suggestion window is opened
  myLangCB.onOpen(function () {
    $A.addClass(myLangCB.combobox, "pressed");
    // $A.get('arrowSymbolId').innerHTML = '&#8593;';
  });

  // Process after the suggestion window is closed
  myLangCB.onClose(function () {
    $A.remClass(myLangCB.combobox, "pressed");
    // $A.get('arrowSymbolId').innerHTML = '&#8595;';
  });

  // Now fire up the newly instantiated ARIA Combobox
  myLangCB.start();

  $A.on("#frm", "submit", function (ev) {
    alert(myLangCB.getValue());
    ev.preventDefault();
  });
});
