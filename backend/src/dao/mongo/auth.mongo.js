import User from "./models/user.js";

export default class AuthPersistance {
  constructor() {}
  async register(data) {
    let one = await User.findOne({ mail: data.mail });
    if (!one) {
      let name = data.first_name;
      data.photo = `https://robohash.org/${name}`;
      let user = await User.create(data);
      return {
        success: true,
        message: "user registered",
        userId: user._id,
      };
    } else {
      return {
        success: false,
        message: "mail already in use",
      };
    }
  }
  async login() {
    return {
      message: "user logged in",
      response: "",
    };
  }
  async logout() {
    return {
      message: "user logged out",
      response: "",
    };
  }

  async readOne(mail) {
    let one = await User.findOne({ mail });
    if (one) {
      return {
        message: "user found!",
        response: one,
      };
    } else {
      return null;
    }
  }
  async readCurrent(query) {
    let one = await User.find(query);
    if (one) {
      return {
        message: "user found!",
        response: one,
      };
    } else {
      return null;
    }
  }
  async readById(id) {
    let one = await User.findById(id);
    if (one) {
      return {
        message: "user found!",
        response: one,
      };
    } else {
      return null;
    }
  }
  async updateOne(mail, data) {
    let one = await User.findOneAndUpdate({ mail }, data, { new: true });
    if (one) {
      return {
        message: "user updated!",
        response: one,
      };
    } else {
      return null;
    }
  }
  async destroyOne(mail) {
    let one = await User.findOneAndDelete({ mail });
    if (one) {
      return {
        message: "user destroyed!",
        response: one,
      };
    } else {
      return null;
    }
  }
}
