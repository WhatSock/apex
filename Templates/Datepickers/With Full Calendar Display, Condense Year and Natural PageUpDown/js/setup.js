$A.import(["Animate", "Datepicker"], { defer: true }, function () {
  $A.setDatepicker({
    // Unique ID for the date picker instance
    // After instantiation, can be referenced using: var DC = $A("UniqueCalendarId");
    id: "UniqueCalendarId",

    // Icon triggering element
    toggle: $A.get("dateIcon"),

    // Native or simulated input element
    input: $A.get("date"),

    // Optionally convert the static month field into a month selector dropdown.
    monthSelect: true,
    // Force the month/year select dropdown to render instead of a button.
    forceSelect: false,

    style: { position: "absolute", zIndex: 1, display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.fadeIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.fadeOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },

    // Condense the year display by removing the year nav buttons
    condenseYear: true,

    // Draw the full calendar, including days in the previous and next months
    drawFullCalendar: true,

    // Set class for the calendar container
    className: "calendar",
  });
});
