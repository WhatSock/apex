$A.import(["Animate", "Dialog"], { defer: true }, function() {
  var myDialogDC = $A.setDialog("#dialog-login", {
    role: "Login",
    trigger: "#triggerId",
    className: "modal",
    isModal: true,
    isAlert: false,
    // forceFocus must always be true if not setting focus into the dialog manually.
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
    },
    runAfter: function(dc) {
      var frm = $A.getElement("lbForm");
      frm.uname.focus();
      $A(frm).on("submit", function(ev) {
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
    }
  });
});
