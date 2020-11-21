$A.import(["Animate", "Tooltip"], { defer: true }, function() {
  var helpTooltipDC = $A.setTooltip("a.aria-tooltip.helpIcon", {
    isManualOpen: true,
    className: "tooltip manual-click",
    delay: 0,
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

  var constraintTooltipDC = $A.setTooltip('input[type="password"]', {
    isFocusOnly: true,
    className: "tooltip on-focus",
    delay: 1000,
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

  var hoverTooltipDC = $A.setTooltip("button.action-btn", {
    source: '<div id="hover-tooltip"><p>Wow, look at that!</p></div>',
    className: "tooltip on-hover",
    delay: 600,
    delayTimeout: 3000,
    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.bounceLeftIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.bounceRightOut", {
          complete: function() {
            complete();
          }
        });
      }
    }
  });
});
