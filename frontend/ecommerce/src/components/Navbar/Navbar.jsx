import { NavLink, useNavigate } from "react-router-dom";
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
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  const [user, setUser] = useState({})
  const navigate = useNavigate()
  const successLogin = () => {
    setSession(true);
    onClose();
  };

  const handleRegister = () => {
    setRegister(!register);
  };

  const getUser = async() => {  
    const url2 = "http://localhost:8080/api/sessions/current";
    let user = ""
    try {
      if (document.cookie) {
        const resp = await axios.get(url2);
       user = resp.data.user
        if (user) {
          setSession(true)
        } else {
          setSession(false)
        }        
      }
    } catch (error) {
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
      });
    }
    setUser(user)
  };


  useEffect(() => {
    getUser()
  
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
      sessionStorage.removeItem("cid")
      document.cookie =
        "token" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setSession(false);
      console.log(session)
      navigate("/")

    } catch (error) {
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };

  const handleProfileClick = () => {
    
  }

  return (
    <>
      <header className="App-header d-flex col-12 justify-content-between">
        <div className="">
          <NavLink className={"brand"} to={`/`}>
            Cachupines.cl
          </NavLink>
        </div>
        <Flex gap={10} justifyContent="center" alignItems="center">
            <>
              {user.role === 1 ? (
                <NavLink to={`/new_product`}>Crear Producto</NavLink>
              ) : null}
            {session ? (
              <Menu>
                <MenuButton borderRadius={50}>
                  <Avatar
                    src={user.photo}
                    border="solid black 1px"
                    p={1}
                    h="60px"
                    w="60px"
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleProfileClick} fontSize={20}><NavLink to="/profile" >Perfil</NavLink></MenuItem>
                  <MenuItem onClick={handleLogout} fontSize={20}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <NavLink onClick={onOpen}>Login</NavLink>
              )}
            </>
         
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
