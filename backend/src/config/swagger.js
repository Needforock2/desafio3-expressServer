import __dirname from "../../utils.js";



const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Cachupines",
      description:
        "Documentación del Backend de la aplicación Ecommerce de Cachupines",
    },
  },
  apis: [`${__dirname}/src/docs/*.yaml`],
};

export default swaggerOptions
