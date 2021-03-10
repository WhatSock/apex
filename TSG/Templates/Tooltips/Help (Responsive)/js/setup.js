$A.import(["Animate", "Tooltip"], { defer: true }, function() {
  var answer = "Terra";

  var helpDC = $A.setTooltip("input.has-help-tooltip", {
    isResponsive: true,
    validate: function(dc, target) {
      var val = (target.value || "").toLowerCase(),
        i = val.length,
        ans = answer.toLowerCase().slice(0, i),
        matches = val === ans;
      dc.isValid = val === answer.toLowerCase();

      if (i === 1 && !matches)
        return "Hmmm, it doesn't look like you're off to a good start.";
      else if (i >= 3 && i <= answer.length && !matches)
        return "Well, you can keep going if you want, but it won't help much.";
      else if (i === 1 && matches) return "Okay, that's a good start.";
      else if (
        i === 2 &&
        val.toLowerCase().slice(0, 1) === answer.toLowerCase().slice(0, 1) &&
        !matches
      )
        return "It looks like you've wandered off there a bit...";
      else if (i === 4 && matches) return "Excellent! You are almost there.";
      else if (i > answer.length) return "Wo, hold on there cowboy!";
      else if (dc.isValid) return "That's correct, you've got it!";
    },
    onValid: function(dc) {
      document.querySelector('input[type="submit"]').disabled = !dc.isValid;
    },
    className: "help-tooltip",
    delay: 1000,
    delayTimeout: 3000,
    style: { display: "none" },
    animate: {
      onRender: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.fadeIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.fadeOut", {
          complete: function() {
            complete();
          }
        });
      }
    }
  });

  var errorTooltip = $A.setTooltip("input.has-help-tooltip", {
    isError: true,
    role: "Error",
    content: "A correct answer to this question is required to proceed.",
    validate: function(dc, target) {
      if (target.value.toLowerCase() !== answer.toLowerCase())
        return dc.content;
    },
    className: "error-tooltip",
    delay: 0,
    delayTimeout: 0,
    style: { display: "none" },
    animate: {
      onRender: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.fadeIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.fadeOut", {
          complete: function() {
            complete();
          }
        });
      }
    }
  });
});
