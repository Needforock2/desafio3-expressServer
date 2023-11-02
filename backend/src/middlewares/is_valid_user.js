
import dao from "../dao/factory.js";
const { User } = dao;
let model = new User()
export default async function (req, res, next) {
    try {
        const one = await model.findOne({ mail: req.body.mail })
        if (one) {
            next()
        } else {
            return res.sendInvalidCredentials()
        }
    } catch (error) {
        next(error)
    }
}