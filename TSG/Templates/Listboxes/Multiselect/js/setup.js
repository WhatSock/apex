$A.import("Listbox", { defer: true }, function() {
  var myListbox = new $A.Listbox({
    label: "Select one or more of your favorite things",
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

  $A("form.addFrm").on("submit", function(ev) {
    var form = this;
    $A(
      '<option value="' +
        form["fruit-id"].value.replace(/<|>/g, "") +
        '">' +
        form["fruit-name"].value.replace(/<|>/g, "") +
        "</option>"
    ).appendTo("#standardSelectId");
    myListbox.update();
    myListbox.RTI.focus(myListbox.options.length - 1);
    form["fruit-name"].value = "";
    form["fruit-id"].value = "";
    ev.preventDefault();
  });
});
