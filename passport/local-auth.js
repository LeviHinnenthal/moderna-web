const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      return done(null, false, req.flash("registerMessage", "jaja :*"));
      const regExEmail = /^[\w._]{4,30}(\+[\w]{0,10})?@[\w.-]{3,}?\.\w{2,5}$/;
      const regExPass = /^[\w]{5,30}$/;

      if (regExPass.test(password) !== true) {
        const msg =
          "Contraseña muy corta o dato inválidos: 5-16 caracteres, letras minúsculas y/o dígitos.";
        return done(null, false, req.flash("registerMessage", msg));
      }
      if (regExEmail.test(email) !== true) {
        const msg = "Email no válido.";
        return done(null, false, req.flash("registerMessage", msg));
      }
      const user = await User.findOne({ email: email });
      if (user) {
        const msg = "El email ya está en uso.";
        return done(null, false, req.flash("registerMessage", msg));
      } else {
        const newUser = new User({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
        });
        await newUser.save();
        return done(null, newUser);
      }
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        const msg = "El email no se encuentra registrado.";
        return done(null, false, req.flash("loginMessage", msg));
      }
      if (!user.validatePassword(password)) {
        const msg = "La contraseña no es correcta.";
        return done(null, false, req.flash("loginMessage", msg));
      }
      return done(null, user);
    }
  )
);
