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

    // Configure complex disabled date ranges using the configure method.
    configure: function(dc) {
      // Run before the datepicker renders

      if (!dc.firstResetDate) {
        // Store a variable in the dc object to ensure this only runs when the date picker first opens, and not every time such as when switching between months or years
        dc.firstResetDate = true;

        // Set current date variables
        var cur = new Date();

        /*
                            // (Optional) Set a custom date to start the calendar on, such as 03/01/2017
                            cur.setDate(1);
                            cur.setMonth(2);
                            cur.setFullYear(2017);
              */

        // Now configure a 'current' object that uses the date syntax within the datepicker JS instance
        // This will be used to merge into the datepicker before it opens
        var current = {
          day: cur.getDate(),
          month: cur.getMonth(),
          year: cur.getFullYear(),
          weekDay: cur.getDay()
        };

        // Now adjust the default date that the date picker first opens with using the previously set date object
        // Uses the 'current' object variables to set the dates within the calendar before it opens
        dc.range.current.month = current.month;
        dc.range.current.mDay = current.day;
        dc.range.current.wDay = current.weekDay;
        dc.range.current.year = current.year;

        // (Optional) Adjust the start date accordingly using an offset for the disabled date range if desired
        cur.setDate(cur.getDate() + 1);

        // Now set a custom variable to store the disabled date range starting point
        dc.startDate = {
          day: cur.getDate(),
          month: cur.getMonth(),
          year: cur.getFullYear(),
          weekDay: cur.getDay()
        };
      }

      // Now dynamically adjust the disabled date range always starting with dc.startDate
      var current = dc.startDate;

      // Disable all dates prior to the current day
      dc.presetDate(dc, cur, cur);

      /*
      if (
        current.year > dc.range.current.year ||
        (current.year === dc.range.current.year &&
          current.month > dc.range.current.month)
      ) {
        dc.range[dc.range.current.month].disabled[dc.range.current.year] = [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31
        ];
      }
*/

      if (
        current.year === dc.range.current.year &&
        current.month === dc.range.current.month
      ) {
        dc.range[dc.range.current.month].disabled[dc.range.current.year] = [];

        for (var day = 1; day < current.day; day++) {
          dc.range[dc.range.current.month].disabled[dc.range.current.year].push(
            day
          );
        }
      }

      // Disable all dates that fall on Saturday or Sunday
      // 0 = Sunday, 6 = Saturday
      dc.range.disabledWDays = [0, 6];

      // Disable Halloween for every year
      if (dc.range.current.month === 9) {
        if (!dc.range[dc.range.current.month].disabled[dc.range.current.year])
          dc.range[dc.range.current.month].disabled[dc.range.current.year] = [];
        dc.range[dc.range.current.month].disabled[dc.range.current.year].push(
          31
        );
      }

      // Clean up the disabled array by filtering duplicates.
      if (
        dc.range[dc.range.current.month].disabled[dc.range.current.year] &&
        dc.range[dc.range.current.month].disabled[dc.range.current.year].length
      )
        dc.range[dc.range.current.month].disabled[
          dc.range.current.year
        ] = dc.range[dc.range.current.month].disabled[
          dc.range.current.year
        ].filter(function(o, i, a) {
          return a.indexOf(o) === i;
        });

      // Prevent configure from running again.
      dc.stopConfigure = true;

      return true;
    }
  });
});
