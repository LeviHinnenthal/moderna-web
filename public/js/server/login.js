var AdminLogin = {};

/* window.ready */
$(document).ready(function () {
  AdminLogin.bindFunctions();
});

AdminLogin.bindFunctions = function () {
  // AdminLogin.submit();
};

/* SUBMIT LOGIN */
AdminLogin.submit = function () {
  $("#login--submit").on("click", function () {
    const email = $("#admin-form--email").val(),
      password = $("#admin-form--pass").val();

    if (!email) return alert("Ingrese un email para loguearse.");
    if (!password) return alert("Ingrese una contraseña para loguearse.");

    $.ajax({
      type: "POST",
      url: "/admin/auth",
      data: { email, password },
      success: function (res) {
        
      },
      error: function (err) {
        const error = err.responseJSON.error;
        alert(error);
      },
    });
  });
};
