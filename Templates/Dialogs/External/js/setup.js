$A.import(["Animate", "Dialog"], { defer: true }, function () {
  var myDialogDC = $A.setDialog("#triggerId", {
    role: "Login",
    fetch: {
      url: "files/login-dialog.htm",
      data: {
        selector: "#dialog-login",
      },
    },
    className: "modal",
    isModal: true,
    isAlert: false,
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
});
