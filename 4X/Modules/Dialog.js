/*!
ARIA Dialog Module 2.0 for Apex 4X
Copyright 2021 Bryan Garaventa (WhatSock.com)
https://github.com/whatsock/apex
Apex 4X is distributed under the terms of the Open Source Initiative OSI - MIT License.
*/

(function() {
  if (!("setDialog" in $A)) {
    $A.addWidgetProfile("Dialog", {
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
          forceFocusWithin: true,
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
      beforeRender: function(dc, container) {
        if (dc.isModal) {
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
      },
      afterRender: function(dc, container) {
        var that = this;
        that.track.push(dc);
        $A.hideBackground(dc.outerNode);
        dc.announce = dc.isAlert === true;
      },
      afterRemove: function(dc, container) {
        var that = this;
        that.track.splice(that.track.length - 1, 1);
        if (that.track.length) {
          if (dc.isModal)
            $A.hideBackground(that.track[that.track.length - 1].outerNode);
          dc.rerouteFocus = that.track[that.track.length - 1];
        } else {
          if (dc.isModal) $A.showBackground();
        }
        if (dc.isModal && $A.isDOMNode(dc.backdrop, null, null, 11))
          $A.remove(dc.backdrop);
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
          o = config.trigger || config.source || null;
        }

        var dcArray = [],
          toDC = function(o) {
            dcArray.push(
              $A.toDC(
                o,
                $A.extend(
                  {
                    widgetType: "Dialog"
                  },
                  config || {}
                )
              )
            );
          };

        if (o)
          $A.query(o, function(i, o) {
            toDC(o);
          });
        else toDC();

        return dcArray.length === 1 ? dcArray[0] : dcArray;
      }
    });
  }
})();
