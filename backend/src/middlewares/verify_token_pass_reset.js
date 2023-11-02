import User from "../dao/mongo/models/user.js";
import jwt from 'jsonwebtoken'
import AuthService from "../services/auth.service.js";


export default function verify_token_pass_reset(req, res, next) {
    const auth_service = new AuthService()
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({
            message: "invalid credentials",
            success: false
        })
    }
      let maskedToken = req.headers.authorization.split(" ")[1];
    let token = maskedToken.replace(/\*/g, "."); 

    jwt.verify(token, process.env.SECRET_TOKEN, async (error, credentials) => {
   
        try {
            if (credentials) {
                let user = await auth_service.readOne(credentials.email)
                req.user = user
                return next()                
            } else {
                return res.sendExpired()
            }
        } catch (error) {
            return next(error)      
        }
    })
}
