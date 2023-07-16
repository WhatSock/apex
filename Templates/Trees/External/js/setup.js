$A.import(["Animate", "Tree"], { defer: true }, function () {
  $A.setTree({
    root: "div.treeview",
    fetch: {
      url: "files/tree.htm",
      data: {
        selector: "ul.top.tree",
      },
    },
    onActivate: function (ev, triggerNode, RTI, boundElement, checked, set) {
      var tree = RTI.DC.top;
      // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
      // if 0, the checked state is "false".
      // if 1, the checked state is "true".
      // if 2, the checked state is "mixed".
      // The 'set' argument is a function that will set the checkable item to a new state.
      // The new value must be a string consisting of "false", "true", or "mixed".
      if (checked) {
        set("false");
      } else {
        set("true");
      }
      generateReadingList(tree);
    },
    style: { display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.slideLeftIn", {
          container: document.querySelector("div.treeview"),
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.slideLeftOut", {
          container: document.querySelector("div.treeview"),
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },
  });

  var generateReadingList = function (tree) {
    var list = [];
    $A.query('a[aria-checked="true"]', tree, function (i, treeItem) {
      list.push(
        $A.getText(treeItem) + ", by " + $A.getAttr(treeItem, "data-author"),
      );
    });
    if (list.length)
      $A((list = "<li>" + list.join("</li><li>") + "</li>")).insertWithin(
        "#readingList",
      );
    else $A.empty("#readingList");
  };
});
