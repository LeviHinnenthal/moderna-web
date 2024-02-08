var Newsletter = {};

/* window.ready */
$(document).ready(function () {
  Newsletter.bindFunctions();
});

Newsletter.bindFunctions = function () {
  Newsletter.activeInactiveNewsletter();
  Newsletter.deleteSelectedNewsletter();
};

Newsletter.activeInactiveNewsletter = function () {
  /* get data of element selected */
  $(".newsletter").on("click", function () {
    const activeValue = $(this).data("active");
    const idNewsletter = $(this).data("id");

    const data = { id: idNewsletter, active: !activeValue };
    AdminNavbar.showLoading();

    $.ajax({
      type: "POST",
      url: "/admin/news",
      data: data,
      success: function (res) {
        if (res.status == "ok") {
          window.location.href = res.redirectURL;
        }
      },
      error: function (err) {
        const { msg } = err.responseJSON;
        alert(msg);
      },
    });
  });
};

Newsletter.deleteSelectedNewsletter = function () {
  $(".newsletter-delete").on("click", function () {
    const idNewsletter = $(this).data("id");

    const data = { id: idNewsletter };

    if (confirm("Seguro que desea eliminar este post?")) {
      AdminNavbar.showLoading();
      $.ajax({
        type: "DELETE",
        url: "/admin/news",
        data: data,
        success: function (res) {
          if (res.status == "ok") {
            window.location.href = res.redirectURL;
          }
        },
        error: function (err) {
          const { msg } = err.responseJSON;
          alert(msg);
        },
      });
    }
  });
};
