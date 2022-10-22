$A.import("Slider", { defer: true }, function () {
  var ariaSlider = new $A.Slider(".slider.bar", {
    label: "Set Offset",
    valueMin: -10,
    valueMax: 10,
    valueNow: 0,
    valueChange: function (val, min, max, sliderInstance) {
      $A.get("value").innerHTML = val;
      return val; // Must return a textual representation of the current value to ensure accessibility for screen reader users.
    },
  });
});
