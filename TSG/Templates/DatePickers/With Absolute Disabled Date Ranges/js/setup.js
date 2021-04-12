$A.import(["Animate", "Datepicker"], { defer: true }, function() {
  $A.setDatepicker({
    // Unique ID for the date picker instance
    // After instantiation, can be referenced using: var DC = $A("UniqueCalendarId");
    id: "UniqueCalendarId",

    // Icon triggering element
    toggle: $A.get("dateIcon"),

    // Native or simulated input element
    input: $A.get("date"),

    style: { position: "absolute", zIndex: 1, display: "none" },
    animate: {
      onRender: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeIn", {
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      },
      onRemove: function(dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeOut", {
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      }
    },

    // Configure absolute and relative disabled date ranges (no earlier than 1st January 2020, and no later than 3 days after today)
    minDate: new Date(2020, 0, 1), // remember that javascript dates have months starting from zero
    maxDate: 3,

    // Set class for the calendar container
    className: "calendar"
  });
});
