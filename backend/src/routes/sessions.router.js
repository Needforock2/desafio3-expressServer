import { Router } from "express";
import auth from "../middlewares/auth.js";
import passport from "passport";
import current_user from "../middlewares/current_user.js";
import verify_token_cookies from "../middlewares/verify_token_cookies.js";

const sessions_router = Router();

sessions_router.get("/", (req, res) => {
  return res.status(200).json(req.session);
});

//CURRENT

sessions_router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res, next) => {
    try {
      if (req?.user && req.cookies["token"]) {
        return res.status(200).json({
          user: req.user,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "user not found",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

//LOGIN
sessions_router.post("/login", async (req, res, next) => {
  try {
    req.session.data = req.body;
    return res.status(200).json({
      session: req.session,
      message: req.session.data.mail + " inicio sesión",
    });
  } catch (error) {
    next(error);
  }
});

//LOGOUT

sessions_router.post("/logout", async (req, res, next) => {
  try {
    req.session.destroy();
    return res.status(200).json({
      success: true,
      message: "sesion cerrada",
      dataSession: req.session,
    });
  } catch (error) {
    next(error);
  }
});

export default sessions_router;
