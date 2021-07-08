$A.import("Slider", { defer: true }, function() {
  var select = $A.get("#syncSelect"),
    options = select.querySelectorAll("option");

  var ariaSlider = new $A.Slider(".slider.bar", {
    label: "Set Appointment Time",
    valueMin: 0,
    valueMax: 23,
    valueNow: 9,
    valueChange: function(val, min, max, sliderInstance) {
      var option = options[val];
      option.selected = true;
      return $A.text(option); // Must return a textual representation of the current value to ensure accessibility for screen reader users.
    }
  });

  $A(select).on("change blur", function(ev) {
    var selectedIndex = (function() {
      for (var i = 0; i < options.length; i++) {
        if (options[i].selected) return i;
      }
    })();
    ariaSlider.setValue(selectedIndex);
  });
});
