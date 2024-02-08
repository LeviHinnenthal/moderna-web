let Home = {};
Home.listMobile = [];
Home.listDesktop = [];
Home.preWidth = 0;
Home.skip = 0;
Home.ids = "";

/* window.ready */
$(document).ready(function () {
  Home.bindFunctions();
  Home.skip = $("#properties-home-more").data("skip");
  Home.ids = $("#properties-home-more").data("ids");
});

Home.bindFunctions = function () {
  Home.featuredProperties();
  Home.bannerSlider();
  Home.contact();
  Home.loadMoreProps();
};

/* FEATURED PROPERTIES */
Home.featuredProperties = function () {
  let imagesSRC = [];
  $("body").on("mouseenter", ".featured-propierties--card", async function () {
    const imgSrcContainer = $(this)
      .children(".featured--card--link")
      .children(".featured-propierties--card--img");

    await imgSrcContainer.children(".data-images__src").each(function () {
      imagesSRC.push($(this).data("image"));
    });

    if (imagesSRC.length > 1) {
      imgSrcContainer.children("img").attr("src", `${imagesSRC[1]}`);
    }

    $(this)
      .children(".card--see-details")
      .css({ opacity: 0, display: "block" })
      .animate({ opacity: 1 }, 10);
  });
  $("body").on("mouseleave", ".featured-propierties--card", async function () {
    const imgSrcContainer = $(this)
      .children(".featured--card--link")
      .children(".featured-propierties--card--img");

    if (imagesSRC.length > 1) {
      imgSrcContainer.children("img").attr("src", `${imagesSRC[0]}`);
    }
    imagesSRC = [];

    $(this)
      .children(".card--see-details")
      .css({ opacity: 1, display: "none" })
      .animate({ opacity: 0 }, 10);
    $(this)
      .children(".featured-propierties--card--content")
      .children(".card--info")
      .show();
  });
};

/* BANNER IMAGES SLIDER */
Home.bannerSlider = function () {
  $(".data-desktop__src").each(function () {
    Home.listDesktop.push($(this).data("image"));
  });
  $(".data-mobile__src").each(function () {
    Home.listMobile.push($(this).data("image"));
  });

  let actualWidth = $(window).width();
  let imgIndex = 0;
  const imgTag = $(".home--header--images-img");
  const dotsContainer = $(".home--header--dots");

  /* SET DESKTOP/MOBILE IMAGES */
  if (actualWidth >= 960) {
    Home.listDesktop.forEach(() => {
      dotsContainer.append('<div class="dot"></div>');
    });
    dotsContainer.children(".dot").eq(imgIndex).addClass("dot-selected");
    imgTag.attr("src", `${Home.listDesktop[imgIndex]}`);
  } else {
    Home.listMobile.forEach(() => {
      dotsContainer.append('<div class="dot"></div>');
    });
    dotsContainer.children(".dot").eq(imgIndex).addClass("dot-selected");
    imgTag.attr("src", `${Home.listMobile[imgIndex]}`);
  }

  /* CHANGE BANNER */
  function changeBannner(listMobile, listDesktop) {
    let preWidth = actualWidth;
    let changeWidth = $(window).width();

    if (preWidth !== changeWidth) {
      if (changeWidth >= 960) {
        dotsContainer.empty();

        Home.listDesktop.forEach(() => {
          dotsContainer.append('<div class="dot"></div>');
        });
      } else {
        dotsContainer.empty();

        Home.listMobile.forEach(() => {
          dotsContainer.append('<div class="dot"></div>');
        });
      }
    } else {
      if (changeWidth >= 960) {
        dotsContainer.empty();
        Home.listDesktop.forEach(() => {
          dotsContainer.append('<div class="dot"></div>');
        });
      } else {
        dotsContainer.empty();
        Home.listMobile.forEach(() => {
          dotsContainer.append('<div class="dot"></div>');
        });
      }
    }

    if (changeWidth >= 960) {
      if (imgIndex < listDesktop.length - 1) {
        imgIndex = imgIndex + 1;

        imgTag.attr("src", `${listDesktop[imgIndex]}`);

        dotsContainer
          .children(`.dot:nth-child(${imgIndex + 1})`)
          .addClass("dot-selected");
        dotsContainer
          .children(`.dot:nth-child(${imgIndex})`)
          .removeClass("dot-selected");
      } else {
        imgIndex = 0;

        imgTag.attr("src", `${listDesktop[imgIndex]}`);

        dotsContainer
          .children(`.dot:nth-child(${listDesktop.length})`)
          .removeClass("dot-selected");
        dotsContainer
          .children(`.dot:nth-child(${imgIndex + 1})`)
          .addClass("dot-selected");
      }
    } else {
      if (imgIndex < listMobile.length - 1) {
        imgIndex = imgIndex + 1;

        imgTag.attr("src", `${listMobile[imgIndex]}`);

        dotsContainer
          .children(`.dot:nth-child(${imgIndex + 1})`)
          .addClass("dot-selected");
        dotsContainer
          .children(`.dot:nth-child(${imgIndex})`)
          .removeClass("dot-selected");
      } else {
        imgIndex = 0;

        imgTag.attr("src", `${listMobile[imgIndex]}`);

        dotsContainer
          .children(`.dot:nth-child(${listMobile.length})`)
          .removeClass("dot-selected");
        dotsContainer
          .children(`.dot:nth-child(${imgIndex + 1})`)
          .addClass("dot-selected");
      }
    }
    return imgIndex;
  }

  /* CHANGE IMG SLIDER */
  setInterval(() => {
    changeBannner(Home.listMobile, Home.listDesktop);
  }, 3000);
};

Home.contact = function () {
  $(".form--submit").on("click", function () {
    const form = {};
    form.msg = $("#form--message").val();
    form.name = $("#form--name").val();
    form.email = $("#form--email").val();
    form.phone = $("#form--phone").val();
    // console.log("Envío del formulario", form)

    if (form.name == "" || form.name == null) {
      return NavBar.showErrorMessage("el nombre no puede estar vacío");
    }
    if (form.email == "" || form.email == null) {
      return NavBar.showErrorMessage("el email no puede estar vacío");
    }
    if (form.phone == "" || form.phone == null) {
      return NavBar.showErrorMessage(
        "el numero de contacto no puede estar vacío"
      );
    }
    if (form.msg == "" || form.msg == null) {
      return NavBar.showErrorMessage("el mensaje no puede estar vacío");
    }

    const templateParams = {
      name: form.name,
      msg: form.msg,
      mail: form.email,
      phone: form.phone,
    };

    NavBar.showLoading();

    emailjs.send("service_ddwrd5n", "template_xc9xdnr", templateParams).then(
      function (response) {
        NavBar.hiddenLoading();
        setTimeout(NavBar.showDoneMessage(), 2000);
        // console.log("SUCCESS!", response.status, response.text);
      },
      function (err) {
        // console.log("FAILED...", err);
      }
    );
  });
};

Home.loadMoreProps = function () {
  $("body").on("click", "#properties-home-more", function () {
    // console.log("click!");

    const filters = $("#properties-home-more").data("filters");
    // const ids = $("body").children("#properties-home-more").data("ids");
    // const ids = $("#properties-home-more").data("ids");
    // const idsToSkipSend = Home.ids.split(",");
    // const deleteEmptyPosition = idsToSkipSend.pop();

    const formData = new FormData();
    formData.append("filters", filters);
    formData.append("skip", Home.skip);
    formData.append("idsToSkip", Home.ids);

    // idsToSkipSend.forEach((id) => console.log(id));

    NavBar.showLoading();

    $.ajax({
      type: "POST",
      url: "/",
      data: formData,
      processData: false, // tell jQuery not to process the data
      contentType: false, // tell jQuery not to set contentType
      success: function (res) {
        const properties = res.properties;
        const more = res.moreProperties;
        const idsToSkip = res.idsToSkip;
        const propContainer = $(".featured-popierties--container");
        properties.forEach((pro) => {
          let srcData = "";
          srcData =
            srcData +
            `<div
            data-image="${pro.primary_img}"
            class="data-images__src"
            style="visibility: hidden"
          ></div>`;
          srcData =
            srcData +
            `<div
            data-image="${pro.secondary_img}"
            class="data-images__src"
            style="visibility: hidden"
          ></div>`;
          propContainer.append(`
          <div class="featured-propierties--card">
            <a href="/property/${pro.id}" class="featured--card--link">
              <div class="featured-propierties--card--img">
              ${srcData}
                <img src="${pro.primary_img}" alt="Imagen de propiedad">
              </div>
            </a>
            <div class="featured-propierties--card--content">
            ${
              pro.sell_or_rent === "rent"
                ? `<span class="feature-type-1">Alquiler</span><p id="card--cost">$${pro.price}</p>`
                : `<span class="feature-type-2">Venta</span>
                <p id="card--cost">US$${pro.price}</p>
                `
            }
            ${
              pro.code !== ""
                ? `<span class="feature-code">cod.${pro.code}</span>`
                : ""
            }              
              <p id="card--title">${pro.name}</p>
              <p id="card--direction">${pro.ubication_name}</p>
              <div class="card--info">
                <p id="card--rooms">${pro.room} Dormitorios</p>
                <p id="card--bathrooms">${pro.bathroom} Baños</p>
                <p id="card--size">${pro.size} m2.</p>
              </div>
            </div>
            <div class="card--see-details">
              <a href="/property/${pro._id}">
                <span>Ver detalles</span>
              </a>
            </div>
          </div>
          `);
        });

        const totalPropsInPage = $(
          ".featured-popierties--container > .featured-propierties--card"
        ).length;

        if (more) {
          // console.log("hay mas para traer");
        } else {
          // console.log("NO hay mas para traer");
          $("#properties-home-more").hide();
        }

        // console.log(idsToSkip);

        $("#properties-home-more").attr("data-skip", totalPropsInPage);
        $("#properties-home-more").attr("data-ids", idsToSkip);
        Home.ids = idsToSkip;
        Home.skip = totalPropsInPage;
        // console.log(Home.ids);
        NavBar.hiddenLoading();
      },
      error: function (err) {
        NavBar.hiddenLoading();
        const { msg } = err.responseJSON;
        alert(msg);
      },
    });
  });
};
