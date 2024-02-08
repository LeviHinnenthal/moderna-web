let NewsletterSubscribe = {};
NewsletterSubscribe.email = undefined;

/* window.ready */
$(document).ready(function () {
  NewsletterSubscribe.bindFunctions();
});

NewsletterSubscribe.bindFunctions = function () {
  $("#newsletter--input").on("keyup", function () {
    NewsletterSubscribe.email = $(this).val();
  });

  $(".newsletter--btn").on("click", function () {
    function validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    if (!validateEmail(NewsletterSubscribe.email)) {
      NavBar.showErrorMessage("Debe colocar una dirección de email correcta.");
    }

    const formData = new FormData();
    formData.append("email", NewsletterSubscribe.email);

    NavBar.showLoading();

    $.ajax({
      type: "POST",
      url: "/subscribe",
      processData: false, // tell jQuery not to process the data
      contentType: false, // tell jQuery not to set contentType
      data: formData,
      success: function (res) {
        if (res.status == "ok") {
          NavBar.hiddenLoading();
          NavBar.showDoneMessage();
          // console.log(res);
        }
      },
      error: function (err) {
        const { msg } = err.responseJSON;
        alert(msg);
      },
    });
  });
};
