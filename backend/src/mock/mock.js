import Product from "../dao/mongo/models/product.js";
import { faker } from "@faker-js/faker"
import MongoConnect from "../config/mongo.js";

const mongo = new MongoConnect(
  "mongodb+srv://needforock:1234@ecommerce.7shr6go.mongodb.net/ecommerce"
);
mongo.connect_mongo();



for (let i = 0; i < 500; i++){
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
        console.log(error)
    }
    
}
