import MyRouter from "../router.js";
import ProductsController from "../../controllers/products.controller.js";
import args from "../../config/arguments.js"; //necesito saber la persistencia
import { faker } from "@faker-js/faker";
const productsController = new ProductsController();


export default class ProductRouter extends MyRouter {
  init() {
    //CREATE
    this.post("/", ["ADMIN","PREMIUM"], async (req, res, next) => {
      try {

        let data = req.body;
        if (!data.code) {
          data.code = faker.number.int({ min: 1000, max: 100000 });
        }
        if (req.user.role === 2) {
          data.owner = req.user.mail;
        }        
        let response = await productsController.createController(data);
        return res.sendSuccessCreate(response);
      } catch (error) {
        next(error);
      }
    });

    //READ
    this.read("/", ["PUBLIC","PREMIUM", "ADMIN", ], async (req, res, next) => {
     
      const { limit, page, query, title, sort, edit } = req.query;
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
    
      if (edit && req.session.role ===2) { 
        queryObject["owner"] = req.session.mail;
      }

      try {
        if (args.persistance === "FS") {
          const productsFS = await productsController.readController();
          return res.sendSuccess({
            status: "sucess",
            payload: productsFS,
          });
        } else {
          const products = await productsController.readController(
            query || title || edit ? queryObject : {},
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
            ? `https://cachupines-backend.onrender.com/api/products?limit=${limit}&page=${nextPage}${
                sort ? `&sort=${sort}` : ""
              }${query ? `&query=${queryType}=${queryValue}` : ""}`
            : null;
          let prevLink = hasPrevPage
            ? `https://cachupines-backend.onrender.com/api/products?limit=${limit}&page=${prevPage}${
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
        return next(error);
      }
    });

    //UPDATE
    this.put("/:pid", ["ADMIN","PREMIUM"], async (req, res, next) => {
      let { pid } = req.params;
      try {
        let data = req.body;
     
        let owner = req.user
        let response = await productsController.updateController(pid, data, owner);
        if (response) {
          if (response.success) {
            return res.sendSuccess(response);            
          } else {      
              if (response.codeName && response.codeName === "DuplicateKey") {
                return res.sendDuplicate();
              }    
            return res.sendNoAuthorizedError(response.message);
          }
        } else {
          return res.sendNotFound();
        }
      } catch (error) {       
        return next(error)
      }
    });

    //DELETE BY ID
    this.delete("/:pid", ["ADMIN", "PREMIUM"], async (req, res, next) => {
      let { pid } = req.params;
      try {
        let one = await productsController.destroyController(pid, req.user);
        if (one) {
          if (one.success) {
            return res.sendSuccess(one);            
          }
          return res.sendNoAuthorizedError(one.message)
        } else {
          return res.sendNotFound();
        }
      } catch (error) {
       return next(error);
      }
    });
  }
}
