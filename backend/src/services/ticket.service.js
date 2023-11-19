import TicketRep from "../repositories/ticket.rep.js";

export default class TicketService{
    constructor() {
        this.repository = new TicketRep()
    }
    readServ = (id)=> this.repository.readRep(id)
}

