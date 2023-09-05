import { Router } from "express";
import User from "../dao/models/user.js";
import is_form_ok from "../middlewares/is_form_ok.js";
import is_8_char from "../middlewares/is_8_char.js";
import is_valid_user from "../middlewares/is_valid_user.js";
import { user_exists } from "../middlewares/user_exists.js";
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

//LOGIN

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
      console.log(req.user);
      req.session.mail = req.user.mail;
      req.session.role = req.user.role;
      return res.status(200).json({
        session: req.session,
        message: req.session.mail + " inició sesión",
      });
    } catch (error) {
      next(error);
    }
  }
);

auth_router.get("/fail-login", (req, res) => {
  res.status(400).json({
    success: false,
    message: "invalid credentials",
  });
});

//logout


auth_router.post("/logout", async (req, res, next) => {
  try {
    req.session.destroy();
    res.cookie("connect.sid", "", { expires: new Date(0) });
    return res.status(200).json({
      success: true,
      message: "sesion cerrada",
      dataSession: req.session,
    });
  } catch (error) {
    next(error);
  }
});

//GH register
auth_router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:mail"] }),
  (req, res) => {

  }
);
auth_router.get(
  "/github/callback",
  passport.authenticate("github", {}),
  create_token,
  (req, res, next) => {
    try {
      req.session.mail = req.user.mail;
        req.session.role = req.user.role;
        console.log(req.session)
      const session = JSON.stringify(req.session);
      return res.status(200).send(
        `<!DOCTYPE html>
            <html lang="en">
            <body>    
            </body>
            <script>
                window.opener.postMessage(${session}, 'http://localhost:5173')
            </script>
            </html>`
      );

    } catch (error) {
      next(error);
    }
  }
);

export default auth_router;
