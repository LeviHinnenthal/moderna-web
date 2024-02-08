var addProperty = {};
addProperty.imagesForLoad = {};
addProperty.videoURL = "";
addProperty.tags = "";
addProperty.neighborsCount = 1;
addProperty.department;
addProperty.highlight = false;

/* window.ready */
$(document).ready(function () {
  // console.log(window.location.pathname);
  if (window.location.pathname == "/admin/properties/add") {
    addProperty.bindFunctions();
  }
});

addProperty.bindFunctions = function () {
  addProperty.setValues();
  addProperty.loadImages();
  addProperty.addNewNeighborForm();
  addProperty.sendData();
  addProperty.enableDragAndDrop();
};

addProperty.sendData = function () {
  /* GET NEW PROPERTY */
  $(".property-submit").on("click", function () {
    const newProperty = addProperty.createForm();
    if (newProperty !== undefined) {
      const formData = new FormData();
      formData.append("propertyName", newProperty.property.name);
      formData.append("propertyDescription", newProperty.property.description);
      formData.append("propertySellRent", newProperty.property.sellrent);
      formData.append("propertyPrice", newProperty.property.price);
      formData.append("propertyBathroom", newProperty.property.bathroom);
      formData.append("propertyRoom", newProperty.property.room);
      formData.append("propertySize", newProperty.property.size);
      formData.append("propertyCode", newProperty.property.code);
      formData.append("propertyType", newProperty.property.type);
      formData.append("propertyTags", newProperty.property.tags);
      formData.append(
        "propertyCharacteristics",
        newProperty.property.characteristics
      );
      formData.append("primaryImg", newProperty.property.primary_img);
      formData.append("secondaryImg", newProperty.property.secondary_img);
      newProperty.property.images.forEach((img, i) => {
        let index = i + 1;
        formData.append("propertyImage" + index, img);
      });
      formData.append("propertyVideoURL", newProperty.property.url);
      formData.append("propertyHighlight", newProperty.property.highlight);
      formData.append(
        "propertyUbicationName",
        newProperty.property.ubication_name
      );
      formData.append(
        "propertyUbicationLat",
        newProperty.property.ubication_lat
      );
      formData.append(
        "propertyUbicationLng",
        newProperty.property.ubication_lng
      );
      formData.append(
        "propertyUbicationArea",
        newProperty.property.ubication_area
      );
      formData.append("propertyDepartment", newProperty.property.department);

      formData.append("areaFeatures", newProperty.area.features);
      newProperty.area.images.forEach((img, i) => {
        let index = i + 1;
        formData.append("areaImage" + index, img);
      });
      newProperty.neighbors.forEach((neighbor, i) => {
        const neighborRAW = JSON.stringify(neighbor);
        formData.append("neighbor" + i, neighborRAW);
      });

      // console.log(newProperty);

      // console.log(newProperty, formData);

      AdminNavbar.showLoading();

      $.ajax({
        type: "POST",
        url: "/admin/properties/add",
        data: formData,
        processData: false, // tell jQuery not to process the data
        contentType: false, // tell jQuery not to set contentType
        success: function (res) {
          // console.log(res);
          if (res.status == "ok") {
            // console.log(res);
            AdminNavbar.hiddenLoading();
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

addProperty.createForm = function () {
  const form = {};
  form.property = {};
  form.area = {};
  form.neighbors = {};

  /* SET PROPERTY NAME */
  form.property.name = $("#property-name").val();
  if (form.property.name == undefined || form.property.name == "") {
    return AdminNavbar.showErrorMessage(
      "Debes introducir el nombre de la nueva propiedad."
    );
  }

  /* SET PROPERTY DESCRIPTION */
  form.property.description = $("#property-description").val();
  if (
    form.property.description == undefined ||
    form.property.description == ""
  ) {
    return AdminNavbar.showErrorMessage(
      "Debes introducir una descripción de la propiedad."
    );
  }

  /* SET PROPERTY TYPE */
  form.property.sellrent = $(".property-sellrent-btn")
    .children(".selected")
    .data("type");

  /* SET PROPERTY PRICE */
  form.property.price = $("#property-price").val();
  if (
    form.property.description == undefined ||
    form.property.description == ""
  ) {
    return AdminNavbar.showErrorMessage(
      "El costos de la propiedad no puede estar vacío o ser $0."
    );
  }

  /* SET PROPERTY BATHROOMS */
  form.property.bathroom = Number($("#property-bathroom").val());

  /* SET PROPERTY ROOMS */
  form.property.room = Number($("#property-room").val());

  /* SET PROPERTY SIZE */
  form.property.size = Number($("#property-size").val());
  if (
    form.property.size == undefined ||
    form.property.size == "" ||
    form.property.size == 0
  ) {
    return AdminNavbar.showErrorMessage(
      "Tamaño de la propiedad no puede ser 0 mts²."
    );
  }

  /* SET PROPERTY CODE */
  form.property.code = $("#property-code").val();

  /* SET PROPERTY TYPE */
  form.property.type = $("#property-type").children("option:selected").val();

  /* SET PROPERTY CHARACTERISTICS */
  form.property.characteristics = $("#property-features").val();
  if (
    form.property.characteristics == undefined ||
    form.property.characteristics == ""
  ) {
    return AdminNavbar.showErrorMessage(
      "Debes introducir las características de la propiedad."
    );
  }

  /* SET PRIMARY IMAGE */
  form.property.primary_img = addProperty.imagesForLoad.primary;

  /* SET SECONDARY IMAGE */
  form.property.secondary_img = addProperty.imagesForLoad.secondary;

  /* SET PROPERTY IMAGES */
  form.property.images = addProperty.imagesForLoad.property;

  /* SET PROPERTY DIRECTION */
  form.property.ubication_name = addProperty.ubication
    ? addProperty.ubication
    : $("#property-direction").val();
  if (
    form.property.ubication_name == undefined ||
    form.property.ubication_name == ""
  ) {
    return AdminNavbar.showErrorMessage(
      "Debes introducir la dirección de la propiedad."
    );
  }
  form.property.ubication_lat = data.lat;
  form.property.ubication_lng = data.lng;
  form.property.ubication_area = data.area;

  /* SET PROPERTY DEPARMENT */
  form.property.department = addProperty.department;

  /* SET VIDEO URL */
  form.property.url = addProperty.videoURL;

  /* SET HIGHLIGHT */
  form.property.highlight = addProperty.highlight;

  /* SET PROPERTY TAGS */
  form.property.tags = addProperty.tags;

  /* SET AREA FEATURES */
  form.area.features = $("#area-features").val();

  /* SET AREA IMAGES */
  form.area.images = addProperty.imagesForLoad.area;

  /* SET NEIGHBORS */
  form.neighbors = addProperty.loadNeighborsData();

  return form;
};

addProperty.setValues = function () {
  /* SET NEW PROPERTY SELL/RENT */
  $("#property-rent").on("click", function () {
    $(this).addClass("selected");
    $("#property-sell").removeClass("selected");
    $("#property-price").attr("placeholder", "$");
  });
  $("#property-sell").on("click", function () {
    $(this).addClass("selected");
    $("#property-rent").removeClass("selected");
    $("#property-price").attr("placeholder", "USD");
  });

  /* SET NEW PROPERTY BATHROOMS */
  $("#bathroom-up").on("click", function () {
    $("#property-bathroom").val(Number($("#property-bathroom").val()) + 1);
  });
  $("#bathroom-down").on("click", function () {
    if ($("#property-bathroom").val() > 0)
      $("#property-bathroom").val(Number($("#property-bathroom").val()) - 1);
  });

  /* SET NEW PROPERTY ROOMS */
  $("#room-up").on("click", function () {
    $("#property-room").val(Number($("#property-room").val()) + 1);
  });
  $("#room-down").on("click", function () {
    if ($("#property-room").val() > 0)
      $("#property-room").val(Number($("#property-room").val()) - 1);
  });

  /* SET NEW PROPERTY SIZE */
  $("#size-up").on("click", function () {
    $("#property-size").val(Number($("#property-size").val()) + 1);
  });
  $("#size-down").on("click", function () {
    if ($("#property-size").val() > 0)
      $("#property-size").val(Number($("#property-size").val()) - 1);
  });

  /* SET PROPERTY DEPARMENT */
  $("#property-department").on("change", function () {
    addProperty.department = $("#property-department")
      .children("option:selected")
      .val();
  });

  /* SET NEW PROPERTY VIDEO URL */
  $("#property-video-btn").on("click", function () {
    const regEx =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    const url = $("#property-video-url").val();
    if (url !== "") {
      if (regEx.test(url)) {
        let urlId = url.split("https://youtu.be/")[1];
        addProperty.videoURL = urlId;
        $("#property-video-btn > p").replaceWith("<p>Agregado!</p>");
      } else {
        AdminNavbar.showErrorMessage(
          "El formato del link no es el correcto -> https://youtu.be/5uA7sIPluo0"
        );
      }
    }
  });

  /* SET HIGHLIGHT */
  $("#property-highlight").on("click", function () {
    $(this).toggleClass("selected-hightlight");
    addProperty.highlight = !addProperty.highlight;
  });

  /* SET PROPERTY TAGS */
  $("#property-tags").on("keyup", function () {
    addProperty.tags = $(this).val();
    addProperty.tags = addProperty.tags;
  });

  /* SET NEW PROPERTY NEIGHBOR SEX */
  $("body").on("click", "#neightbor-male", function () {
    $(this).addClass("selected");
    $(this).parent().children("#neightbor-female").removeClass("selected");
  });
  $("body").on("click", "#neightbor-female", function () {
    $(this).addClass("selected");
    $(this).parent().children("#neightbor-male").removeClass("selected");
  });

  /* SET NEW PROPERTY NEIGHBOR STARS */
  $("body").on("click", "#stars-up", function () {
    if ($(this).parent().parent().children("#neighbor-stars").val() < 5)
      $(this)
        .parent()
        .parent()
        .children("#neighbor-stars")
        .val(
          Number($(this).parent().parent().children("#neighbor-stars").val()) +
            1
        );
  });
  $("body").on("click", "#stars-down", function () {
    if ($(this).parent().parent().children("#neighbor-stars").val() > 1)
      $(this)
        .parent()
        .parent()
        .children("#neighbor-stars")
        .val(
          Number($(this).parent().parent().children("#neighbor-stars").val()) -
            1
        );
  });
};

addProperty.loadImages = function () {
  addProperty.imagesForLoad.primary = null;
  addProperty.imagesForLoad.secondary = null;
  addProperty.imagesForLoad.property = [];
  addProperty.imagesForLoad.area = [];

  /* ADD PRIMARY IMAGE */
  $("#new-primary--img-btn").on("change", function () {
    if (addProperty.imagesForLoad.primary === null) {
      Object.keys(this.files).forEach((img) => {
        addProperty.imagesForLoad.primary = this.files[img];
        $(".add-primary-image-list").prepend(
          `<div class="new-property--img-container"><img class="new-property--image-list" src="${URL.createObjectURL(
            this.files[img]
          )}"</img><div class="new-property--img-delete-btn property-color" data-name="${
            this.files[img]
          }" data-type="primary">${this.files[img].name}</div></div>`
        );
      });
    } else {
      AdminNavbar.showErrorMessage("Solo puedes cargar 1 imágen principal.");
    }
  });
  /* ADD SECONDARY IMAGE */
  $("#new-secondary--img-btn").on("change", function () {
    if (addProperty.imagesForLoad.secondary === null) {
      Object.keys(this.files).forEach((img) => {
        addProperty.imagesForLoad.secondary = this.files[img];
        $(".add-secondary-image-list").prepend(
          `<div class="new-property--img-container"><img class="new-property--image-list" src="${URL.createObjectURL(
            this.files[img]
          )}"</img><div class="new-property--img-delete-btn property-color" data-name="${
            this.files[img]
          }" data-type="secondary">${this.files[img].name}</div></div>`
        );
      });
    } else {
      AdminNavbar.showErrorMessage("Solo puedes cargar 1 imágen secundaria.");
    }
  });
  /* ADD PROPERTY IMAGES */
  $("#new-property--img-btn").on("change", function () {
    Object.keys(this.files).forEach((img) => {
      addProperty.imagesForLoad.property.push(this.files[img]);
      $(".add-property-images-list").prepend(
        `<div class="new-property--img-container"><img class="new-property--image-list" src="${URL.createObjectURL(
          this.files[img]
        )}"</img><div class="new-property--img-delete-btn property-color" data-name="${
          this.files[img]
        }" data-type="property">${this.files[img].name}</div></div>`
      );
    });
  });

  /* SET ZONE AREA IMAGES */
  $("#new-area--img-btn").on("change", function () {
    if (addProperty.imagesForLoad.area.length < 2) {
      addProperty.imagesForLoad.area.push(this.files[0]);
      // console.log("upload");
      // console.log(addProperty.imagesForLoad.area);
      $(".add-area-images-list").prepend(
        `<div class="new-property--img-container"><img class="new-property--image-list" src="${URL.createObjectURL(
          this.files[0]
        )}"</img><div class="new-property--img-delete-btn area-color" data-name="${
          this.files[0].name
        }" data-type="area">${this.files[0].name}</div></div>`
      );
    } else {
      AdminNavbar.showErrorMessage(
        "Solo puedes cargar 2 imágenes del area de la propiedad."
      );
    }
  });

  /* DELETE SELECTED IMG */
  $("body").on("click", ".new-property--img-delete-btn", function () {
    // console.log("click");
    let name = $(this).data("name");
    let type = $(this).data("type");

    // console.log(name, type);

    if (type === "primary") {
      addProperty.imagesForLoad.primary = null;
      $(this).parent().remove();
      // console.log(addProperty.imagesForLoad.property);
    }
    if (type === "secondary") {
      addProperty.imagesForLoad.secondary = null;
      $(this).parent().remove();
      // console.log(addProperty.imagesForLoad.property);
    }
    if (type === "property") {
      addProperty.imagesForLoad.property =
        addProperty.imagesForLoad.property.filter((prop) => prop.name !== name);
      $(this).parent().remove();
      // console.log(addProperty.imagesForLoad.property);
    }
    if (type === "area") {
      addProperty.imagesForLoad.area = addProperty.imagesForLoad.area.filter(
        (prop) => prop.name !== name
      );
      $(this).parent().remove();
      // console.log(addProperty.imagesForLoad.area);
    }
  });
};

addProperty.addNewNeighborForm = function () {
  $("#add-new-neighbor-btn").on("click", function () {
    addProperty.neighborsCount++;
    addProperty.neighborsCount < 3
      ? $(".admin-add-property--form-3").append(`
        <div class="neighbor-form">
        <div class="admin-add-property--form-group neighbor-name">
        <p>Nombre del Vecino ${addProperty.neighborsCount}</p>
          <input type="text" placeholder="Juan" class="neighbor-name-val"/>
        </div>
        <div class="admin-add-property--form-group neighbor-sex">
          <p>Seleccione el sexo</p>
          <div class="neighbor-sex-btn">
            <div class="selected" id="neightbor-male" data-sex="male">Hombre</div>
            <div  id="neightbor-female" data-sex="female">Mujer</div>
          </div>
        </div>  
        <div class="admin-add-property--form-group neighbor-stars">
          <p>Estrellas</p>
          <input type="number" value="4" id="neighbor-stars"/>
          <div class="input-number">
            <div class="up" id="stars-up"></div>
            <div class="down" id="stars-down"></div>
          </div>
        </div>
        <div class="admin-add-property--form-group neighbor-review">
          <p>Reseña</p>
          <textarea
            name="descripcion"
            class=""
            cols="30"
            rows="10"
            placeholder="Descripción"
          ></textarea>
        </div>
      </div>`)
      : AdminNavbar.showErrorMessage(
          "Solo se pueden agregar 2 vecinos por propiedad."
        );
  });
};

addProperty.loadNeighborsData = function () {
  const neighbors = [];

  $(".neighbor-form").each(function () {
    if (
      $(this)
        .children(".neighbor-name")
        .children(".neighbor-name-val")
        .val() !== ""
    ) {
      const neighbor = {};
      neighbor.name = $(this)
        .children(".neighbor-name")
        .children(".neighbor-name-val")
        .val();
      neighbor.sex = $(this)
        .children(".neighbor-sex")
        .children(".neighbor-sex-btn")
        .children(".selected")
        .data("sex");
      neighbor.stars = $(this)
        .children(".neighbor-stars")
        .children("#neighbor-stars")
        .val();
      neighbor.review = $(this)
        .children(".neighbor-review")
        .children("textarea")
        .val();
      neighbors.push(neighbor);
    }
  });
  return neighbors;
};

addProperty.enableDragAndDrop = function () {
  let draggedItem = null;
  let containers = document.querySelectorAll(".new-property--img-container");

  const getNewPositions = () => {
    let positions = [];
    containers.forEach((container) => {
      let imageUrl = container.querySelector(".new-property--image-list").src;
      positions.push(imageUrl);
    });
    return positions;
  };

  containers.forEach((container) => {
    container.draggable = true;

    container.addEventListener("dragstart", function (e) {
      draggedItem = this;
      setTimeout(() => {
        this.style.display = "none";
      }, 0);
    });

    container.addEventListener("dragend", function (e) {
      setTimeout(() => {
        draggedItem.style.display = "block";
        draggedItem = null;

        containers = document.querySelectorAll(".new-property--img-container"); // Reobtener referencias
        EditProperty.newImgsPositions = getNewPositions(); // Actualizar con las nuevas posiciones
        // console.log(EditProperty.newImgsPositions);
      }, 0);
    });

    container.addEventListener("dragover", function (e) {
      e.preventDefault();
    });

    container.addEventListener("dragenter", function (e) {
      e.preventDefault();
    });

    container.addEventListener("drop", function (e) {
      if (this !== draggedItem) {
        this.parentElement.insertBefore(draggedItem, this);
      }
    });
  });
};

/* HELPERS */
function findArrChangePositions(arr1, arr2) {
  const cambios = [];

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      cambios.push({
        valor: arr1[i],
        posicionOriginal: i,
        nuevaPosicion: arr2.indexOf(arr1[i]),
      });
    }
  }

  return cambios;
}
