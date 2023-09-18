import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import swal from "sweetalert";
axios.defaults.withCredentials = true;

export const Register = ({ successLogin, handleRegister }) => {
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
    const url = "http://localhost:8080/api/auth/register";
    try {
      const resp = await axios.post(url, loginData);
      successLogin();
      swal({
        title: "Exito",
        text: resp.data.message,
        icon: "success",
      });
    } catch (error) {
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
      });
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
          >
            <Text color="fg.muted">
              Ya tienes una Cuenta?{" "}
              <Link onClick={() => handleRegister(false)}>Inicia Sesión</Link>
            </Text>
          </Stack>
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
            <Stack spacing="6">
              <FormControl>
                <FormLabel htmlFor="first_name">Nombre</FormLabel>
                <Input
                  id="first_name"
                  name="first_name"
                  type="string"
                  onChange={handleInputChange}
                />
                <FormLabel htmlFor="last_name">Apellido</FormLabel>
                <Input
                  id="last_name"
                  name="last_name"
                  type="string"
                  onChange={handleInputChange}
                />
                <FormLabel htmlFor="name">Edad</FormLabel>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  onChange={handleInputChange}
                />
                <FormLabel htmlFor="name">Url de tu foto</FormLabel>
                <Input
                  id="photo"
                  name="photo"
                  type="string"
                  onChange={handleInputChange}
                />
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="mail"
                  name="mail"
                  type="email"
                  onChange={handleInputChange}
                />
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
              <Button onClick={(e) => handleSubmit(e)} bgColor={"blue.500"}>
                Registrarte
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
