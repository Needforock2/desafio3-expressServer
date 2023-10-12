import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Flex,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { CartContext } from "../../store/context";


export default function ProductDetail() {
  const { setIsEmpty } = useContext(CartContext);
  const params = useParams();
  const [product, setProduct] = useState({});
  const { pid } = params;
  const navigate = useNavigate()
  useEffect(() => {
    async function fetchProd() {
      const url = `http://localhost:8080/api/products/${pid}`;
      try {
        const resp = await axios.get(url);
        setProduct(resp.data);
      } catch (error) {
         swal({
           title: "Ooops 404",
           text: "Not found",
           icon: "error",
         });
        navigate("/")
      }
    }
    fetchProd();
  }, []);

  const handleAddToCart = async (pid) => {
    const createUrl = "http://localhost:8080/api/carts";

    try {
      if (!sessionStorage.getItem("cid")) {
        const resp = await axios.post(createUrl);
        sessionStorage.setItem("cid", resp.data.cid);
      }
      const updateUrl = `http://localhost:8080/api/carts/${sessionStorage.getItem(
        "cid"
      )}/products/${pid}`;
      await axios.post(updateUrl);
      swal({
        title: "Exito",
        text: "Producto Agregado al Carrito",
        icon: "success",
      });
      setIsEmpty(false);
    } catch (error) {
      swal({
        title: "Ooops",
        text: "Debes Iniciar sesión",
        icon: "error",
      });
    }
  };

  return (
    <Card
      maxW="85vw"
      m="50px auto"
      direction={{ base: "column", md: "row", sm: "row" }}
      variant="outline"
    >
      <Box boxSize={{ base: "sm", sm: "md", md: "lg" }} p={5}>
        <Image
          // maxW={{ base: "100%", sm: "200px" }}
          src={product.thumbnails}
          alt={product.title}
          borderRadius="lg"
        />
      </Box>

      <Stack mt="6" spacing="3" textAlign="left">
        <CardBody h="50vh">
          <Heading size="xl">{product.title}</Heading>
          <Text size="md" maxW="50%">
            {product.description}
          </Text>
          <Text color="blue.600" fontSize="3xl">
            Price: ${product.price}
          </Text>
          <Text fontSize="xl">Stock: {product.stock}</Text>
          <Text fontSize="xl">SKU: {product.code}</Text>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button
              variant="ghost"
              colorScheme="blue"
              fontSize="3xl"
              onClick={() => handleAddToCart(product._id)}
            >
              Add to cart
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Stack>
    </Card>
  );
}
