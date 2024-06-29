$A.import(["Animate", "Popup"], { defer: true }, function () {
  var myPopupDC = $A.setPopup("#popupId", {
    role: "Hamlet Excerpt",
    trigger: "#triggerId",
    className: "popup",
    isAlert: true,
    circularTabbing: true,
    style: { display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        window.Velocity(wrapper, "transition.fadeIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        window.Velocity(wrapper, "transition.fadeOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },
    afterRender: function (dc) {
      // Do something after the popup is rendered.
    },
  });
});
