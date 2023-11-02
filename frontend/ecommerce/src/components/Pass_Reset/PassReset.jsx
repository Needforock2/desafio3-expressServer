import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import swal from "sweetalert";
import axios from "axios";

export default function PassReset() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loginData, setLoginData] = useState("");
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef(null);
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
   
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  
    const url = "http://localhost:8080/api/auth/pass_reset";
    try {
      const resp = await axios.post(url, loginData, config);
      swal({
        title: "Exito",
        text: resp.data.message,
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
      });
      if (
        error.response.data.message ===
        "El enlace expiró, por favor vuelve a intentarlo"
      ) {
        navigate("/pass_reset");
      }
    }
  };

  return (
    <Container
      maxW="lg"
      py={{
        base: "2",
        md: "6",
      }}
      px={{
        base: "0",
        sm: "8",
      }}
    >
      <Stack spacing="6">
        <Stack spacing="6">
          <Stack
            spacing={{
              base: "2",
              md: "3",
            }}
            textAlign="center"
          ></Stack>
        </Stack>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={{
            base: "transparent",
            sm: "bg.surface",
          }}
          boxShadow={{
            base: "none",
            sm: "md",
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <InputRightElement>
                    <IconButton
                      variant="text"
                      aria-label={isOpen ? "Mask password" : "Reveal password"}
                      icon={isOpen ? <HiEyeOff /> : <HiEye />}
                      onClick={onClickReveal}
                    />
                  </InputRightElement>
                  <Input
                    id="password"
                    name="password"
                    type={isOpen ? "text" : "password"}
                    autoComplete="current-password"
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormControl>
            </Stack>
            <Stack spacing="6">
              <Button
                onClick={(e) => handleSubmit(e)}
                bgColor={"blue.500"}
                isDisabled={loginData.password =="" ? true : false }
             
              >
                Cambiar Contraseña
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
