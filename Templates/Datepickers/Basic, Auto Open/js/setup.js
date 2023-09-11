$A.import(["Animate", "Datepicker"], { defer: true }, function () {
  $A.setDatepicker({
    // Unique ID for the date picker instance
    // After instantiation, can be referenced using: var DC = $A("UniqueCalendarId");
    id: "UniqueCalendarId",

    // Icon triggering element
    toggle: $A.get("dateIcon"),

    // Native or simulated input element
    input: $A.get("date"),

    // Optionally convert the static year field into a year selector dropdown.
    yearSelect: true,
    yearSelectMin: 1900,
    yearSelectMax: new Date().getFullYear() + 5,
    // Optionally convert the static month field into a month selector dropdown.
    monthSelect: true,
    // Force the month/year select dropdown to render instead of a button.
    forceSelect: false,

    style: { position: "absolute", zIndex: 1, display: "none" },
    animate: {
      onRender: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeIn", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
      onRemove: function (dc, wrapper, next) {
        Velocity(wrapper, "transition.fadeOut", {
          complete: function () {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          },
        });
      },
    },

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
