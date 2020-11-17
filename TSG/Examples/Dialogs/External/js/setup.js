$A.import(["Animate", "Dialog"], { defer: true }, function() {
  var myDialogDC = $A.setDialog("#triggerId", {
    role: "Login",
    fetch: {
      url: "files/login-dialog.htm",
      data: {
        selector: "#dialog-login"
      }
    },
    className: "modal",
    isModal: true,
    isAlert: false,
    // forceFocus must always be true if not setting focus into the dialog manually.
    // In this case, focus is being handled within the file files/login-dialog.htm.
    forceFocus: false,
    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.slideDownIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.slideDownOut", {
          complete: function() {
            complete();
          }
        });
      }
    }
  });
});
