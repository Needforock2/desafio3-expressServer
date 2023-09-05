import { compareSync } from "bcrypt";
import User from "../dao/models/user.js";


export default async function is_valid_pass(req, res, next) {

    try {
        const one = await User.findOne({ mail: req.body.mail });
        const pass_from_form = req.body.password
        const hashed_pass = one.password

        let verified = compareSync(pass_from_form, hashed_pass);
         if (verified) {
           return next();
        }
        return res.status(401).json({
          status: 401,
          method: req.method,
          path: req.url,
          message: "invalid credentials",
        });
    } catch (error) {
        next(error)
    }  
    
}