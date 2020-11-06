$A.import(["Animate", "Dialog"], { defer: true }, function() {
  var myDialogDC = $A.setDialog("#dialog-login", {
    role: "Login",
    trigger: "#triggerId",
    className: "modal",
    isModal: true,
    isAlert: true,
    // forceFocus must always be true if not setting focus into the dialog manually.
    forceFocus: false,
    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeOut", {
          complete: function() {
            complete();
          }
        });
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
