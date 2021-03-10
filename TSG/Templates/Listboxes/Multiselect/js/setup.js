$A.import("Listbox", { defer: true }, function() {
  var myListbox = $A.setListbox("#standardSelectId", {
    label: "Select one or more of your favorite things",
    listbox: "#listboxId",
    multiselect: true,
    onActivate: function(ev, triggerNode, RTI, DC, selected, select) {
      if (selected) {
        // Do something.
      } else {
        // Or do something else.
      }
      // The select() function can optionally be used to set a specific state.
      // Such as select("true");
      // Or select("false");
    },
    extendRTI: {
      // Interaction event Handlers to be added to each focusable role=option node.
      // See /4X/Help/$A API/ARIA Methods/RovingTabIndex for help.
    }
  });
});
