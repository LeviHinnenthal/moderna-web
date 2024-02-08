let Properties = {};
Properties.skip = 0;

/* window.ready */
$(document).ready(function () {
  Properties.skip = $("#properties-more").data("skip");
  Properties.bindFunctions();
});

Properties.bindFunctions = function () {
  Properties.featuredProperties();
  Properties.loadMore();
};

/* FEATURED PROPERTIES */
Properties.featuredProperties = function () {
  let imagesSRC = [];
  $("body").on("mouseenter", ".propierties--card", async function () {
    const imgSrcContainer = $(this)
      .children(".propierties--card--link")
      .children(".propierties--card--img");
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
  $("body").on("mouseleave", ".propierties--card", function () {
    const imgSrcContainer = $(this)
      .children(".propierties--card--link")
      .children(".propierties--card--img");

    if (imagesSRC.length > 1) {
      imgSrcContainer.children("img").attr("src", `${imagesSRC[0]}`);
    }
    imagesSRC = [];
    $(this)
      .children(".card--see-details")
      .css({ opacity: 1, display: "none" })
      .animate({ opacity: 0 }, 10);
    $(this).children(".property--card").children(".card--info").show();
  });
};

Properties.loadMore = function () {
  $("#properties-more").on("click", function () {
    const filters = $("#properties-more").data("filters");
    const ids = $("#properties-more").data("ids");
    const idsToSkipSend = ids.split(",");
    const deleteEmptyPosition = idsToSkipSend.pop();

    const formData = new FormData();
    formData.append("filters", filters);
    formData.append("skip", Properties.skip);
    formData.append("idsToSkip", idsToSkipSend);

    NavBar.showLoading();

    $.ajax({
      type: "POST",
      url: "/properties",
      data: formData,
      processData: false, // tell jQuery not to process the data
      contentType: false, // tell jQuery not to set contentType
      success: function (res) {
        const properties = res.properties;
        const more = res.moreProperties;
        const idsToSkip = res.idsToSkipClient;
        const propContainer = $(".properties--container--cards");
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
          <div class="propierties--card">
          <a href="/property/${pro.id}" class="propierties--card--link">
            <div class="propierties--card--img">
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
            pro.code !== "" && pro.code !== undefined
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
          <div class="card--see-details" style="opacity: 0; display: none;">
            <a href="/property/${pro.id}">
              <span>Ver detalles</span>
            </a>
          </div>
          </div>
          `);
        });

        const countInView = $("#properties-count");
        const totalPropsInPage = $(
          ".properties--container--cards > .propierties--card"
        ).length;

        if (more) {
          // console.log("hay mas para traer");
        } else {
          // console.log("NO hay mas para traer");
          $("#properties-more").hide();
        }

        $("#properties-more").attr("data-skip", totalPropsInPage);
        $("#properties-more").attr("data-ids", ids + idsToSkip);
        countInView.html(totalPropsInPage);
        Properties.skip = totalPropsInPage;
        NavBar.hiddenLoading();
        // console.log(Properties.skip);
      },
      error: function (err) {
        NavBar.hiddenLoading();
        const { msg } = err.responseJSON;
        alert(msg);
      },
    });
  });
};
