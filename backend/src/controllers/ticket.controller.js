import TicketService from "../services/ticket.service.js";

export default class TicketController {
  constructor() {
    this.service = new TicketService()
  }
  readController = (id) => this.service.readServ(id);
}
