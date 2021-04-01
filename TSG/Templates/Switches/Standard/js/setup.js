$A.import(["Animate", "Switch"], { defer: true }, function() {
  $A.setSwitch(
    ".aria-switch.thermostat, .aria-switch.security, .aria-switch.lights",
    {
      onActivate: function(ev, triggerNode, on, set, boundCheckbox) {
        // Do something.
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
