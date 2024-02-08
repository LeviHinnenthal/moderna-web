const { Schema, model } = require("mongoose");

const bannerSchema = new Schema({
  name: String,
  image_url: String,
  type: String,
  active: { type: Boolean, default: true },
  created_on: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

bannerSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Banner = model("Banner", bannerSchema);

module.exports = Banner;
