import dao from "../dao/factory.js";
const { Ticket } = dao
export default class TicketRep{
    constructor() {
        this.model = new Ticket()
    }
    readRep = (id)=> this.model.readModel(id)
}
