import passport from "passport";
import { Strategy } from "passport-local";
import GHStrategy from "passport-github2";
import jwt from "passport-jwt";
import config from "../config/env.js";
import { hashSync, genSaltSync } from "bcrypt";
import dao from "../dao/factory.js";
const { User } = dao;

export default function inicializePassport() {
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const model = new User();
      const user = await model.readById(id); // Recupera al usuario por su ID
      done(null, user.response); // Carga el usuario en req.user
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
        const model = new User();
        let one = await model.readOne({ mail: username });
        if (!one) {
          let name = req.body.first_name;
          req.body.photo = `https://robohash.org/${name}`;
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
      const model = new User();
      let one = await model.readOne({ mail: username });
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
      clientID: config.GH_CLIENT_ID,
      clientSecret: config.GH_SECRET,
      callbackURL: config.GH_CB,
    },
    async (accesToken, refreshToken, profile, done) => {
      try {
        const model = new User();
        const one = await model.readOne(profile._json.login);
    
        if (one) {
          done(null, one.response);
        } else {
          let hashed_pass = hashSync(
            profile._json.url,
            genSaltSync(10)
          );
          let nameSplitted = profile._json.name.split(" ")
          let user = await model.register({
            first_name: nameSplitted[0],
            last_name: nameSplitted[1],
            photo: profile._json.avatar_url,
            mail: profile._json.login,
            password: hashed_pass,
          });
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
        (req) => {
          return req?.cookies["token"];
        },
      ]),
      secretOrKey: process.env.SECRET_TOKEN,
    },
    async (payload, done) => {
      try {
        const model = new User();
        let one = await model.readOne(payload.email);
        if (one) {
          return done(null, one.response);
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
        (req) => {
          
          return req?.cookies["token"]
        },
      ]),
      secretOrKey: process.env.SECRET_TOKEN,
    },
   
    async (payload, done) => {
      try {
        const model = new User();
        let one = await model.readCurrent(
          { mail: payload.email },
          "first_name last_name age mail photo role"
        );
        if (one) {
          return done(null, one.response);
        } else {
          return done(null);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);
