$A.import(["Animate", "Menu"], { defer: true }, function() {
  $A.setMenu("#blackboardId", {
    rightClick: true,
    onActivate: function(ev, triggerNode, RTI, DC, checked, set, isRadio) {
      if ($A.isNum(checked)) {
        // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
        // if 0, the checked state is "false".
        // if 1, the checked state is "true".
        // if 2, the checked state is "mixed".
        // The 'set' argument is a function that will set the checkable item to a new state.
        // The new value must be a string consisting of "false", "true", or "mixed".
        if (checked === 0 || isRadio) {
          set("true");
          RTI.DC.top.remove(function() {
            alert("The new checked state for " + triggerNode.id + " is 'true'");
          });
        } else if (checked === 1) {
          set("mixed");
          RTI.DC.top.remove(function() {
            alert(
              "The new checked state for " + triggerNode.id + " is 'mixed'"
            );
          });
        } else if (checked === 2) {
          set("false");
          RTI.DC.top.remove(function() {
            alert(
              "The new checked state for " + triggerNode.id + " is 'false'"
            );
          });
        }
      } else if (
        triggerNode.href &&
        triggerNode.href.indexOf("https://") !== -1
      )
        RTI.DC.top.remove(function() {
          location.href = triggerNode.href;
        });
      else
        RTI.DC.top.remove(function() {
          alert(triggerNode.id);
        });
    },
    style: { display: "none" },
    animate: {
      onRender: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.slideUpIn", {
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      },
      onRemove: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.slideUpOut", {
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      }
    }
  });
});
