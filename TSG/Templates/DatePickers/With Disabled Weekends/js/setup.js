$A.import(["Animate", "DatePicker"], { defer: true }, function () {
  $A.setDatePicker({
    // Unique ID for the date picker instance
    // After instantiation, can be referenced using: var DC = $A("UniqueCalendarId");
    id: "UniqueCalendarId",

    // Icon triggering element
    toggle: $A.getEl("dateIcon"),

    // Native or simulated input element
    input: $A.getEl("date"),

    style: { position: "absolute", zIndex: 1, display: "none" },
    animate: {
      onRender: function (dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeIn", {
          complete: function () {
            complete();
          },
        });
      },
      onRemove: function (dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeOut", {
          complete: function () {
            complete();
          },
        });
      },
    },

    // Condense the year display by removing the year nav buttons
    condenseYear: true,

    // Disable weekend days
    disableWeekends: true,
  });
});
