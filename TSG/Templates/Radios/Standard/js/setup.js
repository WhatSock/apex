$A.import(["Animate", "Radio"], { defer: true }, function() {
  $A.setRadio(".aria-radio.future", {
    onActivate: function(ev, triggerNode, checked, set, boundRadio) {
      // Do something.
      set("true");
      ev.preventDefault();
    }
  });
});
