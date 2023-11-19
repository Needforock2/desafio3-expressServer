import jwt from 'jsonwebtoken'

export default function create_token(req, res, next) {
    let token = jwt.sign(
        { email: req.user.mail },
        process.env.SECRET_TOKEN,
        { expiresIn: 60*60*24 }
    )
    req.session.token = token
    return next()
}