var Asesory = {};

/* window.ready */
$(document).ready(function () {
  Asesory.bindFunctions();
});

Asesory.bindFunctions = function () {
  Asesory.openCard();
};

Asesory.openCard = function () {
  $(".asesory--card--content").on("click", function () {
    $(this).find(".asesory--card--content--title").toggleClass("open");
    $(this).find(".asesory--card--content--info").toggleClass("open-content");
    $(this).find(".asesory--card--content--info--subtitle").toggleClass("open-content-title");
  });
};
