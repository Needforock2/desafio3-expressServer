import AuthService from "../services/auth.service.js"


export default async function (req, res, next) {

    let model = new AuthService()
    try {
        const one = await model.readOne(req.body.mail)
        if (one) {
            next()
        } else {
            return res.sendInvalidCredentials()
        }
    } catch (error) {
        next(error)
    }
}