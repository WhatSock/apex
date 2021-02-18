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

    openOnFocus: true,
    openOnFocusHelpText:
      "Press Down arrow to browse the calendar, or Escape to close.",

    // Always restore today's date as being selected when calendar is activated.
    resetCurrent: true,
    highlightToday: true,
    showEscBtn: true,
    escBtnName: "Close",
    escBtnIcon: "&times;",

    afterRender: function(dc) {
      $A.get("keyboardHint").hidden = false;
    },
    afterRemove: function(dc) {
      $A.get("keyboardHint").hidden = true;
    }
  });
});
