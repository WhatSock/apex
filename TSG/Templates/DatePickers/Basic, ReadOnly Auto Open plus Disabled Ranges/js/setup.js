$A.import(["Animate", "DatePicker"], { defer: true }, function() {
  $A.setDatePicker({
    // Unique ID for the date picker instance
    // After instantiation, can be referenced using: var DC = $A("UniqueCalendarId");
    id: "UniqueCalendarId",

    // Icon triggering element
    toggle: $A.getEl("dateIcon"),

    // Native or simulated input element
    input: $A.getEl("date"),

    style: { display: "none" },
    animate: {
      onRender: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeIn", {
          complete: function() {
            complete();
          }
        });
      },
      onRemove: function(dc, outerNode, complete) {
        Velocity(outerNode, "transition.fadeOut", {
          complete: function() {
            complete();
          }
        });
      }
    },

    // Enable comment dialog
    enableComments: false,

    // Using a token system, set a specific date string format to be used when setting the selected value into the calendar input box
    // 'YYYY': 4 digit year, 2019
    // 'MMMM': Full name of month, January, etc.
    // 'dddd': Full name of weekday, Monday, etc.
    // 'MM': 2 digit month, 01, etc.
    // 'DD': 2 digit day, 01, etc.
    // 'Do': getDateOrdinalSuffix, 1st, 2nd, 3rd.
    // 'M': 1 or 2 digit month, 1 through 12
    // 'D': 1 or 2 digit day, 1 through 31.
    inputDateFormat: "MM/DD/YYYY",

    // Optional override to choose a different process for handling date selection
    // onDateActivate: function(ev, dc, target) {},

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

    // Set CSS positioning calculation for the calendar
    autoPosition: 3,
    // Customize with positive or negative offsets
    offsetTop: 0,
    offsetLeft: 5,

    allowCascade: true,

    afterRender: function(dc) {
      $A.remAttr($A.getEl("keyboardHint"), "hidden");
    },

    afterRemove: function(dc) {
      $A.setAttr($A.getEl("keyboardHint"), "hidden", true);
    }
  });
});
