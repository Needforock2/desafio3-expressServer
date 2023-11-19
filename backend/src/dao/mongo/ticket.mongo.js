import Ticket from "./models/ticket.js";

export default class TicketPersistance{
    constructor() { }
    async readModel(id) {

        let one = await Ticket.findById(id)
        if (one) {
            return {
                status: "success",
                response: one
            }            
        } else {
            return null
        }
    }
}