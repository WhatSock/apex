$A.import(["Animate", "Tooltip"], { defer: true }, function() {
  var helpTooltipDC = $A.setTooltip("a.aria-tooltip.helpIcon", {
    manualOpen: true
  });

  var fieldConstraintDC = $A.setTooltip('input[type="password"]', {
    onFocusOnly: true
  });
});
