$A.import(["Animate", "Tooltip"], { defer: true }, function() {
  var helpTooltipDC = $A.setTooltip("a.aria-tooltip.helpIcon", {
    manualOpen: true,
    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeOut", {
          complete: function() {
            complete();
          }
        });
      }
    }
  });

  var fieldConstraintDC = $A.setTooltip('input[type="password"]', {
    onFocusOnly: true,
    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.swoopIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.swoopOut", {
          complete: function() {
            complete();
          }
        });
      }
    }
  });
});
