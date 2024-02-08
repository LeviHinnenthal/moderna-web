let Filters = {};
Filters.typeSelected = "rent";
Filters.ubicationsSelected = [];
Filters.ubicationsSelectedNames = [];
Filters.costSelected = undefined;
Filters.typePropertiesSelected = [];
Filters.typePropertiesSelectedForView = [];

/* window.ready */
$(document).ready(function () {
  Filters.bindFunctions();
});

Filters.bindFunctions = function () {
  Filters.link = $("#filters-search");
  Filters.href = $(Filters.link).attr("href");
  const querystring = encodeQueryData({
    sell_or_rent: Filters.typeSelected,
    cost: Filters.costSelected,
    type: Filters.typePropertiesSelected,
    department: Filters.ubicationsSelected,
  });
  Filters.link.attr("href", Filters.href + querystring);

  /* VALUES */
  Filters.rental();
  Filters.sell();
  Filters.ubication();
  Filters.cost();
  Filters.type();
  // Filters.sendData();
};

Filters.rental = function () {
  $("#rental").on("click", function () {
    const value = $(this).data("offer-type");
    $(this).addClass("type-selected");
    $("#sell").removeClass("type-selected");
    Filters.typeSelected = "rent";
    const querystring = encodeQueryData({
      sell_or_rent: Filters.typeSelected,
      cost: Filters.costSelected,
      type: Filters.typePropertiesSelected,
      department: Filters.ubicationsSelected,
    });
    Filters.link.attr("href", Filters.href + querystring);
    if (Filters.costSelected !== undefined) {
      const costShow = $("#cost-show");
      costShow.text("$ " + Filters.costSelected);
    }
    $(".cost-item ").each(function () {
      // console.log($(this).children().text());
      const regex = /US\$/g;
      let text = $(this).children().text();
      if (regex.test(text)) {
        let dolarCostFilter = text.replace(regex, "$");
        $(this).children("span").text(dolarCostFilter);
      }
    });
  });
};
Filters.sell = function () {
  $("#sell").on("click", function () {
    const value = $(this).data("offer-type");
    $(this).addClass("type-selected");
    $("#rental").removeClass("type-selected");
    Filters.typeSelected = "sell";
    const querystring = encodeQueryData({
      sell_or_rent: Filters.typeSelected,
      cost: Filters.costSelected,
      type: Filters.typePropertiesSelected,
      department: Filters.ubicationsSelected,
    });
    Filters.link.attr("href", Filters.href + querystring);
    if (Filters.costSelected !== undefined) {
      const costShow = $("#cost-show");
      costShow.text("US$ " + Filters.costSelected);
    }
    $(".cost-item ").each(function () {
      // console.log($(this).children().text());
      const regex = /[\$]{1}/g;
      let text = $(this).children().text();
      if (regex.test(text)) {
        let dolarCostFilter = $(this).children().text().replace(regex, "US$");
        $(this).children("span").text(dolarCostFilter);
      }
    });
  });
};
Filters.ubication = function () {
  const ubicationShow = $("#ubication-show");
  $("#ubication").on("click", function () {
    $("#filters-content").toggleClass("hidden");
    $("#ubication-content").toggleClass("hidden");
  });
  /* CLOSE MODAL BTN CLICK*/
  $("#ubication-close").on("click", function (e) {
    if (Filters.ubicationsSelected.length > 0) {
      ubicationShow.text(Filters.ubicationsSelectedNames);
    } else {
      ubicationShow.text("Seleccionar");
    }
    $("#filters-content").toggleClass("hidden");
    $("#ubication-content").toggleClass("hidden");
    // console.log(Filters.ubicationsSelected);
  });

  /* CLOSE MODAL OUTSIDE CLICK*/
  /* $("body").on("click", function (e) {
    if (
      !(
        $(e.target).closest("#ubication").length > 0 ||
        $(e.target).closest("#ubication-close").length > 0 ||
        $(e.target).closest(".ubication-item").length > 0
      )
    ) {
      $("#filters-content").addClass("hidden");
      $("#ubication-content").addClass("hidden");
      $(".ubication-item").each(function () {
        $(this).children("span").removeClass("ubication--selected");
        $(this).children("div").removeClass("check-box--checked");
      });
      Filters.ubicationsSelected = [];
    }
  }); */

  /* SELECT DATA */
  $(".ubication-item").on("click", function () {
    const value = $(this).data("ubication");
    const name = $(this).text();
    $(this).children("span").toggleClass("ubication--selected");
    $(this).children("div").toggleClass("check-box--checked");
    if ($(this).children("span").hasClass("ubication--selected")) {
      Filters.ubicationsSelected.push(value);
      Filters.ubicationsSelectedNames.push(name);
      const querystring = encodeQueryData({
        sell_or_rent: Filters.typeSelected,
        cost: Filters.costSelected,
        type: Filters.typePropertiesSelected,
        department: Filters.ubicationsSelected,
      });
      return Filters.link.attr("href", Filters.href + querystring);
    } else {
      Filters.ubicationsSelected = Filters.ubicationsSelected.filter(
        (el) => el !== value
      );
      Filters.ubicationsSelectedNames = Filters.ubicationsSelectedNames.filter(
        (el) => el !== name
      );
      const querystring = encodeQueryData({
        sell_or_rent: Filters.typeSelected,
        cost: Filters.costSelected,
        type: Filters.typePropertiesSelected,
        department: Filters.ubicationsSelected,
      });
      return Filters.link.attr("href", Filters.href + querystring);
    }
  });
};
Filters.cost = function () {
  const costShow = $("#cost-show");
  $("#cost").on("click", function () {
    $("#filters-content").toggleClass("hidden");
    $("#cost-content").toggleClass("hidden");
  });
  $("#cost-close").on("click", function () {
    if (Filters.costSelected !== undefined) {
      if (Filters.typeSelected == "Alquiler") {
        costShow.text("$ " + Filters.costSelected);
      } else {
        costShow.text("US$ " + Filters.costSelected);
      }
    } else {
      costShow.text("Seleccionar");
    }
    $("#filters-content").toggleClass("hidden");
    $("#cost-content").toggleClass("hidden");
  });

  /* CLOSE MODAL OUTSIDE CLICK*/

  $(".cost-item").on("click", function () {
    /* Check if has some "li" selected */
    if (
      $("#cost-content > ul > li > span").hasClass("cost--selected") !==
      $(this).children("span").hasClass("cost--selected")
    ) {
      return alert(
        "Ya tiene un costo seleccionado. Desarquelo para seleccionar otro."
      );
    }

    /* Action for selected "li" and set value*/
    const value = $(this).data("cost");
    $(this).children("span").toggleClass("cost--selected");
    $(this).children("div").toggleClass("check-box--checked");
    if ($(this).children("span").hasClass("cost--selected")) {
      Filters.costSelected = value;
      const querystring = encodeQueryData({
        sell_or_rent: Filters.typeSelected,
        cost: Filters.costSelected,
        type: Filters.typePropertiesSelected,
        department: Filters.ubicationsSelected,
      });
      return Filters.link.attr("href", Filters.href + querystring);
    } else {
      Filters.costSelected = undefined;
      const querystring = encodeQueryData({
        sell_or_rent: Filters.typeSelected,
        cost: Filters.costSelected,
        type: Filters.typePropertiesSelected,
        department: Filters.ubicationsSelected,
      });
      return Filters.link.attr("href", Filters.href + querystring);
    }
  });
};
Filters.type = function () {
  const typeShow = $("#type-show");
  $("#type").on("click", function () {
    $("#filters-content").toggleClass("hidden");
    $("#type-content").toggleClass("hidden");
  });
  $("#type-close").on("click", function () {
    if (Filters.typePropertiesSelectedForView.length > 0) {
      typeShow.text(Filters.typePropertiesSelectedForView);
    } else {
      typeShow.text("Seleccionar");
    }
    $("#filters-content").toggleClass("hidden");
    $("#type-content").toggleClass("hidden");
  });
  $(".type-item").on("click", function () {
    const value = $(this).data("type");
    const valueEs = $(this).data("es");

    $(this).children("span").toggleClass("type-property--selected");
    $(this).children("div").toggleClass("check-box--checked");
    if ($(this).children("span").hasClass("type-property--selected")) {
      Filters.typePropertiesSelected.push(value);
      Filters.typePropertiesSelectedForView.push(valueEs);
      const querystring = encodeQueryData({
        sell_or_rent: Filters.typeSelected,
        cost: Filters.costSelected,
        type: Filters.typePropertiesSelected,
        department: Filters.ubicationsSelected,
      });
      return Filters.link.attr("href", Filters.href + querystring);
    } else {
      Filters.typePropertiesSelectedForView =
        Filters.typePropertiesSelectedForView.filter((el) => el !== valueEs);
      Filters.typePropertiesSelected = Filters.typePropertiesSelected.filter(
        (el) => el !== value
      );
      const querystring = encodeQueryData({
        sell_or_rent: Filters.typeSelected,
        cost: Filters.costSelected,
        type: Filters.typePropertiesSelected,
        department: Filters.ubicationsSelected,
      });
      return Filters.link.attr("href", Filters.href + querystring);
    }
  });
};
Filters.sendData = function () {
  /* $("#filters-search").on("click", function () {
    const formData = new FormData();
    formData.append("sell_rent", Filters.typeSelected);
    formData.append("cost", Filters.costSelected);
    formData.append("types", Filters.typePropertiesSelected);

    console.log(formData);
    NavBar.showLoading();

    $.ajax({
      type: "POST",
      url: "/search-properties",
      data: formData,
      processData: false, // tell jQuery not to process the data
      contentType: false, // tell jQuery not to set contentType
      success: function (res) {
        NavBar.hiddenLoading();
        console.log(res);
        const properties = res.properties;
        const homeView = $(".featured-popierties--container");
        const propertiesView = $(".properties--container--cards");
        let propContainer;

        if (homeView.length > 0) {
          console.log("vista home");
          propContainer = homeView;
          propContainer.html("");
          properties.forEach((pro) => {
            let srcData = "";
            pro.images.map((img) => {
              srcData =
                srcData +
                `<div
              data-image="${img}"
              class="data-images__src"
              style="visibility: hidden"
            ></div>`;
            });
            propContainer.append(`
            <div class="featured-propierties--card">
              <a href="/property/${pro.id}" class="featured--card--link">
                <div class="featured-propierties--card--img">
                ${srcData}
                  <img src="${pro.images[0]}" alt="Imagen de propiedad">
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
                
                <p id="card--title">${pro.name}</p>
                <p id="card--direction">${pro.ubication_name}</p>
                <div class="card--info">
                  <p id="card--rooms">${pro.room} Dormitorios</p>
                  <p id="card--bathrooms">${pro.bathroom} Baños</p>
                  <p id="card--size">${pro.size} m2.</p>
                </div>
              </div>
              <div class="card--see-details">
                <a href="/property/${pro.id}">
                  <span>Ver detalles</span>
                </a>
              </div>
            </div>
            `);
          });
          $("#properties-home-more").hide();
        }
        if (propertiesView.length > 0) {
          console.log("vista props");
          propContainer = propertiesView;
          propContainer.html("");
          properties.forEach((pro) => {
            let srcData = "";
            pro.images.map((img) => {
              srcData =
                srcData +
                `<div
              data-image="${img}"
              class="data-images__src"
              style="visibility: hidden"
            ></div>`;
            });
            propContainer.append(`
            <div class="propierties--card">
            <a href="/property/${pro.id}" class="propierties--card--link">
              <div class="propierties--card--img">
               ${srcData}
                <img src="${pro.images[0]}" alt="Imagen de propiedad">
              </div>
            </a>
            <div class="featured-propierties--card--content">
              
              ${
                pro.sell_or_rent === "rent"
                  ? '<span class="feature-type-1">Alquiler</span>'
                  : '<span class="feature-type-2">Venta</span>'
              }
              
              <p id="card--cost">$${pro.price}</p>
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
          countInView.html(totalPropsInPage);
          $("#properties-more").hide();
        }
      },
      error: function (err) {
        NavBar.hiddenLoading();
        const { msg } = err.responseJSON;
        alert(msg);
      },
    });
  }); */
};

function encodeQueryData(data) {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
}
