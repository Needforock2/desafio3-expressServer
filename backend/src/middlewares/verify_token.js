import User from "../dao/mongo/models/user.js";
import jwt from 'jsonwebtoken'

export default function verify_token (req, res, next){
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({
            message: "invalid credentials",
            success: false
        })
    }
    const token = auth.split(" ")[1]
    jwt.verify(token, process.env.SECRET_TOKEN, async (error, credentials) => {
        try {
            let user = await User.findOne({ mail: credentials.mail })
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
