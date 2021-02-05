$A.import("Listbox", { defer: true }, function() {
  var myListbox = new $A.Listbox({
    label: "Toggle checkable options",
    listbox: "#listboxId",
    checkable: true,
    toggleClass: "selected",
    handlers: {
      // Interaction event Handlers to be added to each focusable role=option node.
      // See /4X/Help/$A API/ARIA Methods/RovingTabIndex for help.
      onClick: function(event, option, RTI) {
        var val = myListbox.checkValue(option);
        if (val === "false") myListbox.check(option, "mixed");
        else if (val === "mixed") myListbox.check(option, "true");
        else if (val === "true") myListbox.check(option, "false");
      },
      onSpace: function(event, option, RTI) {
        RTI.onClick.call(this, event, option, RTI);
      }
    }
  });
});
