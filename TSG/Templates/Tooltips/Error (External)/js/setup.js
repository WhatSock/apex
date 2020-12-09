$A.import(["Animate", "Tooltip"], { defer: true }, function() {
  $A.setTooltip("input.has-error-tooltip", {
    className: "error-tooltip",
    delay: 0,
    delayTimeout: 0,
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
});
