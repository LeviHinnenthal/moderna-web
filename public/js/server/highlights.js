var Highlights = {};
Highlights.imagesForLoad = [];

/* window.ready */
$(document).ready(function () {
  Highlights.bindFunctions();
});

Highlights.bindFunctions = function () {
  Highlights.loadImages();
  Highlights.activeInactive();
  Highlights.sendData();
  Highlights.deleteImage();
};

Highlights.activeInactive = function () {
  /* ACTIVE/INACTIVE BANNER */
  $(".bannerActive").on("click", function () {
    // console.log("click");
    const bannerId = $(this).data("id");
    const activeValue = $(this).data("active");

    const data = { id: bannerId, active: !activeValue };

    // console.log(data);

    AdminNavbar.showLoading();

    $.ajax({
      type: "PATCH",
      url: "/admin/highlights",
      data: data,
      success: function (res) {
        if (res.status == "ok") {
          // AdminNavbar.hiddenLoading();
          window.location.href = res.redirectURL;
        }
      },
      error: function (err) {
        AdminNavbar.hiddenLoading();
        const { msg } = err.responseJSON;
        alert(msg);
      },
    });
  });
};

Highlights.loadImages = function () {
  Highlights.imagesForLoad.desktop = [];
  Highlights.imagesForLoad.mobile = [];
  /* ADD HIGHLIGHTS IMAGE DESKTOP */
  $("#desktop__img-btn").on("change", function () {
    Highlights.imagesForLoad.desktop.push(this.files[0]);
    // console.log("upload");
    $(".desktop").append(
      `<div class="new-desktop--img-container"><img class="new__image" src="${URL.createObjectURL(
        this.files[0]
      )}"</img><div class="new-img-delete-btn" data-name="${
        this.files[0].name
      }" data-type="desktop">${this.files[0].name}</div></div>`
    );
  });
  /* ADD HIGHLIGHTS IMAGE MOBILE */
  $("#mobile__img-btn").on("change", function () {
    Highlights.imagesForLoad.mobile.push(this.files[0]);
    // console.log("upload");
    $(".mobile").append(
      `<div class="new-desktop--img-container"><img class="new__image" src="${URL.createObjectURL(
        this.files[0]
      )}"</img><div class="new-img-delete-btn" data-name="${
        this.files[0].name
      }" data-type="mobile">${this.files[0].name}</div></div>`
    );
  });
  /* DELETE SELECTED IMG */
  $("body").on("click", ".new-img-delete-btn", function () {
    // console.log("click");
    let name = $(this).data("name");
    let type = $(this).data("type");

    // console.log(name, type);

    if (type === "desktop") {
      Highlights.imagesForLoad.desktop =
        Highlights.imagesForLoad.desktop.filter((prop) => prop.name !== name);
      $(this).parent().remove();
      // console.log(Highlights.imagesForLoad.desktop);
    }
    if (type === "mobile") {
      Highlights.imagesForLoad.desktop =
        Highlights.imagesForLoad.desktop.filter((prop) => prop.name !== name);
      $(this).parent().remove();
      // console.log(Highlights.imagesForLoad.desktop);
    }
  });
};

Highlights.createForm = function () {
  const form = {};
  form.banners = {};

  /* SET HIGHLIGHTS DESKTOP IMG */
  form.banners.desktop = Highlights.imagesForLoad.desktop;
  /* SET HIGHLIGHTS MOBILE IMG */
  form.banners.mobile = Highlights.imagesForLoad.mobile;

  return form;
};

Highlights.sendData = function () {
  $(".banners-submit").on("click", function () {
    const highlightsData = Highlights.createForm();
    if (highlightsData !== undefined) {
      const formData = new FormData();

      highlightsData.banners.desktop.forEach((img, i) => {
        formData.append("bannerDesktop" + i, img);
      });
      highlightsData.banners.mobile.forEach((img, i) => {
        formData.append("bannerMobile" + i, img);
      });
      // console.log(highlightsData, formData);
      AdminNavbar.showLoading();

      /* SEND DATA TO SERVER */
      $.ajax({
        type: "POST",
        url: "/admin/highlights",
        data: formData,
        processData: false, // tell jQuery not to process the data
        contentType: false, // tell jQuery not to set contentType
        success: function (res) {
          if (res.status == "ok") {
            // AdminNavbar.hiddenLoading();
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

Highlights.deleteImage = function () {
  $(".banner__delete").on("click", function () {
    const id = $(this).data("id");

    // console.log(id);

    const data = { id: id };
    AdminNavbar.showLoading()

    $.ajax({
      type: "DELETE",
      url: "/admin/highlights",
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
