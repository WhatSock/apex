$A.import(["Animate", "Dialog"], { defer: true }, function () {
  var timeoutDialogDC = $A.setDialog({
    role: "Session Timeout",
    fetch: {
      url: "files/login-dialog.htm",
      data: {
        selector: "#dialog-timeout",
      },
    },
    className: "modal",
    isModal: true,
    isAlert: true,
    style: { display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.slideDownIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.slideDownOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },
  });

  $A("#triggerId").on("click", function (ev) {
    setTimeout(function () {
      timeoutDialogDC.render();
    }, 4000);
    ev.preventDefault();
  });
});
