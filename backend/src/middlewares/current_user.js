import jwt from "passport-jwt";
import User from "../dao/mongo/models/user.js";


export default async function current_user(req, res, next) {

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
          done(null, one);
        } else {
          done(null, false);
        }
      } catch (error) {
        next(error)
      }
    }
  );
}
    