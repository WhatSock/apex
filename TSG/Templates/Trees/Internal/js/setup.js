$A.import(["Animate", "Tree"], { defer: true }, function() {
  $A.setTree("ul.top.tree", {
    onActivate: function(ev, triggerNode, RTI, DC, checked, check) {
      var tree = RTI.DC.top;
      // If a triggerNode is checkable, the 'checked' variable will include a number from 0 to 2, otherwise it will be set to false.
      // 0 = "false".
      // 1 = "true".
      // 2 = "mixed".
      if (checked) {
        check("false");
      } else {
        check("true");
      }
      generateReadingList(tree);
    },
    style: { display: "none" },
    animate: {
      onRender: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.slideLeftIn", {
          container: document.querySelector("div.treeview"),
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.slideLeftOut", {
          container: document.querySelector("div.treeview"),
          complete: function() {
            complete();
          }
        });
      }
    }
  });

  var generateReadingList = function(tree) {
    var list = [];
    $A.query('a[aria-checked="true"]', tree, function(i, treeItem) {
      list.push(
        $A.getText(treeItem) + ", by " + $A.getAttr(treeItem, "data-author")
      );
    });
    if (list.length)
      $A((list = "<li>" + list.join("</li><li>") + "</li>")).insertWithin(
        "#readingList"
      );
    else $A.empty("#readingList");
  };
});
