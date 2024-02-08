var AddNewsletter = {};
AddNewsletter.imagesForLoad = [];
AddNewsletter.videoURL = "";
AddNewsletter.tags = "";
AddNewsletter.author = false;
AddNewsletter.active = true;

/* window.ready */
$(document).ready(function () {
  const pathArray = window.location.pathname.split("/");
  let path = pathArray[2] + "/" + pathArray[3];
  if (path == "news/add") {
    AddNewsletter.bindFunctions();
  }
});

AddNewsletter.bindFunctions = function () {
  AddNewsletter.setValues();
  AddNewsletter.loadImages();
  AddNewsletter.sendData();
};

AddNewsletter.setValues = function () {
  /* SET NEWSLETTER AUTHOR */
  $(".btn-news-1").on("click", function () {
    $(this).toggleClass("toggle-btn-active");
    $(this).toggleClass("toggle-btn-inactive");
    AddNewsletter.author = !AddNewsletter.author;
  });
  /* SET NEWSLETTER ACTIVE */
  $(".btn-news-2").on("click", function () {
    $(this).toggleClass("toggle-btn-inactive");
    $(this).toggleClass("toggle-btn-active");
    AddNewsletter.active = !AddNewsletter.active;
  });

  /* SET NEWSLETTER VIDEO URL */
  $("#news-video-btn").on("click", function () {
    const regEx =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    const url = $("#news-video-url").val();
    if (url !== "") {
      if (regEx.test(url)) {
        let urlId = url.split("https://youtu.be/")[1];
        AddNewsletter.videoURL = urlId;
        $("#news-video-btn > p").replaceWith("<p>Agregado!</p>");
      } else {
        AdminNavbar.showErrorMessage(
          "El formato del link no es el correcto -> https://youtu.be/5uA7sIPluo0"
        );
      }
    }
  });
};

AddNewsletter.sendData = function () {
  /* GET NEW PROPERTY */
  $(".news-submit").on("click", function () {
    const newNewsletter = AddNewsletter.createForm();
    if (newNewsletter !== undefined) {
      const formData = new FormData();

      formData.append("newsletterTitle", newNewsletter.news.name);
      formData.append("newsletterDescription", newNewsletter.news.description);
      formData.append("newsletterAuthor", newNewsletter.news.author);
      formData.append("newsletterActive", newNewsletter.news.active);
      newNewsletter.news.imagePrincipal.forEach((img, i) => {
        formData.append("newsletterImagePrincipal", img);
      });
      newNewsletter.news.imageSub.forEach((img, i) => {
        formData.append("newsletterImageSub", img);
      });
      newNewsletter.news.imageText.forEach((img, i) => {
        formData.append("newsletterImageText", img);
      });
      formData.append("newsletterVideoURL", newNewsletter.news.url);
      if (newNewsletter.news.sub1name) {
        formData.append("newsletterSubName1", newNewsletter.news.sub1name);
        formData.append(
          "newsletterSubDescription1",
          newNewsletter.news.sub1description
        );
      }
      if (newNewsletter.news.sub2name) {
        formData.append("newsletterSubName2", newNewsletter.news.sub2name);
        formData.append(
          "newsletterSubDescription2",
          newNewsletter.news.sub2description
        );
      }
      if (newNewsletter.news.sub3name) {
        formData.append("newsletterSubName3", newNewsletter.news.sub3name);
        formData.append(
          "newsletterSubDescription3",
          newNewsletter.news.sub3description
        );
      }

      // console.log(newNewsletter, formData);

      AdminNavbar.showLoading();

      $.ajax({
        type: "POST",
        url: "/admin/news/add",
        data: formData,
        processData: false, // tell jQuery not to process the data
        contentType: false, // tell jQuery not to set contentType
        success: function (res) {
          // console.log(res);
          if (res.status == "ok") {
            // console.log(res.message);
            window.location.href = res.redirectURL;
          }
        },
        error: function (err) {
          AdminNavbar.hiddenLoading();
          const { msg } = err.responseJSON;
          alert(msg);
        },
      });
    }
  });
};

AddNewsletter.createForm = function () {
  const form = {};
  form.news = {};

  /* SET NEWSLETTER NAME */
  form.news.name = $("#news-name").val();
  if (form.news.name == undefined || form.news.name == "") {
    return alert("Debes introducir el nombre del nuevo post.");
  }

  /* SET NEWSLETTER DESCRIPTION */
  form.news.description = $("#property-description").val();
  if (form.news.description == undefined || form.news.description == "") {
    return alert("Debes introducir una descripción del nuevo post.");
  }

  /* SET NEWSLETTER IMAGES */
  form.news.author = AddNewsletter.author;

  /* SET NEWSLETTER IMAGES */
  form.news.active = AddNewsletter.active;

  /* SET NEWSLETTER IMAGES */
  form.news.imagePrincipal = AddNewsletter.imagesForLoad.principal;

  /* SET NEWSLETTER IMAGES */
  form.news.imageText = AddNewsletter.imagesForLoad.textImage;

  /* SET NEWSLETTER IMAGES */
  form.news.imageSub = AddNewsletter.imagesForLoad.subImage;

  /* SET VIDEO URL */
  form.news.url = AddNewsletter.videoURL;

  /* SET NEWSLETTER SUB 1 NAME */
  if ($("#news-sub1").val() !== "") {
    form.news.sub1name = $("#news-sub1").val();
  }

  /* SET NEWSLETTER SUB 1 DESCRIPTION */
  if ($("#news-sub1-description").val() !== "") {
    form.news.sub1description = $("#news-sub1-description").val();
  }

  /* SET NEWSLETTER SUB 2 NAME */
  if ($("#news-sub2").val() !== "") {
    form.news.sub2name = $("#news-sub2").val();
  }

  /* SET NEWSLETTER SUB 2 DESCRIPTION */
  if ($("#news-sub2-description").val() !== "") {
    form.news.sub2description = $("#news-sub2-description").val();
  }

  /* SET NEWSLETTER SUB 3 NAME */
  if ($("#news-sub3").val() !== "") {
    form.news.sub3name = $("#news-sub3").val();
  }

  /* SET NEWSLETTER SUB 3 DESCRIPTION */
  if ($("#news-sub3-description").val() !== "") {
    form.news.sub3description = $("#news-sub3-description").val();
  }

  return form;
};

AddNewsletter.loadImages = function () {
  /* ADD NEWSLETTER IMAGE PRINCIPAL */
  AddNewsletter.imagesForLoad.principal = [];
  AddNewsletter.imagesForLoad.textImage = [];
  AddNewsletter.imagesForLoad.subImage = [];
  $("body").on("change", "#news_principal__img-btn", function () {
    AddNewsletter.imagesForLoad.principal.push(this.files[0]);
    // console.log("upload");
    $(".add_news_image_principal").replaceWith(
      `<div class="news--img-container"><img class="new-newsletter--image" src="${URL.createObjectURL(
        this.files[0]
      )}"</img><div class="news--img-delete-btn area-color" data-name="${
        this.files[0].name
      }" data-type="principal">${this.files[0].name}</div></div>`
    );
  });

  /* ADD NEWSLETTER IMAGE TEXT */
  $("body").on("change", "#news_text__img-btn", function () {
    AddNewsletter.imagesForLoad.textImage.push(this.files[0]);
    // console.log("upload");
    $(".add_news_image_text").replaceWith(
      `<div class="news--img-container"><img class="new-newsletter--image" src="${URL.createObjectURL(
        this.files[0]
      )}"</img><div class="news--img-delete-btn area-color" data-name="${
        this.files[0].name
      }" data-type="text">${this.files[0].name}</div></div>`
    );
  });

  /* ADD NEWSLETTER IMAGE SUB */
  $("body").on("change", "#news_sub__img-btn", function () {
    AddNewsletter.imagesForLoad.subImage.push(this.files[0]);
    // console.log("upload");
    $(".add_news_image_sub").replaceWith(
      `<div class="news--img-container"><img class="new-newsletter--image" src="${URL.createObjectURL(
        this.files[0]
      )}"</img><div class="news--img-delete-btn area-color" data-name="${
        this.files[0].name
      }" data-type="sub">${this.files[0].name}</div></div>`
    );
  });

  /* DELETE SELECTED IMG */
  $("body").on("click", ".news--img-delete-btn", function () {
    // console.log("click");
    let name = $(this).data("name");
    let type = $(this).data("type");

    // console.log(name, type);

    if (type === "principal") {
      AddNewsletter.imagesForLoad.principal =
        AddNewsletter.imagesForLoad.principal.filter(
          (prop) => prop.name !== name
        );
      $(this).parent().remove();
      $(".news__principal__image > .add__images_container").html(
        `<div class="add_news_image_principal">
            <div class="add-image">
            <p>Cargar</p>
            <input id="news_principal__img-btn" type="file">
            </div>
          </div>`
      );
      // console.log(AddNewsletter.imagesForLoad.principal);
    }
    if (type === "text") {
      AddNewsletter.imagesForLoad.textImage =
        AddNewsletter.imagesForLoad.textImage.filter(
          (prop) => prop.name !== name
        );
      $(this).parent().remove();
      $(".text > .add__images_container").html(
        `<div class="add_news_image_text">
              <div class="add-image">
              <p>Cargar</p>
              <input id="news_text__img-btn" type="file">
              </div>
            </div>`
      );
      // console.log(AddNewsletter.imagesForLoad.textImage);
    }
    if (type === "sub") {
      AddNewsletter.imagesForLoad.subImage =
        AddNewsletter.imagesForLoad.subImage.filter(
          (prop) => prop.name !== name
        );
      $(this).parent().remove();
      $(".sub > .add__images_container").html(
        `<div class="add_news_image_sub">
              <div class="add-image">
              <p>Cargar</p>
              <input id="news_sub__img-btn" type="file">
              </div>
            </div>`
      );
      // console.log(AddNewsletter.imagesForLoad.subImage);
    }
  });
};
