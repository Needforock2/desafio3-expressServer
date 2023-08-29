import { Router } from "express";
import User from "../dao/models/user.js";
import is_form_ok from "../middlewares/is_form_ok.js";
import is_8_char from "../middlewares/is_8_char.js";
import is_valid_user from "../middlewares/is_valid_user.js";
import { user_exists } from "../middlewares/user_exists.js";

const auth_router = Router()

//Register

auth_router.post('/register', is_form_ok, is_8_char, user_exists, async(req, res, next) => {
    try {        
        const other = User.create(req.body)
        return res.status(201).json({
            success: true,
            message: "user registered"
        })
        
    } catch (error) {
        next(error)
    }
})

//LOGIN

auth_router.post('/login', is_8_char, is_valid_user, async(req, res, next) => {
    try {
        req.session.mail = req.body.mail;
        let one = await User.findOne({ mail: req.body.mail });
        req.session.role = one.role
        return res
          .status(200)
          .json({
            session: req.session,
            message: req.session.mail + " inició sesión",
          })
          
    } catch (error) {
        next(error)
    }
})

//logout

auth_router.post('/logout', async(req, res, next) => {
    try {
      req.session.destroy();
      res.cookie("connect.sid", "", { expires: new Date(0) });
      return res.status(200).json({
        success: true,
        message: "sesion cerrada",
        dataSession: req.session,
      });
    } catch (error) {
        next(error)
    }
})

export default auth_router