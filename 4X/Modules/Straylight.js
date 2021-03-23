/*!
4X Straylight 2.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.

(Edit this file however desired to customize markup template functionality.)

*/

(function() {
  if (!("straylight" in $A))
    $A.extend({
      straylight: function(context) {
        context = $A.isNode(context, null, document, 11) ? context : document;

        (function() {
          // ARIA Accordions
          // Search and recognise accordion triggering elements with the class "aria-accordion-trigger" plus a valid data-name attribute for shared control groups.
          var map = new Map();
          $A.query(
            "button[controls][data-name].aria-accordion-trigger, a[controls][data-name].aria-accordion-trigger",
            context,
            function(i, o) {
              if (!$A.data(o, "_isBoundAccordion")) {
                $A.data(o, "_isBoundAccordion", true);
                var name = $A.getAttr(o, "data-name");
                if (!map.has(name)) map.set(name, []);
                map.get(name).push(o);
              }
            }
          );
          $A.loop(
            map,
            function(i, o) {
              $A.import(["Animate", "Accordion"], {
                name: "StraylightAccordion",
                defer: true,
                props: $A.extend(props, {
                  triggers: o
                }),
                call: function(props) {
                  $A.setAccordion(props.triggers, {
                    trackPage: true,
                    toggleClass: "open",
                    isToggle: false,
                    allowMultiple: false,
                    preload: true,
                    preloadImages: true,
                    preloadCSS: true,
                    toggleHide: true,

                    style: { display: "none" },
                    animate: {
                      onRender: function(dc, wrapper, complete) {
                        Velocity(wrapper, "transition.slideLeftIn", {
                          complete: function() {
                            complete();
                          }
                        });
                      },
                      onRemove: function(dc, wrapper, complete) {
                        Velocity(wrapper, "transition.slideLeftOut", {
                          complete: function() {
                            complete();
                          }
                        });
                      }
                    },
                    context: context
                  });
                }
              });
            },
            "map"
          );
        })();

        (function() {
          // ARIA TabLists
          // Search and recognise tablist grouping containers with the class "aria-tablist"
          var groups = [];
          $A.query("*.aria-tablist", context, function(i, o) {
            if (!$A.data(o, "_isBoundTabList")) {
              $A.data(o, "_isBoundTabList", true);
              groups.push(o);
            }
          });
          if (groups.length)
            $A.import(["Animate", "TabList"], {
              name: "StraylightTabList",
              defer: true,
              props: $A.extend(props, {
                tabList: groups
              }),
              call: function(props) {
                $A.loop(
                  props.tabList,
                  function(i, list) {
                    $A.setTabList(
                      list.querySelectorAll(
                        "button[controls].aria-tab, a[controls].aria-tab"
                      ),
                      {
                        trackPage: true,
                        afterRender: function(dc) {
                          $A.setPage(
                            dc.id,
                            $A.getText(dc.triggerNode) +
                              " ARIA Tab - Apex 4X Technical Style Guide"
                          );
                        },
                        preload: true,
                        preloadImages: true,
                        preloadCSS: true,
                        toggleHide: true,

                        style: { display: "none" },
                        animate: {
                          onRender: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.slideUpIn", {
                              complete: function() {
                                complete();
                              }
                            });
                          },
                          onRemove: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.slideUpOut", {
                              complete: function() {
                                complete();
                              }
                            });
                          }
                        },
                        isToggle: false,
                        toggleClass: "active"
                      }
                    );
                  },
                  "array"
                );
              }
            });
        })();

        (function() {
          // ARIA Date Pickers
          // Parse all A and button tags that include the class 'aria-date-picker'
          // An Input element with type=text is specified as the return recipient by matching the controls attribute of the A/Button with the Input element's id attribute.
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
              var id = $A.getAttr(o, "controls") || false,
                target = id ? context.querySelector("#" + id) : false;
              if (target) {
                // Prevent duplicate event bindings when nested within multi-level same page apps
                if ($A.data(o, "_isBoundDatePicker")) var isBound = true;
                else $A.data(o, "_isBoundDatePicker", true);
                if (!isBound)
                  $A.import(["Animate", "DatePicker"], {
                    name: "StraylightDatePicker",
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

                        style: {
                          position: "absolute",
                          zIndex: 1,
                          display: "none"
                        },
                        animate: {
                          onRender: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.fadeIn", {
                              complete: function() {
                                complete();
                              }
                            });
                          },
                          onRemove: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.fadeOut", {
                              complete: function() {
                                complete();
                              }
                            });
                          }
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
            "a[href][controls].aria-dialog, button[controls].aria-dialog"
          );

          if (triggers.length)
            $A.import(["Animate", "Dialog"], {
              name: "StraylightDialog",
              defer: true,
              props: $A.extend(props, {
                triggers: triggers
              }),
              call: function(props) {
                $A.loop(
                  props.triggers,
                  function(i, t) {
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
                          onRender: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.slideDownIn", {
                              complete: function() {
                                complete();
                              }
                            });
                          },
                          onRemove: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.slideDownOut", {
                              complete: function() {
                                complete();
                              }
                            });
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
              name: "StraylightFootnote",
              defer: true,
              props: props,
              call: function(props) {
                $A.setFootnotes(fnSelector, {
                  override: {
                    duration: 700,
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
            "a[href][controls].aria-popup, button[controls].aria-popup"
          );

          if (triggers.length)
            $A.import(["Animate", "Popup"], {
              name: "StraylightPopup",
              defer: true,
              props: $A.extend(props, {
                triggers: triggers
              }),
              call: function(props) {
                $A.loop(
                  props.triggers,
                  function(i, t) {
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
                          onRender: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.fadeIn", {
                              complete: function() {
                                complete();
                              }
                            });
                          },
                          onRemove: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.fadeOut", {
                              complete: function() {
                                complete();
                              }
                            });
                          }
                        },
                        afterRender: function(dc) {
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

        (function() {
          // ARIA Tooltips
          // Search and recognise tooltip triggering elements with the class "aria-tooltip"
          var triggers = context.querySelectorAll("*.aria-tooltip");

          if (triggers.length)
            $A.import(["Animate", "Tooltip"], {
              name: "StraylightTooltip",
              defer: true,
              props: $A.extend(props, {
                triggers: triggers
              }),
              call: function(props) {
                $A.loop(
                  props.triggers,
                  function(i, t) {
                    if (!$A.data(t, "_BoundTooltip")) {
                      $A.data(t, "_BoundTooltip", true);
                      $A.setTooltip(t, {
                        className: "tooltip",
                        isFocusOnly: $A.getAttr(t, "data-mode") === "focus",
                        isManualOpen: $A.getAttr(t, "data-mode") === "click",
                        delay: parseInt($A.getAttr(t, "data-delay")) || 0,
                        delayTimeout:
                          parseInt($A.getAttr(t, "data-timeout")) || 0,
                        style: { display: "none" },
                        animate: {
                          onRender: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.fadeIn", {
                              complete: function() {
                                complete();
                              }
                            });
                          },
                          onRemove: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.fadeOut", {
                              complete: function() {
                                complete();
                              }
                            });
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
          // ARIA Menus
          // Search and recognise menu triggering elements with the class "aria-menu"
          var triggers = context.querySelectorAll("*[menu].aria-menu");

          if (triggers.length)
            $A.import(["Animate", "Menu"], {
              name: "StraylightMenu",
              defer: true,
              props: $A.extend(props, {
                triggers: triggers
              }),
              call: function(props) {
                $A.loop(
                  props.triggers,
                  function(i, t) {
                    if (!$A.data(t, "_BoundMenu")) {
                      $A.data(t, "_BoundMenu", true);
                      $A.setMenu(t, {
                        onActivate: function(
                          ev,
                          triggerNode,
                          RTI,
                          DC,
                          checked,
                          check,
                          isRadio
                        ) {
                          if ($A.isNum(checked)) {
                            // 'checked' reflects the current attribute value for the checkable item, and is always a number if applicable.
                            // if 0, the checked state is "false".
                            // if 1, the checked state is "true".
                            // if 2, the checked state is "mixed".
                            // The 'check' argument is a function that will set the checkable item to a new state.
                            // The new value must be a string consisting of "false", "true", or "mixed".
                            if (checked === 0 || isRadio) {
                              check("true");
                              RTI.DC.top.remove(function() {
                                alert(
                                  "The new checked state for " +
                                    triggerNode.id +
                                    " is 'true'"
                                );
                              });
                            } else if (checked === 1) {
                              check("mixed");
                              RTI.DC.top.remove(function() {
                                alert(
                                  "The new checked state for " +
                                    triggerNode.id +
                                    " is 'mixed'"
                                );
                              });
                            } else if (checked === 2) {
                              check("false");
                              RTI.DC.top.remove(function() {
                                alert(
                                  "The new checked state for " +
                                    triggerNode.id +
                                    " is 'false'"
                                );
                              });
                            }
                          } else if (
                            triggerNode.href &&
                            triggerNode.href.indexOf("https://") !== -1
                          )
                            RTI.DC.top.remove(function() {
                              location.href = triggerNode.href;
                            });
                          else
                            RTI.DC.top.remove(function() {
                              alert(triggerNode.id);
                            });
                        },
                        style: { display: "none" },
                        animate: {
                          onRender: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.slideUpIn", {
                              complete: function() {
                                complete();
                              }
                            });
                          },
                          onRemove: function(dc, wrapper, complete) {
                            Velocity(wrapper, "transition.slideUpOut", {
                              complete: function() {
                                complete();
                              }
                            });
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
          // ARIA Listboxes
          // Search and recognise native select elements with the class "aria-listbox-root"
          var lbs = context.querySelectorAll("select.aria-listbox-root");
          if (lbs.length) {
            $A.import(["Animate", "Listbox"], {
              name: "StraylightListbox",
              defer: true,
              props: $A.extend(props, {
                selects: lbs
              }),
              call: function(props) {
                $A.loop(
                  props.selects,
                  function(i, s) {
                    $A.setListbox(s, {
                      // Additional configuration options.
                    });
                  },
                  "array"
                );
              }
            });
          }
        })();
      }
    });

  $A.on(
    "load",
    function() {
      $A.straylight(document);
    },
    ".straylight"
  );
})();
