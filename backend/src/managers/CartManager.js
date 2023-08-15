import * as fs from "fs";
import { promises } from "fs";
import ProductManager from "./ProductManager.js";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  getCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await promises.readFile(this.path, "utf-8");
        const carts = JSON.parse(data);
        return carts;
      } else {
        return [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  createCart = async () => {
    try {
      const carts = await this.getCarts();
      const cartToAdd = {
        products: [],
        id: carts.length + 1,
      };
      carts.push(cartToAdd);
      await promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      return { status: "success", message: "cart created" };
    } catch (err) {
      return { status: "error", message: "cart not created" };
    }
  };

  getCartById = async (id) => {
    const cartsInFile = await this.getCarts();
    const cart = cartsInFile.find((cart) => cart.id === id);
    return cart
      ? cart.products
      : { status: "error", message: "cart not found" };
  };

  addProductToCart = async (pid, cid) => {
    const productsManager = new ProductManager("src/files/products.json");
    try {
      const carts = await this.getCarts();
      const productsInCart = await this.getCartById(cid);
      if (productsInCart.status === "error") {
        return productsInCart;
      } else {
        const cartIndex = carts.findIndex((obj) => obj.id === cid);
        //verificamos si el producto existe en archivo ---->
        const productsInDB = await productsManager.getProducts();
        if (productsInDB.filter((item) => item.id === pid).length > 0) {
          // <---- verificamos si el producto existe en archivo
          if (
            productsInCart.filter((item) => item.product === pid).length > 0
          ) {
            productsInCart.map((item) => {
              if (item.product === pid) {
                item.quantity += 1;
              }
            });
          } else {
            productsInCart.push({
              product: pid,
              quantity: 1,
            });
          }
          carts[cartIndex].products = productsInCart;
          await promises.writeFile(
            this.path,
            JSON.stringify(carts, null, "\t")
          );
          return { status: "success", message: "product added to cart" };
        } else {
          //sino existe mandamos un error
          return { status: "error", message: "product does not exist" };
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  saveToFile = async (cartsToSave) => {
    await promises.writeFile(
      this.path,
      JSON.stringify(cartsToSave, null, "\t")
    );
  };

  deleteProductFromCart = async (pid, cid) => {
    try {
      const productsInCart = await this.getCartById(cid);
      const carts = await this.getCarts();
      const productIndex = productsInCart.findIndex(
        (item) => item.product === pid
      );
      if (productIndex > -1) {
        productsInCart.splice(productIndex, 1);

        carts.map((cart) => {
          if (cart.id === cid) {
            cart.products = productsInCart;
          }
        });

        await this.saveToFile(carts);
        return { status: "success", message: "product deleted" };
      } else {
        return { status: "error", message: "product not found" };
      }
    } catch (error) {}
  };
}
