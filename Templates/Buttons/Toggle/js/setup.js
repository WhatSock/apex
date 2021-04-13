$A.import(["Animate", "Button"], { defer: true }, function() {
  $A.setButton(".aria-button.toggle.like, .aria-button.toggle.favorite", {
    onActivate: function(ev, triggerNode, boundTo, pressed, set) {
      // 'pressed' reflects the current attribute value for the toggleable item, and is always a number if applicable.
      // if 0, the pressed state is "false".
      // if 1, the pressed state is "true".
      // The 'set' argument is a function that will set the toggleable item to a new state.
      // The new value must be a string consisting of "false" or "true".
      if (pressed) {
        set("false");
      } else {
        set("true");
      }
      ev.preventDefault();
    }
  });

  $A.setButton(".aria-button.toggle.help", {
    onActivate: function(ev, triggerNode, controlledElement, pressed, set) {
      // Do something.
      if (pressed) {
        set("false");
        $A(controlledElement).hide("transition.slideUpOut", function() {
          triggerNode.focus(); // Focus back to the triggerNode after the hide animation completes.
        });
      } else {
        set("true");
        $A(controlledElement).show("transition.slideUpIn", function() {
          $A.announce(controlledElement); // Announce the new content to screen reader users when the rendering animation completes.
        });
      }
      ev.preventDefault();
    }
  });
});
