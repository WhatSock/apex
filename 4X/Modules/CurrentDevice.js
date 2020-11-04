/*!
 * current-device v0.10.1 - https://github.com/matthewhudson/current-device
 * MIT Licensed
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["device"] = factory();
  else root["device"] = factory();
})(window, function() {
  return /******/ (function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      } // Create a new module (and put it into the cache)
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {}
        /******/
      }); // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ); // Flag the module as loaded
      /******/
      /******/ /******/ module.l = true; // Return the exports of the module
      /******/
      /******/ /******/ return module.exports;
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules; // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter
        });
        /******/
      }
      /******/
    }; // define __esModule on exports
    /******/
    /******/ /******/ __webpack_require__.r = function(exports) {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module"
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
    /******/
    /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
      value,
      mode
    ) {
      /******/ if (mode & 1) value = __webpack_require__(value);
      /******/ if (mode & 8) return value;
      /******/ if (
        mode & 4 &&
        typeof value === "object" &&
        value &&
        value.__esModule
      )
        return value;
      /******/ var ns = Object.create(null);
      /******/ __webpack_require__.r(ns);
      /******/ Object.defineProperty(ns, "default", {
        enumerable: true,
        value: value
      });
      /******/ if (mode & 2 && typeof value !== "string")
        for (var key in value)
          __webpack_require__.d(
            ns,
            key,
            function(key) {
              return value[key];
            }.bind(null, key)
          );
      /******/ return ns;
      /******/
    }; // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function(module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module["default"];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, "a", getter);
      /******/ return getter;
      /******/
    }; // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }; // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
    /******/
    /******/
    /******/ /******/ return __webpack_require__((__webpack_require__.s = 0));
    /******/
  })(
    /************************************************************************/
    /******/ [
      /* 0 */
      /***/ function(module, exports, __webpack_require__) {
        module.exports = __webpack_require__(1);

        /***/
      },
      /* 1 */
      /***/ function(module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);
        var _typeof =
          typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
            ? function(obj) {
                return typeof obj;
              }
            : function(obj) {
                return obj &&
                  typeof Symbol === "function" &&
                  obj.constructor === Symbol &&
                  obj !== Symbol.prototype
                  ? "symbol"
                  : typeof obj;
              };

        // Save the previous value of the device variable.
        var previousDevice = window.device;

        var device = {};

        var changeOrientationList = [];

        // Add device as a global object.
        window.device = device;

        // The <html> element.
        var documentElement = window.document.documentElement;

        // The client user agent string.
        // Lowercase, so we can use the more efficient indexOf(), instead of Regex
        var userAgent = window.navigator.userAgent.toLowerCase();

        // Detectable television devices.
        var television = [
          "googletv",
          "viera",
          "smarttv",
          "internet.tv",
          "netcast",
          "nettv",
          "appletv",
          "boxee",
          "kylo",
          "roku",
          "dlnadoc",
          "pov_tv",
          "hbbtv",
          "ce-html"
        ];

        // Main functions
        // --------------

        device.macos = function() {
          return find("mac");
        };

        device.ios = function() {
          return device.iphone() || device.ipod() || device.ipad();
        };

        device.iphone = function() {
          return !device.windows() && find("iphone");
        };

        device.ipod = function() {
          return find("ipod");
        };

        device.ipad = function() {
          var iPadOS13Up =
            navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
          return find("ipad") || iPadOS13Up;
        };

        device.android = function() {
          return !device.windows() && find("android");
        };

        device.androidPhone = function() {
          return device.android() && find("mobile");
        };

        device.androidTablet = function() {
          return device.android() && !find("mobile");
        };

        device.blackberry = function() {
          return find("blackberry") || find("bb10");
        };

        device.blackberryPhone = function() {
          return device.blackberry() && !find("tablet");
        };

        device.blackberryTablet = function() {
          return device.blackberry() && find("tablet");
        };

        device.windows = function() {
          return find("windows");
        };

        device.windowsPhone = function() {
          return device.windows() && find("phone");
        };

        device.windowsTablet = function() {
          return device.windows() && find("touch") && !device.windowsPhone();
        };

        device.fxos = function() {
          return (find("(mobile") || find("(tablet")) && find(" rv:");
        };

        device.fxosPhone = function() {
          return device.fxos() && find("mobile");
        };

        device.fxosTablet = function() {
          return device.fxos() && find("tablet");
        };

        device.meego = function() {
          return find("meego");
        };

        device.cordova = function() {
          return window.cordova && location.protocol === "file:";
        };

        device.nodeWebkit = function() {
          return _typeof(window.process) === "object";
        };

        device.mobile = function() {
          return (
            device.androidPhone() ||
            device.iphone() ||
            device.ipod() ||
            device.windowsPhone() ||
            device.blackberryPhone() ||
            device.fxosPhone() ||
            device.meego()
          );
        };

        device.tablet = function() {
          return (
            device.ipad() ||
            device.androidTablet() ||
            device.blackberryTablet() ||
            device.windowsTablet() ||
            device.fxosTablet()
          );
        };

        device.desktop = function() {
          return !device.tablet() && !device.mobile();
        };

        device.television = function() {
          var i = 0;
          while (i < television.length) {
            if (find(television[i])) {
              return true;
            }
            i++;
          }
          return false;
        };

        device.portrait = function() {
          if (
            screen.orientation &&
            Object.prototype.hasOwnProperty.call(window, "onorientationchange")
          ) {
            return includes(screen.orientation.type, "portrait");
          }
          if (
            device.ios() &&
            Object.prototype.hasOwnProperty.call(window, "orientation")
          ) {
            return Math.abs(window.orientation) !== 90;
          }
          return window.innerHeight / window.innerWidth > 1;
        };

        device.landscape = function() {
          if (
            screen.orientation &&
            Object.prototype.hasOwnProperty.call(window, "onorientationchange")
          ) {
            return includes(screen.orientation.type, "landscape");
          }
          if (
            device.ios() &&
            Object.prototype.hasOwnProperty.call(window, "orientation")
          ) {
            return Math.abs(window.orientation) === 90;
          }
          return window.innerHeight / window.innerWidth < 1;
        };

        // Public Utility Functions
        // ------------------------

        // Run device.js in noConflict mode,
        // returning the device variable to its previous owner.
        device.noConflict = function() {
          window.device = previousDevice;
          return this;
        };

        // Private Utility Functions
        // -------------------------

        // Check if element exists
        function includes(haystack, needle) {
          return haystack.indexOf(needle) !== -1;
        }

        // Simple UA string search
        function find(needle) {
          return includes(userAgent, needle);
        }

        // Check if documentElement already has a given class.
        function hasClass(className) {
          return documentElement.className.match(new RegExp(className, "i"));
        }

        // Add one or more CSS classes to the <html> element.
        function addClass(className) {
          var currentClassNames = null;
          if (!hasClass(className)) {
            currentClassNames = documentElement.className.replace(
              /^\s+|\s+$/g,
              ""
            );
            documentElement.className = currentClassNames + " " + className;
          }
        }

        // Remove single CSS class from the <html> element.
        function removeClass(className) {
          if (hasClass(className)) {
            documentElement.className = documentElement.className.replace(
              " " + className,
              ""
            );
          }
        }

        // HTML Element Handling
        // ---------------------

        // Insert the appropriate CSS class based on the _user_agent.

        if (device.ios()) {
          if (device.ipad()) {
            addClass("ios ipad tablet");
          } else if (device.iphone()) {
            addClass("ios iphone mobile");
          } else if (device.ipod()) {
            addClass("ios ipod mobile");
          }
        } else if (device.macos()) {
          addClass("macos desktop");
        } else if (device.android()) {
          if (device.androidTablet()) {
            addClass("android tablet");
          } else {
            addClass("android mobile");
          }
        } else if (device.blackberry()) {
          if (device.blackberryTablet()) {
            addClass("blackberry tablet");
          } else {
            addClass("blackberry mobile");
          }
        } else if (device.windows()) {
          if (device.windowsTablet()) {
            addClass("windows tablet");
          } else if (device.windowsPhone()) {
            addClass("windows mobile");
          } else {
            addClass("windows desktop");
          }
        } else if (device.fxos()) {
          if (device.fxosTablet()) {
            addClass("fxos tablet");
          } else {
            addClass("fxos mobile");
          }
        } else if (device.meego()) {
          addClass("meego mobile");
        } else if (device.nodeWebkit()) {
          addClass("node-webkit");
        } else if (device.television()) {
          addClass("television");
        } else if (device.desktop()) {
          addClass("desktop");
        }

        if (device.cordova()) {
          addClass("cordova");
        }

        // Orientation Handling
        // --------------------

        // Handle device orientation changes.
        function handleOrientation() {
          if (device.landscape()) {
            removeClass("portrait");
            addClass("landscape");
            walkOnChangeOrientationList("landscape");
          } else {
            removeClass("landscape");
            addClass("portrait");
            walkOnChangeOrientationList("portrait");
          }
          setOrientationCache();
        }

        function walkOnChangeOrientationList(newOrientation) {
          for (var index = 0; index < changeOrientationList.length; index++) {
            changeOrientationList[index](newOrientation);
          }
        }

        device.onChangeOrientation = function(cb) {
          if (typeof cb === "function") {
            changeOrientationList.push(cb);
          }
        };

        // Detect whether device supports orientationchange event,
        // otherwise fall back to the resize event.
        var orientationEvent = "resize";
        if (
          Object.prototype.hasOwnProperty.call(window, "onorientationchange")
        ) {
          orientationEvent = "orientationchange";
        }

        // Listen for changes in orientation.
        if (window.addEventListener) {
          window.addEventListener(orientationEvent, handleOrientation, false);
        } else if (window.attachEvent) {
          window.attachEvent(orientationEvent, handleOrientation);
        } else {
          window[orientationEvent] = handleOrientation;
        }

        handleOrientation();

        // Public functions to get the current value of type, os, or orientation
        // ---------------------------------------------------------------------

        function findMatch(arr) {
          for (var i = 0; i < arr.length; i++) {
            if (device[arr[i]]()) {
              return arr[i];
            }
          }
          return "unknown";
        }

        device.type = findMatch(["mobile", "tablet", "desktop"]);
        device.os = findMatch([
          "ios",
          "iphone",
          "ipad",
          "ipod",
          "android",
          "blackberry",
          "macos",
          "windows",
          "fxos",
          "meego",
          "television"
        ]);

        function setOrientationCache() {
          device.orientation = findMatch(["portrait", "landscape"]);
        }

        setOrientationCache();

        /* harmony default export */ __webpack_exports__["default"] = device;

        /***/
      }
      /******/
    ]
  )["default"];
});
