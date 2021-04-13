$A.import("Button", { defer: true }, function() {
  $A.setButton(".aria-button.SF", {
    onActivate: function(ev, triggerNode) {
      // Do something.
      alert("It's where it's at!");
      ev.preventDefault();
    }
  });
});
