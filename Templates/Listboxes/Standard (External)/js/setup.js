$A.import("Listbox", { defer: true }, function () {
  var myListbox = $A.setListbox({
    root: "div.listbox-root",
    fetch: {
      url: "files/listbox.htm",
      data: {
        selector: "#standardSelectId",
      },
    },
  });
});
