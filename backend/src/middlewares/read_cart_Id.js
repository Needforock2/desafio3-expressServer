import AuthService from "../services/auth.service.js";
export default async function read_cart_Id(req, res, next) {
    const auth_service = new AuthService()
  try {
    const user = await auth_service.readOne(req.user.mail)
    next()
  } catch (error) {
    return next(error);
  }
  
}
