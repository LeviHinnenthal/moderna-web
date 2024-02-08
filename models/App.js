const { Schema, model } = require("mongoose");

const appSchema = new Schema({
  total_views_today: {type: Number, default: 0},
  views_this_month: {type: Number, default: 0},
  views_this_month_properties: {type: Number, default: 0},
  views_this_month_newsletter: {type: Number, default: 0},
  created_on: { type: Date, default: Date.now },
  update_on: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

appSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const App = model("App", appSchema);

module.exports = App;
