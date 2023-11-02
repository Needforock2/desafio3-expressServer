import AuthRepository from "../repositories/auth.rep.js";

export default class AuthService {
  constructor() {
    this.repository = new AuthRepository();
  }
  register = (data) => this.repository.register(data);
  login = () => this.repository.login();
  logout = () => this.repository.logout();
  changeRole = (id) => this.repository.changeRole(id);
  readOne = (mail) => this.repository.readOne(mail);
  readCurrent = (query) => this.repository.readCurrent(query);
  readById = (id) => this.repository.readById(id);
  updateOne = (mail, data) => this.repository.updateOne(mail, data);
  destroyOne = (mail) => this.repository.destroyOne(mail);
}