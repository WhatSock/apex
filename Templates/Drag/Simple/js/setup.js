$A.import(["Beep", "Drag"], { defer: true }, function() {
  // Create a DragulaJS API drake instance.
  var drake = $A
    .setDrag({
      dragula: {
        containers: $A.query(".drop-list")
      }
    })

    // Add event handlers to the drake instance if desired.
    .on("over", function(el, container, source) {
      if (container !== source) $A.beep();
    });
});
