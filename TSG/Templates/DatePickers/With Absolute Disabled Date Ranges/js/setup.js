$A.import(["Animate", "DatePicker"], { defer: true }, function() {
  $A.setDatePicker({
    // Unique ID for the date picker instance
    // After instantiation, can be referenced using: var DC = $A("UniqueCalendarId");
    id: "UniqueCalendarId",

    // Icon triggering element
    toggle: $A.get("dateIcon"),

    // Native or simulated input element
    input: $A.get("date"),

    style: { position: "absolute", zIndex: 1, display: "none" },
    animate: {
      onRender: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.fadeIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, wrapper, complete) {
        Velocity(wrapper, "transition.fadeOut", {
          complete: function() {
            complete();
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
