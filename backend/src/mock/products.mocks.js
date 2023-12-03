import { faker } from "@faker-js/faker";

export default () => {
  const title = faker.commerce.productName().toLowerCase();
  const description = faker.commerce.productDescription();
  const stock = Math.ceil(Math.random() * 1000);
  const price = faker.commerce.price({ min: 100, max: 200 });
  const url_photo = faker.image.url();
  const code = faker.number.int({ min: 1, max: 1000 })
  const category = faker.commerce.department()
  return { title, description, stock, price, url_photo, code, category };
};
