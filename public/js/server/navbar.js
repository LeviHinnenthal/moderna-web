var AdminNavbar = {};

/* window.ready */
$(document).ready(function () {
  AdminNavbar.bindFunctions();
});

AdminNavbar.bindFunctions = function () {
  AdminNavbar.hideShow();
  AdminNavbar.pathLocation();
  AdminNavbar.popupActions();
};

AdminNavbar.hideShow = function () {
  $("#admin-navbar").addClass("navbar-hide");
  $(".admin-navbar--logo").addClass("navbar-logo-hide");
  $(".admin-navbar--links > li").addClass("navbar-container-link-hide");
  $(".admin-navbar--links > li > a").addClass("navbar-link-hide");
  const handleOut = () => {
    $("#admin-navbar").addClass("navbar-hide");
    $(".admin-navbar--logo").addClass("navbar-logo-hide");
    $(".admin-navbar--links > li").addClass("navbar-container-link-hide");
    $(".admin-navbar--links > li > a").addClass("navbar-link-hide");
  };
  const handleIn = () => {
    $("#admin-navbar").removeClass("navbar-hide");
    $(".admin-navbar--logo").removeClass("navbar-logo-hide");
    $(".admin-navbar--links > li").removeClass("navbar-container-link-hide");
    $(".admin-navbar--links > li > a").removeClass("navbar-link-hide");
  };

  $("#admin-navbar").hover(handleIn, handleOut);
};

AdminNavbar.pathLocation = function () {
  const path = window.location.pathname;

  if (path === "/admin/home") {
    $(".navbar-link--home").addClass("navbar-link-location");
    $(".navbar-link--home").addClass("home-location");
    $("#admin-navbar").hover(
      function () {
        $(".navbar-link--home").removeClass("navbar-link-location");
        $(".navbar-link--home").removeClass("home-location");
      },
      function () {
        $(".navbar-link--home").addClass("navbar-link-location");
        $(".navbar-link--home").addClass("home-location");
      }
    );
  }
  if (path === "/admin/news") {
    $(".navbar-link--news").addClass("navbar-link-location");
    $(".navbar-link--news").addClass("news-location");
    $("#admin-navbar").hover(
      function () {
        $(".navbar-link--news").removeClass("navbar-link-location");
        $(".navbar-link--news").removeClass("news-location");
      },
      function () {
        $(".navbar-link--news").addClass("navbar-link-location");
        $(".navbar-link--news").addClass("news-location");
      }
    );
  }
  if (path === "/admin/properties") {
    $(".navbar-link--properties").addClass("navbar-link-location");
    $(".navbar-link--properties").addClass("properties-location");
    $("#admin-navbar").hover(
      function () {
        $(".navbar-link--properties").removeClass("navbar-link-location");
        $(".navbar-link--properties").removeClass("properties-location");
      },
      function () {
        $(".navbar-link--properties").addClass("navbar-link-location");
        $(".navbar-link--properties").addClass("properties-location");
      }
    );
  }
  if (path === "/admin/highlights") {
    $(".navbar-link--highlights").addClass("navbar-link-location");
    $(".navbar-link--highlights").addClass("highlights-location");
    $("#admin-navbar").hover(
      function () {
        $(".navbar-link--highlights").removeClass("navbar-link-location");
        $(".navbar-link--highlights").removeClass("highlights-location");
      },
      function () {
        $(".navbar-link--highlights").addClass("navbar-link-location");
        $(".navbar-link--highlights").addClass("highlights-location");
      }
    );
  }
};

AdminNavbar.popupActions = function () {
  AdminNavbar.hiddenErrorMessage();
  AdminNavbar.hiddenDoneMessage();
};

AdminNavbar.openClose = function () {
  $("body").on("click", "#btn--container", function () {
    $("#btn").toggleClass("btn-open");
    $("#navbar").toggleClass("navbar-open");
    $("#links").toggleClass("active");
  });
};

AdminNavbar.showErrorMessage = function (msg) {
  $("#error__message").text(msg);
  $("#popup-error").css({ visibility: "visible" });
  $("#popup-error").parent().css({ visibility: "visible" });
};

AdminNavbar.hiddenErrorMessage = function () {
  $("#popup-error > .popup__button").on("click", function () {
    $(this).parent().css({ visibility: "hidden" });
    $(this).parent().parent().css({ visibility: "hidden" });
  });
};

AdminNavbar.showDoneMessage = function () {
  $("#popup-done").css({ visibility: "visible" });
  $("#popup-done").parent().css({ visibility: "visible" });
};

AdminNavbar.hiddenDoneMessage = function () {
  $("#popup-done > .popup__button").on("click", function () {
    $(this).parent().css({ visibility: "hidden" });
    $(this).parent().parent().css({ visibility: "hidden" });
    location.reload();
  });
};

AdminNavbar.showLoading = function () {
  $("#popup-loading").css({ visibility: "visible" });
  $("#popup-loading").parent().css({ visibility: "visible" });
};

AdminNavbar.hiddenLoading = function () {
  $("#popup-loading").css({ visibility: "hidden" });
  $("#popup-loading").parent().css({ visibility: "hidden" });
};
