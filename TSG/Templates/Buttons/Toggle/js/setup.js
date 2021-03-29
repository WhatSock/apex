$A.import(["Animate", "Button"], { defer: true }, function() {
  $A.setButton(".aria-button.toggle.like, .aria-button.toggle.favorite", {
    onActivate: function(ev, triggerNode, pressed, set) {
      // Do something.
      if (pressed) {
        set("false");
      } else {
        set("true");
      }
      ev.preventDefault();
    }
  });

  $A.setButton(".aria-button.toggle.help", {
    onActivate: function(ev, triggerNode, pressed, set, controlledElement) {
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
