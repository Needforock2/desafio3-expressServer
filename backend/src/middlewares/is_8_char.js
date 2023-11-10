export default function is_8_char(req, res, next) {
    try {
        if (req.body.password.trim().length > 7) {
            next()
        } else {
            return res.status(400).json({
                success: false,
                message: "password must have 8  characters at least"
            })
        }
    } catch (error) {
        next(error)
    }
}