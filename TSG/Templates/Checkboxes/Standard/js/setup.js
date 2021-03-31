$A.import(["Animate", "Checkbox"], { defer: true }, function() {
  $A.setCheckbox(".aria-checkbox.agree", {
    onActivate: function(ev, triggerNode, checked, set, boundCheckbox) {
      // Do something.
      if (checked) {
        set("false");
      } else {
        set("true");
      }
      ev.preventDefault();
    }
  });

  $A.setCheckbox(".aria-checkbox.subscribe", {
    onActivate: function(ev, triggerNode, checked, set, boundCheckbox) {
      // Do something.
      if (checked) {
        set("false");
      } else {
        set("true");
      }
      ev.preventDefault();
    }
  });

  $A.setCheckbox(".aria-checkbox.happy", {
    onActivate: function(ev, triggerNode, checked, set) {
      // Do something.
      if (checked === 0) {
        // If not checked, then
        set("mixed");
      } else if (checked === 2) {
        // If partially checked, then
        set("true");
        Velocity(triggerNode, "callout.bounce");
      } else if (checked === 1) {
        // If fully checked, then
        set("false");
      }
      ev.preventDefault();
    }
  });
});
