$A.import(["Animate", "Datepicker"], { defer: true }, function () {
  var bc = $A.setDatepicker({
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

    // Enable comment dialog
    enableComments: true,

    // Configure the Comments tooltip pane
    comments: {
      role: "Comment",
      className: "commentTooltip",
      config: {
        autoPosition: 1,
        offsetTop: 0,
        offsetLeft: 0,
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
      },
    },

    // Configure the editor form pane
    editor: {
      // Choose to show the form, defaults to false
      show: true,
      // Set the section name, and the Edit button text
      role: "Edit",
      className: "commentAdd",
      // Set the Save button text
      action1: "Save",
      config: {
        autoPosition: 6,
        offsetTop: 0,
        offsetLeft: 0,
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
      },
    },
  });

  // Set Tooltip Comments for the newly created Calendar DC object

  // Set comments for dates in January. (Change '*' to a year such as 2013 to localize date ranges)

  bc.range[0].comments["*"] = {
    1: "Happy New Year!",
  };

  // Set comments for dates in July. (Change '*' to a year such as 2013 to localize date ranges)

  bc.range[6].comments["*"] = {
    4: "Happy 4th of July!",
  };

  // Set comments for dates in October. (Change '*' to a year such as 2013 to localize date ranges)

  bc.range[9].comments["*"] = {
    31: "Happy Halloween!",
  };

  // Set comments for dates in December. (Change '*' to a year such as 2013 to localize date ranges)

  bc.range[11].comments["*"] = {
    24: "Happy Christmas Eve!",
    25: "Merry Christmas!",
    31: "Happy New Year's Eve!",
  };
});
