import User from "../dao/models/user.js"

export default async function (req, res, next) {
    try {
        const one = await User.findOne({ mail: req.body.mail })
        if (one && one.password === req.body.password) {
            next()
        } else {
            return res.status(400).json({
                success: false,
                message: "wrong mail and/or password"
            })
        }
    } catch (error) {
        next(error)
    }
}