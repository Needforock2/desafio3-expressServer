import {
  Button,
  Card,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import swal from "sweetalert";  
axios.defaults.withCredentials = true;

function NewProduct() {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: "",
    code: "",
    stock: "",
    category: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Aquí puedes hacer algo con los datos del formulario, como enviarlos a una API
    const token = sessionStorage.getItem("token")
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
      const url = "http://localhost:8080/api/products";
      try {
          const resp = await axios.post(
            url,
            productData,
            config
        );
          if (resp.data.status === "success") {
              swal({
                title: "Éxito",
                text: "Producto Creado",
                icon: "success",
              });

          }
          setProductData({
            title: "",
            description: "",
            price: "",
            thumbnail: "",
            code: "",
            stock: "",
            category: "",
          });
      } catch (error) {
         swal({
           title: "Error",
           text: "No tienes permiso",
           icon: "warning",
         });
      }
  };

  return (
    <Card maxW="50vw" m="20px auto" p={10}>
      <Heading>Crear Producto</Heading>
      <form onSubmit={handleSubmit}>
        <FormLabel>
          Title:
          <Input
            required
            type="text"
            name="title"
            value={productData.title}
            onChange={handleInputChange}
          />
        </FormLabel>
        <br />
        <FormLabel>
          Description:
          <Textarea
            required
            name="description"
            value={productData.description}
            onChange={handleInputChange}
          />
        </FormLabel>
        <br />
        <FormLabel>
          Price:
          <Input
            required
            type="number"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
          />
        </FormLabel>
        <br />
        <FormLabel>
          Thumbnail:
          <Input
            required
            type="text"
            name="thumbnail"
            value={productData.thumbnail}
            onChange={handleInputChange}
          />
        </FormLabel>
        <br />
        <FormLabel>
          Code:
          <Input
            required
            type="number"
            name="code"
            value={productData.code}
            onChange={handleInputChange}
          />
        </FormLabel>
        <br />
        <FormLabel>
          Stock:
          <Input
            required
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleInputChange}
          />
        </FormLabel>
        <br />
        <FormLabel>
          Category:
          <Input
            required
            type="text"
            name="category"
            value={productData.category}
            onChange={handleInputChange}
          />
        </FormLabel>
        <br />
        <Button type="submit">Submit</Button>
      </form>
    </Card>
  );
}

export default NewProduct;
