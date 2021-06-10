$A.import(["Beep", "Drag"], { defer: true }, function() {
  // Create a DragulaJS API drake instance.
  var drake = $A.setDrag({
    sort: true,
    dragula: {
      containers: $A.query(".drop-list")
    }
  });
});
