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
    enableComments: true,

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

    /*
    // Optional override to choose a different process for handling date selection
    onDateActivate: function(ev, dc, targ) {
      // Save the desired date string
      targ.value =
        dc.range.wDays[dc.range.current.wDay].lng +
        " " +
        dc.range[dc.range.current.month].name +
        " " +
        dc.range.current.mDay +
        ", " +
        dc.range.current.year;

      // Then close the date picker
      dc.remove();
    },
*/

    // If not included, all of the below values are set by default

    // Set role name text for screen reader users
    role: "Calendar",

    // Set tooltip text
    tooltipTxt: "Press Escape to cancel",
    disabledTxt: "Disabled",
    commentedTxt: "Has Comment",
    prevTxt: "Previous",
    nextTxt: "Next",
    monthTxt: "Month",
    yearTxt: "Year",

    // Set month names
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],

    // Set short and long weekday names
    days: [
      {
        s: "S",
        l: "Sunday"
      },
      {
        s: "M",
        l: "Monday"
      },
      {
        s: "T",
        l: "Tuesday"
      },
      {
        s: "W",
        l: "Wednesday"
      },
      {
        s: "T",
        l: "Thursday"
      },
      {
        s: "F",
        l: "Friday"
      },
      {
        s: "S",
        l: "Saturday"
      }
    ],

    // Set positive or negative offset for differing column arrangements, or 0 for none
    wdOffset: 0,

    // Set CSS positioning calculation for the calendar
    autoPosition: 3,
    // Customize with positive or negative offsets
    offsetTop: 0,
    offsetLeft: 5,
    // Set class for the calendar container
    className: "calendar",

    // Choose a different insertion point in the DOM; must be a DOM node; defaults to the triggering element if not specified.
    targetObj: null,

    // Choose a different focus element in the DOM for CSS autoPositioning; may be a DOM node or CSS Selector; defaults to the triggering element if not specified.
    posAnchor: "",

    // Configure the Comments tooltip pane
    comments: {
      role: "Comment",
      autoPosition: 1,
      offsetTop: 0,
      offsetLeft: 0,
      className: "commentTooltip"
    },

    // Configure the editor form pane
    editor: {
      // Choose to show the form, defaults to false
      show: true,
      // Set the section name, and the Edit button text
      role: "Edit",
      autoPosition: 6,
      offsetTop: 0,
      offsetLeft: 0,
      className: "commentAdd",
      // Set the Save button text
      action1: "Save"
    }

    /*
    // Manually configure the calendar using AJAX or a customization script
    configure: function(dc, save) {
      // 'save' is true when closing the Editor, false otherwise for fetching content when the calendar is opened.

      // If save is false, execute load script

      if (!save) {
        // Optionally load custom values into the dc.range associative array.

        // And optionally prevent this script from running again
        // dc.stopAjax = true;

        // Then open the calendar after processing is finished
        dc.render();
      } else {
        // Otherwise do something with the newly saved values within the dc.range associative array.
      }
    }
*/
  });
});
