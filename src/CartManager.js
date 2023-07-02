import * as fs from "fs";
import { promises } from "fs";

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
    try {
      const carts = await this.getCarts();
      const productsInCart = await this.getCartById(cid);
      if (productsInCart.status === "error") {
        return productsInCart;
      } else {
        const cartIndex = carts.findIndex((obj) => obj.id === cid);
        if (productsInCart.filter((item) => item.product === pid).length > 0) {
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
        await promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        return { status: "success", message: "product added to cart" };
      }
    } catch (err) {
      console.log(err);
    }
  };

    // de aqui para abajo posiblemente se use mas adelante

  /* saveToFile = async (productsToSave) => {
    const data = JSON.stringify(productsToSave, null, 2);
    await promises.writeFile(
      this.path,
      JSON.stringify(productsToSave, null, "\t")
    );
  };
  updateProduct = async (id, modificacion) => {
    const productToEdit = await this.getProductById(id);
    console.log(productToEdit); // buscamos el producto a editar por ID
    const productsArray = await this.getProducts(); // traemos el array desde el archivo
    const index = productsArray.findIndex((obj) => obj.id === id); // buscamos en el array el indice del objeto a modificar
    Object.assign(productToEdit, modificacion); //hacemos las modificaciones del objeto
    productsArray[index] = productToEdit; // y lo metemos en el array

    await this.saveToFile(productsArray); // y guardamos el array en el archivo
    return { status: "success", message: "product modified" };
  };

  deleteProduct = async (id) => {
    const productsArray = await this.getProducts(); // traemos el array desde el archivo
    const index = productsArray.findIndex((obj) => obj.id === id); // buscamos en el array el indice del objeto a eliminar
    if (index > -1) {
      productsArray.splice(index, 1);

      await this.saveToFile(productsArray); // y lo guardamos en el archivo
      return { status: "success", message: "product deleted" };
    } else {
      return { status: "error", message: "product not found" };
    }
  }; */
}
