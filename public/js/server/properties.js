var Properties = {};

/* window.ready */
$(document).ready(function () {
  Properties.bindFunctions();
});

Properties.bindFunctions = function () {
  Properties.activeInactiveProperty();
  Properties.deleteSelectedProperty();
  Properties.setHighlightProperty();
};

Properties.activeInactiveProperty = function () {
  /* get data of element selected */
  $(".property").on("click", function () {
    const activeValue = $(this).data("active");
    const idProperty = $(this).data("id");

    const data = { id: idProperty, active: !activeValue };
    AdminNavbar.showLoading();

    $.ajax({
      type: "POST",
      url: "/admin/properties",
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

Properties.deleteSelectedProperty = function () {
  $(".property-delete").on("click", function () {
    const idProperty = $(this).data("id");

    const data = { id: idProperty };

    if (confirm("Seguro que desea eliminar esta propiedad?")) {
      AdminNavbar.showLoading();
      $.ajax({
        type: "DELETE",
        url: "/admin/properties",
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

Properties.setHighlightProperty = function () {
  $(".property-highlight-edit").on("click", function () {
    const isHighlight = $(this).data("highlight");
    const idProperty = $(this).data("id");

    const data = { id: idProperty, highlight: !isHighlight };


    $.ajax({
      type: "PATCH",
      url: "/admin/properties",
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
  })
}
