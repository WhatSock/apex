$A.import(["Animate", "Popup"], { defer: true }, function () {
  var myPopupDC = $A.setPopup("#triggerId", {
    role: "Hamlet Excerpt",
    fetch: {
      url: "files/popup-excerpt.htm",
      data: {
        selector: "#popupId",
      },
    },
    className: "popup",
    isAlert: false,
    // forceFocus must always be true if not setting focus into the popup manually.
    forceFocus: true,
    circularTabbing: true,
    style: { display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeOut", {
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
