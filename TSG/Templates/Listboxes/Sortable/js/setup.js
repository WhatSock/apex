$A.import("Listbox", { defer: true }, function() {
  var myListbox = $A.setListbox("#listboxId", {
    label: "Sort available options",
    sortable: true
  });
});
