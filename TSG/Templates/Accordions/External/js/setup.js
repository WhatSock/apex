$A.import(["Animate", "Accordion"], { defer: true }, function() {
  $A.setAccordion({
    triggers: ".aria-accordion-trigger",

    // Preload HTML markup to speed rendering
    preload: true,
    // Preload images to speed rendering
    preloadImages: true,
    // Preload CSS stylesheets to speed rendering
    preloadCSS: true,

    toggleClass: "open",

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
    },

    isToggle: false,
    allowMultiple: false
  });
});
