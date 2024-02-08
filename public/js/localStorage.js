var LocalStorage = {};

/* windows.ready */
$(document).ready(function () {
  LocalStorage.bindFunctions();
});

LocalStorage.bindFunctions = function () {
  LocalStorage.setPropertiesLocalStorage();
};

LocalStorage.setPropertiesLocalStorage = function () {
  let getProperties = localStorage.getItem("properties");
  let setProperties;
  $.ajax({
    url: "/properties-raw",
    success: function (res) {
      setProperties = localStorage.setItem("properties", JSON.stringify(res));
    },
  });
};
