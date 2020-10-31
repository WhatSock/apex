/*!
ARIA Dialog Module 2.0 for Apex 4X
Copyright 2020 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setDialog" in $A)) {
    $A.addWidgetTypeProfile("Dialog", {
      track: [],
      configure: function(dc) {
        var that = this,
          pos = {};
        if (dc.isModal && that.track.length) {
          var subDC = that.track[that.track.length - 1],
            zI = subDC.css("z-index") || 1000;
          pos["z-index"] = zI + 2;
        }
        return {
          style: pos,
          isModal: true,
          isAlert: false,
          exposeBounds: true,
          forceFocus: true,
          returnFocus: true,
          exposeHiddenClose: true,
          circularTabbing: true,
          preload: true,
          preloadImages: true,
          preloadCSS: true,
          className: "modal",
          root: "body",
          append: true,
          escToClose: true,
          on: "click",
          click: function(ev, dc) {
            ev.stopPropagation();
          }
        };
      },
      role: function(dc) {
        var r = {};
        r.role = dc.isAlert ? "alertdialog" : "dialog";
        r["aria-modal"] = dc.isModal ? "true" : "false";
        return r;
      },
      onRender: function(dc, container) {
        var that = this,
          isIE = $A.isIE();
        that.track.push(dc);
        if (dc.isModal) {
          $A.query("body > *", function(i, o) {
            if (o !== dc.outerNode) {
              o.inert = true;
              $A.setAttr(o, {
                "aria-hidden": "true"
              });
            }
          });
          dc.backdrop = $A(that.backdrop)
            .on({
              click: function(ev) {
                dc.remove();
                ev.stopPropagation();
              }
            })
            .css(
              $A.isNum(dc.style["z-index"]) && dc.style["z-index"] > 1
                ? {
                    zIndex: dc.style["z-index"] - 1
                  }
                : {}
            )
            .appendTo("body")
            .return();
        }
        if (dc.isAlert) $A.announce(dc.container, true, true);
      },
      onRemove: function(dc, container) {
        var that = this,
          isIE = $A.isIE();
        that.track.splice(that.track.length - 1, 1);
        if (dc.isModal && $A.isDOMNode(dc.backdrop, null, null, 11))
          $A.remove(dc.backdrop);
        if (that.track.length) {
          if (dc.isModal) {
            $A.query("body > *", function(i, o) {
              if (o !== that.track[that.track.length - 1].outerNode) {
                o.inert = true;
                $A.setAttr(o, {
                  "aria-hidden": "true"
                });
              } else {
                o.inert = false;
                $A.remAttr(o, ["aria-hidden"]);
              }
            });
          }
          dc.rerouteFocus = that.track[that.track.length - 1];
        } else {
          if (dc.isModal) {
            $A.query("body > *", function(i, o) {
              o.inert = false;
              $A.remAttr(o, ["aria-hidden"]);
            });
          }
        }
      },
      backdrop: '<div class="modalBackdrop"></div>'
    });

    $A.extend({
      setDialog: function(o, config) {
        if (this._4X) {
          config = o;
          o = this._X;
        }

        if ($A.isPlainObject(o)) {
          config = o;
          o = config.trigger || null;
        }
        if (!o) return null;

        var dcArray = [];
        $A.query(o, function(i, o) {
          dcArray.push(
            $A(o).toDC(
              $A.extend(
                {
                  widgetType: "Dialog"
                },
                config || {}
              )
            )
          );
        });

        return dcArray.length === 1 ? dcArray[0] : dcArray;
      }
    });
  }
})();
