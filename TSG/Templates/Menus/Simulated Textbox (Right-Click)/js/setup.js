$A.import(["Animate", "Menu"], { defer: true }, function () {
  $A.setMenu("#blackboardId", {
    rightClick: true,
    onActivate: function (ev, triggerNode, RTI) {
      if (triggerNode.href && triggerNode.href.indexOf("https://") !== -1)
        location.href = triggerNode.href;
      else alert(triggerNode.id);
    },
    style: { display: "none" },
    animate: {
      onRender: function (dc, outerNode, complete) {
        Velocity(outerNode, "transition.slideUpIn", {
          complete: function () {
            complete();
          },
        });
      },
      onRemove: function (dc, outerNode, complete) {
        Velocity(outerNode, "transition.slideUpOut", {
          complete: function () {
            complete();
          },
        });
      },
    },
  });
});
