$A.import(["Animate", "Switch"], { defer: true }, function() {
  $A.setSwitch(
    ".aria-switch.thermostat, .aria-switch.security, .aria-switch.lights",
    {
      onActivate: function(ev, triggerNode, boundCheckbox, on, set) {
        // 'on' reflects the current attribute value for the checkable item, and is always a number if applicable.
        // if 0, the checked state is "false".
        // if 1, the checked state is "true".
        // The 'set' argument is a function that will set the checkable item to a new state.
        // The new value must be a string consisting of "false" or "true".
        if (on) {
          set("false");
        } else {
          set("true");
          // Velocity(triggerNode, "callout.bounce");
        }
        ev.preventDefault();
      }
    }
  );
});
