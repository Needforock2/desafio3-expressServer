import args from "../../config/arguments.js";
import TicketController from "../../controllers/ticket.controller.js";
import MyRouter from "../router.js";
const ticketController = new TicketController()

export default class TicketRouter extends MyRouter{
    init() {
        //READ
        this.read("/:tid", ["USER", "ADMIN", "PREMIUM"], async (req, res, next) => {
            let { tid } = req.params
            try {
                const ticket = await ticketController.readController(tid)
                if (ticket) {
                    return res.sendSuccess(ticket.response);
                } else {
                    return res.sendNotFound();
                }                
            } catch (error) {
                return next(error)
            }
        })
    }
}