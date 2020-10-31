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
    animate: {
      onRender: function(dc, outerNode, complete) {
        // Optionally add an animation effect when the dialog is rendered.
        // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
        complete();
      },
      onRemove: function(dc, outerNode, complete) {
        // Optionally add an animation effect when the dialog is removed.
        // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
        complete();
      }
    }
  });
});
