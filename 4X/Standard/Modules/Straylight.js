/*@license
4X Straylight 2.3 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: Animate.js, Accordion.js, Tab.js, Datepicker.js, Dialog.js, Footnote.js, Popup.js, Tooltip.js, Menu.js, Listbox.js

(Edit this file however desired to customize markup template functionality.)

*/

(function () {
  if (!("straylight" in $A))
    $A.extend({
      straylight: function (context) {
        context = $A.isNode(context, null, document, 11) ? context : document;

        (function () {
          // ARIA Accordions
          // Search and recognise accordion triggering elements with the class "aria-accordion-trigger" plus a valid data-name attribute for shared control groups.
          var map = new Map();
          $A.query(
            "button[data-controls][data-name].aria-accordion-trigger, a[data-controls][data-name].aria-accordion-trigger",
            context,
            function (i, o) {
              if (!$A.data(o, "_isBoundAccordion")) {
                $A.data(o, "_isBoundAccordion", true);
                var name = $A.getAttr(o, "data-name");
                if (!map.has(name)) map.set(name, []);
                map.get(name).push(o);
              }
            },
          );
          $A.loop(
            map,
            function (i, o) {
              $A.setAccordion(o, {
                isToggle: true,
                allowMultiple: false,
                preload: true,
                preloadImages: true,
                preloadCSS: true,
                toggleHide: true,

                /*
  // Enable auto-rendering when the page loads.
  // When true, the hash tag in the URL will automatically open the associated DC object.
  // To render automatically, the hash tag must match the DC object id.
  // To set a hash tag within the address bar, use the $A.setPage() function.
  // For more details, view: Help/ARIA Development/Browser History and Permalinks
// Plus: Help/DC API/DC Object Configuration/Behaviors
    trackPage: true,
    afterRender: function(dc) {
      $A.setPage(
        dc.id,
        $A.getText(dc.triggerNode) + " ARIA Accordion - Apex 4X Technical Style Guide"
      );
    },
*/

                /* Uncomment to set animation effects.
    style: { display: "none" },
    animate: {
      onRender: function(dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.slideDownIn", {
          duration: 1500,
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      },
      onRemove: function(dc, wrapper, next) {
        $A.Velocity(wrapper, "transition.slideDownOut", {
          delay: 500,
          duration: 1500,
          complete: function() {
            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
            next();
          }
        });
      }
    },
*/

                toggleClassName: "open",

                context: context,
              });
            },
            "map",
          );
        })();

        (function () {
          // ARIA Tabs
          // Search and recognise tablist grouping containers with the class "aria-tablist"
          var groups = [];
          $A.query("*.aria-tablist", context, function (i, o) {
            if (!$A.data(o, "_isBoundTabList")) {
              $A.data(o, "_isBoundTabList", true);
              groups.push(o);
            }
          });
          if (groups.length)
            $A.loop(
              groups,
              function (i, list) {
                $A.setTab(
                  list.querySelectorAll(
                    "button[data-controls].aria-tab, a[data-controls].aria-tab",
                  ),
                  {
                    // Enable auto-rendering when the page loads.
                    // When true, the hash tag in the URL will automatically open the associated DC object.
                    // To render automatically, the hash tag must match the DC object id.
                    // To set a hash tag within the address bar, use the $A.setPage() function.
                    // For more details, view: Help/ARIA Development/Browser History and Permalinks
                    // Plus: Help/DC API/DC Object Configuration/Behaviors
                    trackPage: true,
                    afterRender: function (dc) {
                      $A.setPage(
                        dc.id,
                        $A.getText(dc.triggerNode) +
                          " ARIA Tab - Apex 4X Technical Style Guide",
                      );
                    },

                    preload: true,
                    preloadImages: true,
                    preloadCSS: true,
                    toggleHide: true,

                    /* Uncomment to set animation effects.
                        style: { display: "none" },
                        animate: {
                          onRender: function(dc, wrapper, next) {
                            $A.Velocity(wrapper, "transition.slideDownIn", {
                              duration: 1500,
                              complete: function() {
                                // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                                next();
                              }
                            });
                          },
                          onRemove: function(dc, wrapper, next) {
                            $A.Velocity(wrapper, "transition.slideDownOut", {
                              delay: 500,
                              duration: 1500,
                              complete: function() {
                                // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                                next();
                              }
                            });
                          }
                        },
*/

                    isToggle: false,
                    toggleClassName: "active",
                  },
                );
              },
              "array",
            );
        })();

        (function () {
          // ARIA Date Pickers
          // Parse all A and button tags that include the class 'aria-date-picker'
          // An Input element with type=text is specified as the return recipient by matching the data-controls attribute of the A/Button with the Input element's id attribute.
          // A and Button tags were chosen because they are always active elements, to ensure keyboard accessibility.
          $A.query(
            "a.aria-date-picker, button.aria-date-picker",
            context,
            function (i, o) {
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
                if ($A.data(o, "_isBoundDatepicker")) var isBound = true;
                else $A.data(o, "_isBoundDatepicker", true);
                if (!isBound)
                  $A.setDatepicker({
                    // Unique ID for the date picker instance
                    id: id,

                    // Icon triggering element
                    toggle: o,

                    // Native or simulated input element
                    input: target,

                    style: {
                      position: "absolute",
                      zIndex: 1,
                      display: "none",
                    },
                    animate: {
                      onRender: function (dc, wrapper, next) {
                        $A.Velocity(wrapper, "transition.fadeIn", {
                          complete: function () {
                            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                            next();
                          },
                        });
                      },
                      onRemove: function (dc, wrapper, next) {
                        $A.Velocity(wrapper, "transition.fadeOut", {
                          complete: function () {
                            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                            next();
                          },
                        });
                      },
                    },
                  });
              }
            },
          );
        })();

        (function () {
          // ARIA Dialogs
          // Search and recognise dialog triggering elements with the class "aria-dialog"
          var triggers = context.querySelectorAll(
            "a[href][data-controls].aria-dialog, button[data-controls].aria-dialog",
          );

          if (triggers.length)
            $A.loop(
              triggers,
              function (i, t) {
                if (!$A.data(t, "_BoundDialog")) {
                  $A.data(t, "_BoundDialog", true);
                  var role = $A.getAttr(t, "data-role") || "";
                  $A.setDialog(t, {
                    role: role,
                    className: "modal",
                    isModal: true,
                    isAlert: false,

                    style: { display: "none" },
                    animate: {
                      onRender: function (dc, wrapper, next) {
                        $A.Velocity(wrapper, "transition.slideDownIn", {
                          complete: function () {
                            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                            next();
                          },
                        });
                      },
                      onRemove: function (dc, wrapper, next) {
                        $A.Velocity(wrapper, "transition.slideDownOut", {
                          complete: function () {
                            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                            next();
                          },
                        });
                      },
                    },
                  });
                }
              },
              "array",
            );
        })();

        (function () {
          // ARIA Footnotes
          // Search and recognise footnote triggering elements with the class "aria-footnote"
          // In this case, the link is embedded within a span with class="aria-footnote".
          var fnSelector = 'span.aria-footnote > a[href^="#"]';
          if (document.querySelectorAll(fnSelector).length)
            $A.setFootnotes(fnSelector, {
              override: {
                duration: 700,
                easing: "ease-in",
              },
            });
        })();

        (function () {
          // ARIA Popups
          // Search and recognise popup triggering elements with the class "aria-popup"
          var triggers = context.querySelectorAll(
            "a[href][data-controls].aria-popup, button[data-controls].aria-popup",
          );

          if (triggers.length)
            $A.loop(
              triggers,
              function (i, t) {
                if (!$A.data(t, "_BoundPopup")) {
                  $A.data(t, "_BoundPopup", true);
                  var role = $A.getAttr(t, "data-role") || "Popup";
                  $A.setPopup(t, {
                    role: role,
                    className: "popup",
                    isAlert: false,
                    circularTabbing: true,

                    style: { display: "none" },
                    animate: {
                      onRender: function (dc, wrapper, next) {
                        $A.Velocity(wrapper, "transition.fadeIn", {
                          complete: function () {
                            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                            next();
                          },
                        });
                      },
                      onRemove: function (dc, wrapper, next) {
                        $A.Velocity(wrapper, "transition.fadeOut", {
                          complete: function () {
                            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                            next();
                          },
                        });
                      },
                    },
                    afterRender: function (dc) {
                      // Do something after the popup is rendered.
                    },
                  });
                }
              },
              "array",
            );
        })();

        (function () {
          // ARIA Tooltips
          // Search and recognise tooltip triggering elements with the class "aria-tooltip"
          var triggers = context.querySelectorAll("*.aria-tooltip");

          if (triggers.length)
            $A.loop(
              triggers,
              function (i, t) {
                if (!$A.data(t, "_BoundTooltip")) {
                  $A.data(t, "_BoundTooltip", true);
                  $A.setTooltip(t, {
                    autoCloseSameWidget: true,
                    className: "tooltip",
                    isFocusOnly: $A.getAttr(t, "data-mode") === "focus",
                    isManualOpen: $A.getAttr(t, "data-mode") === "click",
                    delay: parseInt($A.getAttr(t, "data-delay")) || 0,
                    delayTimeout: parseInt($A.getAttr(t, "data-timeout")) || 0,
                    style: { display: "none" },
                    animate: {
                      onRender: function (dc, wrapper, next) {
                        $A.Velocity(wrapper, "transition.fadeIn", {
                          complete: function () {
                            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                            next();
                          },
                        });
                      },
                      onRemove: function (dc, wrapper, next) {
                        $A.Velocity(wrapper, "transition.fadeOut", {
                          complete: function () {
                            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                            next();
                          },
                        });
                      },
                    },
                  });
                }
              },
              "array",
            );
        })();

        (function () {
          // ARIA Menus
          // Search and recognise menu triggering elements with the class "aria-menu"
          var triggers = context.querySelectorAll("*[data-menu].aria-menu");

          if (triggers.length)
            $A.loop(
              triggers,
              function (i, t) {
                if (!$A.data(t, "_BoundMenu")) {
                  $A.data(t, "_BoundMenu", true);
                  $A.setMenu(t, {
                    onActivate: function (
                      ev,
                      triggerNode,
                      RTI,
                      boundElement,
                      checked,
                      check,
                      isRadio,
                    ) {
                      if ($A.isNum(checked)) {
                        // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
                        // if 0, the checked state is "false".
                        // if 1, the checked state is "true".
                        // if 2, the checked state is "mixed".
                        // The 'set' argument is a function that will set the checkable item to a new state.
                        // The new value must be a string consisting of "false", "true", or "mixed".
                        if (checked === 0 || isRadio) {
                          check("true");
                          RTI.DC.top.remove(function () {
                            alert(
                              "The new checked state for " +
                                triggerNode.id +
                                " is 'true'",
                            );
                          });
                        } else if (checked === 1) {
                          check("mixed");
                          RTI.DC.top.remove(function () {
                            alert(
                              "The new checked state for " +
                                triggerNode.id +
                                " is 'mixed'",
                            );
                          });
                        } else if (checked === 2) {
                          check("false");
                          RTI.DC.top.remove(function () {
                            alert(
                              "The new checked state for " +
                                triggerNode.id +
                                " is 'false'",
                            );
                          });
                        }
                      } else if (
                        $A(triggerNode).hasAttr("href") &&
                        $A(triggerNode).getAttr("href").indexOf("https://") !==
                          -1
                      )
                        RTI.DC.top.remove(function () {
                          location.href = triggerNode.href;
                        });
                      else
                        RTI.DC.top.remove(function () {
                          alert(triggerNode.id);
                        });
                    },
                    style: { display: "none" },
                    animate: {
                      onRender: function (dc, wrapper, next) {
                        $A.Velocity(wrapper, "transition.slideUpIn", {
                          duration: 1000,
                          complete: function () {
                            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                            next();
                          },
                        });
                      },
                      onRemove: function (dc, wrapper, next) {
                        $A.Velocity(wrapper, "transition.slideUpOut", {
                          duration: 1000,
                          complete: function () {
                            // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                            next();
                          },
                        });
                      },
                    },
                  });
                }
              },
              "array",
            );
        })();

        (function () {
          // ARIA Listboxes
          // Search and recognise native select elements with the class "aria-listbox-root"
          var lbs = context.querySelectorAll("select.aria-listbox-root");
          if (lbs.length) {
            $A.loop(
              lbs,
              function (i, s) {
                $A.setListbox(s, {
                  // Additional configuration options.
                });
              },
              "array",
            );
          }
        })();
      },
    });

  $A.on(
    "load",
    function () {
      $A.straylight(document);
    },
    ".straylight",
  );
})();
