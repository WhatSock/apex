$A.import("Carousel", { defer: true }, function () {
  var carouselDC = $A.setCarousel({
    container: ".my-slider",
    items: 1,
    slideBy: "page",
    mouseDrag: "mouseDrag",
    controlsContainer: "#controls",
    prevButton: ".previous",
    nextButton: ".next",
    responsive: {
      800: {
        items: 2,
      },
    },
  });
});
