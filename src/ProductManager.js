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
        !product.thumbnail ||
        !product.stock ||
        !product.code
      ) {
        console.log("invalid product information, please check all properties");
        return;
      }

      if (products.find((item) => item.code === product.code)) {
        console.log("this product already exists");
        return;
      }

      const productToAdd = {
        ...product,
        id: products.length + 1,
      };
      products.push(productToAdd);
      await promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
    } catch (err) {
      console.log(err);
    }
  };

  getProductById = async (id) => {
    const productsInFile = await this.getProducts();
    const search = productsInFile.find((item) => item.id === id);
    return search ? search : "Product not found";
  };

  saveToFile = async (productsToSave) => {
    const data = JSON.stringify(productsToSave, null, 2);
    await promises.writeFile(
      this.path,
      JSON.stringify(productsToSave, null, "\t")
    );
  };
  updateProduct = async (id, modificacion) => {
    const productToEdit = await this.getProductById(id); // buscamos el producto a editar por ID
    const productsArray = await this.getProducts(); // traemos el array desde el archivo
    const index = productsArray.findIndex((obj) => obj.id === id); // buscamos en el array el indice del objeto a modificar
    Object.assign(productToEdit, modificacion); //hacemos las modificaciones del objeto
    productsArray[index] = productToEdit; // y lo metemos en el array

    await this.saveToFile(productsArray); // y guardamos el array en el archivo
    console.log(
      "lista de productos despues de modificar un objeto",
      productsArray
    );
  };

  deleteProduct = async (id) => {
    const productsArray = await this.getProducts(); // traemos el array desde el archivo
    const index = productsArray.findIndex((obj) => obj.id === id); // buscamos en el array el indice del objeto a eliminar
    if (index > -1) {
      productsArray.splice(index, 1);

      await this.saveToFile(productsArray); // y lo guardamos en el archivo
      console.log(
        "lista de productos despues de eliminar un objeto",
        productsArray
      );
    } else {
      console.log("Articulo no encontrado, no se puede eliminar");
    }
  };
}
//const manager = new ProductManager("src/products.json");

/* const audi = {
  title: "audi",
  description: "a3",
  price: 50000,
  thumbnail: "www.audi.com",
  code: 505,
  stock: 1,
};
const toyota = {
  title: "toyota",
  description: "hilux",
  price: 20000,
  thumbnail: "www.hilux.com",
  code: 506,
  stock: 10,
};

const toyotaToEdit = {
  description: "FJ40",
  thumbnail: "www.fj40.com",
  code: 1000,
}; */

/* const env = async () => {
  const products = await manager.getProducts();
  console.log("todos los productos en el archivo", products); */

 /*  await manager.addProduct(audi)
  await manager.addProduct(toyota)
  const search = await manager.getProductById(1);
  console.log("busqueda por id 1", search);
  const search1 = await manager.getProductById(4);
  console.log("busqueda por id 2", search1);

  await manager.updateProduct(2, toyotaToEdit);

  await manager.deleteProduct(4); //eliminar producto equivocado
  await manager.deleteProduct(2); //eliminar producto 
};

env();*/

