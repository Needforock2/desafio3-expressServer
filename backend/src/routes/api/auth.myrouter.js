import MyRouter from "../router.js";
import AuthController from "../../controllers/auth.controller.js";
import is_form_ok from "../../middlewares/is_form_ok.js";
import is_8_char from "../../middlewares/is_8_char.js";
import createHash from "../../middlewares/createHash.js";
import is_user from "../../middlewares/is_user.js";
import is_valid_pass from "../../middlewares/is_valid_pass.js";
import create_token from "../../middlewares/create_token.js";
import passport from "passport";
const authController = new AuthController();

export default class AuthRouter extends MyRouter {
  init() {
    //register
    this.post(
      "/register",
      ["PUBLIC"],
      is_form_ok,
      is_8_char,
      createHash,
      async (req, res, next) => {
        try {
          let data = req.body;
          let response = await authController.register(data);
          if (response.success) {
            return res.sendSuccessCreate(response);
          } else {
            return res.sendNotRegistered(response);
          }
        } catch (error) {
          next(error);
        }
      }
    );

    //login
    this.post(
      "/login",
      ["PUBLIC"],
      is_user,
      is_valid_pass,
      create_token,
      async (req, res, next) => {
        try {
          req.session.mail = req.body.mail;
          req.session.role = req.user.role;
          const controller = new AuthController();
          let response = await controller.login();
          if (response) {
            return res
              .cookie("token", req.session.token, {
                maxAge: 60 * 60 * 25 * 7 * 1000,
                httpOnly: false,
              })
              .sendSuccess({
                session: req.session,
                message: req.session.mail + " inició sesión",
              });
          } else {
            return res.sendNotFound("user");
          }
        } catch (error) {}
      }
    );

    //logout
    this.post(
      "/logout",
      ["PUBLIC"],
      passport.authenticate("jwt", { session: false }),
      async (req, res, next) => {
          try {
              req.session.destroy();
              const controller = new AuthController()
              await controller.logout()
              res.cookie("token", "", { expires: new Date(0) });
              return res.sendSuccess({
                success: true,
                message: "sesion cerrada",
                dataSession: req.session,
              });
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
