$A.import(["Animate", "Checkbox"], { defer: true }, function () {
  $A.setCheckbox(".aria-checkbox.agree", {
    onActivate: function (ev, triggerNode, boundCheckbox, checked, set) {
      // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
      // if 0, the checked state is "false".
      // if 1, the checked state is "true".
      // if 2, the checked state is "mixed".
      // The 'set' argument is a function that will set the checkable item to a new state.
      // The new value must be a string consisting of "false", "true", or "mixed".
      if (checked) {
        set("false");
      } else {
        set("true");
      }
      ev.preventDefault();
    },
  });

  $A.setCheckbox(".aria-checkbox.subscribe", {
    onActivate: function (ev, triggerNode, boundCheckbox, checked, set) {
      // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
      // if 0, the checked state is "false".
      // if 1, the checked state is "true".
      // if 2, the checked state is "mixed".
      // The 'set' argument is a function that will set the checkable item to a new state.
      // The new value must be a string consisting of "false", "true", or "mixed".
      if (checked) {
        set("false");
      } else {
        set("true");
      }
      ev.preventDefault();
    },
  });

  $A.setCheckbox(".aria-checkbox.happy", {
    onActivate: function (ev, triggerNode, boundCheckbox, checked, set) {
      // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
      // if 0, the checked state is "false".
      // if 1, the checked state is "true".
      // if 2, the checked state is "mixed".
      // The 'set' argument is a function that will set the checkable item to a new state.
      // The new value must be a string consisting of "false", "true", or "mixed".
      if (checked === 0) {
        // If not checked, then
        set("mixed");
      } else if (checked === 2) {
        // If partially checked, then
        set("true");
        window.Velocity(triggerNode, "callout.bounce");
      } else if (checked === 1) {
        // If fully checked, then
        set("false");
      }
      ev.preventDefault();
    },
  });
});
