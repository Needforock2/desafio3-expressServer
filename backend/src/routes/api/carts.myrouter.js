import MyRouter from "../router.js";
import CartsController from "../../controllers/carts.controller.js";
import AuthController from "../../controllers/auth.controller.js";
import args from "../../config/arguments.js"; //necesito saber la persistencia
import transporter from "../../config/transporter.js";
import config from "../../config/env.js";
import is_valid_product_id from "../../middlewares/is_valid_product_id.js";
import is_user_premium from "../../middlewares/is_user_premium.js";
import is_valid_cart_id from "../../middlewares/is_valid_cart_id.js";

const cartsController = new CartsController();
const userController = new AuthController();

export default class CartsRouter extends MyRouter {
  init() {
    //create
    this.post("/", ["USER", "ADMIN", "PREMIUM"], async (req, res, next) => {
      try {
        let data = req.body;
        const mail = req.user.mail;
        let one = await cartsController.create(data); // creamos el carrito
        const carrito = { cart: one.cid };
        if (args.persistance !== "FS") {
          let resp = await userController.updateOne(mail, carrito);
        }

        return res.sendSuccessCreate({
          cid: one.cid,
          message: one.message,
          success: one.success,
        });
      } catch (error) {
        next(error);
      }
    });
    //READ CART
    this.read("/:cid", ["USER", "ADMIN", "PREMIUM"], async (req, res, next) => {
      try {
        let { cid } = req.params;
        let sortedCart = await cartsController.read(cid);
        return res.sendSuccess(sortedCart); //TODO: paginar los productos del carrito ??????
      } catch (error) {
        next(error);
      }
    });
    

    
    //UPDATE CART WITH a PRODUCT
    this.post(
      "/:cid/products/:pid",
      ["USER", "ADMIN","PREMIUM"],
      is_valid_product_id,
      is_valid_cart_id,
      is_user_premium,
      async (req, res, next) => {
        try {
          let response = await cartsController.update(req.params);
          return res.sendSuccess(response);
        } catch (error) {
          next(error);
        }
      }
    );

    //UPDATE THE QUANTITY OF A PRODUCT IN THE CART
    this.put(
      "/:cid/products/:pid",
      ["USER", "ADMIN", "PREMIUM"],
      is_valid_product_id,
      is_valid_cart_id,
      async (req, res, next) => {
        try {
          let { qty } = req.body;
          let response = await cartsController.updateQty(req.params, qty);
          return res.sendSuccess(response);
        } catch (error) {
          next(error);
        }
      }
    );

    //DELETE ONE PRODUCT FROM THE CART
    this.delete(
      "/:cid/products/:pid",
      ["USER", "ADMIN", "PREMIUM"],
      is_valid_product_id,
      is_valid_cart_id,
      async (req, res, next) => {
        try {
          let response = await cartsController.delete(req.params);
          return res.sendSuccess(response);
        } catch (error) {
          next(error);
        }
      }
    );

    //DELETE ALL PRODUCTS FROM THE CART
    this.delete(
      "/:cid",
      ["USER", "ADMIN", "PREMIUM"],
      is_valid_cart_id,
      async (req, res, next) => {
        try {
          let response = await cartsController.deleteAll(req.params);
          return res.sendSuccess(response);
        } catch (error) {
          next(error);
        }
      }
    );

    //SUM the CART TOTAL
    this.read(
      "/bills/:cid",
      ["USER", "ADMIN", "PREMIUM"],
      is_valid_cart_id,
      async (req, res, next) => {
        try {
          let { cid } = req.params;
          let response = await cartsController.sumAll(cid);
          return res.sendSuccess(response);
        } catch (error) {
          next(error);
        }
      }
    );

    //DELETE CART

    this.delete(
      "/payment-success/:cid",
      ["USER", "ADMIN", "PREMIUM"],
      is_valid_cart_id,
      async (req, res, next) => {
        let mail = req.user.mail;
        try {
          let response = await cartsController.deleteCart(req.params);
          let message = "<h2>Compra realizada exitosamente<h2> </br>";
          for (let i = 0; i < response.cart[0].products.length; i++) {
            message += `<h4>${response.cart[0].products[i].product.title}<h4></br>
                      <h4>Precio: $${response.cart[0].products[i].product.price}<h4></br>
                      <h4>Cantidad: ${response.cart[0].products[i].quantity} <h4></br></br>
          `;
          }
          message += `<h2>Total Pagado: $${response.total.totalAmount}</h2>`;
          await userController.updateOne(mail, { cart: null });
          if (response.success === true) {
            await transporter.sendMail({
              from: `Cachupines.cl <${config.G_MAIL}>`,
              to: `${mail}`,
              subject: "Gracias por tu compra en cachupines.cl",
              html: message,
            });

            return res.sendSuccess(response);
          } else {
            return res.sendNotFound();
          }
        } catch (error) {
          next(error);
        }
      }
    );
  }
}
