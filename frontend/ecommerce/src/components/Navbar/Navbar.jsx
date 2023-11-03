import { useNavigate, NavLink } from "react-router-dom";
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
  Button,
  Heading,
  useTheme, Link
} from "@chakra-ui/react";
import { Login } from "../Login/Login";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { Register } from "../Register/Register";
import { PassResetReq } from "../Pass_Reset/PassResetReq";
import { CartContext } from "../../store/context";
 

axios.defaults.withCredentials = true;

export const NavBar = () => {
  const theme = useTheme();
   const textColor = theme.colors.custom.text;
  const {role, setRole} = useContext(CartContext)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [session, setSession] = useState(false);
  const [register, setRegister] = useState(false);
  const [reset, setReset] = useState(false)
  const [user, setUser] = useState({});
  const navigate = useNavigate()

  const successLogin = () => {
    sessionStorage.setItem("session", true)
    setSession(true);
    onClose();
  };

  const successReset = () => {
    onClose()
    setRegister(false)
    setReset(false)
  }

  const successRegister = () => {
    onClose();
  }

  const handleRegister = () => {
    setRegister(!register);
  };
  const handleReset = () => {
    setReset(!reset)
  }

  const getUser = async () => {
    const url2 = "http://localhost:8080/api/sessions/current";
    let user = "";
    try {
     
        const resp = await axios.get(url2);
        user = resp.data.user[0];
      setUser(user);
      setRole(user.role)
        user.cart?._id && sessionStorage.setItem("cid", user.cart._id);
        user ? setSession(true) : setSession(false);
     
    } catch (error) {
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };
  useEffect(() => {
    const localSession = sessionStorage.getItem("session") 
    if (localSession ) {      
      getUser();
    }
  }, [session]);

  useEffect(() => {

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
      sessionStorage.removeItem("cid");
      sessionStorage.removeItem("session")
      setRole(0)
      setSession(false);
      navigate("/");
    } catch (error) {
      swal({
        title: "Error",
        text: "error",
        icon: "error",
      });
    }
  };

  const handleProfileClick = () => {};

  return (
    <>
      <header className="App-header d-flex col-12 justify-content-between">
        <NavLink
          style={{
            background: "none",
          }}
          color={textColor}
          size="6xl"
          to='/'
        >
          <Heading fontSize="6xl">CACHUPINES</Heading>
        </NavLink>
        <Flex gap={10} justifyContent="center" alignItems="center">
          <>
            {session && (role === 1 || role === 2) ? (
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
                  <MenuItem onClick={handleProfileClick} fontSize={20}>
                    <NavLink to="/profile">Perfil</NavLink>
                  </MenuItem>
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
              {register
                ? "Regístrate"
                : reset
                ? "Reestablece tu Clave"
                : "Inicia sesión en tu cuenta"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {register ? (
                <Register
                  successRegister={successRegister}
                  handleRegister={handleRegister}
                />
              ) : reset ? (
                <PassResetReq
                  successReset={successReset}
                  handleReset={handleReset}
                />
              ) : (
                <Login
                  successLogin={successLogin}
                  handleRegister={handleRegister}
                  handleReset={handleReset}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </header>
    </>
  );
};
