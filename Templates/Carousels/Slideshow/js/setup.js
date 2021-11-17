$A.import("Carousel", { defer: true }, function() {
  var carouselDC = $A.setCarousel({
    container: ".my-slider",
    items: 1,
    slideBy: "page",
    mode: "gallery",
    controlsContainer: "#controls",
    prevButton: ".previous",
    nextButton: ".next"
  });
});
