import ProductsService from "../services/products.service.js"

export default async function (req, res, next) {
    const Product = new ProductsService()
    try {
        let { pid } = req.params
        let one = await Product.readOneService(pid)
        if (one) {
           return next()
        } else {
            return res.sendNotFound()
        }
    } catch (error) {
        next(error)
    }
}