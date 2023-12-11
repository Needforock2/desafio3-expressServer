import MyRouter from "../router.js";
import AuthController from "../../controllers/auth.controller.js";
import is_form_ok from "../../middlewares/is_form_ok.js";
import is_8_char from "../../middlewares/is_8_char.js";
import createHash from "../../middlewares/createHash.js";
import is_user from "../../middlewares/is_user.js";
import is_valid_pass from "../../middlewares/is_valid_pass.js";
import create_token from "../../middlewares/create_token.js";
import passport from "passport";
import is_valid_user from "../../middlewares/is_valid_user.js";
import transporter from "../../config/transporter.js";
import config from "../../config/env.js";
import jwt from "jsonwebtoken";
import verify_token_pass_reset from "../../middlewares/verify_token_pass_reset.js";
import check_pass_reset from "../../middlewares/check_pass_reset.js";
import is_email_ok from "../../middlewares/is_email_ok.js";
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
      is_email_ok,
      is_user,
      is_valid_pass,
      create_token,
      async (req, res, next) => {
        try {
          req.session.mail = req.body.mail;
          req.session.role = req.user.role;
          let response = await authController.login();
          if (response) {
            return res
              .cookie("token", req.session.token, {
                domain: `https://prismatic-conkies-0cf372.netlify.app`,
                maxAge: 60 * 60 * 25 * 7 * 1000,
                httpOnly: true,
                sameSite: "None",
                secure: true
              })
              .sendSuccess({
                session: req.session,
                message: req.session.mail + " inició sesión",
              });
          } else {
            return res.sendNotFound("user");
          }
        } catch (error) {
          next(error);
        }
      }
    );

    //logout
    this.post(
      "/logout",
      ["USER", "ADMIN", "PREMIUM"],
      passport.authenticate("jwt", { session: false }),
      async (req, res, next) => {
        try {
          req.session.destroy();
          await authController.logout();
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

    //ROL CHANGING
    this.put("/premium", ["USER", "PREMIUM"], async (req, res, next) => {
      try {
        let response = await authController.changeRole(req.user._id);
        if (response) {
          return res.sendSuccess(response);
        }
      } catch (error) {
        next(error);
      }
    });

    //PASSWORD RESET REQUEST
    this.post(
      "/reset_req",
      ["PUBLIC"],
      is_email_ok,
      is_valid_user,
      async (req, res, next) => {
        try {
          let mail = req.body.mail;
          let token = jwt.sign(
            { email: req.body.mail },
            process.env.SECRET_TOKEN,
            { expiresIn: 60 * 60 }
          );
          let maskedToken = token.replace(/\./g, "*");
          let message = `<h2>Sigue el siguiente enlace para reestablecer tu contraseña<h2> </br> <a href='${process.env.FRONT_HOST}/pass_reset/${maskedToken}'>Reestablecer contraseña</a>`;
          await transporter.sendMail({
            from: `Cachupines.cl <${config.G_MAIL}>`,
            to: `${mail}`,
            subject: "Enlace de cambio de contraseña",
            html: message,
          });
          return res.sendSuccess({
            success: true,
            message:
              "Enlace de reestablecimiento de contraseña enviado a tu correo",
          });
        } catch (error) {
          next(error);
        }
      }
    );

    // PASSWORD RESET
    this.post(
      "/pass_reset",
      ["PUBLIC"],
      verify_token_pass_reset,
      check_pass_reset,
      is_8_char,
      createHash,
      async (req, res, next) => {
        let response = await authController.updateOne(
          req.user.response.mail,
          req.body
        );
        if (response) {
          return res.sendSuccess({
            success: true,
            message: "Contraseña Cambiada",
          });
        } else {
          return res.sendNotFound();
        }
      }
    );

    //GH register
    this.read(
      "/github",
      ["PUBLIC"],
      passport.authenticate("github", { scope: ["user:mail"] }),
      (req, res) => {}
    );

    //GH LOGIN
    this.read(
      "/github/callback",
      ["PUBLIC"],
      passport.authenticate("github", {}),
      create_token,
      (req, res, next) => {
        try {
          req.session.mail = req.user.mail;
          req.session.role = req.user.role;

          const session = JSON.stringify(req.session);

          return res.status(200)
            .send(
            `<!DOCTYPE html>
            <html lang="en">
            <body>    
            </body>
            <script>
                window.opener.postMessage(${session}, ${process.env.FRONT_HOST})
            </script>
            </html>`
          );
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
