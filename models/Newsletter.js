const { Schema, model } = require("mongoose");

const newsletterSchema = new Schema({
  title: String,
  description: String,
  show_author: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  principal_img: String,
  text_img: String,
  video_url: String,
  sub_name1: String,
  sub_description1: String,
  sub_name2: String,
  sub_description2: String,
  sub_name3: String,
  sub_description3: String,
  sub_img: String,
  times_visited: {type: Number, default: 0},
  created_on: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

newsletterSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Newsletter = model("Newsletter", newsletterSchema);

module.exports = Newsletter;
