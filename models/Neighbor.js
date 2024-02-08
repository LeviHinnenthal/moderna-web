const { Schema, model } = require("mongoose");

const neighborSchema = new Schema({
  name: String,
  sex: String,
  living_zone_stars: Number,
  review: String,
  property_related: { type: Schema.Types.ObjectId, ref: "Property" },
  created_on: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

neighborSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Neighbor = model("Neighbor", neighborSchema);

module.exports = Neighbor;
