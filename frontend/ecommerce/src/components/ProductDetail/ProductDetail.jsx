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
} from "@chakra-ui/react";
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import swal from "sweetalert";




export default function ProductDetail() {
    const params = useParams();
    const [product, setProduct] = useState({})
      const { pid } = params;
    useEffect(() => {
        async function fetchProd() {
            const url = `http://localhost:8080/api/products/${pid}`
            try {
                const resp = await axios.get(url)
                setProduct(resp.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchProd()
    }, [])
    
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
         const updateCart = await axios.post(updateUrl);
         swal({
           title: "Exito",
           text: "Producto Agregado al Carrito",
           icon: "success",
         });
     } catch (error) {
       console.log(error);
     }
   };
    
  return (
    <Card maxW="2xl" m="50px auto">
      <CardBody>
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="xl">{product.title}</Heading>
          <Text size="md">{product.description}</Text>
          <Text color="blue.600" fontSize="3xl">
            ${product.price}
          </Text>
          <Text fontSize="xl">Stock: {product.stock}</Text>
          <Text fontSize="xl">SKU: {product.code}</Text>
        </Stack>
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
    </Card>
  );
}
