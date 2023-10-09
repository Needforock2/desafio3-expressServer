import MyRouter from "../router.js";
import ProductsController from "../../controllers/products.controller.js";
import args from "../../config/arguments.js"; //necesito saber la persistencia
const productsController = new ProductsController();

export default class ProductRouter extends MyRouter {
  init() {
    //CREATE
    this.post("/", ["ADMIN"], async (req, res, next) => {
      try {
        let data = req.body;
        let response = await productsController.createController(data);
        return res.sendSuccessCreate(response);
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
        if (args.persistance === "FS") {
          const productsFS = await productsController.readController();
           return res.sendSuccess({
             status: "sucess",
             payload: productsFS,
           });
        } else {
         const  products = await productsController.readController(
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

           return res.sendSuccess({
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
        }
       
      } catch (error) {
        next(error);
      }
    });

    //READ BY ID
    this.read("/:pid", ["PUBLIC"], async (req, res, next) => {
      let { pid } = req.params;
      try {
        const product = await productsController.readOneController(pid);
        if (product) {
          return res.sendSuccess(product);
        } else {
          return res.sendNotFound();
        }
      } catch (error) {
        next(error);
      }
    });

    //UPDATE
    this.put("/:pid", ["ADMIN"], async (req, res, next) => {
      let { pid } = req.params;
      try {
        let data = req.body;
        let response = await productsController.updateController(pid, data);
        if (response) {
          return res.sendSuccess(response);
        } else {
          return res.sendNotFound();
        }
      } catch (error) {
        next(error);
      }
    });

    //DELETE BY ID
    this.delete("/:pid", ["ADMIN"], async (req, res, next) => {
      let { pid } = req.params;
      try {
        let one = await productsController.destroyController(pid);
        if (one) {
          return res.sendSuccess(one);
        } else {
          return res.sendNotFound();
        }
      } catch (error) {
        next(error);
      }
    });
  }
}
