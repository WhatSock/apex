$A.import(["Animate", "Tooltip"], { defer: true }, function() {
  var inputs = document.querySelectorAll("input.has-error-tooltip");
  $A.setTooltip(inputs, {
    onValid: function(dc) {
      var isValid = true;
      $A.loop(inputs, function(i, o) {
        if (!o.value) isValid = false;
      });
      document.querySelector('input[type="submit"]').disabled = !isValid;
    },
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
