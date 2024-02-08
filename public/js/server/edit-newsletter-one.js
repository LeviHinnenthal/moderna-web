var EditPost = {};
EditPost.editionsToSend = {};

/* window.ready */
$(document).ready(function () {
  const pathArray = window.location.pathname.split("/");
  let path = pathArray[2] + "/" + pathArray[3];
  if (path == "news/edit") {
    EditPost.editionsToSend.show_author = $(".btn-news-1-edit").data("author");
    EditPost.editionsToSend.is_active = $(".btn-news-2-edit").data("active");
    EditPost.bindFunctions();
  }
});

EditPost.bindFunctions = function () {
  EditPost.deleteImage();
  EditPost.getAndSendData();
};

EditPost.deleteImage = function () {
  /* DELETE SELECTED IMG */
  $("body").on("click", ".news--img-delete-btn--edit", function () {
    let url = $(this).data("name");
    let type = $(this).data("type");
    let id = $(this).data("id");

    if (confirm("Seguro que desea eliminar esta imágen?")) {
      AdminNavbar.showLoading();
      $(this)
        .parent()
        .parent()
        .append(
          ` <div class="add-image">
                <p>No se cargó imágen</p>
            </div>
            `
        );
      $(this).parent().remove();

      const formData = new FormData();
      formData.append("url", url);
      formData.append("type", type);
      formData.append("id", id);

      $.ajax({
        type: "POST",
        url: "/admin/newsletter-image/delete",
        data: formData,
        processData: false, // tell jQuery not to process the data
        contentType: false, // tell jQuery not to set contentType
        success: function (res) {
          if (res.status == "ok") {
            AdminNavbar.hiddenLoading();
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

EditPost.getAndSendData = function () {
  /* SET NEWSLETTER AUTHOR */
  $("body").on("click", ".btn-news-1-edit", function () {
    $(this).toggleClass("toggle-btn-active");
    $(this).toggleClass("toggle-btn-inactive");
    EditPost.editionsToSend.show_author = !EditPost.editionsToSend.show_author;
  });
  /* SET NEWSLETTER ACTIVE */
  $(".btn-news-2-edit").on("click", function () {
    $(this).toggleClass("toggle-btn-inactive");
    $(this).toggleClass("toggle-btn-active");
    EditPost.editionsToSend.is_active = !EditPost.editionsToSend.is_active;
  });
  /* SET NEWSLETTER TITLE */
  $("#news-name").on("keyup", function () {
    EditPost.editionsToSend.title = $(this).val();
  });
  /* SET NEWSLETTER DESCRIPTION */
  $("#property-description").on("keyup", function () {
    EditPost.editionsToSend.description = $(this).val();
  });
  /* SET NEWSLETTER SUB1 NAME */
  $("#news-sub1").on("keyup", function () {
    EditPost.editionsToSend.sub_name1 = $(this).val();
  });
  /* SET NEWSLETTER SUB1 DESCRIPTION */
  $("#news-sub1-description").on("keyup", function () {
    EditPost.editionsToSend.sub_description1 = $(this).val();
  });
  /* SET NEWSLETTER SUB2 NAME */
  $("#news-sub2").on("keyup", function () {
    EditPost.editionsToSend.sub_name2 = $(this).val();
  });
  /* SET NEWSLETTER SUB2 DESCRIPTION */
  $("#news-sub2-description").on("keyup", function () {
    EditPost.editionsToSend.sub_description2 = $(this).val();
  });
  /* SET NEWSLETTER SUB3 NAME */
  $("#news-sub3").on("keyup", function () {
    EditPost.editionsToSend.sub_name3 = $(this).val();
  });
  /* SET NEWSLETTER SUB3 DESCRIPTION */
  $("#news-sub3-description").on("keyup", function () {
    EditPost.editionsToSend.sub_description3 = $(this).val();
  });
  /* SET NEWSLETTER VIDEO URL */
  $("#news-video-btn").on("click", function () {
    const regEx =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    const url = $("#news-video-url").val();
    if (url !== "") {
      if (regEx.test(url)) {
        let urlId = url.split("https://youtu.be/")[1];
        EditPost.editionsToSend.video_url = urlId;
        $("#news-video-btn > p").replaceWith("<p>Agregado!</p>");
      } else {
        AdminNavbar.showErrorMessage(
          "El formato del link no es el correcto -> https://youtu.be/5uA7sIPluo0"
        );
      }
    }
  });

  /* SUBMIT DATA */
  $(".news-submit-edit").on("click", function () {
    AdminNavbar.showLoading();

    /* SEND DATA */
    const formData = new FormData();
    for (const data in EditPost.editionsToSend) {
      //   console.log(data, ":", EditPost.editionsToSend[data]);
      formData.append(data, EditPost.editionsToSend[data]);
    }
    const pathArray = window.location.pathname.split("/");
    formData.append("id", pathArray[4]);

    $.ajax({
      type: "POST",
      url: "/admin/newsletter/edit",
      data: formData,
      processData: false, // tell jQuery not to process the data
      contentType: false, // tell jQuery not to set contentType
      success: function (res) {
        if (res.status == "ok") {
          AdminNavbar.hiddenLoading();
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
