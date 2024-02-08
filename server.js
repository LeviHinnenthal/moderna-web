require("dotenv").config();

/* REQUIRED */
const path = require("path");
const express = require("express");
const PORT = process.env.PORT;
const cors = require("cors");
const webRouter = require("./routes/webRouter");
const serverRouter = require("./routes/serverRouter");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

/* INITIALIZATIONS */
const app = express();
require("./mongo");
require("./passport/local-auth");

/* SETTINGS */
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* MIDDLEWARES */
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "modernapropiedades",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  app.locals.registerMessage = req.flash("registerMessage");
  app.locals.loginMessage = req.flash("loginMessage");
  app.locals.user = req.user;
  // console.log(app.locals)
  next();
});

/* ROUTES */
app.use(webRouter);
app.use(serverRouter);

/* CONNECTION */
app.listen(process.env.PORT || 8080, () =>
  console.log(`Server runing on port ${PORT}`)
);
