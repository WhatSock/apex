$A.import("Footnote", { defer: true }, function () {
  $A.setFootnotes('span.aria-footnote > a[href^="#"]', {
    override: {
      duration: 700,
      easing: "ease-in",
    },
  });
});
