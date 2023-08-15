import React, { useEffect } from "react";
import "./cartWidget.css";
import "./../button/button.css";
//import { CartContext } from "../../context/cartContext";
import { NavLink } from "react-router-dom";
import axios from "axios";


//import { AiOutlineShoppingCart} from "react-icons/ai";

export const CartWidget = () => {
  //const { countItems } = useContext(CartContext);
  //const cantidad = countItems();
  useEffect(() => {
       async function fetchCart() {
         const cid = sessionStorage.getItem("cid");
         if (cid) {
             const url = `http://localhost:8080/api/carts/${cid}`;
             try {
                await axios.get(url);

             } catch (error) {
               console.log(error);
             }
         }       
       }
       fetchCart();
  }, [])
  

  return (
    <NavLink to={"/cart"} className="btn btn-light bckg-color-primary">
      Carrito
    </NavLink>
  );
};
