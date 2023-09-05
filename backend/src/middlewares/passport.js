import passport from "passport";
import { Strategy } from "passport-local";
import User from "../dao/models/user.js";
import GHStrategy from "passport-github2";

export default function inicializePassport() {
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    return done(null, user);
  });
}

passport.use(
  "register",
  new Strategy(
    { passReqToCallback: true, usernameField: "mail" },
    async (req, username, password, done) => {
      try {
        let one = await User.findOne({ mail: username });
        if (!one) {
          let user = await User.create(req.body);
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new Strategy({ usernameField: "mail" }, async (username, password, done) => {
    try {
      let one = await User.findOne({ mail: username });
      if (one) {
        return done(null, one);
      }
      return done(null, false);
    } catch (error) {
      return done(error);
    }
  })
);

//GITHUB
passport.use(
  "github",
  new GHStrategy(
    {
      clientID: process.env.GH_CLIENT_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: process.env.GH_CB,
    },
    async (accesToken, refreshToken, profile, done) => {
      try {
          const one = await User.findOne({ mail: profile._json.login })
          if (one) {
              done(null, one)
          } else {
              let user = await User.create({
                name: profile._json.name,
                photo: profile._json.avatar_url,
                  mail: profile._json.login,
                password: profile._json.url
              });
              console.log("user:", user)
              return done(null, user)
          }
      } catch (error) {
          return done(error)
      }
    }
  )
);
