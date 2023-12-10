import { Card, CardBody, Image, Stack, Heading, Text, Divider, CardFooter, ButtonGroup, Button } from '@chakra-ui/react';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { CartContext } from '../../store/context';




export default function ProductCard({ producto, edit, handleDeleteP }) {
  const { setIsEmpty } = useContext(CartContext);
  const navigate = useNavigate()
  const { title, description, price, stock, category, _id, thumbnails } = producto
  const [update, setUpdate] = useState(false)
  const handleAddToCart = async (pid) => {
    const createUrl = `${import.meta.env.VITE_BACKEND_URL}/carts`;
    
    try {
      if (!sessionStorage.getItem('cid')) {
        const resp = await axios.post(createUrl);
        sessionStorage.setItem("cid", resp.data.cid);
      }
       const updateUrl = `${import.meta.env.VITE_BACKEND_URL}/carts/${pid}`;
       await axios.put(updateUrl);
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

  const handleEdit = (pid) => {
    navigate(`/edit_product/${pid}`);
  }

  const handleDelete = async(pid) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/products/${pid}`;
      const resp = await axios.delete(url)
      if (resp.data.success) {

          swal({
            title: "Exito",
            text: "Producto Eliminado",
            icon: "success",
          });
                handleDeleteP();
      } else {
          swal({
            title: "Ooops",
            text: "Ha habido un error",
            icon: "error",
          });
      }
    } catch (error) {
        swal({
          title: "Ooops",
          text: `${error.response.data.message}`,
          icon: "error",
        });
    }
  }
  return (
    <Card maxW="sm" boxShadow="5px 5px 17px 0px rgba(0,0,0,0.75);">
      <CardBody
        onClick={edit ? null : () => handleClick(_id)}
        _hover={
          edit
            ? null
            : {
                cursor: "pointer",
              }
        }
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
        {edit ? (
          <ButtonGroup spacing="2">
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleEdit(_id)}
            >
              Editar
            </Button>
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleDelete(_id)}
            >
              Eliminar
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup spacing="2">
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleAddToCart(_id)}
            >
              Agregar al Carrito
            </Button>
          </ButtonGroup>
        )}
      </CardFooter>
    </Card>
  );
}
