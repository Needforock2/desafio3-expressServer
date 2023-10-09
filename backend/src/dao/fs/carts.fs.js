import * as fs from "fs";
import { promises } from "fs";
import ProductFs from "../fs/products.fs.js";

export default class CartFs {
  constructor() {
    this.path = "./src/dao/fs/files/carts.json";
    this.carts = [];
    this.init();
  }
  init() {
    let file = fs.existsSync(this.path);
    if (!file) {
      fs.writeFileSync(this.path, "[]");
    } else {
      this.carts = JSON.parse(fs.readFileSync(this.path, "UTF-8"));
    }
    return true;
  }

  createModel = async (cart) => {
    const carts = await this.readModels();
    carts.push(cart);
    await promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return {
      success: true,
      message: `cart created with id: ${cart._id}`,
      cid: cart._id,
    };
  };

  readModels = async () => {
    let all = this.carts;
    if (this.carts.length > 0) {
      return all;
    } else {
      return [];
    }
  };

  readModel = async (id) => {
    const cartsInFile = await this.readModels();
    const cart = cartsInFile.find((cart) => cart._id === id);
    return cart ? cart : { status: "error", message: "cart not found" };
  };

  updateModel = async (data) => {
    let { cid, pid } = data;

    const productsManager = new ProductFs();
    const carts = await this.readModels();
    const productsInCart = await this.readModel(cid);
    const cartIndex = carts.findIndex((obj) => obj._id === cid);
    //verificamos si el producto existe en archivo ---->
    const productsInFS = await productsManager.readModel();
    if (productsInFS.filter((item) => item._id === pid).length > 0) {
      // <---- verificamos si el producto existe en archivo
      if (
        productsInCart.products.filter((item) => item.product === pid).length >
        0
      ) {
        productsInCart.products.map((item) => {
          if (item.product === pid) {
            item.quantity += 1;
          }
        });
      } else {
        productsInCart.products.push({
          product: pid,
          quantity: 1,
        });
      }
      carts[cartIndex].products = productsInCart.products;
      await promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      return {
        success: true,
        message: `cart id: ${cid} modified`,
      };
    } else {
      //sino existe mandamos un error
      return { status: "error", message: "product does not exist" };
    }
  };

  updateQtyModel = async (data, qty) => {
    let { cid, pid } = data;
     const productsManager = new ProductFs();
     const carts = await this.readModels();
    const productsInCart = await this.readModel(cid);

    if (productsInCart.status==="error") {
       return {
         success: false,
         message: `cart not found`,
       };
    }

     const cartIndex = carts.findIndex((obj) => obj._id === cid);
     //verificamos si el producto existe en archivo ---->
     const productsInFS = await productsManager.readModel();
     if (productsInFS.filter((item) => item._id === pid).length > 0) {
       // <---- verificamos si el producto existe en archivo
       if (
         productsInCart.products.filter((item) => item.product === pid).length >
         0
       ) {
         productsInCart.products.map((item) => {
           if (item.product === pid) {
             item.quantity =qty;
           }
           
         });
       } else {
         return {
         success: false,
         message: `cart id: ${cid} not modified, product not found`,
       };
       }
       carts[cartIndex].products = productsInCart.products;
       await promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
       return {
         success: true,
         message: `cart id: ${cid} modified`,
       };
     } else {
       //sino existe mandamos un error
       return {
         success: false,
         message: `product does not exist`,
       };
     }
  }
  saveToFile = async (cartsToSave) => {
    await promises.writeFile(
      this.path,
      JSON.stringify(cartsToSave, null, "\t")
    );
  };

  deleteModel = async (data) => {
    let { cid, pid } = data;
    const productsInCart = await this.readModel(cid);

    const carts = await this.readModels();
    const productIndex = productsInCart.products.findIndex(
      (item) => item.product === pid
    );
    if (productIndex > -1) {
      productsInCart.products.splice(productIndex, 1);

      carts.map((cart) => {
        if (cart._id === cid) {
          cart.products = productsInCart.products;
        }
      });

      await this.saveToFile(carts);
      return {
        success: true,
        message: `cart id: ${cid} modified`,
      };
    } else {
      return { status: "error", message: "product not found" };
    }
  };

  deleteAllModel = async (data) => {
    let { cid } = data
    const carts = await this.readModels();
    const indexOfCart = carts.findIndex((obj) => obj._id === cid)
    
     if (indexOfCart > -1) {
       carts.splice(indexOfCart, 1);

       await this.saveToFile(carts); // y lo guardamos en el archivo
       return {
         status: "success",
         message: "cart deleted",
         carts
       };
     } else {
       return { status: "error", message: "cart not found" };
     }

  }
}
