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
        _id: user._id,
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

  async changeRole(id) {
    let one = await User.findById(id);
    switch (one.role) {
      case 0:
        let resp = await User.findByIdAndUpdate(id, { role: 2 });
        return {
          success: true,
          message: `user ID: ${id} has been upgraded to PREMIUM`,
        };
      case 2:
        let resp2 = await User.findByIdAndUpdate(id, { role: 0 })        
        return {
          success: true,
          message: `user ID: ${id} has been degraded to USER`,
        };
    }
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
