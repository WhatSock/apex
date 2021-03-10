$A.import(["Animate", "Accordion"], { defer: true }, function() {
  $A.setAccordion(".aria-accordion-trigger", {
    singleTabStop: true,
    toggleClass: "open",
    toggleHide: true,
    isToggle: false,
    allowMultiple: false,

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
