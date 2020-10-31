$A.import(["CurrentDevice", "Combobox"], { defer: true }, function() {
  // Create a new ARIA Combobox instance
  var myLangCB = new $A.Combobox({
    select: $A.getEl("languagesId"),
    input: $A.getEl("langBtnId"),
    childNode: $A.getEl("insertionPoint")
  });

  // Set multiple divider to break up list item markup properly when updated.
  myLangCB.setMultipleDivider(function(values) {
    return values.length
      ? "<ul><li>" + values.join("</li><li>") + "</li></ul>"
      : "<i>(None Selected)</i>";
  });

  // Set CSS autopositioning relative to the triggering element.
  // Accepted 4X API values between 0-disabled-default and 12
  myLangCB.setAutoPosition(5);

  // Set a positive or negative top/left offset to be applied to the autoPosition property calculation
  myLangCB.setOffset({
    top: 5,
    left: 10
  });

  // Logic to distinguish between touch screen devices
  if (!$A.isTouch) {
    // For non-touch devices, add screen reader accessible keyboard instructions
    myLangCB.setPromptText("Press the down arrow to browse available options");
  }

  // Dynamically toggle help text for desktops that support dual touch and keyboard interaction.
  if (window.device.type === "desktop") {
    $A.on("toggletouch", function(ev) {
      myLangCB.setPromptText(
        $A.isTouch ? "" : "Press the down arrow to browse available options"
      );
    });
  }

  // Set a default list option display size for standard screens
  myLangCB.setSize(
    window.device.type === "mobile"
      ? 3
      : window.device.type === "tablet"
      ? 5
      : 7
  );

  // Set specific text for the hidden Close link encountered by screen reader users
  myLangCB.setCloseText("Close Language Selector");

  // Process after the suggestion window is opened
  myLangCB.onOpen(function() {
    $A.addClass(myLangCB.combobox, "pressed");
    // $A.getEl('arrowSymbolId').innerHTML = '&#8593;';
  });

  // Process after the suggestion window is closed
  myLangCB.onClose(function() {
    $A.remClass(myLangCB.combobox, "pressed");
    // $A.getEl('arrowSymbolId').innerHTML = '&#8595;';
  });

  // Now fire up the newly instantiated ARIA Combobox
  myLangCB.start();

  $A.on("#clearAll", {
    click: function(ev) {
      // Clear all of the selected options.
      myLangCB.clearAll();
      myLangCB.combobox.focus();
      ev.preventDefault();
    }
  });

  $A.on("#frm", "submit", function(ev) {
    var values = [],
      selectedMatches = myLangCB.getValue();
    $A.query(selectedMatches, function(i, o) {
      values.push(o.value);
    });
    alert(
      "Option nodes selected " +
        selectedMatches.length +
        "\n" +
        "Selected values " +
        values.toString()
    );
    ev.preventDefault();
  });
});
