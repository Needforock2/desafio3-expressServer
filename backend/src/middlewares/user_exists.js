import User from "../dao/models/user.js";

export async function user_exists(req, res, next) {
       try {
           const one = User.findOne({ mail: req.body.mail })
           console.log(one)
           if (!one.mail) {
               return next()
           } else {
                return res.status(400).json({
                  success: false,
                  message: "user already exists",
                });
           }
       } catch (error) {
            next(error)
       }
}