import React from "react";

import { Button } from "../button/Button";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import { CartWidget } from "../CartWidget/CartWidget";
import { Flex } from "@chakra-ui/react";


export const NavBar = () => {
  return (
    <>
      <header className="App-header d-flex col-12 justify-content-between">
        <div className="">
          <NavLink className={"brand"} to={`/`}>
            Cachupines.cl
          </NavLink>
        </div>
        <Flex gap={10} justifyContent='center' alignItems='center' >
          <NavLink to={`/new_product`}>Crear Producto</NavLink>
          <CartWidget />
        </Flex>
      </header>
    </>
  );
};
