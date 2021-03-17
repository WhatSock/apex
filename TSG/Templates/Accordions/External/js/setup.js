$A.import(["Animate", "Accordion"], { defer: true }, function() {
  $A.setAccordion(".aria-accordion-trigger", {
    trackPage: true,
    isToggle: false,
    allowMultiple: false,
    preload: true,
    preloadImages: true,
    preloadCSS: true,

    toggleClass: "open",

    style: { display: "none" },
    animate: {
      onRender: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.slideLeftIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.slideLeftOut", {
          complete: function() {
            complete();
          }
        });
      }
    }
  });
});
