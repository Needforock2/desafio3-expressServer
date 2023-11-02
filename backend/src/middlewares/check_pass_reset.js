import { compareSync } from "bcrypt";

export default async function check_pass_reset(req, res, next) {
  try {
    const one = req.user
    const pass_from_form = req.body.password;
    const hashed_pass = one.response.password;
    let verified = compareSync(pass_from_form, hashed_pass);
    if (verified) {
        return res.sendNoAuthorizedError("Debes usar una contraseña diferente")
    } 
    return next()
  } catch (error) {

    next(error);
  }
}
