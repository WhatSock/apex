$A.import(["Animate", "Accordion"], { defer: true }, function() {
  $A.setAccordion({
    triggers: ".aria-accordion-trigger",

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
    allowMultiple: false,
    preload: true,
    preloadImages: true
  });
});
