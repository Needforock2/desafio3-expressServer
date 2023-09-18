import { Card, CardBody, Image, Stack, Heading, Text, Divider, CardFooter, ButtonGroup, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';



export default function ProductCard({ producto }) {
  const navigate = useNavigate()
  const { title, description, price, stock, category, _id } = producto
  
  const handleAddToCart = async (pid) => {
    const createUrl = "http://localhost:8080/api/carts";
    
    try {
      if (!sessionStorage.getItem('cid')) {
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
    } catch (error) {
      swal({
        title: "Ooops",
        text: "Debes Iniciar sesión",
        icon: "error",
      });
    }
  }

  const handleClick = (pid) => {
    navigate(`/detail/${pid}`)
  }
  return (
    <Card maxW="sm">
      <CardBody
        onClick={() => handleClick(_id)}
        _hover={{
          cursor: "pointer",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{title}</Heading>
          <Text>{description}</Text>
          <Text color="blue.600" fontSize="2xl">
            ${price}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button
            variant="ghost"
            colorScheme="blue"
            onClick={() => handleAddToCart(_id)}
          >
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
