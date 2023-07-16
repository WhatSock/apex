/*@license
ARIA Drag and Drop Module 1.0 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: Animate.js, Menu.js, Dragula.css, Dragula.js
*/

(function () {
  var debug = true;
  if (!("setDrag" in $A)) {
    $A.import(["Animate", "Menu", "Dragula.css", "Dragula"], {
      name: "DragModule",
      once: true,
      props: props,
      call: function (props) {
        $A.extend({
          setDrag: function (config) {
            config = $A.extend(
              true,
              {
                render: "append",
                sort: false,
                dragula: {
                  revertOnSpill: true,
                  invalid: function (el, handle) {
                    return false; // don't prevent any drags from initiating by default
                  },
                  accepts: function (el, target, source, sibling) {
                    if (isSort) return true;
                    return source !== target; // Prevent source from referencing itself as a drop target by default unless sortable is true.
                  },
                },
                menu: {
                  manualDrop: function (
                    dragElement,
                    target,
                    source,
                    action,
                    actionsObject,
                    nextSibling,
                  ) {
                    return false;
                  },
                  tag: {
                    render: "append",
                    button:
                      '<a aria-label="Actions" class="aria-action-menu-button">&darr;</a>',
                    menu: '<ul hidden class="drag top menu"></ul>',
                    move: '<li><a data-action="move" class="menu-action move">Move to %DROPNAME%</a></li>',
                    copy: '<li><a data-action="copy" class="menu-action copy">Copy to %DROPNAME%</a></li>',
                    up: '<li><a data-action="up" class="menu-action up">Move Up</a></li>',
                    left: '<li><a data-action="up" class="menu-action left">Move Left</a></li>',
                    down: '<li><a data-action="down" class="menu-action down">Move Down</a></li>',
                    right:
                      '<li><a data-action="down" class="menu-action right">Move Right</a></li>',
                    custom: [],
                    customActivate: null,
                    invalid: function (el, action, source, target) {
                      return false;
                    },
                  },
                },
              },
              config,
            );

            var isCopy = config.dragula.copy || false,
              isSort = config.sort || config.dragula.copySortSource || false,
              build = function (el, sourceContainer, containers) {
                if ($A.isArray(el)) {
                  $A.loop(
                    el,
                    function (i, e) {
                      build(e, sourceContainer, containers);
                    },
                    "array",
                  );
                  return;
                }
                var actions = $A.data(el, "actions");
                if (actions) {
                  $A.remove(actions.button);
                  $A.remove(actions.menu);
                  $A.destroy(actions.DC);
                }
                if (!$A.isArray(containers) || !containers.length) return;
                actions = {
                  button: $A.morph(config.menu.tag.button),
                  menu: $A.morph(config.menu.tag.menu),
                  children: [],
                  dragElement: el,
                  sourceContainer: sourceContainer,
                };
                if (isSort) {
                  var orient = $A.getOrientation(sourceContainer.children),
                    isHor =
                      orient.orientation === "horizontal" && !orient.lineWrap;
                  if ($A.previous(el)) {
                    var up = $A.morph(config.menu.tag[isHor ? "left" : "up"]);
                    actions.children.push(up);
                    actions.menu.appendChild(up);
                  }
                  if ($A.next(el)) {
                    var down = $A.morph(
                      config.menu.tag[isHor ? "right" : "down"],
                    );
                    actions.children.push(down);
                    actions.menu.appendChild(down);
                  }
                }
                $A.loop(
                  containers,
                  function (i, o) {
                    var dn = ($A.getAttr(o, "data-dropname") || "").replace(
                      /<|>/g,
                      "",
                    );
                    if (dn) {
                      var mItem = $A.morph(
                        config.menu.tag[isCopy ? "copy" : "move"].replace(
                          "%DROPNAME%",
                          dn,
                        ),
                      );
                      if (
                        config.dragula.accepts(el, o, sourceContainer) &&
                        o !== sourceContainer
                      ) {
                        $A.data(mItem, "DropContainer", o);
                        actions.children.push(mItem);
                        actions.menu.appendChild(mItem);
                      }
                    } else if (debug) {
                      throw "The drop-zone container element is missing a unique and informative data-dropname attribute.";
                    }
                  },
                  "array",
                );
                $A.loop(
                  config.menu.tag.custom,
                  function (i, m) {
                    var mItem = $A.morph(m);
                    if (
                      !config.menu.tag.invalid(
                        el,
                        $A.getAttr(mItem.firstChild, "data-action"),
                        sourceContainer,
                      )
                    ) {
                      actions.children.push(mItem);
                      actions.menu.appendChild(mItem);
                    }
                  },
                  "array",
                );
                $A[config.menu.tag.render](actions.button, el);
                $A.after(actions.menu, actions.button);
                $A(actions.button).describedBy(el);
                $A.setKBA11Y(actions.button, "button");
                $A(actions.button).on(
                  "click mousedown mouseup mousemove touchstart touchend touchmove",
                  function (ev) {
                    ev.stopPropagation();
                  },
                );
                actions.DC = $A.setMenu(
                  actions.button,
                  $A.extend(
                    true,
                    {
                      toggleHide: true,
                      onActivate: function (
                        ev,
                        triggerNode,
                        RTI,
                        boundElement,
                        checked,
                        set,
                        isRadio,
                      ) {
                        var dropContainer = $A.data(
                          triggerNode.parentNode,
                          "DropContainer",
                        );
                        RTI.DC.top.remove(function () {
                          var prevSibling = $A.previous(actions.dragElement),
                            nextSibling = $A.next(actions.dragElement),
                            next = nextSibling || sourceContainer,
                            action = $A.getAttr(triggerNode, "data-action");
                          drake.emit("beforeClone", actions.dragElement);
                          if (
                            isSort &&
                            (action === "up" || action === "down")
                          ) {
                            drake.emit(
                              "drop",
                              actions.dragElement,
                              dropContainer,
                              sourceContainer,
                              nextSibling,
                              function () {
                                if (
                                  !config.menu.manualDrop(
                                    actions.dragElement,
                                    dropContainer,
                                    sourceContainer,
                                    action,
                                    actions,
                                    next,
                                  )
                                ) {
                                  if (action === "up") {
                                    $A.before(actions.dragElement, prevSibling);
                                    drake.emit("dragend", actions.dragElement);
                                    if ($A.data(actions.dragElement, "actions"))
                                      next = $A.data(
                                        actions.dragElement,
                                        "actions",
                                      ).button;
                                    $A.focus(next);
                                  } else if (action === "down") {
                                    $A.after(actions.dragElement, nextSibling);
                                    drake.emit("dragend", actions.dragElement);
                                    if ($A.data(actions.dragElement, "actions"))
                                      next = $A.data(
                                        actions.dragElement,
                                        "actions",
                                      ).button;
                                    $A.focus(next);
                                  }
                                }
                              },
                            );
                          } else if (dropContainer) {
                            drake.emit(
                              "drop",
                              actions.dragElement,
                              dropContainer,
                              sourceContainer,
                              nextSibling,
                              function () {
                                if (
                                  !config.menu.manualDrop(
                                    actions.dragElement,
                                    dropContainer,
                                    sourceContainer,
                                    action,
                                    actions,
                                    next,
                                  )
                                )
                                  $A[config.render](
                                    isCopy
                                      ? actions.dragElement.cloneNode(true)
                                      : actions.dragElement,
                                    dropContainer,
                                  );
                                drake.emit("dragend", actions.dragElement);
                                if ($A.data(nextSibling, "actions"))
                                  next = $A.data(nextSibling, "actions").button;
                                $A.focus(next);
                              },
                            );
                          } else if ($A.isFn(config.menu.tag.customActivate)) {
                            if (
                              !config.menu.manualDrop(
                                actions.dragElement,
                                dropContainer,
                                sourceContainer,
                                action,
                                actions,
                                nextSibling,
                              )
                            )
                              config.menu.tag.customActivate(
                                ev,
                                actions.dragElement,
                                sourceContainer,
                                action,
                                actions,
                                next,
                              );
                            drake.emit("dragend", actions.dragElement);
                            if ($A.data(nextSibling, "actions"))
                              next = $A.data(nextSibling, "actions").button;
                            $A.focus(next);
                          }
                        });
                      },
                      animate: {
                        onRender: function (dc, wrapper, next) {
                          Velocity(wrapper, "transition.slideUpIn", {
                            complete: function () {
                              // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                              next();
                            },
                          });
                        },
                        onRemove: function (dc, wrapper, next) {
                          Velocity(wrapper, "transition.slideUpOut", {
                            complete: function () {
                              // Running next() is required to continue executing built-in lifecycle methods such as afterRender() when the animation completes.
                              next();
                            },
                          });
                        },
                      },
                      click: function (ev, dc) {
                        ev.stopPropagation();
                      },
                      mouseDown: function (ev, dc) {
                        ev.stopPropagation();
                      },
                      mouseUp: function (ev, dc) {
                        ev.stopPropagation();
                      },
                      mouseMove: function (ev, dc) {
                        ev.stopPropagation();
                      },
                      touchStart: function (ev, dc) {
                        ev.stopPropagation();
                      },
                      touchEnd: function (ev, dc) {
                        ev.stopPropagation();
                      },
                      touchMove: function (ev, dc) {
                        ev.stopPropagation();
                      },
                    },
                    config.menu,
                  ),
                );
                $A.data(el, "actions", actions);
              },
              drake = dragula(config.dragula)
                .on("beforeClone", function (el) {
                  build(el);
                })
                .on("drop", function (el, target, source, sibling, manual) {
                  if ($A.isFn(manual)) manual();
                })
                .on("dragend", function (el) {
                  generateMenus();
                }),
              generateMenus = function () {
                $A.loop(
                  drake.containers,
                  function (i, c) {
                    build(c.children, c, drake.containers);
                  },
                  "array",
                );
              };
            generateMenus();

            return drake;
          },
          unsetDrag: function (drake) {
            $A.loop(
              drake.containers,
              function (i, c) {
                $A.loop(
                  c.children,
                  function (i, el) {
                    var actions = $A.data(el, "actions");
                    if (actions) {
                      $A.remove(actions.button);
                      $A.remove(actions.menu);
                      $A.destroy(actions.DC);
                    }
                  },
                  "array",
                );
              },
              "array",
            );
            drake.destroy();
          },
        });
      },
    });
  }
})();
