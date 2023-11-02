export default function is_email_ok(req, res, next) {
  try {
    const { mail} = req.body;
    if (mail) {
      next();
    } else {
      return res.status(400).json({
        success: false,
        message: "please enter a valid email",
      });
    }
  } catch (error) {
    next(error);
  }
}
