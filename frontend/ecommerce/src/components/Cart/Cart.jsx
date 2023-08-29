import { Flex, Heading} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductCardCart from "./ProductCardCart";
import OrderSummary from "./OrderSummary";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [total, setTotal] = useState(0);

  //Leer el carrito
  useEffect(() => {
    setUpdated(false);
    async function fetchCart() {
      const cid = sessionStorage.getItem("cid");
      const url = `http://localhost:8080/api/carts/${cid}`;
      try {
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCart();
  }, [updated]);

  //leer el total del carrito
    useEffect(() => {
      setUpdated(false);
    async function fetchTotalAmount() {
      const cid = sessionStorage.getItem("cid");
      const url = `http://localhost:8080/api/carts/bills/${cid}`;
      try {
        const res = await axios.get(url);
        setTotal(res.data.totalAmount);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTotalAmount();
  }, [updated]);

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

  return (
    <>
      {products.length > 0 ? (
        <Flex
          flexDir="row"
          justifyContent="center"
          alignItems="center"
          gap={10}
          mt={20}
        >
          <Flex
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            {products.map((product) => (
              <ProductCardCart
                handleDelete={handleDelete}
                key={product.id}
                producto={product.product}
                qty={product.quantity}
                handleRefresh={handleRefresh}
              />
            ))}
          </Flex>

          <OrderSummary total={total} />
        </Flex>
      ) : (
        <Heading mt="20%">No hay articulos en el carrito</Heading>
      )}
    </>
  );
}
