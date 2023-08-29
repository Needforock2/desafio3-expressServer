import { Router } from "express";
import auth from "../middlewares/auth.js";

const sessions_router = Router()

sessions_router.get('/', (req, res) => {
    return res.status(200).json(req.session)
})

//LOGIN
sessions_router.post('/login', async (req, res, next) => {
    try {
        req.session.data = req.body;
        return res.status(200).json({
          session: req.session,
          message: req.session.data.mail + " inicio sesión",
        });
    } catch (error) {
        next(error)
    }
    
})

//LOGOUT

sessions_router.post('/logout', async (req, res, next) => {
    try {
        req.session.destroy()
        return res.status(200).json({
            success: true,
            message: 'sesion cerrada',
            dataSession: req.session
        })
    } catch (error) {
        next(error)
    }
})


export default sessions_router