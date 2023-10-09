import * as fs from "fs";
import { promises } from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await promises.readFile(this.path, "utf-8");
        const products = JSON.parse(data);
        return products;
      } else {
        return [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  addProduct = async (product) => {
   
    try {
      const products = await this.getProducts();
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        //!product.thumbnail ||
        !product.stock ||
        !product.code ||
        !product.status
      ) {
        return { status: "error", message: "invalid product information, please check all properties" };
      }

      if (products.find((item) => item.code === product.code)) {
       
        return { status: "error", message: "this product already exists" }
      }

      const productToAdd = {
        ...product,
        id: products.length + 1,
      };
      products.push(productToAdd);
      await promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
      return { status: "success", message: "product created", products };
    } catch (err) {
      console.log(err);
    }
  };

  getProductById = async (id) => {
    const productsInFile = await this.getProducts();
    const search = productsInFile.find((item) => item.id === id);
    return search
      ? search
      : { status: "error", message: "product not found" };
  };

  saveToFile = async (productsToSave) => {
    const data = JSON.stringify(productsToSave, null, 2);
    await promises.writeFile(
      this.path,
      JSON.stringify(productsToSave, null, "\t")
    );
  };
  updateProduct = async (id, modificacion) => {
    const productToEdit = await this.getProductById(id);

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
      return { status: "success", message: "product deleted", products: productsArray };
    } else {
      return { status: "error", message: "product not found" };
    }
  };
}

