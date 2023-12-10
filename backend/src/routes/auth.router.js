import { Router } from "express";
import is_form_ok from "../middlewares/is_form_ok.js";
import is_8_char from "../middlewares/is_8_char.js";
import createHash from "../middlewares/createHash.js";
import is_valid_pass from "../middlewares/is_valid_pass.js";
import passport from "passport";
import create_token from "../middlewares/create_token.js";


const auth_router = Router();

//Register

/* auth_router.post('/register', is_form_ok, is_8_char, user_exists, createHash, async(req, res, next) => {
    try {        
        const other = User.create(req.body)
        return res.status(201).json({
            success: true,
            message: "user registered"
        })
        
    } catch (error) {
        next(error)
    }
}) */

auth_router.post(
  "/register",
  is_form_ok,
  is_8_char,
  //user_exists,
  createHash,
  passport.authenticate("register", {
    failureRedirect: "/api/auth/fail-register",
  }),
  (req, res, next) => {
    try {
      return res.status(201).json({
        success: true,
        message: "user registered",
        userId: req.user._id,
      });
    } catch (error) {
      next(error);
    }
  }
);

auth_router.get("/fail-register", (req, res) => {
  res.status(400).json({
    success: false,
    message: "mail already in use",
  });
});

//LOGIN Passport

auth_router.post(
  "/login",
  is_8_char,
  passport.authenticate("login", {
    failureRedirect: "/api/auth/fail-login",
  }),
  is_valid_pass,
  create_token,
  async (req, res, next) => {
    try {
      req.session.mail = req.user.mail;
      req.session.role = req.user.role;
      return res
        .status(200)
        .cookie("token", req.session.token, {
          maxAge: 60 * 60 * 25 * 7 * 1000,
          httpOnly: false,
        })
        .json({
          session: req.session,
          message: req.session.mail + " inició sesión",
        });
    } catch (error) {
      next(error);
    }
  }
);

/* auth_router.post(
  "/login",
  is_8_char,
  is_valid_user,
  is_valid_pass,
  create_token,
  async (req, res, next) => {
    try {
      req.session.mail = req.body.mail;
      let one = await User.findOne({ mail: req.body.mail }); //documento de mongo con todas las propiedades del usuario
      req.session.role = one.role;
      console.log(req.session.token)
      return res
        .status(200)
        .cookie("token", req.session.token, {
          maxAge: 60 * 60 * 25 * 7 * 1000,
          httpOnly: false,
        })
        .json({
          session: req.session,
          message: req.session.mail + " inicio sesión",
        });
    } catch (error) {
      next(error);
    }
  }
); */

auth_router.get("/fail-login", (req, res) => {
  res.status(400).json({
    success: false,
    message: "invalid credentials",
  });
});

//logout

auth_router.post(
  "/logout",
  passport.authenticate("jwt",{ session:false }),
  async (req, res, next) => {
    try {
      req.session.destroy();
      res.cookie("token", "", { expires: new Date(0) });
      return res.status(200).json({
        success: true,
        message: "sesion cerrada",
        dataSession: req.session,
      });
    } catch (error) {
      next(error);
    }
  }
);

//GH register
auth_router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:mail"] }),
  (req, res) => {}
);

auth_router.get(
  "/github/callback",
  passport.authenticate("github", {}),
  create_token,
  (req, res, next) => {
    try {
      req.session.mail = req.user.mail;
      req.session.role = req.user.role;
      const session = JSON.stringify(req.session);
      return res.status(200).send(
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

export default auth_router;
