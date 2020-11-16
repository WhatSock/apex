$A.import(["Animate", "Accordion"], { defer: true }, function() {
  $A.setAccordion({
    // Set all triggering elements with the class "aria-accordion-trigger" into accordion toggles.
    triggers: ".aria-accordion-trigger",

    // Set the class name that will be added to the triggering element of the currently open accordion
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

    // Choose whether or not to make accordion expand/collapse links toggles as well
    isToggle: false,
    allowMultiple: false,
    preload: true,
    preloadImages: true,
    // Preload CSS stylesheets to speed rendering
    // preloadCSS: true,
    // importCSS: [
    // "path/stylesheet.css"
    // ],
    context: document,
    callback: function(dc) {
      // if (dc.loaded) {
      // dc.container = the newly displayed region if dc.loaded = true
      // dc.triggerObj is the triggering element for the executed callback
      // }
    }
  });
});
