const { Schema, model } = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: String,
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return this.first_name + " " + this.last_name;
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

userSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);

const User = model("User", userSchema);

module.exports = User;
