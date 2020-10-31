$A.import(["Animate", "DatePicker"], { defer: true }, function() {
  $A.setDatePicker({
    // Unique ID for the date picker instance
    // After instantiation, can be referenced using: var DC = $A("UniqueCalendarId");
    id: "UniqueCalendarId",

    // Icon triggering element
    toggle: $A.getEl("dateIcon"),

    // Native or simulated input element
    input: $A.getEl("date"),

    animate: {
      onRender: function(dc, outerNode, complete) {
        // Optionally add an animation effect when the calendar is rendered.
        // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
        complete();
      },
      onRemove: function(dc, outerNode, complete) {
        // Optionally add an animation effect when the calendar is removed.
        // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
        complete();
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

    // Configure absolute and relative disabled date ranges (no earlier than 1st January 2018, and no later than 3 days after today)
    minDate: new Date(2018, 0, 1), // remember that javascript dates have months starting from zero
    maxDate: 3,

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
    posAnchor: ""
  });
});
