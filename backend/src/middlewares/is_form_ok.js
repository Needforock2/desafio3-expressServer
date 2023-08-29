export default function is_form_ok(req,res,next) {
    try {
        const { name, mail, password } = req.body
        if (name && mail && password) {
            next()
        } else {
            return res.status(400).json({
                success: false,
                message: "please enter name, mail and password"
            })
        }
    } catch (error) {
        next(error)
    }
}