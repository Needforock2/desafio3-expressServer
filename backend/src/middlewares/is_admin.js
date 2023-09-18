export default function (req, res, next) {
    try {
        if (req.session.role === 1) {
            next()
        } else {
            return res.status(403).json({
                success: false,
                response: "forbidden"
            })
        }
    } catch (error) {
        next(error)
    }
}