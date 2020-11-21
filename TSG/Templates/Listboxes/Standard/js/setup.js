$A.import("Listbox", { defer: true }, function() {
  var myListbox = new $A.Listbox({
    label: "Choose one or the other",
    listbox: "#listboxId",
    select: "#standardSelectId",
    toggleClass: "selected",
    showSelect: true,
    preventInsert: true,
    handlers: {
      // Interaction event Handlers to be added to each focusable role=option node.
      // See /4X/Help/$A API/ARIA Methods/RovingTabIndex for help.
    }
  });
});
