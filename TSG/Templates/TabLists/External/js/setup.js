$A.import(["Animate", "TabList"], { defer: true }, function() {
  $A.setTabList("button.aria-tab", {
    trackPage: true,
    afterRender: function(dc) {
      $A.setPage(
        dc.id,
        $A.getText(dc.triggerNode) + " ARIA Tab - Apex 4X Technical Style Guide"
      );
    },

    // Preload HTML markup when pulling content from external resources to speed rendering
    preload: true,
    preloadImages: true,
    preloadCSS: true,

    style: { display: "none" },
    animate: {
      onRender: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.slideUpIn", {
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      },
      onRemove: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.slideUpOut", {
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      }
    },

    isToggle: false,
    toggleClass: "active"
  });
});
