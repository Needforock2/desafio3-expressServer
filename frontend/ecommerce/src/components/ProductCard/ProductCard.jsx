import { Card, CardBody, Image, Stack, Heading, Text, Divider, CardFooter, ButtonGroup, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { CartContext } from '../../store/context';




export default function ProductCard({ producto }) {
  const { setIsEmpty } = useContext(CartContext);
  const navigate = useNavigate()
  const { title, description, price, stock, category, _id, thumbnails } = producto
  
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
      setIsEmpty(false)
    } catch (error) {
      swal({
        title: "Ooops",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    }
  }

  const handleClick = (pid) => {
    navigate(`/detail/${pid}`)
  }
  return (
    <Card maxW="sm" boxShadow="5px 5px 17px 0px rgba(0,0,0,0.75);">
      <CardBody
        onClick={() => handleClick(_id)}
        _hover={{
          cursor: "pointer",
        }}
      >
        <Image
          src={thumbnails}
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
