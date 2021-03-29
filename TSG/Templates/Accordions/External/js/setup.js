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
      onRender: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.slideLeftIn", {
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      },
      onRemove: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.slideLeftOut", {
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      }
    }
  });
});
