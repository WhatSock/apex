$A.import("Listbox", { defer: true }, function () {
  var myListbox = $A.setListbox("#listboxId", {
    label: "Toggle checkable options",
    onActivate: function (ev, triggerNode, RTI, boundElement, checked, set) {
      // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
      // if 0, the checked state is "false".
      // if 1, the checked state is "true".
      // if 2, the checked state is "mixed".
      // The 'set' argument is a function that will set the checkable item to a new state.
      // The new value must be a string consisting of "false", "true", or "mixed".
      if (checked) {
        set("false");
      } else {
        set("true");
      }
    },
    extendRTI: {
      // Interaction event Handlers to be added to each focusable role=option node.
      // See /Help/$A API/ARIA Methods/RovingTabIndex for help.
    },
  });
});
