$A.import("Listbox", { defer: true }, function() {
  var myListbox = $A.setListbox("#listboxId", {
    label: "Toggle checkable options",
    // Set checkable to true to make all options checkable,
    // otherwise set the 'check' attribute in the HTML markup to make individual options checkable instead.
    checkable: false,
    onActivate: function(ev, triggerNode, RTI, DC, checked, check) {
      // If a triggerNode is checkable, the 'checked' variable will include a number from 0 to 2, otherwise it will be set to false.
      // 0 = "false".
      // 1 = "true".
      // 2 = "mixed".
      if (checked) {
        check("false");
      } else {
        check("true");
      }
    },
    extendRTI: {
      // Interaction event Handlers to be added to each focusable role=option node.
      // See /4X/Help/$A API/ARIA Methods/RovingTabIndex for help.
    }
  });
});
