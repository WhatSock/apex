$A.import(["Animate", "Popup"], { defer: true }, function() {
  var myPopupDC = $A.setPopup("#triggerId", {
    role: "Hamlet Excerpt",
    fetch: {
      url: "files/popup-excerpt.htm",
      data: {
        selector: "#popupId"
      }
    },
    className: "popup",
    isAlert: false,
    // forceFocus must always be true if not setting focus into the popup manually.
    forceFocus: true,
    circularTabbing: true,
    animate: {
      onRender: function(dc, outerNode, complete) {
        // Optionally add an animation effect when the popup is rendered.
        // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
        complete();
      },
      onRemove: function(dc, outerNode, complete) {
        // Optionally add an animation effect when the popup is removed.
        // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
        complete();
      }
    },
    runAfter: function(dc) {
      // Do something after the popup is rendered.
    }
  });
});
