const { Schema, model } = require("mongoose");

const propertySchema = new Schema({
  name: String,
  description: String,
  sell_or_rent: String,
  price: String,
  bathroom: Number,
  room: Number,
  size: Number,
  type: String,
  code: String,
  property_characteristics: [{ type: String }],
  attractions_area: [{ type: String }],
  area_features: String,
  primary_img: String,
  secondary_img: String,
  images: [{ type: String }],
  highlight: { type: Boolean, default: false },
  video_url: String,
  ubication_name: String,
  ubication_lat: String,
  ubication_lng: String,
  ubication_area: String,
  department: String,
  attractions_images: [{ type: String }],
  neighbors: [{ type: Schema.Types.ObjectId, ref: "Neighbor" }],
  times_visited: {type: Number, default: 0},
  active: { type: Boolean, default: true },
  created_on: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

propertySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Property = model("Property", propertySchema);

module.exports = Property;
