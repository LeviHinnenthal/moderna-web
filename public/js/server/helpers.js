var Helpers = {};

/* window.ready */
$(document).ready(function () {
  Helpers.bindFunctions();
});

Helpers.bindFunctions = function () {
  Helpers.uploadFiles();
};

Helpers.uploadFiles = async (url,formData) => {
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
    });
};
