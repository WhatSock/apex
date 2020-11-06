$A.import(["Animate", "TabList"], { defer: true }, function() {
  $A.setTabList({
    // Specify the tab container that includes role="tablist".
    tabList: 'ul.aria-tablist[role="tablist"]',

    // Set the DC object to render literal content
    mode: 0,

    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.slideUpIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.slideUpOut", {
          complete: function() {
            complete();
          }
        });
      }
    },

    // Allow tabs to be toggled
    // isToggle: true,

    // Set a className that will be added to the triggering element for the currently active tab
    toggleClass: "active",

    context: document,

    callback: function(dc) {}
  });
});
