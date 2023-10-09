import User from "../dao/mongo/models/user.js";
import jwt from 'jsonwebtoken'

export default function verify_token_cookies (req, res, next){
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "invalid credentials",
            success: false
        })
    }
    jwt.verify(token, process.env.SECRET_TOKEN, async (error, credentials) => {
        try {
            let user = await User.findOne(
              { mail: credentials.email },
              "first_name last_name age mail photo role"
            );
            req.user = user
            return next()            
        } catch (error) {
            return res.status(401).json({
              message: "invalid credentials",
              success: false,
            });            
        }
    })
}
