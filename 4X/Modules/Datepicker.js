/*@license
ARIA Date Picker Module 5.7 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Contributions by Danny Allen (dannya.com) / Wonderscore Ltd (wonderscore.co.uk)
https://github.com/whatsock/apex
License: MIT <https://opensource.org/licenses/MIT>
*/

(function () {
  if (!("setDatepicker" in $A)) {
    $A.addWidgetProfile("Datepicker", {
      configure: function (dc) {
        return {
          returnFocus: false,
          allowRerender: true,
          exposeBounds: true,
          exposeHiddenClose: false,
        };
      },
      role: function (dc) {
        return {
          role: "dialog",
          "aria-modal": "false",
          "aria-label": dc.role,
        };
      },
      innerRole: function (dc) {
        return {
          role: "application",
        };
      },
    });
    $A.extend({
      setDatepicker: function (config) {
        var config = config || {},
          helpTextShort = config.helpTextShort
            ? config.helpTextShort
            : "Press F1 for help.",
          helpText = config.helpText
            ? config.helpText
            : "Press the arrow keys to navigate by day, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year, or Escape to cancel.",
          monthOnly = config.monthOnly === true,
          monthSelect = monthOnly || config.monthSelect === true,
          yearSelect = monthOnly || config.yearSelect === true,
          forceSelect = monthOnly || config.forceSelect === true,
          // Toggles for openOnFocus support.
          openOnFocusHelpText = config.openOnFocusHelpText
            ? config.openOnFocusHelpText
            : "Press Down arrow to browse the calendar, or Escape to close.",
          onFocusInit = false,
          onFocusTraverse = false,
          pId = config.id || $A.genId(),
          trigger = $A.morph(config.toggle),
          targ = $A.morph(config.input),
          commentsEnabled = !monthOnly && config.enableComments === true,
          // Control the behavior of date selection clicks
          handleClick = $A.isFn(config.onActivate)
            ? config.onActivate
            : function (ev, dc) {
                // format selected calendar value and set into input field
                targ.value = dc.formatDate(dc);

                dc.remove();

                if (!dc.triggerClicked) $A.focus(config.returnFocusTo || targ);
                else $A.focus(config.returnFocusTo || trigger);
                dc.triggerClicked = false;
              },
          pressed = {},
          changePressed = function (ev) {
            pressed.alt = ev.altKey;
            pressed.ctrl = ev.ctrlKey;
            pressed.shift = ev.shiftKey;
          };

        var baseId = $A.genId();

        // Calendar object declaration start
        var mainDC = $A(
          [
            {
              id: pId,
              role: config.role || "Calendar",
              widgetType: "Datepicker",
              //              autoCloseWidget: true,
              autoCloseSameWidget: true,
              trigger: trigger,
              target: targ,
              on: "opendatepicker",
              disabled: config.disabled === true,
              // Toggles for openOnFocus support.
              returnFocus: false,
              openOnFocus: config.openOnFocus === true,
              openOnFocusHelpText: openOnFocusHelpText,
              showEscBtn: config.showEscBtn === true,
              escBtnName: config.escBtnName || "Close",
              escBtnIcon: config.escBtnIcon || "&times;",
              tooltipTxt: config.tooltipTxt || "Press Escape to cancel",
              markedTxt: config.markedTxt || "Selected",
              disabledTxt: config.disabledTxt || "Disabled",
              commentedTxt: config.commentedTxt || "Has Comment",
              prevTxt: config.prevTxt || "Previous",
              nextTxt: config.nextTxt || "Next",
              monthTxt: config.monthTxt || "Month",
              yearTxt: config.yearTxt || "Year",
              leftButtonYearText: config.leftButtonYearText || "&#8656;",
              rightButtonYearText: config.rightButtonYearText || "&#8658;",
              leftButtonMonthText: config.leftButtonMonthText || "&#8592;",
              rightButtonMonthText: config.rightButtonMonthText || "&#8594;",
              drawFullCalendar: config.drawFullCalendar === true,
              highlightToday: $A.isBool(config.highlightToday)
                ? config.highlightToday
                : true,
              pageUpDownNatural: true,
              // inputDateFormat: config.inputDateFormat || "dddd MMMM D, YYYY",
              inputDateFormat: config.inputDateFormat || "MM/DD/YYYY",
              audibleDateFormat: config.audibleDateFormat || "dddd D MMMM YYYY",
              initialDate:
                config.initialDate instanceof Date
                  ? config.initialDate
                  : new Date(),
              minDate:
                config.minDate !== undefined
                  ? config.minDate instanceof Date
                    ? config.minDate
                    : new Date(
                        new Date().setDate(
                          new Date().getDate() + config.minDate,
                        ),
                      )
                  : undefined,
              maxDate:
                config.maxDate !== undefined
                  ? config.maxDate instanceof Date
                    ? config.maxDate
                    : new Date(
                        new Date().setDate(
                          new Date().getDate() + config.maxDate,
                        ),
                      )
                  : undefined,
              disableWeekdays:
                config.disableWeekdays !== undefined
                  ? config.disableWeekdays
                  : false,
              disableWeekends:
                config.disableWeekends !== undefined
                  ? config.disableWeekends
                  : false,
              className: config.className || "calendar",
              range: {
                disabledWDays: [],
                0: {
                  name:
                    config.months && config.months[0]
                      ? config.months[0]
                      : "January",
                  max: 31,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                1: {
                  name:
                    config.months && config.months[1]
                      ? config.months[1]
                      : "February",
                  max: 28,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                2: {
                  name:
                    config.months && config.months[2]
                      ? config.months[2]
                      : "March",
                  max: 31,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                3: {
                  name:
                    config.months && config.months[3]
                      ? config.months[3]
                      : "April",
                  max: 30,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                4: {
                  name:
                    config.months && config.months[4]
                      ? config.months[4]
                      : "May",
                  max: 31,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                5: {
                  name:
                    config.months && config.months[5]
                      ? config.months[5]
                      : "June",
                  max: 30,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                6: {
                  name:
                    config.months && config.months[6]
                      ? config.months[6]
                      : "July",
                  max: 31,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                7: {
                  name:
                    config.months && config.months[7]
                      ? config.months[7]
                      : "August",
                  max: 31,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                8: {
                  name:
                    config.months && config.months[8]
                      ? config.months[8]
                      : "September",
                  max: 30,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                9: {
                  name:
                    config.months && config.months[9]
                      ? config.months[9]
                      : "October",
                  max: 31,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                10: {
                  name:
                    config.months && config.months[10]
                      ? config.months[10]
                      : "November",
                  max: 30,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                11: {
                  name:
                    config.months && config.months[11]
                      ? config.months[11]
                      : "December",
                  max: 31,
                  marked: {},
                  disabled: {},
                  disabledWDays: [],
                  comments: {},
                  message: {},
                },
                wDays: [
                  {
                    shrt:
                      config.days && config.days[0] ? config.days[0].s : "S",
                    lng:
                      config.days && config.days[0]
                        ? config.days[0].l
                        : "Sunday",
                  },
                  {
                    shrt:
                      config.days && config.days[1] ? config.days[1].s : "M",
                    lng:
                      config.days && config.days[1]
                        ? config.days[1].l
                        : "Monday",
                  },
                  {
                    shrt:
                      config.days && config.days[2] ? config.days[2].s : "T",
                    lng:
                      config.days && config.days[2]
                        ? config.days[2].l
                        : "Tuesday",
                  },
                  {
                    shrt:
                      config.days && config.days[3] ? config.days[3].s : "W",
                    lng:
                      config.days && config.days[3]
                        ? config.days[3].l
                        : "Wednesday",
                  },
                  {
                    shrt:
                      config.days && config.days[4] ? config.days[4].s : "T",
                    lng:
                      config.days && config.days[4]
                        ? config.days[4].l
                        : "Thursday",
                  },
                  {
                    shrt:
                      config.days && config.days[5] ? config.days[5].s : "F",
                    lng:
                      config.days && config.days[5]
                        ? config.days[5].l
                        : "Friday",
                  },
                  {
                    shrt:
                      config.days && config.days[6] ? config.days[6].s : "S",
                    lng:
                      config.days && config.days[6]
                        ? config.days[6].l
                        : "Saturday",
                  },
                ],
                // Change the week day offset for the calendar display
                wdOffset: isNaN(config.wdOffset) ? 0 : config.wdOffset,
              },
              getWDay: function (dc, d, r) {
                var d = $A.isNum(d) ? d : dc.range.current.wDay,
                  o = dc.range.wdOffset;

                if (o < 0) d = d + o < 0 ? 7 + o : d + o;
                else if (o > 0) d = d + o > 6 ? -1 + (d + o - 6) : d + o;

                if (r) d = 6 - d;
                return d;
              },
              getDateOrdinalSuffix: function (i) {
                var j = i % 10,
                  k = i % 100;

                if (j === 1 && k !== 11) {
                  return i + "st";
                }

                if (j === 2 && k !== 12) {
                  return i + "nd";
                }

                if (j === 3 && k !== 13) {
                  return i + "rd";
                }

                return i + "th";
              },
              formatDate: function (dc, dateFormatTokens, dateFormat) {
                if (!dateFormatTokens)
                  dateFormatTokens = {
                    YYYY: dc.range.current.year,
                    YY: dc.range.current.year.toString().slice(-2),
                    MMMM: dc.range[dc.range.current.month].name,
                    dddd: dc.range.wDays[dc.range.current.wDay].lng,
                    MM: ("00" + (dc.range.current.month + 1)).slice(-2),
                    DD: ("00" + dc.range.current.mDay).slice(-2),
                    Do: dc.getDateOrdinalSuffix(dc.range.current.mDay),
                    M: dc.range.current.month + 1,
                    D: dc.range.current.mDay,
                  };

                // if dateFormat is not specified, use component default
                if (!$A.isStr(dateFormat)) dateFormat = dc.inputDateFormat;

                var re = new RegExp(
                  Object.keys(dateFormatTokens).join("|"),
                  "gi",
                );

                return dateFormat.replace(re, function (matched) {
                  return dateFormatTokens[matched];
                });
              },
              modifyDateValues: function (values, modifications) {
                // Note: Months are zero based
                for (var key in modifications) {
                  var modification = modifications[key];

                  if (key === "month") {
                    values.month += modification;

                    if (modification < 0) {
                      // Subtraction
                      if (values.month < 0) {
                        values.month = 11;

                        if (values.year) {
                          values.year -= 1;
                        }
                      }
                    } else {
                      // Addition
                      if (values.month > 11) {
                        values.month = 0;

                        if (values.year) {
                          values.year += 1;
                        }
                      }
                    }
                  }
                }

                return values;
              },
              setFocus: function (o, p, s) {
                var dc = this;

                if (!o) return false;

                dc.current = o;

                if (!monthOnly) {
                  dc.query("td.dayInMonth.selected", function (i, p) {
                    $A.setAttr(p, {
                      tabindex: "-1",
                    });

                    $A.remClass(p, "selected");
                    $A.data(p, "_Selected", 0);
                  });
                  $A.addClass(o, "selected");
                  $A.data(o, "_Selected", true);
                  $A.setAttr(o, {
                    tabindex: "0",
                  });
                }

                if (!s) {
                  if (dc.navBtn === "PM") {
                    dc.buttons.pM.focus();
                    setTimeout(function () {
                      $A.announce(
                        dc.range[dc.range.current.month].name,
                        false,
                        true,
                      );
                    }, 1);
                    dc.navBtnS = true;
                  } else if (dc.navBtn === "NM") {
                    dc.buttons.nM.focus();
                    setTimeout(function () {
                      $A.announce(
                        dc.range[dc.range.current.month].name,
                        false,
                        true,
                      );
                    }, 1);
                    dc.navBtnS = true;
                  } else if (dc.navBtn === "PY") {
                    dc.buttons.pY.focus();
                    setTimeout(function () {
                      $A.announce(
                        dc.range.current.year.toString(),
                        false,
                        true,
                      );
                    }, 1);
                    dc.navBtnS = true;
                  } else if (dc.navBtn === "NY") {
                    dc.buttons.nY.focus();
                    setTimeout(function () {
                      $A.announce(
                        dc.range.current.year.toString(),
                        false,
                        true,
                      );
                    }, 1);
                    dc.navBtnS = true;
                  } else if (dc.navBtn === "CY") {
                    if (!dc.buttons.cYS.hidden) dc.buttons.cYS.focus();
                    else if (!dc.buttons.cY.hidden) dc.buttons.cY.focus();
                  } else if (
                    dc.navBtn === "CM" ||
                    (monthOnly && (!dc.openOnFocus || triggered))
                  ) {
                    if (!dc.buttons.cYS.hidden) dc.buttons.cYS.focus();
                    else if (!dc.buttons.cY.hidden) dc.buttons.cY.focus();
                  } else {
                    // Toggles for openOnFocus support.
                    if (
                      !dc.openOnFocus ||
                      (dc.openOnFocus && !onFocusInit && onFocusTraverse)
                    ) {
                      o.focus();
                    }
                  }
                }

                if (dc.fn.navBtn) dc.fn.navBtn = "";
                else dc.navBtn = "";

                return true;
              },
              setCurrent: function (dc) {
                if (dc.date instanceof Date) {
                  dc.range.current = {
                    mDay: dc.date.getDate(),
                    month: dc.date.getMonth(),
                    year: dc.date.getFullYear(),
                    wDay: dc.date.getDay(),
                  };
                }
              },
              setDayMarked: function (dc, dateObj, isMarked) {
                var year = dateObj.getFullYear(),
                  month = dateObj.getMonth(),
                  day = dateObj.getDate();

                if (isMarked) {
                  // initialise marked array for month if it doesn't exist
                  if (typeof dc.range[month].marked[year] !== "object") {
                    dc.range[month].marked[year] = [];
                  }

                  // set day as marked
                  dc.range[month].marked[year].push(day);
                } else {
                  // unset day as marked
                  if (typeof dc.range[month].marked[year] === "object") {
                    var arrIndex = dc.range[month].marked[year].indexOf(day);

                    if (arrIndex !== -1) {
                      delete dc.range[month].marked[year][arrIndex];
                    }
                  }
                }
              },
              clearAllMarked: function (dc) {
                for (var month in dc.range) {
                  dc.range[month].marked = {};
                }
              },
              setDayDisabled: function (dc, dateObj, isDisabled) {
                var year = dateObj.getFullYear(),
                  month = dateObj.getMonth(),
                  day = dateObj.getDate();

                if (isDisabled) {
                  // initialise disabled array for month if it doesn't exist
                  if (typeof dc.range[month].disabled[year] !== "object") {
                    dc.range[month].disabled[year] = [];
                  }

                  // set day as disabled
                  dc.range[month].disabled[year].push(day);
                } else {
                  // unset day as disabled
                  if (typeof dc.range[month].disabled[year] === "object") {
                    var arrIndex = dc.range[month].disabled[year].indexOf(day);

                    if (arrIndex !== -1) {
                      delete dc.range[month].disabled[year][arrIndex];
                    }
                  }
                }
              },
              setMonthDisabled: function (dc, dateObj, isDisabled) {
                var year = dateObj.getFullYear(),
                  month = dateObj.getMonth();

                if (isDisabled) {
                  // reset month disabled array
                  dc.range[month].disabled[year] = [];

                  // set each day in month as disabled
                  for (var day = 1; day <= dc.range[month].max; day++) {
                    dc.range[month].disabled[year].push(day);
                  }
                } else {
                  // unset month as disabled
                  dc.range[month].disabled[year] = [];
                }
              },
              setDayOfWeekDisabled: function (
                dc,
                dateObj,
                daysOfWeek,
                isDisabled,
              ) {
                var year = dateObj.getFullYear(),
                  month = dateObj.getMonth();

                // initialise disabled array for month if it doesn't exist
                if (typeof dc.range[month].disabled[year] !== "object") {
                  dc.range[month].disabled[year] = [];
                }

                // initialise local modifiable date that we will use to call the native getDay() method on
                var date = new Date(year, month, 1);

                for (var day = 1; day <= dc.range[month].max; day++) {
                  date.setDate(day);

                  if (daysOfWeek.indexOf(date.getDay()) !== -1) {
                    if (isDisabled) {
                      dc.range[month].disabled[year].push(day);
                    } else {
                      // unset day as disabled
                      var arrIndex = dc.range[month].marked[year].indexOf(day);

                      if (arrIndex !== -1) {
                        delete dc.range[month].marked[year][arrIndex];
                      }
                    }
                  }
                }
              },
              setWeekdaysDisabled: function (dc, dateObj, isDisabled) {
                // 0 = Sunday, 6 = Saturday
                dc.setDayOfWeekDisabled(
                  dc,
                  dateObj,
                  [1, 2, 3, 4, 5],
                  isDisabled,
                );
              },
              setWeekendsDisabled: function (dc, dateObj, isDisabled) {
                // 0 = Sunday, 6 = Saturday, which are the days we are not setting
                dc.setDayOfWeekDisabled(dc, dateObj, [0, 6], isDisabled);
              },
              clearAllDisabled: function (dc) {
                for (var month in dc.range) {
                  dc.range[month].disabled = {};
                }
              },
              setMonthMessage: function (dc, dateObj, message) {
                var year = dateObj.getFullYear(),
                  month = dateObj.getMonth();

                if ($A.isStr(message) && message.length > 0) {
                  // set month message
                  dc.range[month].message[year] = message;
                } else {
                  // unset month message
                  delete dc.range[month].message[year];
                }
              },
              clearAllMessage: function (dc) {
                for (var month in dc.range) {
                  dc.range[month].message = {};
                }
              },
              isDisabledYear: function (dc, year) {
                for (var month = 0; month <= 11; month++) {
                  if (!dc.isDisabledMonth(dc, month, year)) return false;
                }
                return true;
              },
              isDisabledMonth: function (dc, month, year) {
                for (var day = 1; day <= dc.range[month].max; day++) {
                  if (!dc.isDisabledDate(dc, day, new Date(year, month, day)))
                    return false;
                }
                return true;
              },
              isDisabledDate: function (dc, counter, dateObj, cmpObj) {
                if (!cmpObj) {
                  cmpObj = dc.range.current;
                }

                var disabled = dc.range[cmpObj.month].disabled[cmpObj.year],
                  disabledAll = dc.range[cmpObj.month].disabled["*"],
                  disabledWDays = dc.range[cmpObj.month].disabledWDays,
                  disabledAllWDays = dc.range.disabledWDays;

                var wkd = dateObj.getDay();

                return !!(
                  (disabled && $A.inArray(counter, disabled) !== -1) ||
                  (disabledAll && $A.inArray(counter, disabledAll) !== -1) ||
                  (disabledWDays.length &&
                    $A.inArray(wkd, disabledWDays) !== -1) ||
                  (disabledAllWDays.length &&
                    $A.inArray(wkd, disabledAllWDays) !== -1) ||
                  dc.isOutsideDateRange(dateObj)
                );
              },
              isOutsideDateRange: function (dateObj) {
                var dateCmp = this.createDateComparisonValue(dateObj);

                return (
                  (this.minDateComparisonValue &&
                    dateCmp < this.minDateComparisonValue) ||
                  (this.maxDateComparisonValue &&
                    dateCmp > this.maxDateComparisonValue)
                );
              },
              createDayCell: function (
                i,
                cellDateObj,
                cssClasses,
                isDisabled,
                isSelected,
              ) {
                var dc = this,
                  cell = "<td ",
                  dateToday = dc.createDateComparisonValue(new Date()),
                  dateNew = dc.createDateComparisonValue(cellDateObj);

                // set correct ARIA attributes
                if (dateNew === dateToday) {
                  cell += 'aria-current="date" ';
                }

                if (isDisabled) {
                  cell += 'aria-disabled="true" ';
                }

                cell += 'aria-label="';

                // draw comment?
                var comments =
                    dc.range[dc.range.current.month].comments[
                      dc.range.current.year
                    ],
                  commentsAll = dc.range[dc.range.current.month].comments["*"];

                var comm = "";

                if (comments && comments[i]) comm = comments[i];
                else if (commentsAll && commentsAll[i]) comm = commentsAll[i];

                if (comm) {
                  cell += dc.commentedTxt.replace(/<|>|\"/g, "") + " ";
                }

                var month = cellDateObj.getMonth();
                var dateFormatTokens = {
                  YYYY: cellDateObj.getFullYear(),
                  MMMM: dc.range[month].name,
                  dddd: dc.range.wDays[cellDateObj.getDay()].lng,
                  MM: ("00" + (month + 1)).slice(-2),
                  DD: ("00" + i).slice(-2),
                  Do: dc.getDateOrdinalSuffix(i),
                  M: month + 1,
                  D: i,
                };

                // set audible date value
                var re = new RegExp(
                  Object.keys(dateFormatTokens).join("|"),
                  "gi",
                );

                cell += dc.audibleDateFormat.replace(re, function (matched) {
                  return dateFormatTokens[matched];
                });

                if (comm) {
                  cell += comm.replace(/<|>|\n/g, " ").replace(/\"/g, '\\"');
                }
                cell += '" role="button" tabindex="-1" ';

                // CSS classes
                cell += 'class="day ' + (cssClasses ? cssClasses : "");

                if (dc.highlightToday === true) {
                  if (dateNew === dateToday) {
                    cell += " dayToday";
                  }
                }

                // set date as visually marked?
                var isMarked =
                  dc.range[dc.range.current.month].marked[
                    dc.range.current.year
                  ] &&
                  dc.range[dc.range.current.month].marked[
                    dc.range.current.year
                  ].indexOf(i) !== -1;

                if ((isSelected && !isDisabled) || isMarked) {
                  cell += " dayMarked";
                }

                if (isDisabled) {
                  cell += " disabled";
                }

                if (comm) {
                  cell += " comment";
                }
                cell += '" ';

                // Title attribute
                cell += 'title="';

                if (isMarked) {
                  cell += dc.markedTxt.replace(/<|>|\"/g, "");
                } else if (isDisabled) {
                  cell += dc.disabledTxt.replace(/<|>|\"/g, "");
                }

                cell +=
                  '" id="' +
                  dc.baseId +
                  i +
                  '"><span aria-hidden="true">' +
                  i +
                  "</span></td>";

                return cell;
              },
              createDateComparisonValue: function (dateObj) {
                return parseInt(
                  dateObj.getFullYear() +
                    ("00" + dateObj.getMonth()).slice(-2) +
                    ("00" + dateObj.getDate()).slice(-2),
                  10,
                );
              },
              presetDate: function (dc, initialDate, minDate, maxDate) {
                dc = dc || this;
                dc.initialDate = initialDate || dc.initialDate || new Date();
                dc.minDate = minDate || dc.minDate || null;
                dc.maxDate = maxDate || dc.maxDate || null;
                dc.setDateComparisons(dc);
                dc.date = !dc.isDisabledDate(
                  dc,
                  dc.initialDate.getDate(),
                  dc.initialDate,
                )
                  ? dc.initialDate
                  : new Date();
                dc.setCurrent(dc);
                dc.fn.current = {};
                $A.extend(true, dc.fn.current, dc.range.current);
              },
              setDate: function (dc, dateObj) {
                // if dateObj is not specified, set to an initial value...
                if (dateObj === undefined) {
                  // ensure initialDate value is within any set date range
                  if (
                    (dc.minDate || dc.maxDate) &&
                    dc.isOutsideDateRange(dc.initialDate)
                  ) {
                    // initialDate config value is outside of the valid date range, determine an optimal initial date value
                    if (dc.initialDate < dc.minDate) {
                      dateObj = dc.minDate;
                    } else if (dc.initialDate > dc.maxDate) {
                      dateObj = dc.maxDate;
                    }
                  } else {
                    // set to initialDate config value
                    dateObj = dc.initialDate;
                  }
                }

                dc.date = dateObj;
                dc.setCurrent(dc);
                dc.fn.current = {};
                $A.extend(true, dc.fn.current, dc.range.current);
              },
              setDateComparisons: function (dc) {
                // If we have minDate / maxDate set, ensure they don't have time precision, and create comparison value
                if (dc.minDate instanceof Date) {
                  dc.minDate.setHours(0, 0, 0, 0);
                  dc.minDateComparisonValue = dc.createDateComparisonValue(
                    dc.minDate,
                  );
                }
                if (dc.maxDate instanceof Date) {
                  dc.maxDate.setHours(0, 0, 0, 0);
                  dc.maxDateComparisonValue = dc.createDateComparisonValue(
                    dc.maxDate,
                  );
                }
                if (dc.initialDate instanceof Date) {
                  dc.currentDate = dc.initialDate;
                } else {
                  dc.currentDate = new Date();
                }
                // Cache current date for comparison
                dc.currentDateComparisonValue = dc.createDateComparisonValue(
                  dc.currentDate,
                );
              },
              storeCurrentDate: function (dc) {
                dc.date = new Date(
                  dc.range.current.year,
                  dc.range.current.month,
                  dc.range.current.mDay,
                );
              },
              setDisabled: function (dc, s) {
                if (typeof dc === "boolean") {
                  s = dc;
                  dc = this;
                } else dc = dc || this;
                dc.disabled = s ? true : false;
                $A.setAttr([targ, trigger], "disabled", dc.disabled);
                if (!dc.disabled) $A.remAttr([targ, trigger], "disabled");
              },
              onceBeforeRender: function (dc) {
                if (!(dc.date instanceof Date)) {
                  dc.setDateComparisons(dc);
                  dc.setDate(dc);
                }
              },
              rerenderTable: function (dc) {
                dc.rerendering = true;
                dc.afterRemove(dc);
                dc.beforeRender(dc);
                dc.duringRender(dc);
                dc.afterRender(dc);
                dc.rerendering = false;
              },
              beforeRender: function (dc) {
                function isValidDateString(dateString) {
                  var regex_mmddyyyy =
                      /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/,
                    regex_ddmmyyyy =
                      /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/;
                  return (
                    regex_mmddyyyy.test(dateString) ||
                    regex_ddmmyyyy.test(dateString)
                  );
                }

                var dateValue = targ.value.replace(/\.|\-/g, "/"),
                  dateParts = targ.value.split("/");
                if (dateParts.length === 2) {
                  if (dateParts[1] > 12) {
                    if (dateParts[1].length === 2)
                      dateParts[1] = "20" + dateParts[1];
                    dateValue = dateParts[0] + "/01/" + dateParts[1];
                  } else if (dateParts[0] > 12) {
                    if (dateParts[0].length === 2)
                      dateParts[0] = "20" + dateParts[0];
                    dateValue = dateParts[1] + "/01/" + dateParts[0];
                  }
                } else if (
                  config.inputDateFormat === "DD/MM/YYYY" &&
                  dateParts.length === 3
                ) {
                  if (dateParts[2].length === 2)
                    dateParts[2] = "20" + dateParts[2];
                  dateValue =
                    dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2];
                } else if (
                  config.inputDateFormat === "MM/DD/YYYY" &&
                  dateParts.length === 3
                ) {
                  if (dateParts[2].length === 2)
                    dateParts[2] = "20" + dateParts[2];
                  dateValue =
                    dateParts[0] + "/" + dateParts[1] + "/" + dateParts[2];
                }
                var isValid = isValidDateString(dateValue);
                if (!isValid) {
                  dateValue = dc.initialDate;
                }
                if (
                  !dc.rerendering &&
                  isValid &&
                  dateValue &&
                  !dc.isOutsideDateRange(new Date(dateValue))
                ) {
                  dc.presetDate(dc, new Date(dateValue));
                }

                // based on config option, disable weekdays?
                if (dc.disableWeekdays) {
                  dc.setWeekdaysDisabled(dc, dc.date, true);
                }

                // based on config option, disable weekends?
                if (dc.disableWeekends) {
                  dc.setWeekendsDisabled(dc, dc.date, true);
                }

                if (
                  $A.isFn(config.configure) &&
                  !dc.stopConfigure &&
                  !dc.configureLoading
                ) {
                  dc.configureLoading = dc.cancel = true;
                  dc.fn.navBtn = dc.navBtn;
                  if (config.configure.apply(dc, [dc]) === true) {
                    setTimeout(function () {
                      dc.render();
                    }, 1);
                  }
                }

                if (dc.range.current.month === 1)
                  dc.range[1].max =
                    new Date(dc.range.current.year, 1, 29).getMonth() === 1
                      ? 29
                      : 28;
                dc.baseId = baseId;
                dc.prevBtnId = dc.baseId + "p";
                dc.currentBtnId = dc.baseId + "c";
                dc.nextBtnId = dc.baseId + "n";

                // Calculate prev/next month date values, and whether they are within the allowed date range
                var prevDateValues = dc.modifyDateValues(
                  {
                    month: dc.range.current.month,
                    year: dc.range.current.year,
                  },
                  {
                    month: -1,
                  },
                );

                var prevMonth = new Date();
                prevMonth.setMonth(prevDateValues.month);
                prevMonth.setFullYear(prevDateValues.year);

                var nextDateValues = dc.modifyDateValues(
                  {
                    month: dc.range.current.month,
                    year: dc.range.current.year,
                  },
                  {
                    month: 1,
                  },
                );

                var nextMonth = new Date();
                nextMonth.setMonth(nextDateValues.month);
                nextMonth.setFullYear(nextDateValues.year);

                // Draw the year display and prev/next year buttons?
                var yearSelector = "";

                if (!config.condenseYear) {
                  var hasPrevYear = !dc.isOutsideDateRange(
                      new Date(dc.range.current.year - 1, 0, 1),
                    ),
                    hasNextYear = !dc.isOutsideDateRange(
                      new Date(dc.range.current.year + 1, 0, 1),
                    );

                  yearSelector =
                    '<tr class="yearSelector" role="presentation">' +
                    '<td class="nav prev btn year' +
                    (!hasPrevYear ? " disabled" : "") +
                    '" accesskey="1" title="' +
                    dc.prevTxt.replace(/<|>|\"/g, "") +
                    " " +
                    dc.yearTxt.replace(/<|>|\"/g, "") +
                    '" aria-label="' +
                    dc.prevTxt.replace(/<|>|\"/g, "") +
                    " " +
                    dc.yearTxt.replace(/<|>|\"/g, "") +
                    '"' +
                    (!hasPrevYear
                      ? ' aria-disabled="true" tabindex="-1"'
                      : ' tabindex="0"') +
                    ' role="button" id="' +
                    dc.prevBtnId +
                    'Y"><span aria-hidden="true">' +
                    dc.leftButtonYearText +
                    "</span></td>" +
                    '<td colspan="5" class="year" role="presentation" title="' +
                    dc.tooltipTxt.replace(/<|>|\"/g, "") +
                    '">' +
                    // Add year select field if enabled.
                    (yearSelect
                      ? "<select " +
                        (forceSelect ? "" : "hidden ") +
                        'class="nav current select year" id="' +
                        dc.currentBtnId +
                        'Y" title="' +
                        dc.yearTxt.replace(/<|>|\"/g, "") +
                        '" aria-label="' +
                        dc.yearTxt.replace(/<|>|\"/g, "") +
                        '">' +
                        (function () {
                          var min =
                              config.yearSelectMin || dc.range.current.year,
                            max = config.yearSelectMax || dc.range.current.year,
                            s = "";
                          if (dc.minDate instanceof Date)
                            min = Math.min(min, dc.minDate.getFullYear());
                          if (dc.maxDate instanceof Date)
                            max = Math.max(max, dc.maxDate.getFullYear());
                          while (min <= max) {
                            if (!dc.isDisabledYear(dc, min))
                              s +=
                                "<option" +
                                (min === dc.range.current.year
                                  ? ' selected="selected"'
                                  : "") +
                                " value=" +
                                min +
                                ">" +
                                min +
                                "</option>";
                            min++;
                          }
                          return s;
                        })() +
                        "</select>" +
                        "<span " +
                        (forceSelect ? "hidden " : "") +
                        'class="nav current btn year" tabindex="0" role="button" id="' +
                        dc.currentBtnId +
                        'YB">' +
                        dc.range.current.year +
                        "</span>"
                      : "<span>" + dc.range.current.year + "</span>") +
                    "</td>" +
                    '<td class="nav next btn year' +
                    (!hasNextYear ? " disabled" : "") +
                    '" accesskey="2" title="' +
                    dc.nextTxt.replace(/<|>|\"/g, "") +
                    " " +
                    dc.yearTxt.replace(/<|>|\"/g, "") +
                    '" aria-label="' +
                    dc.nextTxt.replace(/<|>|\"/g, "") +
                    " " +
                    dc.yearTxt.replace(/<|>|\"/g, "") +
                    '"' +
                    (!hasNextYear
                      ? ' aria-disabled="true" tabindex="-1"'
                      : ' tabindex="0"') +
                    ' role="button" id="' +
                    dc.nextBtnId +
                    'Y"><span aria-hidden="true">' +
                    dc.rightButtonYearText +
                    "</span></td></tr>";
                }

                // Draw the month display and prev/next month buttons
                var hasPrevMonth = !dc.isOutsideDateRange(
                    new Date(
                      prevDateValues.year,
                      prevDateValues.month,
                      dc.range[prevDateValues.month].max,
                    ),
                  ),
                  hasNextMonth = !dc.isOutsideDateRange(
                    new Date(nextDateValues.year, nextDateValues.month, 1),
                  );

                var monthSelector =
                  '<tr class="monthSelector" role="presentation">' +
                  '<td class="nav prev btn month' +
                  (!hasPrevMonth ? " disabled" : "") +
                  '" accesskey="3" title="' +
                  dc.prevTxt.replace(/<|>|\"/g, "") +
                  " " +
                  dc.monthTxt.replace(/<|>|\"/g, "") +
                  '" aria-label="' +
                  dc.prevTxt.replace(/<|>|\"/g, "") +
                  " " +
                  dc.monthTxt.replace(/<|>|\"/g, "") +
                  '"' +
                  (!hasPrevMonth
                    ? ' aria-disabled="true" tabindex="-1"'
                    : ' tabindex="0"') +
                  ' role="button" id="' +
                  dc.prevBtnId +
                  '"><span aria-hidden="true">' +
                  dc.leftButtonMonthText +
                  "</span></td>" +
                  '<td colspan="5" class="month" role="presentation">' +
                  // Add month select field if enabled.
                  (monthSelect
                    ? "<select " +
                      (forceSelect ? "" : "hidden ") +
                      'class="nav current select month" id="' +
                      dc.currentBtnId +
                      'M" title="' +
                      dc.monthTxt.replace(/<|>|\"/g, "") +
                      '" aria-label="' +
                      dc.monthTxt.replace(/<|>|\"/g, "") +
                      '">' +
                      (function () {
                        var s = "";
                        for (var i = 0; i <= 11; i++) {
                          if (!dc.isDisabledMonth(dc, i, dc.range.current.year))
                            s +=
                              "<option value=" +
                              i +
                              (i === dc.range.current.month
                                ? ' selected="selected"'
                                : "") +
                              ">" +
                              dc.range[i].name +
                              (!config.condenseYear
                                ? ""
                                : " " + dc.range.current.year) +
                              "</option>";
                        }
                        return s;
                      })() +
                      "</select>" +
                      "<span " +
                      (forceSelect ? "hidden " : "") +
                      'class="nav current btn month" tabindex="0" role="button" id="' +
                      dc.currentBtnId +
                      'MB">' +
                      dc.range[dc.range.current.month].name +
                      (!config.condenseYear
                        ? ""
                        : " " + dc.range.current.year) +
                      "</span>"
                    : "<span>" +
                      dc.range[dc.range.current.month].name +
                      (!config.condenseYear
                        ? ""
                        : " " + dc.range.current.year) +
                      "</span>") +
                  "</td>" +
                  '<td class="nav next btn month' +
                  (!hasNextMonth ? " disabled" : "") +
                  '" accesskey="4" title="' +
                  dc.nextTxt.replace(/<|>|\"/g, "") +
                  " " +
                  dc.monthTxt.replace(/<|>|\"/g, "") +
                  '" aria-label="' +
                  dc.nextTxt.replace(/<|>|\"/g, "") +
                  " " +
                  dc.monthTxt.replace(/<|>|\"/g, "") +
                  '"' +
                  (!hasNextMonth
                    ? ' aria-disabled="true" tabindex="-1"'
                    : ' tabindex="0"') +
                  ' role="button" id="' +
                  dc.nextBtnId +
                  '"><span aria-hidden="true">' +
                  dc.rightButtonMonthText +
                  "</span></td></tr>";

                dc.content = "";

                // Start constructing the Datepicker table element
                // Reconfigured for Esc btn processing
                dc.content +=
                  '<table role="presentation" class="calendar">' +
                  yearSelector +
                  monthSelector +
                  '<tr role="presentation" aria-hidden="true"' +
                  (monthOnly ? ' hidden="hidden">' : ">");

                dc.iter = 0;

                // Draw day headers
                for (var i = 0; i < 7; i++) {
                  var di = dc.getWDay(dc, i),
                    d = dc.range.wDays[di];

                  if (!i) {
                    dc.iter = dc.iterE = di + 6 > 6 ? -1 + di : di + 6;
                    dc.iterS = di;
                  }
                  dc.content +=
                    '<th scope="col" class="week" title="' +
                    d.lng +
                    '" role="presentation"><span>' +
                    d.shrt +
                    "</span></th>";
                }
                dc.content +=
                  '</tr><tr role="presentation"' +
                  (monthOnly ? ' hidden="hidden">' : ">");

                // Start drawing day cells
                var m = new Date();
                m.setDate(1);
                m.setMonth(dc.range.current.month);
                m.setFullYear(dc.range.current.year);

                var f = m.getDay();
                m.setDate(dc.range[dc.range.current.month].max);
                var e = m.getDay(),
                  w = dc.iterS;

                // Draw the full calendar? (a full grid containing previous / next month cells)
                if (dc.drawFullCalendar === true) {
                  var daysInMonth = new Date(
                      prevDateValues.year,
                      prevDateValues.month + 1,
                      0,
                    ).getDate(),
                    counter =
                      daysInMonth -
                      new Date(
                        dc.range.current.year,
                        dc.range.current.month,
                        0,
                      ).getDay() +
                      dc.range.wdOffset;
                }

                while (w !== f) {
                  w = w + 1 > 6 ? 0 : w + 1;

                  if (dc.drawFullCalendar === true) {
                    prevMonth.setDate(counter);
                    dc.content += dc.createDayCell(
                      counter,
                      prevMonth,
                      "dayInPrevMonth",
                      dc.isDisabledDate(dc, counter, prevMonth),
                    );
                    ++counter;
                  } else {
                    dc.content +=
                      '<td class="empty" role="presentation"><span>&nbsp;</span></td>';
                  }
                }

                dc.range.track = {};

                for (var i = 1; i <= 31; i++) {
                  dc.range.track[dc.baseId + i] = i;
                }

                for (
                  var i = 1;
                  i <= dc.range[dc.range.current.month].max;
                  i++
                ) {
                  m.setDate(i);

                  var isSelected =
                    i === dc.fn.current.mDay &&
                    dc.range.current.month === dc.fn.current.month &&
                    dc.range.current.year === dc.fn.current.year;

                  // Draw calendar day cell
                  dc.content += dc.createDayCell(
                    i,
                    m,
                    "dayInMonth",
                    dc.isDisabledDate(dc, i, m),
                    isSelected,
                  );

                  var w = m.getDay();

                  if (w === dc.iter && i < dc.range[dc.range.current.month].max)
                    dc.content +=
                      '</tr><tr role="presentation"' +
                      (monthOnly ? ' hidden="hidden">' : ">");
                }

                if (dc.drawFullCalendar === true) {
                  var counter = 1;
                }

                while (e !== dc.iter) {
                  e = e + 1 > 6 ? 0 : e + 1;

                  if (dc.drawFullCalendar === true) {
                    nextMonth.setDate(counter);
                    dc.content += dc.createDayCell(
                      counter,
                      nextMonth,
                      "dayInNextMonth",
                      dc.isDisabledDate(dc, counter, nextMonth),
                    );
                    ++counter;
                  } else {
                    dc.content +=
                      '<td class="empty" role="presentation"><span>&nbsp;</span></td>';
                  }
                }
                dc.content += "</tr></table>";

                if (!$A.isNode(dc.messageContainer)) {
                  dc.messageContainerId = $A.genId();
                  dc.messageContainer = $A.create(
                    "div",
                    {
                      id: dc.messageContainerId,
                    },
                    {},
                    "monthMessage",
                  );
                }

                // if a message is set for the month, draw it
                if (
                  dc.range[dc.range.current.month].message[
                    dc.range.current.year
                  ]
                ) {
                  dc.messageContainer.innerHTML =
                    "<p>" +
                    dc.range[dc.range.current.month].message[
                      dc.range.current.year
                    ] +
                    "</p>";
                  $A.setAttr(
                    dc.container,
                    "aria-labelledby",
                    dc.messageContainerId,
                  );
                } else {
                  if (!triggeredByTouch)
                    dc.messageContainer.innerHTML =
                      "<p>" + dc.helpTextShort + "</p>";
                  $A.remAttr(dc.container, "aria-labelledby");
                }

                // Reconfigured for Esc btn processing
                if (dc.showEscBtn) {
                  dc.content +=
                    '<button id="' +
                    dc.baseId +
                    'esc" aria-label="' +
                    dc.escBtnName +
                    '" title="' +
                    dc.escBtnName +
                    '" class="esc-button">' +
                    dc.escBtnIcon +
                    "</button>";
                }
              },
              mouseEnter: function (ev, dc) {
                dc.mouseWithin = true;
              },
              mouseLeave: function (ev, dc) {
                dc.mouseWithin = false;
              },
              click: function (ev, dc) {
                ev.stopPropagation();
              },
              keyDown: function (ev, dc) {
                var k = $A.keyEvent(ev);

                if (k === 112) {
                  $A.remAttr(dc.container, "aria-labelledby");
                  dc.container.appendChild(dc.messageContainer);
                  $A.setAttr(dc.messageContainer, {
                    role: "alert",
                  });
                  if (!triggeredByTouch)
                    dc.messageContainer.innerHTML =
                      "<p>" + dc.helpText + "</p>";
                  ev.preventDefault();
                  ev.stopPropagation();
                }
              },
              updateDisabled: function () {
                var dc = this;
                dc.query('td[aria-disabled="true"]', function (i, o) {
                  $A.data(o, "disabled", true);
                });
              },
              updateCommented: function () {
                var dc = this;
                dc.query("td.comment", function (i, o) {
                  $A.data(o, "_HasComment", true);
                });
              },
              duringRender: function (dc) {
                if (dc.rerendering) {
                  dc.container.innerHTML = dc.content;
                } else {
                  dc.datepickerLoaded = false;

                  dc.setAttr({
                    title: !triggeredByTouch ? dc.helpTextShort : "",
                  });
                }

                if (dc.messageContainer.innerHTML) {
                  dc.container.appendChild(dc.messageContainer);
                }
              },
              afterRender: function (dc) {
                dc.buttons = {
                  esc: !dc.showEscBtn
                    ? null
                    : dc.container.querySelector("button.esc-button"),
                  pY: config.condenseYear ? null : $A.get(dc.prevBtnId + "Y"),
                  nY: config.condenseYear ? null : $A.get(dc.nextBtnId + "Y"),
                  pM: $A.get(dc.prevBtnId),
                  nM: $A.get(dc.nextBtnId),
                };

                if (!config.condenseYear && dc.disableNavPrevYearBtn)
                  $A.setAttr(dc.buttons.pY, "aria-disabled", "true");

                if (!config.condenseYear && dc.disableNavNextYearBtn)
                  $A.setAttr(dc.buttons.nY, "aria-disabled", "true");

                if (dc.disableNavPrevMonthBtn)
                  $A.setAttr(dc.buttons.pM, "aria-disabled", "true");

                if (dc.disableNavNextMonthBtn)
                  $A.setAttr(dc.buttons.nM, "aria-disabled", "true");

                if (!dc.prevCurrent) dc.prevCurrent = {};
                $A.extend(true, dc.prevCurrent, dc.range.current);

                dc.updateDisabled();
                dc.updateCommented();

                var nMonth = function () {
                    if (
                      dc.disableNavNextMonthBtn &&
                      $A.data(dc.buttons.nM, "disabled")
                    )
                      return;

                    $A.extend(true, dc.prevCurrent, dc.range.current);

                    var dateValues = dc.modifyDateValues(
                      {
                        month: dc.range.current.month,
                        year: dc.range.current.year,
                      },
                      {
                        month: 1,
                      },
                    );

                    // Only change to next month if its first day is inside the valid date range
                    if (
                      !dc.isOutsideDateRange(
                        new Date(dateValues.year, dateValues.month, 1),
                      )
                    ) {
                      var day =
                          dc.range.current.mDay > dc.range[dateValues.month].max
                            ? dc.range[dateValues.month].max
                            : dc.range.current.mDay,
                        intendedDate = new Date(
                          dateValues.year,
                          dateValues.month,
                          day,
                        );

                      // If intended selected date one month ahead is outside of date range, set
                      // selected date to the next available date
                      if (dc.isOutsideDateRange(intendedDate))
                        dc.date = dc.maxDate;
                      else dc.date = intendedDate;
                    } else {
                      dc.date = dc.maxDate;
                    }

                    dc.setCurrent(dc);
                    dc.rerenderTable(dc);
                  },
                  pMonth = function () {
                    if (
                      dc.disableNavPrevMonthBtn &&
                      $A.data(dc.buttons.pM, "disabled")
                    )
                      return;

                    $A.extend(true, dc.prevCurrent, dc.range.current);

                    var dateValues = dc.modifyDateValues(
                      {
                        month: dc.range.current.month,
                        year: dc.range.current.year,
                      },
                      {
                        month: -1,
                      },
                    );

                    // Only change to previous month if its last day is inside the valid date range
                    if (
                      !dc.isOutsideDateRange(
                        new Date(
                          dateValues.year,
                          dateValues.month,
                          dc.range[dateValues.month].max,
                        ),
                      )
                    ) {
                      var day =
                          dc.range.current.mDay > dc.range[dateValues.month].max
                            ? dc.range[dateValues.month].max
                            : dc.range.current.mDay,
                        intendedDate = new Date(
                          dateValues.year,
                          dateValues.month,
                          day,
                        );

                      // If intended selected date one month previously is outside of date range, set
                      // selected date to the next available date
                      if (dc.isOutsideDateRange(intendedDate))
                        dc.date = dc.minDate;
                      else dc.date = intendedDate;
                    } else {
                      dc.date = dc.minDate;
                    }

                    dc.setCurrent(dc);
                    dc.rerenderTable(dc);
                  },
                  gYear = function (forward) {
                    if (
                      !forward &&
                      ((!config.condenseYear &&
                        $A.data(dc.buttons.pY, "disabled")) ||
                        (config.condenseYear && dc.disableNavPrevYearBtn))
                    ) {
                      return;
                    } else if (
                      forward &&
                      ((!config.condenseYear &&
                        $A.data(dc.buttons.nY, "disabled")) ||
                        (config.condenseYear && dc.disableNavNextYearBtn))
                    ) {
                      return;
                    }

                    $A.extend(true, dc.prevCurrent, dc.range.current);

                    var month = dc.range.current.month,
                      year = forward
                        ? dc.range.current.year + 1
                        : dc.range.current.year - 1;

                    if (month === 1) dc.range[1].max = 28;
                    var day =
                      dc.range.current.mDay > dc.range[month].max
                        ? dc.range[month].max
                        : dc.range.current.mDay;

                    // Only change year if the intended date is inside of any set date range
                    var intendedDate = new Date(year, month, day);

                    if (dc.isOutsideDateRange(intendedDate)) {
                      return;
                    }

                    dc.date = intendedDate;
                    dc.setCurrent(dc);
                    dc.rerenderTable(dc);
                  };
                var isKP = false;

                if (!monthOnly)
                  $A.on(
                    "#" + dc.containerId + " td.day",
                    {
                      focus: function (ev) {
                        if ($A.data(this, "_HasComment")) {
                          var year =
                              dc.range[dc.range.current.month].comments[
                                dc.range.current.year
                              ],
                            all =
                              dc.range[dc.range.current.month].comments["*"],
                            comm = "";

                          if (year && year[dc.range.current.mDay])
                            comm = year[dc.range.current.mDay];
                          else if (all && all[dc.range.current.mDay])
                            comm = all[dc.range.current.mDay];
                          comm = $A.trim(comm.replace(/<|>/g, ""));

                          if (comm) {
                            commentDC.content = comm;
                            commentDC.rerender(function () {
                              if (formDC.openEditor) {
                                formDC.openEditor = false;

                                if (formDC.loaded) formDC.reset();
                              }
                            });
                          }
                        } else if (commentDC.loaded) {
                          commentDC.remove();
                        }
                      },
                      click: function (ev) {
                        // If items from a previous / next month are selected, modify the date accordingly
                        if ($A.hasClass(this, "dayInPrevMonth")) {
                          var prevDateValues = dc.modifyDateValues(
                            {
                              month: dc.range.current.month,
                              year: dc.range.current.year,
                            },
                            {
                              month: -1,
                            },
                          );

                          dc.date = new Date(
                            prevDateValues.year,
                            prevDateValues.month,
                            dc.range.track[this.id],
                          );
                        } else if ($A.hasClass(this, "dayInNextMonth")) {
                          var nextDateValues = dc.modifyDateValues(
                            {
                              month: dc.range.current.month,
                              year: dc.range.current.year,
                            },
                            {
                              month: 1,
                            },
                          );

                          dc.date = new Date(
                            nextDateValues.year,
                            nextDateValues.month,
                            dc.range.track[this.id],
                          );
                        } else {
                          // Selection in current month, just adjust the date
                          dc.date.setDate(dc.range.track[this.id]);
                        }

                        dc.setCurrent(dc);

                        if (
                          $A.data(this, "_Selected") ||
                          (!commentsEnabled && !$A.data(this, "_HasComment"))
                        ) {
                          if (!$A.data(this, "disabled")) {
                            $A.extend(true, dc.fn.current, dc.range.current);
                            // Toggles for openOnFocus support.
                            onFocusInit = false;
                            onFocusTraverse = true;
                            dc.storeCurrentDate(dc);
                            handleClick.apply(this, [ev, dc, targ]);
                          } else {
                            ev.stopPropagation();
                            ev.preventDefault();
                          }
                        } else dc.setFocus(this);
                        ev.preventDefault();
                      },
                      keydown: function (ev) {
                        changePressed(ev);
                        var k = $A.keyEvent(ev);
                        if (k === 13) {
                          isKP = true;

                          if (!$A.data(this, "disabled")) {
                            $A.extend(true, dc.fn.current, dc.range.current);
                            // Toggles for openOnFocus support.
                            onFocusInit = false;
                            onFocusTraverse = true;
                            dc.storeCurrentDate(dc);
                            handleClick.apply(this, [ev, dc, targ]);
                          }

                          ev.preventDefault();
                        } else if (
                          k === 32 &&
                          commentsEnabled &&
                          config.editor &&
                          config.editor.show &&
                          !formDC.openEditor
                        ) {
                          formDC.openEditor = true;
                          formDC.reset();
                          ev.preventDefault();
                        } else if (
                          (k >= 37 && k <= 40) ||
                          k === 27 ||
                          (k >= 33 && k <= 36)
                        ) {
                          var wd = dc.range.current.wDay;

                          if (k === 37) {
                            // Left arrow key
                            $A.extend(true, dc.prevCurrent, dc.range.current);

                            if (dc.range.current.mDay > 1) {
                              dc.range.current.mDay--;
                              dc.range.current.wDay = !wd ? 6 : wd - 1;

                              dc.setFocus(
                                dc.range.index[dc.range.current.mDay - 1],
                                this,
                              );
                            } else if (
                              dc.range.current.mDay === 1 &&
                              !$A.data(dc.buttons.pM, "disabled")
                            ) {
                              var dateValues = dc.modifyDateValues(
                                {
                                  month: dc.range.current.month,
                                  year: dc.range.current.year,
                                },
                                {
                                  month: -1,
                                },
                              );

                              var day = dc.range[dateValues.month].max;

                              if (dateValues.month === 1)
                                day =
                                  new Date(
                                    dateValues.year,
                                    1,
                                    29,
                                  ).getMonth() === 1
                                    ? 29
                                    : 28;

                              dc.date = new Date(
                                dateValues.year,
                                dateValues.month,
                                day,
                              );
                              dc.setCurrent(dc);
                              dc.rerenderTable(dc);
                            }
                          } else if (k === 39) {
                            // Right arrow key
                            $A.extend(true, dc.prevCurrent, dc.range.current);

                            if (
                              dc.range.current.mDay <
                              dc.range[dc.range.current.month].max
                            ) {
                              dc.range.current.mDay++;
                              dc.range.current.wDay = wd === 6 ? 0 : wd + 1;

                              dc.setFocus(
                                dc.range.index[dc.range.current.mDay - 1],
                                this,
                              );
                            } else if (
                              dc.range.current.mDay ==
                                dc.range[dc.range.current.month].max &&
                              !$A.data(dc.buttons.nM, "disabled")
                            ) {
                              var dateValues = dc.modifyDateValues(
                                {
                                  month: dc.range.current.month,
                                  year: dc.range.current.year,
                                },
                                {
                                  month: 1,
                                },
                              );

                              dc.date = new Date(
                                dateValues.year,
                                dateValues.month,
                                1,
                              );
                              dc.setCurrent(dc);
                              dc.rerenderTable(dc);
                            }
                          } else if (k === 38) {
                            // Up arrow key
                            $A.extend(true, dc.prevCurrent, dc.range.current);

                            if (dc.range.current.mDay - 7 > 0) {
                              dc.range.current.mDay -= 7;

                              dc.setFocus(
                                dc.range.index[dc.range.current.mDay - 1],
                                this,
                              );
                            } else if (!$A.data(dc.buttons.pM, "disabled")) {
                              // Go to previous month
                              var dateValues = dc.modifyDateValues(
                                {
                                  month: dc.range.current.month,
                                  year: dc.range.current.year,
                                },
                                {
                                  month: -1,
                                },
                              );

                              if (
                                dateValues.month === 1 &&
                                new Date(dateValues.year, 1, 29).getMonth() ===
                                  1
                              )
                                dc.range[dateValues.month].max = 29;
                              else if (dateValues.month === 1)
                                dc.range[dateValues.month].max = 28;

                              var day =
                                  dc.range[dateValues.month].max +
                                  (dc.range.current.mDay - 7),
                                intendedDate = new Date(
                                  dateValues.year,
                                  dateValues.month,
                                  day,
                                );

                              // If intended selected date one month previous is outside of date range, do not attempt
                              // to select the date cell
                              if (!dc.isOutsideDateRange(intendedDate)) {
                                dc.date = intendedDate;
                                dc.setCurrent(dc);
                                dc.rerenderTable(dc);
                              }
                            }
                          } else if (k === 40) {
                            // Down arrow key
                            $A.extend(true, dc.prevCurrent, dc.range.current);

                            if (
                              dc.range.current.mDay + 7 <=
                              dc.range[dc.range.current.month].max
                            ) {
                              dc.range.current.mDay += 7;

                              dc.setFocus(
                                dc.range.index[dc.range.current.mDay - 1],
                                this,
                              );
                            } else if (!$A.data(dc.buttons.nM, "disabled")) {
                              // Go to next month
                              var dateValues = dc.modifyDateValues(
                                {
                                  month: dc.range.current.month,
                                  year: dc.range.current.year,
                                },
                                {
                                  month: 1,
                                },
                              );

                              var day =
                                  dc.range.current.mDay +
                                  7 -
                                  dc.range[dc.range.current.month].max,
                                intendedDate = new Date(
                                  dateValues.year,
                                  dateValues.month,
                                  day,
                                );

                              // If intended selected date one month ahead is outside of date range, do not attempt
                              // to select the date cell
                              if (!dc.isOutsideDateRange(intendedDate)) {
                                dc.date = intendedDate;
                                dc.setCurrent(dc);
                                dc.rerenderTable(dc);
                              }
                            }
                          } else if (k === 27) {
                            // Esc key
                            dc.remove();
                            // Toggles for openOnFocus support.
                            onFocusInit = false;
                            onFocusTraverse = true;
                            $A.focus(config.returnFocusTo || targ);
                          } else if (k === 33) {
                            // PageUp key
                            $A.extend(true, dc.prevCurrent, dc.range.current);

                            if (dc.pageUpDownNatural) {
                              if (pressed.alt) {
                                gYear(false);
                              } else {
                                pMonth();
                              }
                            } else {
                              if (pressed.alt) {
                                gYear(true);
                              } else {
                                nMonth();
                              }
                            }
                          } else if (k === 34) {
                            // PageDown key
                            $A.extend(true, dc.prevCurrent, dc.range.current);

                            if (dc.pageUpDownNatural) {
                              if (pressed.alt) {
                                gYear(true);
                              } else {
                                nMonth();
                              }
                            } else {
                              if (pressed.alt) {
                                gYear(false);
                              } else {
                                pMonth();
                              }
                            }
                          } else if (k === 36) {
                            // Home key (goes to the first day of the row)
                            $A.extend(true, dc.prevCurrent, dc.range.current);

                            if (wd !== dc.iterS && dc.range.current.mDay > 1) {
                              while (
                                dc.range.current.wDay !== dc.iterS &&
                                $A.get(dc.baseId + (dc.range.current.mDay - 1))
                              ) {
                                dc.range.current.wDay =
                                  dc.range.current.wDay - 1 < 0
                                    ? 6
                                    : dc.range.current.wDay - 1;
                                dc.range.current.mDay--;
                              }
                              dc.setFocus(
                                dc.range.index[dc.range.current.mDay - 1],
                                this,
                              );
                            }
                          } else if (k === 35) {
                            // End key (goes to the last day of the row)
                            $A.extend(true, dc.prevCurrent, dc.range.current);

                            if (
                              wd !== dc.iterE &&
                              dc.range.current.mDay <
                                dc.range[dc.range.current.month].max
                            ) {
                              while (
                                dc.range.current.wDay !== dc.iterE &&
                                $A.get(dc.baseId + (dc.range.current.mDay + 1))
                              ) {
                                dc.range.current.wDay =
                                  dc.range.current.wDay + 1 > 6
                                    ? 0
                                    : dc.range.current.wDay + 1;
                                dc.range.current.mDay++;
                              }
                              dc.setFocus(
                                dc.range.index[dc.range.current.mDay - 1],
                                this,
                              );
                            }
                          }
                          ev.preventDefault();
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          // Tab key (without any simultaneous modifiers Alt / Ctrl / Shift)
                          $A.extend(true, dc.prevCurrent, dc.range.current);

                          if (commentsEnabled && formDC.loaded) {
                            if (!$A.isHidden(formDC.textarea)) {
                              formDC.textarea.focus();
                            } else {
                              formDC.commentBtn.focus();
                            }
                          } else {
                            dc.navUpdate();
                            var navX = dc.nav[0];
                            if ($A.isNode(navX)) navX.focus();
                          }
                          ev.preventDefault();
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          pressed.shift
                        ) {
                          // Tab key (with simultaneous Shift modifier)
                          $A.extend(true, dc.prevCurrent, dc.range.current);

                          dc.navUpdate();
                          var navX = dc.nav[dc.nav.length - 1];
                          if ($A.isNode(navX)) {
                            navX.focus();
                          } else if (commentsEnabled && formDC.loaded) {
                            formDC.commentBtn.focus();
                          }
                          ev.preventDefault();
                        }
                      },
                      keyup: function (ev) {
                        changePressed(ev);
                        var k = $A.keyEvent(ev);

                        if (k === 13 && !isKP && !dc.isAdd) {
                          if (!$A.data(this, "disabled")) {
                            $A.extend(true, dc.fn.current, dc.range.current);

                            if (!dc.setFocus.firstOpen) {
                              // Toggles for openOnFocus support.
                              onFocusInit = false;
                              onFocusTraverse = true;
                              dc.storeCurrentDate(dc);
                              handleClick.apply(this, [ev, dc, targ]);
                            }
                          }

                          ev.preventDefault();
                        }

                        isKP = dc.setFocus.firstOpen = dc.isAdd = false;
                      },
                    },
                    "." + baseId,
                  );

                // Reconfigured for Esc btn processing
                if (dc.showEscBtn) {
                  $A.on(
                    dc.buttons.esc,
                    {
                      click: function (ev) {
                        dc.remove();
                        onFocusInit = false;
                        onFocusTraverse = true;
                        $A.focus(config.returnFocusTo || targ);
                        ev.preventDefault();
                      },
                      keydown: function (ev) {
                        changePressed(ev);
                        var k = $A.keyEvent(ev);

                        if (k === 27 || k === 13 || k === 32) {
                          dc.remove();
                          onFocusInit = false;
                          onFocusTraverse = true;
                          $A.focus(config.returnFocusTo || targ);
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          // Tab key (without any simultaneous modifiers Alt / Ctrl / Shift)

                          var navX = dc.navTo(this, 1);
                          if ($A.isNode(navX)) navX.focus();
                          else mainDC.current.focus();

                          ev.preventDefault();
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          pressed.shift
                        ) {
                          var navX = dc.navTo(this, 0);
                          if ($A.isNode(navX)) {
                            navX.focus();
                          } else if (commentsEnabled && formDC.loaded) {
                            formDC.commentBtn.focus();
                          } else {
                            mainDC.current.focus();
                          }
                          ev.preventDefault();
                        }
                      },
                      keyup: function (ev) {
                        changePressed(ev);
                      },
                    },
                    "." + baseId,
                  );
                }

                if (yearSelect && !config.condenseYear) {
                  (function () {
                    var ySel = $A.get("#" + dc.currentBtnId + "Y"),
                      os = ySel.querySelectorAll("option"),
                      ySelHandle = function (ev) {
                        var year = (function () {
                          for (var i = 0; i < os.length; i++) {
                            if (os[i].selected)
                              return parseInt($A.getAttr(os[i], "value"));
                          }
                          return dc.range.current.year;
                        })();

                        if (!forceSelect) {
                          dc.buttons.cYS.hidden = true;
                          dc.buttons.cY.hidden = false;
                        }
                        if (year !== dc.range.current.year) {
                          dc.initialDate = new Date(
                            year,
                            dc.range.current.month,
                            dc.range.current.mDay,
                          );
                          dc.setDate(dc);
                          dc.rerenderTable(dc);
                        } else {
                          dc.buttons[forceSelect ? "cYS" : "cY"].focus();
                        }
                      };
                    dc.buttons.cYS = ySel;
                    dc.buttons.cY = $A.get("#" + dc.currentBtnId + "YB");
                    $A.on(
                      ySel,
                      {
                        keydown: function (ev) {
                          changePressed(ev);
                          var k = $A.keyEvent(ev);
                          if (k === 13) {
                            if (monthOnly) {
                              onFocusInit = false;
                              onFocusTraverse = true;
                              dc.storeCurrentDate(dc);
                              handleClick.apply(this, [ev, dc, targ]);
                            }
                          } else if (k === 27) {
                            if (!forceSelect) {
                              dc.buttons.cYS.hidden = true;
                              dc.buttons.cY.hidden = false;
                              dc.buttons.cY.focus();
                            } else {
                              dc.remove();
                              onFocusInit = false;
                              onFocusTraverse = true;
                              $A.focus(config.returnFocusTo || targ);
                            }
                            ev.stopPropagation();
                            ev.preventDefault();
                          } else if (
                            k === 9 &&
                            !pressed.alt &&
                            !pressed.ctrl &&
                            !pressed.shift
                          ) {
                            if (forceSelect) {
                              var navX = dc.navTo(this, 1);
                              if ($A.isNode(navX)) navX.focus();
                              else mainDC.current.focus();
                              ev.preventDefault();
                            }
                          } else if (
                            k === 9 &&
                            !pressed.alt &&
                            !pressed.ctrl &&
                            pressed.shift
                          ) {
                            if (forceSelect) {
                              var navX = dc.navTo(this, 0);
                              if ($A.isNode(navX)) {
                                navX.focus();
                              } else if (commentsEnabled && formDC.loaded) {
                                formDC.commentBtn.focus();
                              } else {
                                mainDC.current.focus();
                              }
                              ev.preventDefault();
                            }
                          }
                        },
                        keyup: function (ev) {
                          changePressed(ev);
                        },
                        change: function (ev) {
                          dc.navBtn = "CY";
                          ySelHandle(ev);
                        },
                      },
                      "." + baseId,
                    );
                  })();
                  $A.on(
                    dc.buttons.cY,
                    {
                      click: function (ev) {
                        if (!forceSelect) {
                          dc.buttons.cY.hidden = true;
                          dc.buttons.cYS.hidden = false;
                          dc.buttons.cYS.focus();
                        }
                        ev.preventDefault();
                      },
                      keydown: function (ev) {
                        changePressed(ev);
                        var k = $A.keyEvent(ev);
                        if (k === 13 || k === 32) {
                          if (!forceSelect) {
                            dc.buttons.cY.hidden = true;
                            dc.buttons.cYS.hidden = false;
                            dc.buttons.cYS.focus();
                          }
                          ev.preventDefault();
                        } else if (k === 27) {
                          dc.remove();
                          onFocusInit = false;
                          onFocusTraverse = true;
                          $A.focus(config.returnFocusTo || targ);
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          var navX = dc.navTo(this, 1);
                          if ($A.isNode(navX)) navX.focus();
                          else mainDC.current.focus();
                          ev.preventDefault();
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          pressed.shift
                        ) {
                          var navX = dc.navTo(this, 0);
                          if ($A.isNode(navX)) {
                            navX.focus();
                          } else if (commentsEnabled && formDC.loaded) {
                            formDC.commentBtn.focus();
                          } else {
                            mainDC.current.focus();
                          }
                          ev.preventDefault();
                        }
                      },
                      keyup: function (ev) {
                        changePressed(ev);
                      },
                    },
                    "." + baseId,
                  );
                }

                if (monthSelect) {
                  (function () {
                    var mSel = $A.get("#" + dc.currentBtnId + "M"),
                      os = mSel.querySelectorAll("option"),
                      mSelHandle = function (ev) {
                        var month = (function () {
                          for (var i = 0; i < os.length; i++) {
                            if (os[i].selected)
                              return parseInt($A.getAttr(os[i], "value"));
                          }
                          return dc.range.current.month;
                        })();

                        if (!forceSelect) {
                          dc.buttons.cMS.hidden = true;
                          dc.buttons.cM.hidden = false;
                        }
                        if (month !== dc.range.current.month) {
                          dc.initialDate = new Date(
                            dc.range.current.year,
                            month,
                            dc.range.current.mDay,
                          );
                          dc.setDate(dc);
                          dc.rerenderTable(dc);
                        } else {
                          dc.buttons[forceSelect ? "cMS" : "cM"].focus();
                        }
                      };
                    dc.buttons.cMS = mSel;
                    dc.buttons.cM = $A.get("#" + dc.currentBtnId + "MB");

                    $A.on(
                      mSel,
                      {
                        click: function (ev) {
                          if (monthOnly) {
                            onFocusInit = false;
                            onFocusTraverse = true;
                            dc.storeCurrentDate(dc);
                            handleClick.apply(this, [ev, dc, targ]);
                          }
                        },
                        keydown: function (ev) {
                          changePressed(ev);
                          var k = $A.keyEvent(ev);
                          if (k === 13) {
                            if (monthOnly) {
                              onFocusInit = false;
                              onFocusTraverse = true;
                              dc.storeCurrentDate(dc);
                              handleClick.apply(this, [ev, dc, targ]);
                            }
                          } else if (k === 27) {
                            if (!forceSelect) {
                              dc.buttons.cMS.hidden = true;
                              dc.buttons.cM.hidden = false;
                              dc.buttons.cM.focus();
                            } else {
                              dc.remove();
                              onFocusInit = false;
                              onFocusTraverse = true;
                              $A.focus(config.returnFocusTo || targ);
                            }
                            ev.stopPropagation();
                            ev.preventDefault();
                          } else if (
                            k === 9 &&
                            !pressed.alt &&
                            !pressed.ctrl &&
                            !pressed.shift
                          ) {
                            if (forceSelect) {
                              var navX = dc.navTo(this, 1);
                              if ($A.isNode(navX)) navX.focus();
                              else mainDC.current.focus();
                              ev.preventDefault();
                            }
                          } else if (
                            k === 9 &&
                            !pressed.alt &&
                            !pressed.ctrl &&
                            pressed.shift
                          ) {
                            if (forceSelect) {
                              var navX = dc.navTo(this, 0);
                              if ($A.isNode(navX)) {
                                navX.focus();
                              } else if (commentsEnabled && formDC.loaded) {
                                formDC.commentBtn.focus();
                              } else {
                                mainDC.current.focus();
                              }
                              ev.preventDefault();
                            }
                          }
                        },
                        keyup: function (ev) {
                          changePressed(ev);
                        },
                        change: function (ev) {
                          dc.navBtn = "cM";
                          mSelHandle(ev);
                          if (monthOnly) {
                            onFocusInit = false;
                            onFocusTraverse = true;
                            dc.storeCurrentDate(dc);
                            handleClick.apply(this, [ev, dc, targ]);
                          }
                        },
                      },
                      "." + baseId,
                    );
                  })();

                  $A.on(
                    dc.buttons.cM,
                    {
                      click: function (ev) {
                        if (!forceSelect) {
                          dc.buttons.cM.hidden = true;
                          dc.buttons.cMS.hidden = false;
                          dc.buttons.cMS.focus();
                        }
                        ev.preventDefault();
                      },
                      keydown: function (ev) {
                        changePressed(ev);
                        var k = $A.keyEvent(ev);
                        if (k === 13 || k === 32) {
                          if (!forceSelect) {
                            dc.buttons.cM.hidden = true;
                            dc.buttons.cMS.hidden = false;
                            dc.buttons.cMS.focus();
                          }
                          ev.preventDefault();
                        } else if (k === 27) {
                          dc.remove();
                          onFocusInit = false;
                          onFocusTraverse = true;
                          $A.focus(config.returnFocusTo || targ);
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          var navX = dc.navTo(this, 1);
                          if ($A.isNode(navX)) navX.focus();
                          else mainDC.current.focus();
                          ev.preventDefault();
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          pressed.shift
                        ) {
                          var navX = dc.navTo(this, 0);
                          if ($A.isNode(navX)) {
                            navX.focus();
                          } else if (commentsEnabled && formDC.loaded) {
                            formDC.commentBtn.focus();
                          } else {
                            mainDC.current.focus();
                          }
                          ev.preventDefault();
                        }
                      },
                      keyup: function (ev) {
                        changePressed(ev);
                      },
                    },
                    "." + baseId,
                  );
                }

                $A.on(
                  dc.buttons.pM,
                  {
                    click: function (ev) {
                      dc.navBtn = "PM";
                      pMonth();
                      ev.preventDefault();
                    },
                    keydown: function (ev) {
                      changePressed(ev);
                      var k = $A.keyEvent(ev);

                      if (k === 13 || k === 32) {
                        dc.navBtn = "PM";
                        pMonth();
                        ev.preventDefault();
                      } else if (k === 27) {
                        dc.remove();
                        // Toggles for openOnFocus support.
                        onFocusInit = false;
                        onFocusTraverse = true;
                        $A.focus(config.returnFocusTo || targ);
                        ev.preventDefault();
                      } else if (!config.condenseYear && k === 38) {
                        dc.buttons.pY.focus();
                        ev.preventDefault();
                      } else if (k === 39) {
                        dc.buttons.nM.focus();
                        ev.preventDefault();
                      } else if (k === 37 || k === 40) {
                        ev.preventDefault();
                      } else if (
                        k === 9 &&
                        !pressed.alt &&
                        !pressed.ctrl &&
                        !pressed.shift
                      ) {
                        var navX = dc.navTo(this, 1);
                        if ($A.isNode(navX)) navX.focus();
                        else mainDC.current.focus();
                        ev.preventDefault();
                      } else if (
                        k === 9 &&
                        !pressed.alt &&
                        !pressed.ctrl &&
                        pressed.shift
                      ) {
                        var navX = dc.navTo(this, 0);
                        if ($A.isNode(navX)) {
                          navX.focus();
                        } else if (commentsEnabled && formDC.loaded) {
                          formDC.commentBtn.focus();
                        } else {
                          mainDC.current.focus();
                        }
                        ev.preventDefault();
                      }
                    },
                    keyup: function (ev) {
                      changePressed(ev);
                    },
                  },
                  "." + baseId,
                );

                $A.on(
                  dc.buttons.nM,
                  {
                    click: function (ev) {
                      dc.navBtn = "NM";
                      nMonth();
                      ev.preventDefault();
                    },
                    keydown: function (ev) {
                      changePressed(ev);
                      var k = $A.keyEvent(ev);

                      if (k === 13 || k === 32) {
                        dc.navBtn = "NM";
                        nMonth();
                        ev.preventDefault();
                      } else if (k === 27) {
                        dc.remove();
                        // Toggles for openOnFocus support.
                        onFocusInit = false;
                        onFocusTraverse = true;
                        $A.focus(config.returnFocusTo || targ);
                        ev.preventDefault();
                      } else if (!config.condenseYear && k === 38) {
                        dc.buttons.nY.focus();
                        ev.preventDefault();
                      } else if (k === 37) {
                        dc.buttons.pM.focus();
                        ev.preventDefault();
                      } else if (k === 39 || k === 40) {
                        ev.preventDefault();
                      } else if (
                        k === 9 &&
                        !pressed.alt &&
                        !pressed.ctrl &&
                        !pressed.shift
                      ) {
                        if (monthOnly) {
                          dc.navUpdate();
                          var navX = dc.nav[0];
                          if ($A.isNode(navX)) navX.focus();
                        } else mainDC.current.focus();
                        ev.preventDefault();
                      } else if (
                        k === 9 &&
                        !pressed.alt &&
                        !pressed.ctrl &&
                        pressed.shift
                      ) {
                        dc.navUpdate();
                        var navX = dc.navTo(this, 0);
                        if ($A.isNode(navX)) {
                          navX.focus();
                        } else if (commentsEnabled && formDC.loaded) {
                          formDC.commentBtn.focus();
                        } else {
                          mainDC.current.focus();
                        }
                        ev.preventDefault();
                      }
                    },
                    keyup: function (ev) {
                      changePressed(ev);
                    },
                  },
                  "." + baseId,
                );

                if (!config.condenseYear)
                  $A.on(
                    dc.buttons.pY,
                    {
                      click: function (ev) {
                        dc.navBtn = "PY";
                        gYear();
                        ev.preventDefault();
                      },
                      keydown: function (ev) {
                        changePressed(ev);
                        var k = $A.keyEvent(ev);

                        if (k === 13 || k === 32) {
                          dc.navBtn = "PY";
                          gYear();
                          ev.preventDefault();
                        } else if (k === 27) {
                          dc.remove();
                          // Toggles for openOnFocus support.
                          onFocusInit = false;
                          onFocusTraverse = true;
                          $A.focus(config.returnFocusTo || targ);
                          ev.preventDefault();
                        } else if (k === 39) {
                          dc.buttons.nY.focus();
                          ev.preventDefault();
                        } else if (k === 40) {
                          dc.buttons.pM.focus();
                          ev.preventDefault();
                        } else if (k === 37 || k === 38) {
                          ev.preventDefault();
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          var navX = dc.navTo(this, 1);
                          if ($A.isNode(navX)) navX.focus();
                          else mainDC.current.focus();
                          ev.preventDefault();
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          pressed.shift
                        ) {
                          var navX = dc.navTo(this, 0);
                          if ($A.isNode(navX)) {
                            navX.focus();
                          } else if (commentsEnabled && formDC.loaded) {
                            formDC.commentBtn.focus();
                          } else {
                            if (monthOnly) dc.buttons.nM.focus();
                            else mainDC.current.focus();
                          }
                          ev.preventDefault();
                        }
                      },
                      keyup: function (ev) {
                        changePressed(ev);
                      },
                    },
                    "." + baseId,
                  );

                if (!config.condenseYear)
                  $A.on(
                    dc.buttons.nY,
                    {
                      click: function (ev) {
                        dc.navBtn = "NY";
                        gYear(true);
                        ev.preventDefault();
                      },
                      keydown: function (ev) {
                        changePressed(ev);
                        var k = $A.keyEvent(ev);

                        if (k === 13 || k === 32) {
                          dc.navBtn = "NY";
                          gYear(true);
                          ev.preventDefault();
                        } else if (k === 27) {
                          dc.remove();
                          // Toggles for openOnFocus support.
                          onFocusInit = false;
                          onFocusTraverse = true;
                          $A.focus(config.returnFocusTo || targ);
                          ev.preventDefault();
                        } else if (k === 37) {
                          dc.buttons.pY.focus();
                          ev.preventDefault();
                        } else if (k === 40) {
                          dc.buttons.nM.focus();
                          ev.preventDefault();
                        } else if (k === 38 || k === 39) {
                          ev.preventDefault();
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          !pressed.shift
                        ) {
                          var navX = dc.navTo(this, 1);
                          if ($A.isNode(navX)) navX.focus();
                          else mainDC.current.focus();
                          ev.preventDefault();
                        } else if (
                          k === 9 &&
                          !pressed.alt &&
                          !pressed.ctrl &&
                          pressed.shift
                        ) {
                          var navX = dc.navTo(this, 0);
                          if ($A.isNode(navX)) {
                            navX.focus();
                          } else if (commentsEnabled && formDC.loaded) {
                            formDC.commentBtn.focus();
                          } else {
                            mainDC.current.focus();
                          }
                          ev.preventDefault();
                        }
                      },
                      keyup: function (ev) {
                        changePressed(ev);
                      },
                    },
                    "." + baseId,
                  );

                (function () {
                  var btns = [
                    "esc",
                    "pY",
                    "cY",
                    "cYS",
                    "nY",
                    "pM",
                    "cM",
                    "cMS",
                    "nM",
                  ];
                  dc.navUpdate = function () {
                    dc.nav = [];
                    for (var iB = 0; iB < btns.length; iB++) {
                      var b = dc.buttons[btns[iB]];
                      if (
                        b &&
                        !$A.isDisabled(b) &&
                        !$A.isHidden(b) &&
                        $A.isFocusable(b)
                      )
                        dc.nav.push(b);
                    }
                  };
                  dc.navUpdate();
                  dc.navTo = function (cur, forward) {
                    dc.navUpdate();
                    if (monthOnly) {
                      if (cur === dc.nav[0] && !forward)
                        return dc.nav[dc.nav.length - 1];
                      if (cur === dc.nav[dc.nav.length - 1] && forward)
                        return dc.nav[0];
                      return dc.nav[
                        $A.inArray(cur, dc.nav) + (forward ? 1 : -1)
                      ];
                    }
                    if (
                      !dc.nav.length ||
                      (cur === dc.nav[0] && !forward) ||
                      (cur === dc.nav[dc.nav.length - 1] && forward)
                    )
                      return null;
                    return (
                      dc.nav[$A.inArray(cur, dc.nav) + (forward ? 1 : -1)] ||
                      null
                    );
                  };
                })();

                dc.range.index = dc.container.querySelectorAll("td.dayInMonth");
                dc.setFocus.firstOpen = true;
                dc.setFocus(dc.range.index[dc.range.current.mDay - 1]);

                if (!dc.rerendering) {
                  if (commentsEnabled && config.editor && config.editor.show)
                    formDC.render();

                  if (dc.openOnFocus) $A.setAttr(targ, "aria-expanded", "true");
                  $A.setAttr(dc.triggerNode, "aria-expanded", "true");
                  setTimeout(function () {
                    dc.datepickerLoaded = true;
                  }, 750);
                }

                triggered = false;
              },
              helpTextShort: helpTextShort,
              helpText: helpText,
              afterRemove: function (dc) {
                if (!dc.rerendering) {
                  if (config.resetCurrent) {
                    dc.date = new Date();
                    dc.setCurrent(dc);
                    $A.extend(true, dc.fn.current, dc.range.current);
                  }

                  if (commentsEnabled) commentDC.remove();

                  if (commentsEnabled && config.editor && config.editor.show) {
                    formDC.lock = false;
                    formDC.remove();
                  }

                  $A.setAttr(dc.triggerNode, "aria-expanded", "false");
                }

                if ($A.isFn(config.configure))
                  dc.lock = dc.configureLoading = false;
              },
            },
          ],
          config,
        )[0];
        // Calendar object declaration end

        // Comment object declaration start
        var commentDC = $A(
          mainDC,
          [
            {
              id: pId + "commentTooltip",
              role: (config.comments && config.comments.role) || "Comment",
              widgetType: "Datepicker",
              returnFocus: false,
              className:
                (config.comments && config.comments.className) ||
                "commentTooltip",
              beforeRender: function (dc) {
                dc.targetNode = dc.parent.wrapper;
              },
            },
          ],
          (config.comments && config.comments.config) || {},
        )[0];
        // Comment object declaration end

        // Form object declaration start
        var formDC = $A(
          mainDC,
          [
            {
              id: pId + "commentAdd",
              role: (config.editor && config.editor.role) || "Edit",
              widgetType: "Datepicker",
              className:
                (config.editor && config.editor.className) || "commentAdd",
              openEditor: false,
              content:
                '<textarea style="visibility: hidden; display: none;" class="commentTa" title="' +
                commentDC.role +
                '"></textarea><button title="' +
                ((config.editor && config.editor.role) || "Edit") +
                " " +
                commentDC.role +
                '" class="commentBtn">' +
                ((config.editor && config.editor.role) || "Edit") +
                "</button>",
              beforeRender: function (dc) {
                dc.targetNode = dc.parent.wrapper;
              },
              click: function (ev, dc) {
                ev.stopPropagation();
              },
              duringRender: function (dc) {
                $A.setAttr(dc.wrapper, {
                  role: "dialog",
                  "aria-modal": "false",
                  "aria-label": dc.role,
                });

                $A.setAttr(dc.container, "role", "application");
              },
              add: function (dc) {
                var comm = $A.trim(dc.textarea.value.replace(/<|>|\n/g, " "));

                if (!dc.comments[dc.parent.range.current.year])
                  dc.comments[dc.parent.range.current.year] = {};
                dc.comments[dc.parent.range.current.year][
                  dc.parent.range.current.mDay
                ] = comm;
                var lbl =
                    dc.parent.range.current.mDay +
                    ", " +
                    dc.parent.range.wDays[dc.parent.range.current.wDay].lng +
                    " " +
                    dc.parent.range[dc.parent.range.current.month].name +
                    " " +
                    dc.parent.range.current.year,
                  pre = "";

                if (
                  (dc.parent.range[dc.parent.range.current.month].disabled[
                    dc.parent.range.current.year
                  ] &&
                    $A.inArray(
                      dc.parent.range.current.mDay,
                      dc.parent.range[dc.parent.range.current.month].disabled[
                        dc.parent.range.current.year
                      ],
                    ) !== -1) ||
                  (dc.parent.range[dc.parent.range.current.month].disabled[
                    "*"
                  ] &&
                    $A.inArray(
                      dc.parent.range.current.mDay,
                      dc.parent.range[dc.parent.range.current.month].disabled[
                        "*"
                      ],
                    ) !== -1)
                )
                  pre += dc.parent.disabledTxt.replace(/<|>|\"/g, "") + " ";

                if (!comm) {
                  $A.remClass(dc.parent.current, "comment");
                  $A.data(dc.parent.current, "_HasComment", false);
                } else {
                  $A.addClass(dc.parent.current, "comment");
                  $A.data(dc.parent.current, "_HasComment", true);
                  pre += dc.parent.commentedTxt.replace(/<|>|\"/g, "") + " ";
                }
                lbl = pre + lbl;
                $A.setAttr(dc.parent.current, {
                  title: $A.trim(pre),
                  "aria-label": lbl + " " + comm.replace(/\"/g, '"'),
                });
              },
              reset: function () {
                var dc = this;

                if (dc.loaded) {
                  if (dc.openEditor) {
                    if (!dc.textarea)
                      dc.textarea = dc.query("textarea", function () {
                        $A.css(this, {
                          visibility: "",
                          display: "",
                        });

                        dc.css("left", dc.parent.wrapper.offsetLeft);
                        $A.on(
                          this,
                          {
                            focus: function (ev) {
                              if (commentDC.loaded) commentDC.remove();
                            },
                            keydown: function (ev) {
                              var k = $A.keyEvent(ev);

                              if (this.value.length > 800)
                                this.value = this.value.substring(0, 799);

                              if (k === 13) {
                                dc.parent.isAdd = true;
                                dc.add.apply(this, [dc]);
                                dc.parent.current.focus();
                                dc.openEditor = false;
                                dc.reset();
                                ev.preventDefault();
                              } else if (k === 27) {
                                dc.parent.current.focus();
                                dc.openEditor = false;
                                dc.reset();
                                ev.preventDefault();
                              }
                            },
                          },
                          "." + baseId,
                        );
                      })[0];
                    else {
                      $A.css(dc.textarea, {
                        visibility: "",
                        display: "",
                      });

                      dc.css("left", dc.parent.wrapper.offsetLeft);
                    }
                    $A.setAttr(dc.textarea, {
                      title:
                        dc.parent.range.current.mDay +
                        ", " +
                        dc.parent.range.wDays[dc.parent.range.current.wDay]
                          .lng +
                        " " +
                        dc.parent.range[dc.parent.range.current.month].name +
                        " " +
                        dc.parent.range.current.year,
                    }).focus();

                    dc.comments =
                      dc.parent.range[dc.parent.range.current.month].comments;
                    var cmt =
                      (dc.comments[dc.parent.range.current.year] &&
                        dc.comments[dc.parent.range.current.year][
                          dc.parent.range.current.mDay
                        ]) ||
                      (dc.comments["*"] &&
                        dc.comments["*"][dc.parent.range.current.mDay]) ||
                      "";

                    if (cmt) dc.textarea.value = cmt;
                    $A.setAttr(dc.commentBtn, {
                      title:
                        ((config.editor && config.editor.action1) || "Save") +
                        " " +
                        commentDC.role,
                    }).innerHTML =
                      (config.editor && config.editor.action1) || "Save";
                  } else {
                    if (dc.textarea) {
                      dc.textarea.value = "";
                      $A.css(dc.textarea, {
                        visibility: "hidden",
                        display: "none",
                      });
                    }

                    dc.css(
                      "left",
                      dc.parent.wrapper.offsetLeft +
                        dc.parent.wrapper.offsetWidth -
                        dc.wrapper.offsetWidth,
                    );
                    $A.setAttr(dc.commentBtn, {
                      title:
                        ((config.editor && config.editor.role) || "Edit") +
                        " " +
                        commentDC.role,
                    }).innerHTML =
                      (config.editor && config.editor.role) || "Edit";
                  }
                }
              },
              afterRender: function (dc) {
                dc.textarea = dc.container.querySelector("textarea");
                dc.commentBtn = dc.container.querySelector("button");

                $A.on(
                  dc.commentBtn,
                  {
                    focus: function (ev) {
                      if (commentDC.loaded) commentDC.remove();
                    },
                    click: function (ev) {
                      if (dc.openEditor) {
                        dc.parent.isAdd = true;
                        dc.add.apply(dc.commentBtn, [dc]);
                        dc.parent.current.focus();
                        dc.openEditor = false;
                        dc.reset();
                      } else {
                        dc.openEditor = true;
                        dc.reset();
                      }
                      ev.preventDefault();
                    },
                    keydown: function (ev) {
                      var k = $A.keyEvent(ev);

                      if (k === 27) {
                        if (dc.openEditor) {
                          dc.parent.current.focus();
                          dc.openEditor = false;
                          dc.reset();
                        }

                        ev.preventDefault();
                      } else if (
                        k === 9 &&
                        !ev.altKey &&
                        !ev.shiftKey &&
                        !ev.ctrlKey
                      ) {
                        var navX = dc.parent.nav[0];
                        if ($A.isNode(navX)) navX.focus();
                        else mainDC.current.focus();
                        ev.preventDefault();
                      } else if (
                        k === 9 &&
                        !pressed.alt &&
                        !pressed.ctrl &&
                        pressed.shift
                      ) {
                        if (!$A.isHidden(formDC.textarea)) {
                          formDC.textarea.focus();
                        } else {
                          mainDC.current.focus();
                        }
                        ev.preventDefault();
                      }
                    },
                  },
                  "." + baseId,
                );

                dc.reset();
                dc.lock = true;

                $A.on(
                  dc.textarea,
                  "keydown",
                  function (ev) {
                    var k = $A.keyEvent(ev);

                    if (k === 27) {
                      if (dc.openEditor) {
                        dc.parent.current.focus();
                        dc.openEditor = false;
                        dc.reset();
                      }

                      ev.preventDefault();
                    } else if (
                      k === 9 &&
                      !ev.altKey &&
                      !ev.ctrlKey &&
                      ev.shiftKey
                    ) {
                      mainDC.current.focus();
                      ev.preventDefault();
                    } else if (k === 13) {
                      dc.commentBtn.click();
                      ev.preventDefault();
                    }
                  },
                  "." + baseId,
                );
              },
              beforeRemove: function (dc) {
                dc.openEditor = false;
                dc.textarea = null;
                dc.parent.setFocus.firstOpen = true;
              },
              lock:
                commentsEnabled && config.editor && config.editor.show
                  ? false
                  : true,
            },
          ],
          (config.editor && config.editor.config) || {},
        )[0];
        // Form object declaration end

        $A.on(
          window,
          "resize",
          function (ev) {
            mainDC.setPosition();
            commentDC.setPosition();
            formDC.setPosition();
            formDC.reset();
          },
          "." + baseId,
        );

        $A.setAttr(trigger, "aria-expanded", "false");

        // Toggles for openOnFocus support.
        var odc = mainDC,
          odcDel = false,
          odcDelFn = function () {
            odcDel = false;
          },
          odcFn = function () {
            if (!odcDel && !odc.loaded && !odc.disabled) {
              odcDel = true;
              // Toggles for openOnFocus support.
              onFocusInit = false;
              onFocusTraverse = true;
              triggered = true;

              $A.trigger(this, "opendatepicker");
              setTimeout(odcDelFn, 1000);
            } else if (!odcDel && odc.loaded) {
              odcDel = true;
              odc.remove();
              // Toggles for openOnFocus support.
              onFocusInit = false;
              onFocusTraverse = false;
              setTimeout(odcDelFn, 1000);
            }
          },
          triggered = false;

        $A.on(
          trigger,
          {
            click: function (ev) {
              odcFn.call(this);
              ev.preventDefault();
            },
            keydown: function (ev) {
              var k = $A.keyEvent(ev);

              if (k === 32) {
                odcFn.call(this);
                ev.preventDefault();
                ev.stopPropagation();
              }
            },
          },
          "." + baseId,
        );

        var triggeredByTouch = false;

        // Toggles for openOnFocus support.

        if (config.openOnFocus === true) {
          $A.setAttr(targ, "aria-expanded", "false");

          $A.on(
            targ,
            {
              touchstart: function (ev) {
                triggeredByTouch = true;
                if (
                  !odcDel &&
                  !odc.loaded &&
                  !onFocusInit &&
                  !onFocusTraverse &&
                  !odc.disabled
                ) {
                  odcDel = true;
                  $A.trigger(trigger, "opendatepicker");
                  ev.preventDefault();
                  setTimeout(odcDelFn, 1000);
                }
              },
              focus: function (ev) {
                if (
                  triggeredByTouch &&
                  !odcDel &&
                  !odc.loaded &&
                  !onFocusInit &&
                  onFocusTraverse
                ) {
                  ev.preventDefault();
                  this.blur();
                  if (trigger) $A.focus(config.returnFocusTo || trigger);
                } else if (
                  !odcDel &&
                  !odc.loaded &&
                  !onFocusInit &&
                  !onFocusTraverse &&
                  !odc.disabled
                ) {
                  odcDel = true;
                  $A.trigger(trigger, "opendatepicker");
                  if (!triggeredByTouch)
                    setTimeout(function () {
                      $A.announce(odc.openOnFocusHelpText);
                    }, 1);
                  setTimeout(odcDelFn, 1000);
                }
                onFocusInit = true;
                onFocusTraverse = false;
              },
              mousedown: function (ev) {
                this.blur();
                onFocusInit = onFocusTraverse = false;
                this.focus();
              },
              blur: function (ev) {
                if (
                  odc.loaded &&
                  onFocusInit &&
                  !onFocusTraverse &&
                  !odc.mouseWithin
                ) {
                  odc.remove();
                }
                onFocusInit = false;
              },
              keydown: function (ev) {
                var k = $A.keyEvent(ev);

                if (k === 40 && onFocusInit && !onFocusTraverse && odc.loaded) {
                  onFocusInit = false;
                  onFocusTraverse = true;
                  if (monthOnly) {
                    if (!odc.buttons.cMS.hidden) odc.buttons.cMS.focus();
                    else if (!odc.buttons.cM.hidden) odc.buttons.cM.focus();
                  } else
                    odc.setFocus(odc.range.index[odc.range.current.mDay - 1]);
                  ev.preventDefault();
                  ev.stopPropagation();
                } else if (
                  k === 40 &&
                  !odc.loaded &&
                  !odcDel &&
                  !odc.disabled
                ) {
                  odcDel = true;
                  onFocusInit = true;
                  onFocusTraverse = false;
                  $A.trigger(trigger, "opendatepicker");
                  setTimeout(odcDelFn, 1000);
                  onFocusInit = false;
                  onFocusTraverse = true;
                  if (monthOnly) {
                    if (!odc.buttons.cMS.hidden) odc.buttons.cMS.focus();
                    else if (!odc.buttons.cM.hidden) odc.buttons.cM.focus();
                  } else
                    odc.setFocus(odc.range.index[odc.range.current.mDay - 1]);
                  ev.preventDefault();
                  ev.stopPropagation();
                } else if (
                  k === 27 &&
                  onFocusInit &&
                  !onFocusTraverse &&
                  odc.loaded
                ) {
                  onFocusInit = false;
                  onFocusTraverse = false;
                  odc.remove();
                  ev.preventDefault();
                  ev.stopPropagation();
                } else if (
                  k === 9 &&
                  onFocusInit &&
                  !onFocusTraverse &&
                  odc.loaded &&
                  ev.shiftKey
                ) {
                  onFocusInit = false;
                  onFocusTraverse = false;
                  odc.remove();
                } else if (
                  k === 9 &&
                  onFocusInit &&
                  !onFocusTraverse &&
                  odc.loaded &&
                  !ev.shiftKey
                ) {
                  onFocusInit = false;
                  onFocusTraverse = true;
                  if (monthOnly) {
                    if (!odc.buttons.cMS.hidden) odc.buttons.cMS.focus();
                    else if (!odc.buttons.cM.hidden) odc.buttons.cM.focus();
                  } else
                    odc.setFocus(odc.range.index[odc.range.current.mDay - 1]);
                  setTimeout(function () {
                    $A.announce(odc.helpTextShort);
                  }, 1);
                  ev.preventDefault();
                  ev.stopPropagation();
                }
              },
            },
            "." + baseId,
          );
        } else {
          $A.on(targ, {
            touchstart: function (ev) {
              triggeredByTouch = true;
            },
            focus: function (ev) {
              if (
                triggeredByTouch &&
                !odcDel &&
                !odc.loaded &&
                !onFocusInit &&
                onFocusTraverse
              ) {
                ev.preventDefault();
                this.blur();
                if (trigger) $A.focus(config.returnFocusTo || trigger);
              }

              onFocusInit = true;
              onFocusTraverse = false;
            },
          });
        }

        odc.setDisabled(odc, odc.disabled);
        $A(trigger).describedBy(targ).controls(targ);

        $A.on(
          "body",
          "click",
          function (ev) {
            if (mainDC.datepickerLoaded) mainDC.remove();
          },
          "." + baseId,
        );

        return mainDC;
      },
    });
  }
})();
