$A.import(["Animate", "Datepicker"], { defer: true }, function () {
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
      onRender: function (dc, wrapper, next) {
        window.Velocity(wrapper, "transition.fadeIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        window.Velocity(wrapper, "transition.fadeOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },

    // Configure relative disabled date ranges (5 days before today, and 30 days after today)
    minDate: -5,
    maxDate: 30,

    // Disable weekends from selection
    disableWeekends: true,

    openOnFocus: true,
    openOnFocusHelpText:
      "Press Down arrow to browse the calendar, or Escape to close.",

    // Always restore today's date as being selected when calendar is activated.
    resetCurrent: true,
    highlightToday: true,
    showEscBtn: true,
    escBtnName: "Close",
    escBtnIcon: "&times;",

    afterRender: function (dc) {
      $A.get("keyboardHint").hidden = false;
    },

    afterRemove: function (dc) {
      $A.get("keyboardHint").hidden = true;
    },
  });
});
