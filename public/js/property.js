let Property = {};
Property.principalImagesArray = [];
Property.atractionsImagesArray = [];
Property.formTypeArr = ["visit", "call", "know_more"];
Property.formType = Property.formTypeArr[0];

/* window.ready */
$(document).ready(function () {
  const pathArray = window.location.pathname.split("/");
  let path = pathArray[1];
  if (path == "property") {
    Property.bindFunctions();
  }
});

Property.bindFunctions = function () {
  Property.principalImages();
  Property.atractionsImages();
  Property.principalCarrousell();
  Property.atractionsCarrousell();
  Property.loadVideo();
  Property.similarProperties();
  Property.contact();
  Property.contactVisit();
  Property.contactCall();
  Property.contactKnowMore();
  Property.contactRestart();
};

/* GET PRINCIPAL IMAGES */
Property.principalImages = function () {
  $(".data__src").each(function () {
    const dataAtractionsSrc = $(this).data("image");
    Property.principalImagesArray.push(dataAtractionsSrc);
  });
};

/* GET ATRACTIONS IMAGES */
Property.atractionsImages = function () {
  $(".data-atractions__src").each(function () {
    const dataSrc = $(this).data("image");
    Property.atractionsImagesArray.push(dataSrc);
  });
};

/* CHANGE PRINCIPAL IMAGE */
Property.principalCarrousell = function () {
  const imgContainer = $("#visible__img");
  let imgIndex = 0;

  if (imgIndex < Property.principalImagesArray.length - 1) {
    $(".change__next").css({ "background-color": "#FFFFFF" });
    $(".change__pre").css({ "background-color": "rgba(255, 255, 255, 0.5)" });
  }

  $(".change__pre").on("click", function () {
    // console.log("click");

    if (imgIndex > 0) {
      imgIndex = imgIndex - 1;
      imgContainer.attr("src", `${Property.principalImagesArray[imgIndex]}`);

      $(".images-dots")
        .children(".dot--selected")
        .prev()
        .addClass("dot--selected")
        .next()
        .removeClass("dot--selected");
    }
    if (imgIndex < Property.principalImagesArray.length - 1) {
      $(".change__pre").css({
        "background-color": "rgba(255, 255, 255, 0.5)",
      });
      $(".change__next").css({ "background-color": "#FFFFFF" });
    }
  });

  $(".change__next").on("click", function () {
    if (imgIndex < Property.principalImagesArray.length - 1) {
      imgIndex = imgIndex + 1;
      imgContainer.attr("src", `${Property.principalImagesArray[imgIndex]}`);

      $(".images-dots")
        .children(".dot--selected")
        .next()
        .addClass("dot--selected")
        .prev()
        .removeClass("dot--selected");
    }
    if (imgIndex === Property.principalImagesArray.length - 1) {
      $(".change__next").css({
        "background-color": "rgba(255, 255, 255, 0.5)",
      });
      $(".change__pre").css({ "background-color": "#FFFFFF" });
    }
  });
};

/* CHANGE ATRACTION IMAGE */
Property.atractionsCarrousell = function () {
  const imgContainer = $("#visible__img-atraction");
  let imgIndex = 0;

  if (imgIndex < Property.atractionsImagesArray.length - 1) {
    $(".change__next__atraction").css({ "background-color": "#FFFFFF" });
    $(".change__pre__atraction").css({
      "background-color": "rgba(255, 255, 255, 0.5)",
    });
  }

  $(".change__pre__atraction").on("click", function () {
    if (imgIndex > 0) {
      imgIndex = imgIndex - 1;
      imgContainer.attr("src", `${Property.atractionsImagesArray[imgIndex]}`);

      $(".atractions-dots")
        .children(".dot--selected")
        .prev()
        .addClass("dot--selected")
        .next()
        .removeClass("dot--selected");
    }
    if (imgIndex < Property.atractionsImagesArray.length - 1) {
      $(".change__pre__atraction").css({
        "background-color": "rgba(255, 255, 255, 0.5)",
      });
      $(".change__next__atraction").css({ "background-color": "#FFFFFF" });
    }
  });

  $(".change__next__atraction").on("click", function () {
    if (imgIndex < Property.atractionsImagesArray.length - 1) {
      imgIndex = imgIndex + 1;
      imgContainer.attr("src", `${Property.atractionsImagesArray[imgIndex]}`);

      $(".atractions-dots")
        .children(".dot--selected")
        .next()
        .addClass("dot--selected")
        .prev()
        .removeClass("dot--selected");
    }
    if (imgIndex === Property.atractionsImagesArray.length - 1) {
      $(".change__next__atraction").css({
        "background-color": "rgba(255, 255, 255, 0.5)",
      });
      $(".change__pre__atraction").css({ "background-color": "#FFFFFF" });
    }
  });
};

/* LOAD VIDEO YOUTUBE */
Property.loadVideo = function () {
  const videoSRC = $("#video-source").data("video");
  let videoId = videoSRC;
  if (videoId !== undefined || videoId !== "") {
    const videoSRC2 = "https://www.youtube.com/embed/" + videoId;
    $("#video-source").attr("src", videoSRC2);
  }
};

Property.similarProperties = function () {
  let imagesSRC = [];
  $(".similar-propierties--card").mouseenter(async function () {
    const imgSrcContainer = $(this)
      .children(".similar--card--link")
      .children(".similar-propierties--card--img");

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
  $(".similar-propierties--card").mouseleave(function () {
    const imgSrcContainer = $(this)
      .children(".similar--card--link")
      .children(".similar-propierties--card--img");

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

/* SEND CONSULTE FOR PROPERTY */
Property.contact = function () {
  $(".property--form--submit").on("click", function () {
    const form = {};
    form.msg = $(".msg").val();
    form.name = $(".name").val();
    form.last_name = $(".last_name").val();
    form.email = $(".email").val();
    form.phone = $(".phone").val();
    form.id = $(".property--form--container").data("id");
    form.type = Property.formType;
    console.log("Envío del formulario", form);

    const templateParams = {
      name: form.name,
      last_name: form.last_name,
      msg: form.msg,
      email: form.email,
      phone: form.phone,
      id: form.id,
      type: Property.formType,
    };

    if (form.name === "") return alert("Debe ingresar su nombre");
    if (form.last_name === "") return alert("Debe ingresar su apellido");
    if (form.phone === "") return alert("Debe ingresar su número de contacto");
    if (form.email === "") return alert("Debe ingresar su email");

    NavBar.showLoading();

    emailjs.send("service_4vjqqxx", "template_culxz39", templateParams).then(
      function (response) {
        NavBar.hiddenLoading();
        setTimeout(NavBar.showDoneMessage(), 1000);
        console.log("SUCCESS!", response.status, response.text);
      },
      function (err) {
        console.log("FAILED...", err);
      }
    );
  });
};

// Visita
Property.contactVisit = function () {
  $(".property--form--visit").on("click", function () {
    Property.formType = Property.formTypeArr[0];

    $(".property--form--container-buttons").addClass("hide--form--buttons");
    $(".msg").val("Hola, quiero visitar esta propiedad.");
  });
};

// Llamada
Property.contactCall = function () {
  $(".property--form--call").on("click", function () {
    Property.formType = Property.formTypeArr[1];

    $(".property--form--container-buttons").addClass("hide--form--buttons");
    $(".msg").val(
      "Hola, quiero que me llamen por más información de esta propiedad."
    );
  });
};

// Saber más
Property.contactKnowMore = function () {
  $(".property--form--know-more").on("click", function () {
    Property.formType = Property.formTypeArr[2];

    $(".property--form--container-buttons").addClass("hide--form--buttons");
    $(".msg").val(
      "Hola, me interesa esta propiedad Agradezco más información."
    );
  });
};

Property.contactRestart = function () {
  $(".property--form--close").on("click", function () {
    Property.formType = Property.formTypeArr[0];

    $(".property--form--container-buttons").removeClass("hide--form--buttons");
    $(".msg").val("");
    $(".name").val("");
    $(".email").val("");
    $(".phone").val("");
    $(".msg")
      .attr(
        "placeholder",
        "Hola, me interesa esta propiedad Agradezco más información."
      )
      .placeholder();
  });
};
