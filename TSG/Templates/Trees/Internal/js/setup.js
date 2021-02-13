$A.import(["Animate", "Tree"], { defer: true }, function() {
  $A.setTree("ul.top.tree", {
    onActivate: function(ev, triggerNode, RTI, DC, checked, check) {
      var tree = RTI.DC.top;
      if (checked) {
        check("false");
      } else {
        check("true");
      }
      generateReadingList(tree);
    },
    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.slideLeftIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.slideLeftOut", {
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
