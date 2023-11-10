import { compareSync } from "bcrypt";
import dao from "../dao/factory.js";
const { User } = dao;


export default async function is_valid_pass(req, res, next) {
const model = new User();
  try {
    if (req.body.password) {
        const one = await model.readOne(req.body.mail);
        const pass_from_form = req.body.password;
        const hashed_pass = one.response.password;
        let verified = compareSync(pass_from_form, hashed_pass);
        if (verified) {
          return next();
        }
        return res.sendInvalidCredentials();
    } else {
      return res.status(400).json({
        success: false,
        message: "please enter a valid password",
      });
    }
      
    } catch (error) {
        next(error)
    }  
    
}