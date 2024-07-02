$A.import(["Animate", "Tooltip"], { defer: true }, function () {
  var helpTooltipDC = $A.setTooltip("a.aria-tooltip.helpIcon", {
    id: "helpTooltipId",
    autoCloseSameWidget: true,
    fetch: {
      url: "files/tooltips.htm",
      data: {
        selector: "#quote-tooltip",
      },
    },
    isManualOpen: true,
    className: "tooltip manual-click",
    delay: 0,
    style: { display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.fadeIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.fadeOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },
  });

  var constraintTooltipDC = $A.setTooltip('input[type="password"]', {
    id: "constraintTooltipId",
    autoCloseSameWidget: true,
    fetch: {
      url: "files/tooltips.htm",
      data: {
        selector: "#password-tooltip",
      },
    },
    isFocusOnly: true,
    className: "tooltip on-focus",
    delay: 1000,
    style: { display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.swoopIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.swoopOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },
  });

  var hoverTooltipDC = $A.setTooltip("button.action-btn", {
    id: "hoverTooltipId",
    autoCloseSameWidget: true,
    fetch: {
      url: "files/tooltips.htm",
      data: {
        selector: "#hover-tooltip",
      },
    },
    className: "tooltip on-hover",
    delay: 600,
    delayTimeout: 3000,
    style: { display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.bounceLeftIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.bounceRightOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },
  });
});
