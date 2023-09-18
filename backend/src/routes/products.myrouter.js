import MyRouter from "./router.js";
import Product from "../dao/models/product.js";

export default class ProductRouter extends MyRouter{
    init() {
        //CREATE
        this.post("/", ["ADMIN"], async (req, res, next) => {
         try {
           const product = req.body;
           let one = await Product.create(product);
           const products = await Product.find();
           return res
             .status(201)
             .json({ status: "success", message: "product created", products });
         } catch (error) {
           next(error);
         }
        });

        //READ
        this.read("/", ["PUBLIC"], async (req, res, next) => {
         const { limit, page, query, title, sort } = req.query;
         //console.log(req.session);
         const options = {
           limit: limit ? limit : 6,
           page: page ? page : 1,
           sort: sort ? { price: sort } : {},
         };

         let queryObject = {};
         let queryType;
         let queryValue;
         let queryStock;
         if (query) {
           const querySplitted = query.split("=");
           queryType = querySplitted[0] ? querySplitted[0] : null;
           queryValue = querySplitted[1] ? querySplitted[1] : null;

           if (queryType === "stock") {
             queryStock = { $gte: queryValue };
             queryObject[queryType] = queryStock;
           } else {
             queryObject[queryType] = queryValue;
           }
         }
         if (title) {
           queryObject["title"] = { $regex: title, $options: "i" };
         }

         try {
           const products = await Product.paginate(
             query || title ? queryObject : {},
             options
           );
           const {
             docs,
             limit,
             totalPages,
             page,
             hasPrevPage,
             hasNextPage,
             prevPage,
             nextPage,
           } = products;
           let nextLink = hasNextPage
             ? `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}${
                 sort ? `&sort=${sort}` : ""
               }${query ? `&query=${queryType}=${queryValue}` : ""}`
             : null;
           let prevLink = hasPrevPage
             ? `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}${
                 sort ? `&sort=${sort}` : ""
               }${query ? `&query=${queryType}=${queryValue}` : ""}`
             : null;

           return res.status(200).json({
             status: "success",
             payload: docs,
             totalPages,
             prevPage,
             nextPage,
             page,
             hasPrevPage,
             hasNextPage,
             nextLink,
             prevLink,
           });
         } catch (error) {
           next(error);
         }
        });

        //READ BY ID
        this.read("/:pid", ["PUBLIC"], async (req, res, next) => {
          let { pid } = req.params;
          try {
            const product = await Product.findById(pid);
            return res.send(product);
          } catch (error) {
            return res.status(400).json({
              success: false,
              message: `product id: ${pid}} not found`,
            });
          }
        });

        //DELETE BY ID
        this.delete("/:pid", ["ADMIN"], async (req, res, next) => {
             let { pid } = req.params;
             try {
               let one = await Product.findByIdAndDelete(pid);
               const products = await Product.find();
               io.emit("message", products);
               return res.status(200).json({
                 success: true,
                 message: `product id: ${one._id} deleted`,
               });
             } catch (error) {
               return res.status(400).json({
                 success: false,
                 message: `product id: ${pid} not found`,
               });
             }
        })
    }
}