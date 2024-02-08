/* GOOGLE MAPS AUTOCMPLETE */
let autocomplete;
const data = {
  area: "",
  name: "",
  lat: "",
  lng: ""
}
window.initAutocomplete = function () {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("property-direction-edit"),
    {
      types: ["address"],
      componentRestrictions: { country: ["UY"] },
      fields: ["address_components", "geometry", "icon", "name"],
    }
  );

  autocomplete.addListener("place_changed", onPlaceChanged);
};

function onPlaceChanged() {
  var place = autocomplete.getPlace();

  if (!place.geometry) {
    document.getElementById("property-direction").placeholder =
      "Seleccione una dirección válida";
  } else {
    // get lat
    let lat = place.geometry.location.lat();
    // get lng
    let lng = place.geometry.location.lng();
    //get area
    let area = place.address_components[3].short_name;

    // console.log(place.address_components);

    data.lat = `${lat}`;
    data.lng = `${lng}`;
    data.area = `${area}`;
    data.name = place.name;
  }
}
