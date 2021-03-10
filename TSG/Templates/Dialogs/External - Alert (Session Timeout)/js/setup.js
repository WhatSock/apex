$A.import(["Animate", "Dialog"], { defer: true }, function() {
  var timeoutDialogDC = $A.setDialog({
    role: "Session Timeout",
    fetch: {
      url: "files/login-dialog.htm",
      data: {
        selector: "#dialog-timeout"
      }
    },
    className: "modal",
    isModal: true,
    isAlert: true,
    style: { display: "none" },
    animate: {
      onRender: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.slideDownIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.slideDownOut", {
          complete: function() {
            complete();
          }
        });
      }
    }
  });

  $A("#triggerId").on("click", function(ev) {
    setTimeout(function() {
      timeoutDialogDC.render();
    }, 4000);
    ev.preventDefault();
  });
});
