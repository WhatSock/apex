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
      onRender: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeIn", {
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      },
      onRemove: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeOut", {
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      }
    }
  });
});
