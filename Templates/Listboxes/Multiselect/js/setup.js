$A.import("Listbox", { defer: true }, function () {
  var myListbox = $A.setListbox("#standardSelectId", {
    label: "Select one or more of your favorite things",
    listbox: "#listboxId",
    multiselect: true,
    onActivate: function (ev, triggerNode, RTI, boundElement, selected, set) {
      // 'selected' reflects the current attribute value for the selectable item, and is always a number if applicable.
      // if 0, the selected state is "false".
      // if 1, the selected state is "true".
      // The 'set' argument is a function that will set the selectable item to a new state.
      // The new value must be a string consisting of "false" or "true".
      if (selected) {
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
