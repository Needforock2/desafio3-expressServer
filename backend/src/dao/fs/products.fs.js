import * as fs from "fs";
import { promises } from "fs";

export default class ProductFS {
  constructor() {
    this.path = "./src/dao/fs/files/products.json";
    this.products = [];
    this.init();
  }
  init() {
    let file = fs.existsSync(this.path);
    if (!file) {
      fs.writeFileSync(this.path, "[]");
    } else {
      this.products = JSON.parse(fs.readFileSync(this.path, "UTF-8"));
    }
    return true;
  }
  readModel = async () => {
    let all = this.products;
    if (this.products.length > 0) {
      return all;
    } else {
      return [];
    }
  };

  createModel = async (product) => {
    try {
      const products = await this.readModel();
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        //!product.thumbnail ||
        !product.stock ||
        !product.code ||
        !product.status
      ) {
        console.log("invalid product information, please check all properties");
        return {
          status: "error",
          message: "invalid product information, please check all properties",
        };
      }

      if (products.length > 0) {
        if (products.find((item) => item.code === product.code)) {
          return { status: "error", message: "this product already exists" };
        }
      }

      /*    const productToAdd = {
        ...product,
        id: products.length + 1,
      }; */
      products.push(product);
      await promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
      return {
        status: "success",
        message: "product created",
        response: { product_id: product._id },
      };
    } catch (err) {
      console.log(err);
    }
  };

  readOneModel = async (id) => {
    const productsInFile = await this.readModel();
    const search = productsInFile.find((item) => item._id === id);
    return search ? search : { status: "error", message: "product not found" };
  };

  saveToFile = async (productsToSave) => {
    const data = JSON.stringify(productsToSave, null, 2);
    await promises.writeFile(
      this.path,
      JSON.stringify(productsToSave, null, "\t")
    );
  };
  updateModel = async (id, modificacion) => {
    const productToEdit = await this.readOneModel(id);
    console.log(productToEdit); // buscamos el producto a editar por ID
    const productsArray = await this.readModel(); // traemos el array desde el archivo
    const index = productsArray.findIndex((obj) => obj._id === id); // buscamos en el array el indice del objeto a modificar
    Object.assign(productToEdit, modificacion); //hacemos las modificaciones del objeto
    productsArray[index] = productToEdit; // y lo metemos en el array

    await this.saveToFile(productsArray); // y guardamos el array en el archivo
    return { status: "success", message: "product modified" };
  };

  destroyModel = async (id) => {
    const productsArray = await this.readModel(); // traemos el array desde el archivo
    const index = productsArray.findIndex((obj) => obj._id === id); // buscamos en el array el indice del objeto a eliminar
    if (index > -1) {
      productsArray.splice(index, 1);

      await this.saveToFile(productsArray); // y lo guardamos en el archivo
      return {
        status: "success",
        message: "product deleted",
        products: productsArray,
      };
    } else {
      return { status: "error", message: "product not found" };
    }
  };
}
