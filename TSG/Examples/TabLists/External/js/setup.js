$A.import(["Animate", "TabList"], { defer: true }, function() {
  $A.setTabList({
    // Specify the tab container that includes role="tablist".
    tabList: '.aria-tablist[role="tablist"]',

    // Preload HTML markup when pulling content from external content files to speed rendering
    preload: true,

    // Preload images within preloaded HTML markup when pulling content from external content files to speed rendering
    preloadImages: true,

    // Preload CSS stylesheets to speed rendering
    // preloadCSS: true,
    // importCSS: [
    // "path/stylesheet.css"
    // ],

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
    isToggle: false,

    // Set a className that will be added to the triggering element for the currently active tab
    toggleClass: "active",

    context: document,

    callback: function(dc) {}
  });
});
