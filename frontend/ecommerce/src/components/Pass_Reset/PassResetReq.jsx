import {
  Box,
  Button,
  Container,
  FormControl,
    FormLabel,
  Spinner,
  Input,
  Stack,
  Text,
  Flex,
  Link
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import swal from "sweetalert";
axios.defaults.withCredentials = true;

export const PassResetReq = ({ successReset, handleReset, flag }) => {
    const [loginData, setLoginData] = useState("");
    const [loading, setLoading] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_BACKEND_URL}/auth/reset_req`;
      try {
        setLoading(true)
        const resp = await axios.post(url, loginData);
        if (successReset) {
          
          successReset();
        }
          setLoading(false)
      swal({
        title: "Exito",
        text: resp.data.message,
        icon: "success",
      });
      } catch (error) {
          successReset();
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };

    return (
      <>
        {loading ? (
          <Flex
            minH="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap="6"
          >
            <Spinner size="xl" />
            <Text>Procesando Solicitud</Text>
          </Flex>
        ) : (
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
                    Coloca tu email para reestablecer contraseña
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
                  <Stack spacing="5">
                    <FormControl>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        id="mail"
                        name="mail"
                          type="mail"
                          required='true'
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Stack>
                  <Stack spacing="6">
                    <Button
                      onClick={(e) => handleSubmit(e)}
                      bgColor={"blue.500"}
                    >
                      Reestablecer Contraseña
                    </Button>
                    <>
                      {!flag ? (
                        <Flex
                          justifyContent="center"
                          flexDir="column"
                          alignItems="center"
                          gap={3}
                        >
                          <Text>ó</Text>
                          <Link
                            textDecoration="underline"
                            color="blue.500"
                            onClick={handleReset}
                          >
                            Inicia Sesión
                          </Link>
                        </Flex>
                      ) : null}
                    </>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Container>
        )}
      </>
    );
};
