var EditProperty = {};
EditProperty.editionsToSend = {};
EditProperty.newImgsPositions = [];
EditProperty.initialImgsPositions = [];

/* window.ready */
$(document).ready(function () {
  const pathArray = window.location.pathname.split("/");
  let path = pathArray[2] + "/" + pathArray[3];
  if (path == "properties/edit") {
    EditProperty.bindFunctions();
  }
});

EditProperty.bindFunctions = function () {
  EditProperty.deleteImage();
  EditProperty.getAndSendData();
  EditProperty.enableDragAndDrop();
  EditProperty.storeInitialPositions();
};

EditProperty.storeInitialPositions = function () {
  let containers = document.querySelectorAll(".new-property--img-container");
  containers.forEach((container) => {
    let imageUrl = container.querySelector(".new-property--image-list").src;
    EditProperty.initialImgsPositions.push(imageUrl);
  });
  // console.log("Posiciones Iniciales:", EditProperty.initialImgsPositions);
};

EditProperty.deleteImage = function () {
  /* DELETE SELECTED IMG */
  $("body").on("click", ".new-property--img-delete-btn-edit", function () {
    // console.log("click");
    let url = $(this).data("name");
    let type = $(this).data("type");
    let id = $(this).data("id");

    // console.log(url, type, id);
    if (confirm("Seguro que desea eliminar esta imágen?")) {
      AdminNavbar.showLoading();
      $(this).parent().remove();

      const formData = new FormData();
      formData.append("url", url);
      formData.append("type", type);
      formData.append("id", id);

      $.ajax({
        type: "POST",
        url: "/admin/properties-image/delete",
        data: formData,
        processData: false, // tell jQuery not to process the data
        contentType: false, // tell jQuery not to set contentType
        success: function (res) {
          // console.log(res);
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

EditProperty.getAndSendData = function () {
  /* SET EDIT PROPERTY NAME */
  $("#property-name").on("keyup", function () {
    const newValue = $(this).val();
    newValue !== undefined && newValue !== ""
      ? (EditProperty.editionsToSend.name = newValue)
      : "";
  });
  /* SET EDIT PROPERTY DESCRIPTION */
  $("#property-description").on("keyup", function () {
    const newValue = $(this).val();
    newValue !== undefined && newValue !== ""
      ? (EditProperty.editionsToSend.description = newValue)
      : "";
  });
  /* SET EDIT PROPERTY SELL/RENT */
  $("#property-rent").on("click", function () {
    $(this).addClass("selected");
    $("#property-sell").removeClass("selected");
    $("#property-price").attr("placeholder", "$");
    EditProperty.editionsToSend.sell_or_rent = "rent";
  });
  $("#property-sell").on("click", function () {
    $(this).addClass("selected");
    $("#property-rent").removeClass("selected");
    $("#property-price").attr("placeholder", "USD");
    EditProperty.editionsToSend.sell_or_rent = "sell";
  });
  /* SET NEW PROPERTY BATHROOMS */
  $("#bathroom-up").on("click", function () {
    $("#property-bathroom").val(Number($("#property-bathroom").val()) + 1);
    EditProperty.editionsToSend.bathroom = Number(
      $("#property-bathroom").val()
    );
  });
  $("#bathroom-down").on("click", function () {
    if ($("#property-bathroom").val() > 0)
      $("#property-bathroom").val(Number($("#property-bathroom").val()) - 1);
    EditProperty.editionsToSend.bathroom = Number(
      $("#property-bathroom").val()
    );
  });
  $("#property-bathroom").on("change", function () {
    if ($(this).val() > 0)
      EditProperty.editionsToSend.bathroom = Number(
        $("#property-bathroom").val()
      );
  });
  /* SET NEW PROPERTY ROOMS */
  $("#room-up").on("click", function () {
    $("#property-room").val(Number($("#property-room").val()) + 1);
    EditProperty.editionsToSend.room = Number($("#property-room").val());
  });
  $("#room-down").on("click", function () {
    if ($("#property-room").val() > 0)
      $("#property-room").val(Number($("#property-room").val()) - 1);
    EditProperty.editionsToSend.room = Number($("#property-room").val());
  });
  $("#property-room").on("change", function () {
    if ($(this).val() > 0)
      EditProperty.editionsToSend.room = Number($("#property-room").val());
  });
  /* SET NEW PROPERTY SIZE */
  $("#size-up").on("click", function () {
    $("#property-size").val(Number($("#property-size").val()) + 1);
    EditProperty.editionsToSend.size = Number($("#property-size").val());
  });
  $("#size-down").on("click", function () {
    if ($("#property-size").val() > 0) {
      $("#property-size").val(Number($("#property-size").val()) - 1);
      EditProperty.editionsToSend.size = Number($("#property-size").val());
    }
  });
  $("#property-size").on("change", function () {
    if ($(this).val() > 0)
      EditProperty.editionsToSend.size = Number($("#property-size").val());
  });
  /* SET NEW PROPERTY VIDEO URL */
  $("#property-video-btn").on("click", function () {
    const regEx =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    const url = $("#property-video-url").val();
    if (url !== "") {
      if (regEx.test(url)) {
        let urlId = url.split("https://youtu.be/")[1];
        EditProperty.editionsToSend.video_url = urlId;
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
    if (!$(this).data("highlight")) {
      $(this).toggleClass("selected-hightlight");
      EditProperty.editionsToSend.highlight = true;
    } else {
      if (!EditProperty.editionsToSend.highlight) {
        $(this).toggleClass("selected-hightlight");
        EditProperty.editionsToSend.highlight = !$(this).data("highlight");
      } else {
        $(this).toggleClass("selected-hightlight");
        EditProperty.editionsToSend.highlight =
          !EditProperty.editionsToSend.highlight;
      }
    }
  });
  /* SET PROPERTY TYPE */
  $("#property-type").on("change", function () {
    EditProperty.editionsToSend.type = $("#property-type")
      .children("option:selected")
      .val();
  });
  /* SET PROPERTY CHARACTERISTICS */
  $("#property-features").on("keyup", function () {
    EditProperty.editionsToSend.property_characteristics = $(this).val();
  });
  /* SET PROPERTY TAGS */
  $("#property-tags").on("keyup", function () {
    EditProperty.editionsToSend.attractions_area = $(this).val();
  });
  /* SET PROPERTY PRICE */
  $("#property-price").on("keyup", function () {
    EditProperty.editionsToSend.price = $("#property-price").val();
  });
  /* SET PROPERTY CODE */
  $("#property-code").on("keyup", function () {
    EditProperty.editionsToSend.code = $("#property-code").val();
  });
  /* SET AREA FEATURES */
  $("#area-features").on("keyup", function () {
    EditProperty.editionsToSend.area_features = $("#area-features").val();
  });
  /* SET PROPERTY UBICATION */
  $("#property-direction-edit").on("change", function () {
    EditProperty.editionsToSend.ubication_name = $(
      "#property-direction-edit"
    ).val();
  });
  /* SET PROPERTY DEPARMENT */
  $("#property-department-edit").on("change", function () {
    EditProperty.editionsToSend.department = $("#property-department-edit")
      .children("option:selected")
      .val();
  });
  /* GET IMAGES POSITIONS */
  console.log(EditProperty.newImgsPositions);

  /* SUBMIT DATA */
  $(".property-submit-edit").on("click", function () {
    /* CHECK NEW UBICATION */
    if (data.name !== "") {
      EditProperty.editionsToSend.ubication_name = data.name;
      EditProperty.editionsToSend.ubication_lat = data.lat;
      EditProperty.editionsToSend.ubication_lng = data.lng;
      EditProperty.editionsToSend.ubication_area = data.area;
    }
    // GET IMAGES POSITIONS
    if (EditProperty.newImgsPositions.length > 0) {
      EditProperty.editionsToSend.images = EditProperty.newImgsPositions;
    }

    // console.log(EditProperty.editionsToSend.images);

    // console.log(EditProperty.editionsToSend);

    AdminNavbar.showLoading();

    /* SEND DATA */
    const formData = new FormData();
    for (const data in EditProperty.editionsToSend) {
      // console.log(EditProperty.editionsToSend);
      formData.append(data, EditProperty.editionsToSend[data]);
    }
    const pathArray = window.location.pathname.split("/");
    formData.append("id", pathArray[4]);

    $.ajax({
      type: "POST",
      url: "/admin/properties/edit",
      data: formData,
      processData: false, // tell jQuery not to process the data
      contentType: false, // tell jQuery not to set contentType
      success: function (res) {
        // console.log(res);
        if (res.status == "ok") {
          // console.log(res.message);
          AdminNavbar.hiddenLoading();
          // window.location.href = res.redirectURL;
        }
      },
      error: function (err) {
        const { msg } = err.responseJSON;
        alert(msg);
      },
    });
  });
};

EditProperty.enableDragAndDrop = function () {
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
        console.log(EditProperty.newImgsPositions);
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
