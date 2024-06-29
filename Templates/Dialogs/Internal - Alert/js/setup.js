$A.import(["Animate", "Dialog"], { defer: true }, function () {
  var myDialogDC = $A.setDialog("#dialog-login", {
    role: "Login",
    trigger: "#triggerId",
    className: "modal",
    isModal: true,
    isAlert: true,
    style: { display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        window.Velocity(wrapper, "transition.slideDownIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        window.Velocity(wrapper, "transition.slideDownOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },
    afterRender: function (dc) {
      var frm = $A.get("lbForm");
      $A(frm).on("submit", function (ev) {
        if (!frm.uname.value) {
          alert("Woops! You forgot your username...");
          frm.uname.focus();
        } else if (!frm.pass.value) {
          alert("Woops! You forgot your password...");
          frm.pass.focus();
        } else {
          alert("WOW!");
          dc.remove();
        }
        ev.preventDefault();
      });
    },
  });
});
