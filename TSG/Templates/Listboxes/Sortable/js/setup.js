$A.import("Listbox", { defer: true }, function() {
  var myListbox = new $A.Listbox({
    label: "Sort available options",
    listbox: "#listboxId",
    sortable: true,
    toggleClass: "selected",
    handlers: {
      // Interaction event Handlers to be added to each focusable role=option node.
      // See /4X/Help/$A API/ARIA Methods/RovingTabIndex for help.
    }
  });
});
