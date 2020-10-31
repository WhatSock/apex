/*!
4X Bootstrap 2.0 for Apex 4X
Copyright 2020 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.

(Edit this file however desired to customize markup template functionality.)

*/

(function() {
  if (!("bootstrap" in $A))
    $A.extend({
      bootstrap: function(context) {
        context = $A.isDOMNode(context) ? context : document;

        (function() {
          // ARIA Accordions
          // Search and recognise accordion triggering elements with the class "aria-accordion-trigger"
          var groups = {};
          $A.query(".aria-accordion-trigger", context, function(i, o) {
            var groupName = $A.getAttr(o, "data-group");
            if (!groups[groupName]) groups[groupName] = [];
            if (!$A.data(o, "_isBoundAccordion")) {
              $A.data(o, "_isBoundAccordion", true);
              groups[groupName].push(o);
            }
          });
          for (var n in groups) {
            $A.import(["Animate", "Accordion"], {
              name: "BootstrapAccordion",
              defer: true,
              props: $A.extend(props, {
                accordionGroup: groups[n]
              }),
              call: function(props) {
                $A.setAccordion({
                  triggers: props.accordionGroup,
                  preload: true,
                  preloadImages: true,
                  preloadCSS: true,
                  animate: {
                    onRender: function(dc, outerNode, complete) {
                      // Optionally add an animation effect when the accordion panel is rendered.
                      // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
                      complete();
                    },
                    onRemove: function(dc, outerNode, complete) {
                      // Optionally add an animation effect when the accordion panel is removed.
                      // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
                      complete();
                    }
                  },
                  toggleClass: "open",
                  context: context,
                  callback: function(dc) {}
                });
              }
            });
          }
        })();

        (function() {
          // ARIA TabLists
          // Search and recognise tablist grouping containers with the class "aria-tablist" and the role "tablist"
          var groups = [];
          $A.query('*.aria-tablist[role="tablist"]', context, function(i, o) {
            if (!$A.data(o, "_isBoundTabList")) {
              $A.data(o, "_isBoundTabList", true);
              groups.push(o);
            }
          });
          if (groups.length)
            $A.import(["Animate", "TabList"], {
              name: "BootstrapTabList",
              defer: true,
              props: $A.extend(props, {
                tabList: groups
              }),
              call: function(props) {
                $A.setTabList({
                  tabList: props.tabList,
                  preload: true,
                  preloadImages: true,
                  preloadCSS: true,
                  animate: {
                    onRender: function(dc, outerNode, complete) {
                      // Optionally add an animation effect when the tab panel is rendered.
                      // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
                      complete();
                    },
                    onRemove: function(dc, outerNode, complete) {
                      // Optionally add an animation effect when the tab panel is removed.
                      // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
                      complete();
                    }
                  },
                  isToggle: false,
                  toggleClass: "active",
                  callback: function(dc) {}
                });
              }
            });
        })();

        (function() {
          // ARIA Date Pickers
          // Parse all A and button tags that include the class 'aria-date-picker'
          // An Input element with type=text is specified as the return recipient by matching the data-controls attribute of the A/Button with the Input element's id attribute.
          // A and Button tags were chosen because they are always active elements, to ensure keyboard accessibility.
          $A.query(
            "a.aria-date-picker, button.aria-date-picker",
            context,
            function(i, o) {
              var tdc = $A.getDC(o.id);
              if (tdc && tdc.loaded) {
                tdc.returnFocus = false;
                tdc.remove();
                tdc.returnFocus = true;
              }
              var id = $A.getAttr(o, "data-controls") || false,
                target = id ? context.querySelector("#" + id) : false;
              if (target) {
                // Prevent duplicate event bindings when nested within multi-level same page apps
                if ($A.data(o, "_isBoundDatePicker")) var isBound = true;
                else $A.data(o, "_isBoundDatePicker", true);
                if (!isBound)
                  $A.import(["Animate", "DatePicker"], {
                    name: "BootstrapDatePicker",
                    defer: true,
                    props: $A.extend(props, {
                      id: id,
                      button: o,
                      input: target
                    }),
                    call: function(props) {
                      $A.setDatePicker({
                        // Unique ID for the date picker instance
                        id: props.id,

                        // Icon triggering element
                        toggle: props.button,

                        // Native or simulated input element
                        input: props.input,

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

                        // Uncomment to disable auto positioning
                        // autoPosition: 0,

                        // Uncomment to combine the year and month selectors
                        // condenseYear: true,

                        // Uncomment to switch the behaviour when the PageUp or PageDown keys are pressed to a "natural" behaviour (PageUp goes to previous month, PageDown goes to next month)
                        // pageUpDownNatural: true,

                        // Uncomment to append a "dayToday" CSS class to the current day cell element - this allows styling to be targeted to this specific element
                        // highlightToday: true,

                        // Uncomment to fill in the day cells outside of the current month so that the calendar grid is always filled with day cells
                        // drawFullCalendar: true,

                        // Uncomment to run custom functions at the end of the code within the following component functions. Receives a single parameter "dc", which provides access to the Datepicker object.
                        // runBefore: function (dc) {
                        // 	console.log('runBefore');
                        // 	console.log(dc);
                        // },
                        // runAfterClose: function (dc) {
                        // 	console.log('runAfterClose');
                        // 	console.log(dc);
                        // },

                        // Uncomment to override the character used on the month / year change buttons
                        // leftButtonYearText: '&lt;',
                        // rightButtonYearText: '&gt;',
                        // leftButtonMonthText: '&lt;',
                        // rightButtonMonthText: '&gt;',

                        // Uncomment to set specific start / end boundaries of a date range. Can be Date objects (absolute boundaries), or integers (relative boundaries)
                        // minDate: (new Date(1987, 4, 19)),
                        // maxDate: 28,

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

                        style: {
                          position: "absolute",
                          zIndex: 1
                        }
                      });
                    }
                  });
              }
            }
          );
        })();

        (function() {
          // ARIA Dialogs
          // Search and recognise dialog triggering elements with the class "aria-dialog"
          var triggers = context.querySelectorAll(
            "a[href][data-controls].aria-dialog, button[data-controls].aria-dialog"
          );

          if (triggers.length)
            $A.import(["Animate", "Dialog"], {
              name: "BootstrapDialog",
              defer: true,
              props: $A.extend(props, {
                triggers: triggers
              }),
              call: function(props) {
                $A.loop(
                  props.triggers,
                  function(i, t) {
                    if (!$A.data(t, "_Bound")) {
                      $A.data(t, "_Bound", true);
                      var role = $A.getAttr(t, "data-role") || "";
                      $A.setDialog(t, {
                        role: role,
                        className: "modal",
                        isModal: true,
                        isAlert: false,
                        // forceFocus must always be true if not setting focus into the dialog manually.
                        forceFocus: true,
                        returnFocus: true,
                        animate: {
                          onRender: function(dc, outerNode, complete) {
                            // Optionally add an animation effect when the dialog is rendered.
                            // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
                            complete();
                          },
                          onRemove: function(dc, outerNode, complete) {
                            // Optionally add an animation effect when the dialog is removed.
                            // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
                            complete();
                          }
                        }
                      });
                    }
                  },
                  "array"
                );
              }
            });
        })();

        (function() {
          // ARIA Footnotes
          // Search and recognise footnote triggering elements with the class "aria-footnote"
          // In this case, the link is embedded within a span with class="aria-footnote".
          var fnSelector = 'span.aria-footnote > a[href^="#"]';
          if (document.querySelectorAll(fnSelector).length)
            $A.import("Footnote", {
              name: "BootstrapFootnote",
              defer: true,
              props: props,
              call: function(props) {
                $A.setFootnotes({
                  footnotes: fnSelector,
                  override: {
                    duration: 550,
                    easing: "ease-in"
                  }
                });
              }
            });
        })();

        (function() {
          // ARIA Popups
          // Search and recognise popup triggering elements with the class "aria-popup"
          var triggers = context.querySelectorAll(
            "a[href][data-controls].aria-popup, button[data-controls].aria-popup"
          );

          if (triggers.length)
            $A.import(["Animate", "Popup"], {
              name: "BootstrapPopup",
              defer: true,
              props: $A.extend(props, {
                triggers: triggers
              }),
              call: function(props) {
                $A.loop(
                  props.triggers,
                  function(i, t) {
                    if (!$A.data(t, "_Bound")) {
                      $A.data(t, "_Bound", true);
                      var role = $A.getAttr(t, "data-role") || "Popup";
                      $A.setPopup(t, {
                        role: role,
                        className: "popup",
                        isAlert: false,
                        // forceFocus must always be true if not setting focus into the popup manually.
                        forceFocus: true,
                        circularTabbing: true,
                        animate: {
                          onRender: function(dc, outerNode, complete) {
                            // Optionally add an animation effect when the popup is rendered.
                            // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
                            complete();
                          },
                          onRemove: function(dc, outerNode, complete) {
                            // Optionally add an animation effect when the popup is removed.
                            // To ensure accessibility, make sure that the complete() function is executed within the callback after the animation finishes.
                            complete();
                          }
                        },
                        runAfter: function(dc) {
                          // Do something after the popup is rendered.
                        }
                      });
                    }
                  },
                  "array"
                );
              }
            });
        })();
      }
    });

  $A.on("load", function() {
    $A.bootstrap(document);
  });
})();
