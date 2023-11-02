import dao from "../dao/factory.js";
const { User } = dao;

export default class AuthRepository {
  constructor() {
    this.model = new User();
  }
  register = (data) => this.model.register(data);
  login = () => this.model.login();
  logout = () => this.model.logout();
  changeRole = (id) => this.model.changeRole(id);
  readOne = (mail) => this.model.readOne(mail);
  readCurrent = (query) => this.model.readCurrent(query);
  readById = (id) => this.model.readById(id);
  updateOne = (mail, data) => this.model.updateOne(mail, data);
  destroyOne = (mail) => this.model.destroyOne(mail);
}
