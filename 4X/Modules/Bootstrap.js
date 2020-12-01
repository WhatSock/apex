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
          // Search and recognise accordion triggering elements with the class "aria-accordion-trigger" plus a valid data-name attribute for shared control groups.
          var groups = {};
          $A.query(
            "button[data-controls][data-name].aria-accordion-trigger",
            context,
            function(i, o) {
              var groupName = $A.getAttr(o, "data-name");
              if (!groups[groupName]) groups[groupName] = [];
              if (!$A.data(o, "_isBoundAccordion")) {
                $A.data(o, "_isBoundAccordion", true);
                groups[groupName].push(o);
              }
            }
          );
          for (var n in groups) {
            $A.import(["Animate", "Accordion"], {
              name: "BootstrapAccordion",
              defer: true,
              props: $A.extend(props, {
                accordionGroup: groups[n]
              }),
              call: function(props) {
                $A.setAccordion(props.accordionGroup, {
                  isToggle: false,
                  allowMultiple: false,
                  preload: true,
                  preloadImages: true,
                  preloadCSS: true,

                  style: { display: "none" },
                  animate: {
                    onRender: function(dc, outerNode, complete) {
                      Velocity(outerNode, "transition.slideLeftIn", {
                        complete: function() {
                          complete();
                        }
                      });
                    },
                    onRemove: function(dc, outerNode, complete) {
                      Velocity(outerNode, "transition.slideLeftOut", {
                        complete: function() {
                          complete();
                        }
                      });
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
                $A.loop(
                  props.tabList,
                  function(i, list) {
                    $A.setTabList(list.querySelectorAll('*[role="tab"]'), {
                      preload: true,
                      preloadImages: true,
                      preloadCSS: true,

                      style: { display: "none" },
                      animate: {
                        onRender: function(dc, outerNode, complete) {
                          Velocity(outerNode, "transition.slideUpIn", {
                            complete: function() {
                              complete();
                            }
                          });
                        },
                        onRemove: function(dc, outerNode, complete) {
                          Velocity(outerNode, "transition.slideUpOut", {
                            complete: function() {
                              complete();
                            }
                          });
                        }
                      },
                      isToggle: false,
                      toggleClass: "active"
                    });
                  },
                  "array"
                );
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
                          onRender: function(dc, outerNode, complete) {
                            Velocity(outerNode, "transition.slideDownIn", {
                              complete: function() {
                                complete();
                              }
                            });
                          },
                          onRemove: function(dc, outerNode, complete) {
                            Velocity(outerNode, "transition.slideDownOut", {
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

        (function() {
          // ARIA Tooltips
          // Search and recognise tooltip triggering elements with the class "aria-tooltip"
          var triggers = context.querySelectorAll("*.aria-tooltip");

          if (triggers.length)
            $A.import(["Animate", "Tooltip"], {
              name: "BootstrapTooltip",
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
