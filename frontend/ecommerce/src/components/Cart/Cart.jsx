import { Flex, Heading, Box, Card, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ProductCardCart from "./ProductCardCart";
import OrderSummary from "./OrderSummary";
import swal from "sweetalert";
import { CartContext } from "../../store/context";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Wrapper from "../PaymentForm/Wrapper";
import PaymentForm from "../PaymentForm/PaymentForm";
import PaymentService from "../../services/paymentService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export default function Cart() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [total, setTotal] = useState(0);
  const { setIsEmpty } = useContext(CartContext);

  //Leer el carrito
  useEffect(() => {
    setUpdated(false);
    async function fetchCart() {
      const cid = sessionStorage.getItem("cid");
      if (cid) {
        setLoadingProducts(true);
        const url = `${import.meta.env.VITE_BACKEND_URL}/carts`;
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
    const url = `${import.meta.env.VITE_BACKEND_URL}/carts/${pid}`;
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
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/carts/${pid}`;
      await axios.patch(url, body);
      setUpdated(true);
    } catch (error) {
      console.log(error);
    }
  };
  const callbackSuccessPaymentIntent = (res) => {
    console.log("hola")
    setClientSecret(res.data.payload.client_secret);
  };

  const callbackErrorPaymentIntent = (err) => {
    console.log(err);
  };

  const handlePay = async () => {
    //setLoading(true);
    
    try {
      const service = new PaymentService()
      service.createPaymentIntent({
        total: total,
        callbackSuccess: callbackSuccessPaymentIntent,
        callbackError: callbackErrorPaymentIntent,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSuccessPayment = async (result) => {
    const cid = sessionStorage.getItem("cid");
    if (result === true) {
       const url = `${
         import.meta.env.VITE_BACKEND_URL
       }/carts/payment-success/${cid}`;
      const response = await axios.delete(url);
      if (response.data.success === true) {
        sessionStorage.removeItem("cid");
        setLoadingProducts(false);
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
     
    } else {
      swal({
        title: "Ooops!",
        text: `Algo salió mal`,
        icon: "error",
      });
    }
    
  }

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
          
       
        </Flex>
      ) : (
        <Box>
          {!loadingProducts ? (
            products.length > 0 ? (
              <>
                <Wrapper hidden={clientSecret}>
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
                </Wrapper>

                <Wrapper hidden={!clientSecret || !stripePromise}>
                  <Card maxW="20%" margin="5rem auto" padding="2rem">
                    <Text mb="2rem">Pago seguro con Stripe</Text>
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret: clientSecret }}
                    >
                      <PaymentForm
                        handleSuccessPayment={handleSuccessPayment}                        
                      />
                    </Elements>
                  </Card>
                </Wrapper>
              </>
            ) : (
              <Heading mt="20%">No hay articulos en el carrito</Heading>
            )
          ) : (
            <Flex
              minH="90vh"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              gap="6"
            >
              <Spinner size="xl" />
              <Text>Actualizando....</Text>
            </Flex>
          )}
        </Box>
      )}
    </>
  );
}
