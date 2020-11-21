$A.import("Footnote", { defer: true }, function() {
  $A.setFootnotes({
    footnotes: 'span.aria-footnote > a[href^="#"]',
    override: {
      duration: 550,
      easing: "ease-in"
    }
  });
});
