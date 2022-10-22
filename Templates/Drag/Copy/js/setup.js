$A.import(["Beep", "Drag"], { defer: true }, function () {
  // Create a DragulaJS API drake instance.
  var drake = $A
    .setDrag({
      dragula: {
        containers: $A.query(".drop-list"),
        copy: true,
        accepts: function (el, target, source, sibling) {
          return source.id === "options" && target !== source;
        },
      },
      menu: {
        tag: {
          custom: [
            '<li><a data-action="moveToCart" class="menu-action move">Move to Shopping Cart</a></li>',
            '<li><a data-action="remove" class="menu-action remove">Remove Book</a></li>',
          ],
          customActivate: function (
            ev,
            dragElement,
            source,
            action,
            actionsObject,
            next
          ) {
            if (action === "remove") {
              $A.remove(dragElement);
              $A.focus(next);
              if (source.id !== "wishedFor") compute();
            }
          },
          invalid: function (dragElement, action, source, target) {
            if (source.id !== "wishedFor" && action === "moveToCart")
              return true;
            if (source.id === "options" && action === "remove") return true;
            return false;
          },
        },
        manualDrop: function (
          dragElement,
          target,
          source,
          action,
          actionsObject,
          nextSibling
        ) {
          if (action === "moveToCart") {
            $A(dragElement).appendTo("#selections");
            $A.beep();
            compute();
            return true;
          }
          return false;
        },
      },
    })

    // Add event handlers to the drake instance if desired.
    .on("over", function (el, container, source) {
      if (container !== source) $A.beep();
    })
    .on("drop", function (el, target, source, sibling) {
      $A.beep();
      if (target.id !== "wishedFor" && target.id !== "options") compute();
    });

  // Configure extra functionality for the page.
  var quantity = 0,
    subtotal = 0.0,
    cart = $A.get("selections"),
    compute = function () {
      subtotal = 0.0;
      quantity = $A.query("img", cart, function (i, g) {
        subtotal += parseFloat($A.getAttr(g, "data-price"));
      }).length;
      subtotal = subtotal.toFixed(2);
      $A("#quantity").insert(quantity.toString());
      $A("#subtotal").insert(subtotal.toString());
      $A("#subtotals").alert();
    };
});
