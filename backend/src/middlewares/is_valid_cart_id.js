import Cart from "../dao/mongo/models/cart.js";

export default async function (req, res, next) {

  try {
    let { cid } = req.params;
    let one = await Cart.findById(cid)
    if (one) {
      return next();
    } else {
      return res.sendNotFound();
    }
  } catch (error) {
    next(error);
  }
}
