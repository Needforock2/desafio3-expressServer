import User from "../dao/models/user.js"

export default async function (req, res, next) {
    try {
        const one = await User.findOne({ mail: req.body.mail })
        if (one) {
            next()
        } else {
            return res.sendInvalidCredentials()
        }
    } catch (error) {
        next(error)
    }
}