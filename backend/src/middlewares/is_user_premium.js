import AuthService from "../services/auth.service.js";
import ProductsService from "../services/products.service.js";

export default async function (req, res, next) {
    try {
        let usuario = req.user;
        let { pid } = req.params;
        let User = new AuthService();
        let Product = new ProductsService()
        let product = await Product.readOneService(pid)
        let user = await User.readById(usuario._id);
        if (user.response.role === 2 && product.owner === user.response.mail) {
          return res.sendNoAuthorizedError("You cannot add your own products to your cart");
        } else {
          next();
        }
    } catch (error) {
        next(error)
    }
    
}

