import { Flex, Heading, Box, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ProductCardCart from "./ProductCardCart";
import OrderSummary from "./OrderSummary";
import swal from "sweetalert";
import { CartContext } from "../../store/context";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [total, setTotal] = useState(0);
  const { setIsEmpty } = useContext(CartContext);

  //Leer el carrito
  useEffect(() => {
    setUpdated(false);
    async function fetchCart() {
     
      const cid = sessionStorage.getItem("cid");
      if (cid) {
         setLoadingProducts(true);
        const url = `http://localhost:8080/api/carts/${cid}`;
        try {
          const res = await axios.get(url);
          if (res.data.cart) {
            setProducts(res.data.cart?.sortedProducts);
            setTotal(res.data.cart.total);
            
          } else {
            setProducts([]);
            setTotal(0);
            setIsEmpty(true);
          }
          setLoadingProducts(false);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchCart();
  }, [updated, setIsEmpty]);

  const handleDelete = async (pid) => {
    const cid = sessionStorage.getItem("cid");
    const url = `http://localhost:8080/api/carts/${cid}/products/${pid}`;
    try {
      await axios.delete(url);
      setUpdated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = async (pid, qty) => {
    const body = {
      qty,
    };
    const cid = sessionStorage.getItem("cid");
    try {
      const url = `http://localhost:8080/api/carts/${cid}/products/${pid}`;
      await axios.put(url, body);
      setUpdated(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    const cid = sessionStorage.getItem("cid");
    try {
      const url = `http://localhost:8080/api/carts/payment-success/${cid}`;
      const response = await axios.delete(url);
      if (response.data.success === true) {
        sessionStorage.removeItem("cid");
        setLoadingProducts(false)
        setLoading(false);
        swal({
          title: "Exito",
          text: `Compra realizada exitosamente. Recibirás un email de confirmación`,
          icon: "success",
        });
        setIsEmpty(true);
        navigate("/");
      } else {
        swal({
          title: "Ooops!",
          text: `Algo salió mal`,
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <Flex
          minH="90vh"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="6"
        >
          <Spinner size="xl" />
          <Text>Procesando la orden....</Text>
        </Flex>
      ) : (
          <Box>
            {!loadingProducts ?
            products.length > 0 ? (
            <Flex
              flexDir="row"
              justifyContent="center"
              alignItems="start"
              gap={10}
              mt={20}
            >
              <Flex
                flexDir="column"
                justifyContent="center"
                alignItems="center"
                gap={2}
                position="relative"
              >
                {products.map((product) => (
                  <ProductCardCart
                    handleDelete={handleDelete}
                    key={product.id}
                    producto={product}
                    qty={product.quantity}
                    handleRefresh={handleRefresh}
                  />
                ))}
              </Flex>

              <OrderSummary total={total} handlePay={handlePay} />
            </Flex>
          ) : (
            <Heading mt="20%">No hay articulos en el carrito</Heading>
          )
           :
           <Flex
          minH="90vh"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="6"
        >
          <Spinner size="xl" />
          <Text>Actualizando....</Text>
        </Flex>}
          
        </Box>
      )}
    </>
  );
}
