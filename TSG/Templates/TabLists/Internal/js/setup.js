$A.import(["Animate", "TabList"], { defer: true }, function() {
  $A.setTabList("button.aria-tab", {
    trackPage: true,
    afterRender: function(dc) {
      $A.setPage(
        dc.id,
        $A.getText(dc.triggerNode) + " ARIA Tab - Apex 4X Technical Style Guide"
      );
    },

    style: { display: "none" },
    animate: {
      onRender: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.slideUpIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.slideUpOut", {
          complete: function() {
            complete();
          }
        });
      }
    },

    isToggle: false,
    toggleClass: "active",
    toggleHide: true
  });
});
