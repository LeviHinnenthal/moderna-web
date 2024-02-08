var NavBar = {};

$(document).ready(function () {
  NavBar.bindFunctions();
});

NavBar.bindFunctions = function () {
  NavBar.openClose();
  NavBar.popupActions();
  NavBar.searchByCode();
};

NavBar.popupActions = function () {
  NavBar.hiddenErrorMessage();
  NavBar.hiddenDoneMessage();
};

NavBar.openClose = function () {
  $("body").on("click", "#btn--container", function () {
    $("#btn").toggleClass("btn-open");
    $("#navbar").toggleClass("navbar-open");
    $("#links").toggleClass("active");
  });
};

NavBar.showErrorMessage = function (msg) {
  $("#error__message").text(msg);
  $("#popup-error").css({ visibility: "visible" });
  $("#popup-error").parent().css({ visibility: "visible" });
};

NavBar.hiddenErrorMessage = function () {
  $("#popup-error > .popup__button").on("click", function () {
    $(this).parent().css({ visibility: "hidden" });
    $(this).parent().parent().css({ visibility: "hidden" });
  });
};

NavBar.showDoneMessage = function () {
  $("#popup-done").css({ visibility: "visible" });
  $("#popup-done").parent().css({ visibility: "visible" });
};

NavBar.hiddenDoneMessage = function () {
  $("#popup-done > .popup__button").on("click", function () {
    $(this).parent().css({ visibility: "hidden" });
    $(this).parent().parent().css({ visibility: "hidden" });
    location.reload();
  });
};

NavBar.showLoading = function () {
  $("#popup-loading").css({ visibility: "visible" });
  $("#popup-loading").parent().css({ visibility: "visible" });
};

NavBar.hiddenLoading = function () {
  $("#popup-loading").css({ visibility: "hidden" });
  $("#popup-loading").parent().css({ visibility: "hidden" });
};

NavBar.searchByCode = function () {
  // Web
  $("#navbar-search").bind("input", async function () {
    const val = $(this).val();
    const searchBarContainer = $(".navbar-search");
    const filteredProperties = [];
    const listHtml = $("<ul>", { class: "navbar-search-list" });
    const getProperties = localStorage.getItem("properties");

    if (searchBarContainer.find(".navbar-search-list").length > 0) {
      $(".navbar-search-list").remove();
    }

    if (val.length > 0 && val !== " ") {
      JSON.parse(getProperties).forEach((el) => {
        if (el.code.includes(val)) {
          filteredProperties.push(el);
        }
      });

      if (filteredProperties.length > 0) {
        listHtml.append(
          filteredProperties.map((prop) =>
            $("<li>")
              .append(`<a href="/property/${prop.id}" class="search-item"><img src="${prop.primary_img}"
                  alt="Imagen de propiedad" /><p>${prop.name}</p></a>`)
          )
        );
      } else {
        listHtml.text("No hay resultados.");
      }

      searchBarContainer.append(listHtml);
    }
  });

  // Mobile
  $("#navbar-search-mobile").bind("input", async function () {
    const val = $(this).val();
    const searchBarContainer = $(".navbar-search-mobile");
    const filteredProperties = [];
    const getProperties = localStorage.getItem("properties");
    const listHtml = $("<ul>", { class: "navbar-search-list" });
    if (searchBarContainer.find(".navbar-search-list").length > 0) {
      $(".navbar-search-list").remove();
    }

    if (val.length > 0 && val !== " ") {
      JSON.parse(getProperties).forEach((el) => {
        if (el.code.includes(val)) {
          filteredProperties.push(el);
        }
      });

      if (filteredProperties.length > 0) {
        listHtml.append(
          filteredProperties.map((prop) =>
            $("<li>")
              .append(`<a href="/property/${prop.id}" class="search-item"><img src="${prop.primary_img}"
                  alt="Imagen de propiedad" /><p>${prop.name}</p></a>`)
          )
        );
      } else {
        listHtml.text("No hay resultados.");
      }

      searchBarContainer.append(listHtml);
    } else {
    }
  });

  $(document).mouseup(function (e) {
    var container = $(".navbar-search-list");

    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.hide();
    }
  });
};
