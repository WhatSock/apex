/*@license
ARIA Combobox Module 3.2 for Apex 4X
Author: Bryan Garaventa (https://www.linkedin.com/in/bgaraventa)
Home: WhatSock.com  :  Download: https://github.com/whatsock/apex
License: MIT (https://opensource.org/licenses/MIT)

Required dependencies: SmoothScroll.js, AccName.js
*/

(function() {
  if (!("Combobox" in $A)) {
    $A.import(["SmoothScroll", "AccName"], {
      name: "ComboboxModule",
      props: props,
      once: true,
      call: function(props) {
        $A.extend({
          Combobox: function(config) {
            var sel = config.select || false,
              combobox = config.input || false,
              accName =
                ($A.isFn(window.getAccName) &&
                  window.getAccName(config.input).name) ||
                "",
              child = config.childNode || false;

            if (!sel || !combobox) return null;

            var isInput =
              ["input", "textarea"].indexOf(combobox.nodeName.toLowerCase()) !==
              -1;

            if (!isInput && !child) return null;

            $A.setAttr(combobox, {
              role: "combobox",
              "aria-expanded": "false",
              "aria-autocomplete": "list",
              "aria-haspopup": "listbox"
            });

            var baseId = $A.genId(),
              that = this,
              start = false;

            if (!combobox.id) combobox.id = baseId;

            var options = {
              id: baseId,
              role: "List",
              returnFocus: false,
              exposeBounds: true,
              exposeHiddenClose: true,
              delay: config.delay || 1000,
              style: config.style,
              animate: config.animate,
              hiddenCloseName: "Close Popup",
              displayHiddenClose: false,
              className: "toplevel-div clearfix",
              middleClass: "middle-div clearfix",
              listboxClass: "listbox clearfix",
              optionClass: "option clearfix",
              activeClass: "active",
              toggleClassName: "pressed",
              triggerNode: combobox,
              widgetType: "Combobox",
              autoCloseSameWidget: true,
              cb: {
                selected: [],
                select: function(dc, o, select) {
                  if (!$A.isNode(o) || !o.id) {
                    $A.remAttr(dc.triggerNode, [
                      "aria-activedescendant",
                      "aria-controls"
                    ]);
                    dc.cb.activeDescendant = false;
                    return;
                  }

                  $A.remAttr(dc.cb.selected, "aria-selected");
                  $A.remClass(dc.cb.selected, dc.activeClass);
                  dc.cb.selected = [];
                  if (select) {
                    $A.setAttr(dc.triggerNode, "aria-activedescendant", o.id);
                    dc.cb.activeDescendant = true;
                    $A.setAttr(o, "aria-selected", "true");
                    $A.addClass(o, dc.activeClass);
                    dc.cb.selected.push(o);
                    that.scrollIntoView(o, dc.scrollCallback, dc);
                  } else {
                    $A.remAttr(dc.triggerNode, [
                      "aria-activedescendant",
                      "aria-controls"
                    ]);
                    dc.cb.activeDescendant = false;
                  }
                },
                key: "",
                charMin: 0,
                baseId: baseId,
                baseInc: 1,
                options: {},
                optionNodes: [],
                size: 0,
                readonly: false,
                multiple: false,
                checked: false,
                multipleDivider: function(values) {
                  return values.join("");
                },
                required: false,
                parentTag: config.parentTag || "ul",
                childTag: config.childTag || "li",
                names: [],
                values: [],
                matches: [],
                value: "",
                showAll: false,
                substringMatch: false,
                wordMatch: false,
                autoComplete: false,
                currentOption: null,
                activeDescendant: false,
                sIndex: -1,
                clicked: false,
                mClicked: false,
                isInput: isInput,
                setDefault: true,
                bound: false,
                fn: {
                  update: function() {
                    var dc = this.dc;
                    that.close();
                    dc.cb.options = {};
                    dc.cb.currentOption = null;
                    dc.cb.names = [];
                    dc.cb.values = [];
                    dc.cb.readonly = dc.cb.isInput
                      ? combobox.readOnly
                        ? true
                        : false
                      : true;
                    dc.cb.required = dc.cb.isInput
                      ? combobox.required
                        ? true
                        : false
                      : $A.getAttr(dc.triggerNode, "aria-required") === "true"
                      ? true
                      : false;
                    dc.cb.multiple = $A.getAttr(dc.cb.sel, "multiple")
                      ? true
                      : false;
                    dc.cb.optionNodes = $A.query("option", dc.cb.sel);

                    if (dc.cb.readonly) {
                      dc.cb.substringMatch = dc.cb.wordMatch = false;
                    }

                    for (var i = 0; i < dc.cb.optionNodes.length; i++) {
                      dc.cb.baseInc++;

                      var name = $A
                          .trim($A.getText(dc.cb.optionNodes[i]))
                          .replace(/<|>/g, ""),
                        oId = dc.cb.baseId + dc.cb.baseInc,
                        o =
                          "<" +
                          dc.cb.childTag +
                          ' role="option" tabindex="-1" id="' +
                          oId +
                          '" data-value="' +
                          dc.cb.optionNodes[i].value +
                          '" class="' +
                          dc.optionClass +
                          '" ';
                      if (dc.cb.multiple) o += 'aria-checked="false" ';
                      o +=
                        "><a><span>" +
                        name +
                        "</span></a></" +
                        dc.cb.childTag +
                        ">";

                      dc.cb.options[dc.cb.optionNodes[i].value] = {
                        content: o,
                        id: oId,
                        so: dc.cb.optionNodes[i],
                        checked: dc.cb.optionNodes[i].selected,
                        no: name,
                        v: dc.cb.optionNodes[i].value,
                        i: i
                      };

                      dc.cb.names.push(name);
                      dc.cb.values.push(dc.cb.optionNodes[i].value);
                    }

                    dc.cb.sel.selectedIndex =
                      dc.cb.sel.selectedIndex >= 0
                        ? dc.cb.sel.selectedIndex
                        : 0;

                    if (!dc.cb.multiple)
                      dc.cb.fn.setValue(
                        dc.cb.options[
                          dc.cb.optionNodes[dc.cb.sel.selectedIndex].value
                        ],
                        true
                      );
                    else {
                      dc.cb.autoComplete = true;
                      dc.cb.fn.setValue(false, true);
                    }

                    if (dc.cb.required && dc.cb.isInput)
                      $A.setAttr(dc.triggerNode, {
                        "aria-required": "true"
                      });
                  },
                  render: function(pass, scroll, noRecheck) {
                    var dc = this.dc;

                    if (dc.cb.multiple && !noRecheck) {
                      for (var value in dc.cb.options) {
                        var option = dc.cb.options[value];
                        $A.setAttr(
                          option.o,
                          "aria-checked",
                          option.checked ? "true" : "false"
                        );
                      } // End for loop
                    }

                    if (dc.cb.readonly) {
                      var pShowAll = dc.cb.showAll;
                      dc.cb.showAll = true;
                    }

                    if (!dc.cb.readonly && !dc.cb.showAll && !dc.cb.value) {
                      dc.cb.showAll = pShowAll;
                      return true;
                    }

                    if (!scroll) {
                      dc.cb.sIndex = dc.cb.sel.selectedIndex;
                      dc.cb.matches = [];
                      if (dc.loaded) {
                        that.close(function() {
                          that.open(true);
                        });
                        return dc;
                      }
                    }

                    if (scroll && dc.cb.key) {
                      var v = dc.cb.key.toLowerCase(),
                        fd = false,
                        oI = dc.cb.sIndex;
                      dc.cb.sIndex++;

                      for (var i = dc.cb.sIndex; i < dc.cb.names.length; i++) {
                        if ($A.inArray(v, dc.cb.names[i].toLowerCase()) === 0) {
                          fd = true;
                          dc.cb.sIndex = i;
                          break;
                        }
                      }

                      if (!fd) {
                        dc.cb.sIndex = 0;

                        for (var i = dc.cb.sIndex; i < oI; i++) {
                          if (
                            $A.inArray(v, dc.cb.names[i].toLowerCase()) === 0
                          ) {
                            fd = true;
                            dc.cb.sIndex = i;
                            break;
                          }
                        }
                      }

                      if (!fd) dc.cb.sIndex = oI;
                      else {
                        if (!dc.cb.multiple) {
                          dc.cb.currentOption =
                            dc.cb.options[dc.cb.values[dc.cb.sIndex]];
                          dc.cb.value = dc.cb.currentOption.no;
                        } else {
                          dc.cb.currentOption = [];
                          dc.cb.currentOption[0] =
                            dc.cb.options[dc.cb.values[dc.cb.sIndex]];
                          dc.cb.value = dc.cb.currentOption[0].no;
                        }

                        if (!dc.cb.multiple) {
                          dc.cb.select(dc, dc.cb.currentOption.o, true);
                        } else {
                          dc.cb.select(dc, dc.cb.currentOption[0].o, true);
                        }
                      }
                    } else {
                      if (pass || dc.cb.showAll || dc.cb.readonly) {
                        dc.cb.matches = dc.cb.values;
                      } else {
                        for (var i = 0; i < dc.cb.names.length; i++) {
                          if (dc.cb.wordMatch) {
                            var vA = $A
                                .trim(dc.cb.value)
                                .toLowerCase()
                                .split(" "),
                              nA = $A
                                .trim(dc.cb.names[i])
                                .toLowerCase()
                                .split(" "),
                              vx = 0,
                              nx = 0;

                            for (var z = 0; z < vA.length; z++) {
                              for (var y = 0; y < nA.length; y++) {
                                if (
                                  $A.trim(vA[z]) &&
                                  $A.trim(nA[y]) &&
                                  $A.inArray($A.trim(vA[z]), $A.trim(nA[y])) !==
                                    -1 &&
                                  $A.trim(vA[z]).length ===
                                    $A.trim(nA[y]).length
                                ) {
                                  nx++;
                                  break;
                                }
                              }
                              vx++;
                            }

                            if (vx && nx && vx <= nx) {
                              dc.cb.matches.push(dc.cb.values[i]);
                            }
                          } else if (
                            (!dc.cb.wordMatch &&
                              !dc.cb.substringMatch &&
                              $A.inArray(
                                dc.cb.value.toLowerCase(),
                                dc.cb.names[i].toLowerCase()
                              ) === 0) ||
                            (!dc.cb.wordMatch &&
                              dc.cb.substringMatch &&
                              $A.inArray(
                                dc.cb.value.toLowerCase(),
                                dc.cb.names[i].toLowerCase()
                              ) !== -1)
                          )
                            dc.cb.matches.push(dc.cb.values[i]);
                        }
                      }

                      if (!dc.cb.matches.length) return true;

                      if (dc.cb.readonly)
                        dc.cb.sIndex = dc.cb.sel.selectedIndex;
                      else dc.cb.sIndex = 0;

                      if (dc.cb.readonly) {
                        dc.cb.showAll = pShowAll;
                        dc.cb.currentObject =
                          dc.cb.options[dc.cb.matches[dc.cb.sIndex]];
                      }
                    }
                    return false;
                  },
                  setAltTrigger: function(o) {
                    if (!o || o.nodeType !== 1) return;
                    var dc = this.dc;

                    $A.setAttr(o, {
                      role: "button",
                      "aria-expanded": "false"
                    });

                    $A.setAttr(o, {
                      "aria-label":
                        ($A.isFn(window.getAccName) &&
                          window.getAccName(dc.triggerNode).name) ||
                        $A.getText(dc.triggerNode)
                    });

                    dc.cb.altClicked = false;

                    $A.off(o, "click");

                    $A.on(o, "click", function(ev) {
                      if (!dc.cb.altClicked) {
                        dc.cb.altClicked = true;

                        if (!dc.loaded) {
                          that.open();
                        } else {
                          if (dc.cb.multiple && dc.cb.mClicked) {
                            dc.cb.fn.setValue(false, false, true);
                            dc.cb.mClicked = false;
                          }
                          that.close();
                        }
                        dc.triggerNode.focus();
                        setTimeout(function() {
                          dc.cb.altClicked = false;
                        }, 300);
                      }
                      ev.stopPropagation();
                      ev.preventDefault();
                    });
                    dc.cb.altTrigger = o;
                  },
                  setValue: function(option, pass, manual) {
                    var dc = this.dc;

                    if (option && !dc.cb.multiple) {
                      dc.cb.value = option.no;
                      dc.cb.currentOption = option;

                      if (!pass) option.so.selected = true;

                      if (
                        !pass &&
                        dc.cb.fn.onSelect &&
                        $A.isFn(dc.cb.fn.onSelect)
                      ) {
                        var nv = dc.cb.fn.onSelect.apply(dc.triggerNode, [
                          option.no,
                          option.v,
                          dc.triggerNode,
                          dc.cb.sel
                        ]);

                        if (nv || $A.isStr(nv)) dc.cb.value = nv;
                      } else if (dc.cb.isInput) {
                        if (manual || dc.cb.setDefault)
                          dc.triggerNode.value = dc.cb.value;
                      } else {
                        if (manual || dc.cb.setDefault) {
                          dc.cb.child.innerHTML = dc.cb.value;
                        }
                      }
                    } else if (!option && dc.cb.multiple) {
                      var soNodes = [];

                      if (pass) {
                        soNodes = $A.query("option[selected]", dc.cb.sel);

                        for (var i = 0; i < soNodes.length; i++) {
                          dc.cb.options[soNodes[i].value].checked = true;
                        }
                      }

                      dc.cb.currentOption = [];
                      dc.cb.value = "";
                      var vals = [];

                      for (var value in dc.cb.options) {
                        var option = dc.cb.options[value];

                        if (!pass) {
                          option.checked =
                            $A.getAttr(option.o, "aria-checked") === "true"
                              ? true
                              : false;
                          option.so.selected = option.checked
                            ? "selected"
                            : false;
                        }

                        if (option.checked) {
                          dc.cb.currentOption.push(option);
                          soNodes.push(option.so);
                          vals.push(option.no);
                        }
                      } // End for loop

                      dc.cb.value = dc.cb.multipleDivider(vals);

                      if (
                        !pass &&
                        dc.cb.fn.onSelect &&
                        $A.isFn(dc.cb.fn.onSelect)
                      ) {
                        var nv = dc.cb.fn.onSelect.apply(dc.triggerNode, [
                          dc.cb.value,
                          soNodes,
                          dc.triggerNode,
                          dc.cb.sel
                        ]);

                        if (nv || $A.isStr(nv)) dc.cb.value = nv;
                      } else if (dc.cb.isInput) {
                        if (manual || dc.cb.setDefault)
                          dc.triggerNode.value = dc.cb.value;
                      } else {
                        if (manual || dc.cb.setDefault) {
                          dc.cb.child.innerHTML = dc.cb.value;
                        }
                      }
                    }

                    dc.cb.pValue = dc.cb.value;
                  },
                  checkValue: function(v) {
                    var dc = this.dc;

                    if (!(v && v.length >= dc.cb.charMin)) return -1;

                    for (var i = 0; i < dc.cb.names.length; i++) {
                      if (
                        $A.trim(v) &&
                        $A.trim(v.toLowerCase()) ==
                          $A.trim(dc.cb.names[i].toLowerCase())
                      ) {
                        return i;
                      }
                    }
                    return -1;
                  },
                  unsetValue: function(pass) {
                    var dc = this.dc;

                    if (!pass && dc.cb.sel.selectedIndex >= 0)
                      dc.cb.optionNodes[
                        dc.cb.sel.selectedIndex
                      ].selected = false;
                    dc.cb.currentOption = null;

                    if (dc.cb.isInput) {
                      dc.cb.value = dc.triggerNode.value;
                    } else {
                      dc.cb.value = $A.getText(dc.cb.child);
                    }
                  },
                  bind: function() {
                    var dc = this.dc;

                    if (dc.cb.bound) return;

                    $A.off(dc.triggerNode, ".4XCombobox");
                    var touched = false,
                      touchDelay = null,
                      handleClick = function(ev) {
                        if (!dc.cb.altTrigger) {
                          if (!dc.loaded) {
                            that.open();
                          } else if (dc.loaded) that.close();
                        }
                      };

                    $A.on(
                      dc.triggerNode,
                      {
                        touchstart: function(ev) {
                          touched = true;
                          if (!touchDelay) handleClick.call(this, ev);
                          touchDelay = setTimeout(function() {
                            touchDelay = null;
                          }, 1000);
                        },
                        mousedown: function(ev) {
                          // if (dc.cb.isInput) handleClick.call(this, ev);
                          ev.stopPropagation();
                        },
                        click: function(ev) {
                          if (!dc.cb.isInput) handleClick.call(this, ev);
                          ev.stopPropagation();
                        },
                        keydown: function(ev) {
                          var e = this,
                            k = $A.keyEvent(ev);
                          ev.stopPropagation();

                          if (k === 9) {
                            if (dc.loaded) {
                              if (
                                dc.cb.autoComplete &&
                                dc.cb.activeDescendant
                              ) {
                                if (!dc.cb.multiple)
                                  dc.cb.fn.setValue(
                                    dc.cb.options[dc.cb.matches[dc.cb.sIndex]],
                                    false,
                                    true
                                  );
                                else dc.cb.fn.setValue(false, false, true);
                              }
                              that.close();
                            }
                          } else if (
                            (k === 13 || k === 32) &&
                            !dc.cb.isInput &&
                            !dc.cb.activeDescendant &&
                            !dc.loaded
                          ) {
                            that.open();
                            ev.preventDefault();
                          } else if (
                            !dc.cb.multiple &&
                            (k === 13 || k === 32) &&
                            dc.cb.activeDescendant &&
                            dc.loaded
                          ) {
                            dc.cb.fn.setValue(
                              dc.cb.options[dc.cb.matches[dc.cb.sIndex]],
                              false,
                              true
                            );
                            that.close();
                            announceVal();
                            ev.preventDefault();
                          } else if (
                            dc.cb.multiple &&
                            k === 13 &&
                            dc.cb.activeDescendant &&
                            dc.loaded
                          ) {
                            dc.cb.fn.setValue(false, false, true);
                            that.close();
                            announceVal();

                            ev.preventDefault();
                          } else if (
                            dc.cb.multiple &&
                            k === 32 &&
                            dc.cb.activeDescendant &&
                            dc.loaded
                          ) {
                            $A.setAttr(
                              dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o,
                              "aria-checked",
                              $A.getAttr(
                                dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o,
                                "aria-checked"
                              ) === "true"
                                ? "false"
                                : "true"
                            );
                            if (dc.cb.autoSaveIfChecked) {
                              dc.cb.fn.setValue(false, false, true);
                            }
                            ev.preventDefault();
                          } else if (k === 38 || k === 40) {
                            ev.preventDefault();
                          } else if (
                            dc.cb.readonly &&
                            ((k >= 48 && k <= 57) || (k >= 65 && k <= 90))
                          ) {
                            dc.cb.key += String.fromCharCode(k);
                            dc.cb.fn.render(false, true, true);

                            if (dc.cb.keyReset) clearTimeout(dc.cb.keyReset);
                            dc.cb.keyReset = setTimeout(function() {
                              dc.cb.key = "";
                            }, 1500);
                          }
                        },
                        keyup: function(ev) {
                          var e = this,
                            k = $A.keyEvent(ev);

                          if (dc.cb.showAllIfEmpty && e.value) {
                            dc.cb.showAll = dc.fn.showAll;
                          }

                          if (
                            dc.cb.readonly &&
                            dc.loaded &&
                            (k === 37 || k === 39)
                          ) {
                            ev.preventDefault();
                          } else if (
                            k === 40 &&
                            !dc.cb.activeDescendant &&
                            !dc.loaded &&
                            !e.value &&
                            dc.cb.showAllIfEmpty
                          ) {
                            dc.cb.showAll = true;
                            dc.cb.sIndex =
                              (dc.cb.readonly || dc.cb.showAll) &&
                              dc.cb.sel.selectedIndex >= 0
                                ? dc.cb.sel.selectedIndex
                                : 0;
                            if (!$A.isNum(dc.cb.sIndex)) dc.cb.sIndex = 0;
                            that.open();
                            ev.preventDefault();
                          } else if (
                            k === 40 &&
                            !dc.cb.activeDescendant &&
                            !dc.loaded &&
                            dc.cb.readonly
                          ) {
                            dc.cb.sIndex =
                              (dc.cb.readonly || dc.cb.showAll) &&
                              dc.cb.sel.selectedIndex >= 0
                                ? dc.cb.sel.selectedIndex
                                : 0;
                            if (!$A.isNum(dc.cb.sIndex)) dc.cb.sIndex = 0;
                            that.open();
                            ev.preventDefault();
                          } else if (
                            k === 40 &&
                            !dc.cb.activeDescendant &&
                            dc.loaded
                          ) {
                            dc.cb.sIndex =
                              dc.cb.readonly &&
                              dc.cb.showAll &&
                              dc.cb.sel.selectedIndex >= 0
                                ? dc.cb.sel.selectedIndex
                                : 0;
                            dc.cb.select(
                              dc,
                              dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o,
                              true
                            );
                            ev.preventDefault();
                          } else if (
                            k === 40 &&
                            dc.cb.activeDescendant &&
                            dc.loaded
                          ) {
                            if (dc.cb.sIndex < dc.cb.matches.length - 1)
                              dc.cb.sIndex++;
                            else dc.cb.sIndex = 0;
                            dc.cb.select(
                              dc,
                              dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o,
                              true
                            );
                            ev.preventDefault();
                          } else if (
                            ev.altKey &&
                            k === 38 &&
                            dc.cb.activeDescendant &&
                            dc.loaded
                          ) {
                            if (!dc.cb.multiple)
                              dc.cb.fn.setValue(
                                dc.cb.options[dc.cb.matches[dc.cb.sIndex]],
                                false,
                                true
                              );
                            else dc.cb.fn.setValue(false, false, true);
                            that.close();
                            announceVal();

                            ev.preventDefault();
                          } else if (
                            k === 38 &&
                            dc.cb.activeDescendant &&
                            dc.loaded
                          ) {
                            if (dc.cb.sIndex > 0) dc.cb.sIndex--;
                            else dc.cb.sIndex = dc.cb.matches.length - 1;
                            dc.cb.select(
                              dc,
                              dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o,
                              true
                            );
                            ev.preventDefault();
                          } else if (k === 27 || k === 37 || k === 39) {
                            dc.cb.select(dc);

                            if (k === 27) that.close();
                          } else if (!dc.cb.readonly && k !== 9) {
                            if (dc.cb.isInput) dc.cb.value = e.value;
                            var x = dc.cb.fn.checkValue(dc.cb.value);

                            if (dc.cb.value && x !== -1) {
                              var option = dc.cb.options[dc.cb.values[x]];

                              if (!dc.cb.multiple) dc.cb.currentOption = option;
                              else {
                                dc.cb.currentOption = [];
                                dc.cb.currentOption[0] = option;
                              }
                              option.so.selected = true;
                              that.close();
                            } else {
                              if (
                                dc.cb.value &&
                                dc.cb.value.length >= dc.cb.charMin
                              ) {
                                var skp =
                                  dc.cb.isInput && !dc.cb.readonly
                                    ? true
                                    : false;

                                if (skp) {
                                  if (
                                    !dc.cb.pValue ||
                                    dc.cb.pValue !== combobox.value
                                  ) {
                                    dc.cb.pValue = combobox.value;
                                    skp = false;
                                  }
                                }

                                if (!skp) {
                                  dc.cb.fn.render();
                                  that.open(true);
                                }
                              } else if (!(dc.cb.multiple && k === 32)) {
                                that.close();
                              }
                            }
                          }
                        },
                        focus: function(ev) {},
                        blur: function(ev) {
                          if (!touched && !dc.cb.multiple) {
                            setTimeout(function() {
                              if (!dc.cb.altClicked) {
                                if (dc.loaded) {
                                  if (
                                    dc.cb.autoComplete &&
                                    dc.cb.activeDescendant &&
                                    !dc.cb.clicked
                                  )
                                    dc.cb.fn.setValue(
                                      dc.cb.options[
                                        dc.cb.matches[dc.cb.sIndex]
                                      ],
                                      false,
                                      true
                                    );
                                  that.close();
                                }
                                dc.cb.clicked = false;
                              }
                            }, 150);
                          }
                        }
                      },
                      null,
                      ".4XCombobox"
                    );
                    dc.cb.bound = true;
                  },
                  set: function() {
                    var dc = this.dc;
                    dc.cb.select(dc);
                    $A.setAttr(dc.triggerNode, {
                      "aria-expanded": "false"
                    });

                    if (!dc.cb.isInput) {
                      dc.cb.baseInc++;

                      if (!dc.cb.child.id)
                        $A.setAttr(dc.cb.child, {
                          tabindex: "-1",
                          id: dc.cb.baseId + dc.cb.baseInc
                        });

                      $A.addIdRef(
                        dc.triggerNode,
                        "aria-labelledby",
                        dc.cb.child.id
                      );
                    }
                  },
                  onSelect: null,
                  onOpen: null,
                  onClose: null,
                  onTriggerChange: null,
                  setSize: function() {
                    var dc = this.dc,
                      s =
                        (dc.cb.size || 5) <= dc.cb.matches.length
                          ? dc.cb.size || 5
                          : dc.cb.matches.length,
                      o = dc.cb.options[dc.cb.matches[0]].o,
                      h = $A.elementHeight(o);
                    h +=
                      parseInt($A.css(o, "margin-top"), 10) +
                      parseInt($A.css(o, "margin-bottom"), 10);
                    h =
                      s * h +
                      (parseInt($A.css(dc.content, "padding-top"), 10) +
                        parseInt($A.css(dc.content, "padding-bottom"), 10));
                    $A.css(dc.content, "height", h);
                  }
                }
              },
              click: function(ev, dc) {
                ev.stopPropagation();
              },
              beforeRender: function(dc) {
                if (!dc.cb.matches.length) return (dc.cancel = true);
                dc.fn.matches = dc.cb.matches;
                dc.cb.baseInc++;
                dc.content = that.listboxNode = $A.create(
                  dc.cb.parentTag,
                  {
                    role: "listbox",
                    "aria-label": accName,
                    id: dc.cb.baseId + dc.cb.baseInc
                  },
                  null,
                  dc.listboxClass
                );

                for (var i = 0; i < dc.cb.matches.length; i++) {
                  dc.cb.options[dc.cb.matches[i]].o = $A.toNode(
                    dc.cb.options[dc.cb.matches[i]].content,
                    true
                  );
                  dc.content.appendChild(dc.cb.options[dc.cb.matches[i]].o);
                }
              },
              duringRender: function(dc) {
                $A.addClass(dc.container, dc.middleClass);
              },
              afterRender: function(dc) {
                $A.setAttr(that.combobox, "aria-controls", that.listboxNode.id);
                if (dc.cb.matches !== dc.fn.matches) {
                  dc.beforeRender(dc);
                  dc.insert(dc.content);
                }
                $A.query(dc.cb.matches, function(i, v) {
                  $A.off(dc.cb.options[v].o, "click");

                  $A.on(dc.cb.options[v].o, {
                    click: function(ev) {
                      if (!dc.cb.multiple) {
                        dc.cb.fn.setValue(dc.cb.options[v], false, true);
                        dc.cb.clicked = true;
                        that.close();
                        announceVal();
                      } else {
                        var o = dc.cb.options[v].o;

                        if (o)
                          $A.setAttr(
                            o,
                            "aria-checked",
                            $A.getAttr(o, "aria-checked") === "true"
                              ? "false"
                              : "true"
                          );
                        dc.cb.mClicked = true;
                      }

                      ev.preventDefault();
                    },
                    focus: function(ev) {}
                  });
                });

                if (!(dc.cb.sIndex >= 0)) dc.cb.sIndex = 0;

                if (dc.cb.readonly) {
                  dc.cb.select(
                    dc,
                    dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o,
                    true
                  );
                }

                dc.cb.fn.setSize();

                setTimeout(function() {
                  $A.announce(
                    dc.cb.options[dc.cb.matches[dc.cb.sIndex]].no,
                    true
                  );
                }, 1);

                $A.setAttr(dc.triggerNode, "aria-expanded", "true");

                if (dc.cb.altTrigger && dc.cb.altTrigger.nodeType === 1) {
                  $A.addClass(dc.cb.altTrigger, dc.toggleClassName);
                  $A.setAttr(dc.cb.altTrigger, "aria-expanded", "true");

                  if (
                    dc.cb.fn.onTriggerChange &&
                    $A.isFn(dc.cb.fn.onTriggerChange)
                  )
                    dc.cb.fn.onTriggerChange.apply(dc.cb.altTrigger, [
                      dc.cb.altTrigger,
                      dc.loaded
                    ]);
                }

                if (dc.cb.fn.onOpen && $A.isFn(dc.cb.fn.onOpen))
                  dc.cb.fn.onOpen.apply(dc.triggerNode, [dc]);
              },
              beforeRemove: function(dc) {
                if (dc.loaded) {
                  if (dc.cb.multiple && dc.cb.mClicked) {
                    dc.cb.fn.setValue(false, false, true);
                  }
                }
              },
              afterRemove: function(dc) {
                dc.cb.mClicked = false;
                dc.cb.select(dc);
                $A.setAttr(dc.triggerNode, {
                  "aria-expanded": "false"
                });

                if (dc.cb.altTrigger && dc.cb.altTrigger.nodeType === 1) {
                  $A.remClass(dc.cb.altTrigger, dc.toggleClassName);

                  $A.setAttr(dc.cb.altTrigger, {
                    "aria-expanded": "false"
                  });

                  if (
                    dc.cb.fn.onTriggerChange &&
                    $A.isFn(dc.cb.fn.onTriggerChange)
                  )
                    dc.cb.fn.onTriggerChange.apply(dc.cb.altTrigger, [
                      dc.cb.altTrigger,
                      dc.loaded
                    ]);
                }

                if (dc.cb.fn.onClose && $A.isFn(dc.cb.fn.onClose))
                  dc.cb.fn.onClose.apply(dc.triggerNode, [dc]);
              },
              onCreate: function(dc) {
                that.combobox = dc.triggerNode;
                that.select = dc.cb.sel;
              },
              scrollConfig: config.scrollConfig || {}
            };
            $A.extend(options, config.override || {});

            var dc = $A([options])[0];

            dc.cb.dc = dc.cb.fn.dc = that.dc = dc;
            dc.cb.sel = sel;
            dc.cb.child = child;

            var announceVal = function() {
              if (!(dc.cb.fn.onSelect && $A.isFn(dc.cb.fn.onSelect))) {
                setTimeout(function() {
                  if (!dc.cb.multiple || dc.cb.isInput) {
                    $A.announce(dc.cb.value.toString(), false, true);
                  } else if (dc.cb.child) {
                    $A.announce(dc.cb.child, false, true);
                  }
                }, 150);
              }
            };

            that.setCharMin = function(v) {
              if ($A.isNum(v) && v >= 0) dc.cb.charMin = v;
            };

            that.setShowAll = function(v) {
              dc.cb.showAll = dc.fn.showAll = v ? true : false;
            };

            that.setShowAllIfEmpty = function(v) {
              dc.cb.showAllIfEmpty = v ? true : false;
            };

            that.setAutoSaveIfChecked = function(v) {
              dc.cb.autoSaveIfChecked = v ? true : false;
            };

            that.setSubstringMatch = function(v) {
              dc.cb.substringMatch = v ? true : false;
            };

            that.setWordMatch = function(v) {
              dc.cb.wordMatch = v ? true : false;
            };

            that.setTags = function(o) {
              if (o.parentTag) dc.cb.parentTag = o.parentTag;

              if (o.childTag) dc.cb.childTag = o.childTag;
            };

            that.setOffset = function(o) {
              if (!isNaN(o.left)) dc.offsetLeft = o.left;

              if (!isNaN(o.top)) dc.offsetTop = o.top;
            };

            that.setAutoComplete = function(v) {
              dc.cb.autoComplete = v ? true : false;
            };

            that.close = function(f) {
              dc.remove(f);
            };

            that.open = function(passive) {
              if (dc.loaded) return;

              if (start) {
                dc.cb.fn.render();

                dc.render(function() {
                  if (!passive) {
                    dc.cb.select(
                      dc,
                      dc.cb.options[dc.cb.matches[dc.cb.sIndex]].o,
                      true
                    );
                  }
                });
              }
            };

            that.setAltTrigger = function(o) {
              dc.cb.fn.setAltTrigger(o);
            };

            that.setAutoPosition = function(n) {
              if (!isNaN(n) && n < 10) dc.autoPosition = n;
            };

            that.setSize = function(n) {
              if (!isNaN(n) && n > 0) dc.cb.size = n;
            };

            that.setPosAnchor = function(o) {
              dc.posAnchor = o;
            };

            that.setTargetNode = function(o) {
              dc.targetNode = o;
            };

            that.setClassNames = function(o) {
              if (o.toplevelClass) dc.className = o.toplevelClass;

              if (o.middleClass) dc.middleClass = o.middleClass;

              if (o.listboxClass) dc.listboxClass = o.listboxClass;

              if (o.optionClass) dc.optionClass = o.optionClass;

              if (o.activeClass) dc.activeClass = o.activeClass;

              if (o.toggleClass) dc.toggleClassName = o.toggleClass;
            };

            that.setDefault = function(v) {
              dc.cb.setDefault = v ? true : false;
            };

            that.setMultipleDivider = function(fn) {
              if (fn && $A.isFn(fn)) dc.cb.multipleDivider = fn;
            };

            that.clearAll = function() {
              that.close();

              for (var value in dc.cb.options) {
                var option = dc.cb.options[value];
                option.so.selected = false;
                option.checked = false;
                $A.setAttr(option.o, "aria-checked", "false");
              } // End for loop

              if (dc.cb.isInput) dc.triggerNode.value = "";
              else if (dc.cb.child) {
                if (!dc.cb.multiple) $A.empty(dc.cb.child);
                else dc.cb.fn.setValue(false, true);
              }
            };

            that.update = function() {
              dc.cb.fn.update();
            };

            that.start = function() {
              start = true;
              dc.cb.fn.bind();
              dc.cb.fn.update();

              if (
                document.activeElement === combobox &&
                (dc.cb.readonly || dc.cb.value)
              ) {
                that.open();
              }
            };

            that.stop = function() {
              start = false;
              that.close();
            };

            that.onSelect = function(fn) {
              if (fn && $A.isFn(fn)) dc.cb.fn.onSelect = fn;
            };

            that.onOpen = function(fn) {
              if (fn && $A.isFn(fn)) dc.cb.fn.onOpen = fn;
            };

            that.onClose = function(fn) {
              if (fn && $A.isFn(fn)) dc.cb.fn.onClose = fn;
            };

            that.onTriggerChange = function(fn) {
              if (fn && $A.isFn(fn)) dc.cb.fn.onTriggerChange = fn;
            };

            that.setPromptText = function(s) {
              $A.setAttr(combobox, "aria-description", s);
            };

            that.setCloseText = function(s) {
              if (!s) {
                dc.exposeHiddenClose = false;
              } else {
                dc.exposeHiddenClose = true;
                dc.hiddenCloseName = s;
              }
            };

            that.scrollIntoView = function(o, cb, dc) {
              $A.scrollTo(
                o,
                $A.extend(
                  {
                    duration: 100,
                    container: that.listboxNode,
                    complete: function() {
                      if ($A.isFn(cb)) cb.call(o, o);
                    }
                  },
                  dc.scrollConfig || {}
                )
              );
            };

            that.getValue = function() {
              if (!dc.cb.multiple) return dc.cb.sel.value;
              else {
                var r = [];

                for (var value in dc.cb.options) {
                  var option = dc.cb.options[value];

                  if (option.checked && option.so.selected) r.push(option.so);
                } // End for loop
                return r;
              }
            };

            $A.on(window, "resize." + baseId, function() {
              if (dc && dc.loaded) {
                dc.setPosition();
                dc.cb.fn.setSize();
              }
            });

            $A(combobox).on("remove", function(mutation, node) {
              $A.off(window, "." + baseId);
            });

            if (!dc.cb.isInput && !$A.getAttr(dc.triggerNode, "tabindex"))
              $A.setAttr(dc.triggerNode, "tabindex", "0");

            dc.cb.fn.set();

            $A.remAttr(dc.triggerNode, ["data-controls"]);

            return that;
          }
        });
      }
    });
  }
})();
