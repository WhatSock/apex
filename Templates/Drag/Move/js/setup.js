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
    })
    .on("drop", function(el, target, source, sibling) {
      if (target.id !== "wishedFor" && target.id !== "options") compute();
    });

  // Configure extra functionality for the page.
  var quantity = 0,
    subtotal = 0.0,
    cart = $A.get("selections"),
    compute = function() {
      subtotal = 0.0;
      quantity = $A.query("img", cart, function(i, g) {
        subtotal += parseFloat($A.getAttr(g, "data-price"));
      }).length;
      subtotal = subtotal.toFixed(2);
      $A("#quantity").insert(quantity.toString());
      $A("#subtotal").insert(subtotal.toString());
      $A("#subtotals").alert();
    };
});
