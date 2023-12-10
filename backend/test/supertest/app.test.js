import { expect } from "chai";
import supertest from "supertest";

const requester = supertest(
  `https://cachupines-backend.onrender.com/api`
);

describe("Testeando Ecommerce", () => {
  describe("Testeando Flujo Usuario Premium + CRUD Products + CRUD Carrito", () => {
    let idToUse = null;
    let cookie = null;
    let cartId = null;
    it("Debe crear un usuario Basico", async () => {
      let user = {
        first_name: "usuario",
        last_name: "apellido",
        mail: "usuario@cachupines.com",
        role: 0,
        password: "hola1234",
      };
      const response = await requester.post("/auth/register").send(user);
      const { _body } = response;
      expect(_body.message).to.be.equals("user registered");
    });
    it("Debe iniciar sesion un usuario Basico", async () => {
      let data = {
        mail: "usuario@cachupines.com",
        password: "hola1234",
      };
      const response = await requester.post("/auth/login").send(data);
      const { headers } = response;
      cookie = headers["set-cookie"][0];
      cookie = {
        name: cookie.split("=")[0],
        value: cookie.split("=")[1],
      };
      expect(cookie.name).to.be.equals("token");
      expect(cookie.value).to.be.ok;
    });
    it("Debe hacer upgrade de USUARIO a PREMIUM", async () => {
      const response = await requester.put("/auth/premium").set("Cookie", [cookie.name + "=" + cookie.value]);
      const { _body } = response;
      expect(_body.success).to.be.equals(true);
    });
    it("Ahora como usuario premium Debe crear un producto", async () => {
      let data = {
        title: "articulo premium",
        description: "Professional mirrorless camera",
        price: 3799,
        thumbnail: "www.canon.com/eosr5.jpg",
        code: 7,
        stock: 2,
        category: "cameras",
        status: true,
      };
      const response = await requester
        .post("/products")
        .send(data)
        .set("Cookie", [cookie.name + "=" + cookie.value]);

      const { _body } = response;
      idToUse = _body.response.product_id;
      expect(_body.message).to.be.equals("product created");
    });
    it("Debe leer los productos de la DB", async () => {
      const response = await requester.get("/products");
      const { _body } = response;
      expect(Array.isArray(_body.payload)).to.be.equals(true);
    });
    it("Como usuario premium Debe Editar un producto", async () => {
      let data = {
        title: "articulo premium editado",
        status: false,
      };
      const response = await requester
        .put("/products/" + idToUse)
        .send(data)
        .set("Cookie", [cookie.name + "=" + cookie.value]);
      const { _body } = response;
      expect(_body.message).to.be.equals(`product id: ${idToUse} modified`);
    });
    it("Como usuario premium Debe Eliminar un producto", async () => {
      const response = await requester
        .delete("/products/" + idToUse)
        .set("Cookie", [cookie.name + "=" + cookie.value]);
      const { _body } = response;
      expect(_body.message).to.be.equals(`product id: ${idToUse} deleted`);
    });
    it("Debe agregar un producto al carrito", async () => {
      let cart = {
        products: [
          {
            product: "656d23555b977e21ef50f6d1",
            quantity: 2,
          },
          {
            product: "656d23565b977e21ef50f6d3",
            quantity: 3,
          },
        ],
      };
      const response = await requester
        .post("/carts")
        .send(cart)
        .set("Cookie", [cookie.name + "=" + cookie.value]);
      const { _body } = response;
      cartId = _body.cid;
      expect(_body.message).to.be.equals(`cart created with id: ${cartId}`);
    });
    it("Debe leer el carrito del usuario", async () => {
      const response = await requester
        .get("/carts")
        .set("Cookie", [cookie.name + "=" + cookie.value]);
      const { _body } = response;
      expect(Array.isArray(_body.cart.sortedProducts)).to.be.equals(true);
    });
    it("Debe actualizar un producto en el carrito", async () => {
      let pid = "656d23565b977e21ef50f6d7";
      const response = await requester
        .put("/carts/" + pid)
        .set("Cookie", [cookie.name + "=" + cookie.value]);
      const { _body } = response;
      expect(_body.message).to.be.equals(`cart id: ${cartId} modified`);
    });
    it("Debe eliminar un producto en el carrito", async () => {
      let pid = "656d23565b977e21ef50f6d7";
      const response = await requester
        .delete("/carts/" + pid)
        .set("Cookie", [cookie.name + "=" + cookie.value]);
      const { _body } = response;
      expect(_body.message).to.be.equals(`cart id: ${cartId} modified`);
    });
    it("Debe leer un ticket", async () => {
      let tid = "6542e7f215601fccaf1e2f22";
      const response = await requester
        .get("/ticket/" + tid)
        .set("Cookie", [cookie.name + "=" + cookie.value]);
      const { _body } = response;
      expect(_body._id).to.be.equals(tid);
    });
    it("Debe Cerrar Sesión de usuario", async () => {
      const response = await requester
        .post("/auth/logout")
        .set("Cookie", [cookie.name + "=" + cookie.value]);
      const { _body } = response;
      expect(_body.message).to.be.equals("sesion cerrada");
    });
  });
});
