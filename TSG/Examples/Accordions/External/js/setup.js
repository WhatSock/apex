$A.import(["Animate", "Accordion"], { defer: true }, function() {
  $A.setAccordion({
    // Set all triggering elements with the class "aria-accordion-trigger" into accordion toggles.
    triggers: ".aria-accordion-trigger",

    // Preload HTML markup to speed rendering
    preload: true,

    // Preload images to speed rendering
    preloadImages: true,

    // Preload CSS stylesheets to speed rendering
    // preloadCSS: true,
    // importCSS: [
    // "path/stylesheet.css"
    // ],

    // Set the class name that will be added to the triggering element of the currently open accordion
    toggleClass: "open",

    animate: {
      onRender: function(dc, outerNode, complete) {
        // Optionally add an animation effect when the accordion panel is rendered.
        // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
        complete();
      },
      onRemove: function(dc, outerNode, complete) {
        // Optionally add an animation effect when the accordion panel is removed.
        // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
        complete();
      }
    },

    // Choose whether or not to make accordion expand/collapse links toggles as well
    isToggle: false,

    allowMultiple: false,

    context: document,

    callback: function(dc) {
      // if (dc.loaded) {
      // dc.container = the newly displayed region if dc.loaded = true
      // dc.triggerObj is the triggering element for the executed callback
      // }
    }
  });
});
