import passport from "passport";
import { Strategy } from "passport-local";
import User from "../dao/models/user.js";
import GHStrategy from "passport-github2";
import  jwt  from "passport-jwt";

export default function inicializePassport() {
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Recupera al usuario por su ID
      done(null, user); // Carga el usuario en req.user
    } catch (error) {
      done(error);
    }
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
            let name= req.body.first_name
            req.body.photo = `https://robohash.org/${name}`
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
    new Strategy(
      { usernameField: "mail" },
      async (username, password, done) => {
        try {
          let one = await User.findOne({ mail: username });
          if (one) {
            return done(null, one);
          }
          return done(null, false);
        } catch (error) {
          return done(error);
        }
      }
    )
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
          const one = await User.findOne({ mail: profile._json.login });
          if (one) {
            done(null, one);
          } else {
            let user = await User.create({
              name: profile._json.name,
              photo: profile._json.avatar_url,
              mail: profile._json.login,
              password: profile._json.url,
            });
            console.log("user:", user);
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //JWT

  passport.use(
    "jwt",
    new jwt.Strategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([
          (req) => req?.cookies["token"],
        ]),
        secretOrKey: process.env.SECRET_TOKEN,
      },
      async (payload, done) => {
        try {
          let one = await User.findOne({ mail: payload.email });      
          if (one) {
            return done(null, one); 
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.use(
    "current",
    new jwt.Strategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([
          (req) => req?.cookies["token"],
        ]),
        secretOrKey: process.env.SECRET_TOKEN,
      },
      async (payload, done) => {
        try {
          let one = await User.findOne(
            { mail: payload.email },
            "first_name last_name age mail photo role"
          );
          if (one) {
           return done(null, one);
          } else {
            return done(null);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );




