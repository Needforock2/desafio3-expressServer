import Product from "../dao/mongo/models/product.js";
import { faker } from "@faker-js/faker";
import MongoConnect from "../config/mongo.js";
import "dotenv/config.js";
import config from "../config/env.js";

export default async function mocking() {
  const mongo = new MongoConnect(config.DATABASE_URL);
  mongo.connect_mongo();

  for (let i = 0; i < 100; i++) {
      console.log("mockinb");
    const product = {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      code: faker.number.int({ min: 1, max: 1000 }),
      price: faker.commerce.price({ min: 100, max: 2000 }),
    

      status: true,
      stock: faker.number.int({ min: 1, max: 1000 }),
      category: faker.commerce.department(),
      thumbnails: faker.image.urlLoremFlickr({
        category: "computers",
      }),
    };
    try {
      await Product.create(product);
    } catch (error) {
      console.log(error);
    }
  }
}

//mocking();
