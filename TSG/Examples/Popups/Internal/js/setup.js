$A.import(["Animate", "Popup"], { defer: true }, function() {
  var myPopupDC = $A.setPopup("#popupId", {
    role: "Hamlet Excerpt",
    trigger: "#triggerId",
    className: "popup",
    isAlert: false,
    // forceFocus must always be true if not setting focus into the popup manually.
    forceFocus: true,
    circularTabbing: true,
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
      // Do something after the popup is rendered.
    }
  });
});
