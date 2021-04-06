$A.import(["Animate", "Radio"], { defer: true }, function() {
  $A.setRadio(".aria-radio.future", {
    onActivate: function(ev, triggerNode, boundRadio, checked, set) {
      // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
      // if 0, the checked state is "false".
      // if 1, the checked state is "true".
      // The 'set' argument is a function that will set the checkable item to a new state.
      // The new value must be a string consisting of "false" or "true".
      set("true");
      ev.preventDefault();
    }
  });
});
