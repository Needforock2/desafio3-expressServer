import { NavLink } from "react-router-dom";
import "./navbar.css";
import { CartWidget } from "../CartWidget/CartWidget";
import {
  Flex,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Login } from "../Login/Login";
import { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { Register } from "../Register/Register";

axios.defaults.withCredentials = true;

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [session, setSession] = useState(false);
  const [register, setRegister] = useState(false);
  const successLogin = () => {
    setSession(true);
    onClose();
  };

  const handleRegister = () => {
    setRegister(!register);
  };

  const getToken = () => {
    const token = sessionStorage.getItem("token");
    return token;
  };
  const resetSessionStore = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("cid");
  };
  useEffect(() => {
    if (getToken()) {
      setSession(true);
    } else {
      setSession(false);
    }
    console.log(session)
  }, [session]);

  useEffect(() => {
    //console.log(register)
  }, [register]);

  const handleLogout = async () => {
    const url = "http://localhost:8080/api/auth/logout";
    try {
      const resp = await axios.post(url);
      swal({
        title: "Exito",
        text: resp.data.message,
        icon: "success",
      });
      setSession(false);
      resetSessionStore();
    } catch (error) {
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };
  return (
    <>
      <header className="App-header d-flex col-12 justify-content-between">
        <div className="">
          <NavLink className={"brand"} to={`/`}>
            Cachupines.cl
          </NavLink>
        </div>
        <Flex gap={10} justifyContent="center" alignItems="center">
          {session ? (
            <>
              <NavLink to={`/new_product`}>Crear Producto</NavLink>
              <NavLink onClick={handleLogout}>Logout</NavLink>
            </>
          ) : (
            <NavLink onClick={onOpen}>Login</NavLink>
          )}
          <CartWidget />
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {register ? "Regístrate" : "Inicia sesión en tu cuenta"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {register ? (
                <Register
                  successLogin={successLogin}
                  handleRegister={handleRegister}
                />
              ) : (
                <Login
                  successLogin={successLogin}
                  handleRegister={handleRegister}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </header>
    </>
  );
};
