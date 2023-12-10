import React, { useContext, useEffect, useState } from "react";
import "./cartWidget.css";
import "./../button/button.css";
//import { CartContext } from "../../context/cartContext";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { RiShoppingCartLine } from 'react-icons/ri'
import { Flex, Icon, Box } from "@chakra-ui/react";
import { CartContext } from "../../store/context";



//import { AiOutlineShoppingCart} from "react-icons/ai";

export const CartWidget = () => {
  const [cartQty, setCartQty] = useState(0)
  const { isEmpty, setIsEmpty } = useContext(CartContext);

  useEffect(() => {
       async function fetchCart() {
         const cid = sessionStorage.getItem("cid");
         if (cid) {
             const url = `${import.meta.env.VITE_BACKEND_URL}/carts/${cid}`;
             try {
               const cart = await axios.get(url);
               cart.data?.cart.sortedProducts.length > 0 &&  setIsEmpty(false)    
                 setCartQty(cart.data.cart.sortedProducts.length);
             } catch (error) {
               console.log(error);
             }
         }       
       }
       fetchCart();
  }, [setIsEmpty, isEmpty])
  
  return (
    <NavLink to={"/cart"} className="btn btn-light bckg-color-primary">
      <Flex position='relative' justifyContent="center" alignItems="center">
        <Icon w={20} h={10} as={RiShoppingCartLine} />
        {!isEmpty ? (
          <Box
            m={0}
            p={1}
            background="#12be4b"
            borderRadius={50}
            position="absolute"
            top="-15%"
            right="7%"
            minH={4}
            minW={4}
            fontSize={10}
            fontWeight='bold'
            color={"white"}
          ></Box>
        ) : null}
      </Flex>
    </NavLink>
  );
};
