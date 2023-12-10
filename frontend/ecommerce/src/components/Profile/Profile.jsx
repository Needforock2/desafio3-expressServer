import { useContext, useEffect, useState } from "react";
import { Box, Avatar, Text, VStack, Flex, Spinner, Button } from "@chakra-ui/react";
import swal from "sweetalert";
import axios from "axios";
import { CartContext } from "../../store/context";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const { role, setRole } = useContext(CartContext);
  const navigate = useNavigate();

  const handlePremium = async() => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/auth/premium`;
    try {
      const resp = await axios.put(url)
      if (resp.data.success) {
        if (resp.data.message.includes("PREMIUM")) {
          swal({
            title: "Felicidades!!!",
            text: "Ahora eres usuario Premium",
            icon: "success",
          })
          setRole(2)
        } else {
           swal({
             title: "Hmmmm",
             text: "Has perdido los privilegios",
             icon: "warning",
           });
          setRole(0)
        }
      } else {
         swal({
           title: "Error",
           text: "Algo Salió Mal",
           icon: "error",
         });
      }
    } catch (error) {
       swal({
         title: "Error",
         text: error.response.data.message,
         icon: "error",
       });
    }
  }

  useEffect(() => {
    if (role === null) {
      navigate("/");
    }
  }, []);

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
      const getUser = async () => {
        setLoading(true);
        const url2 = `${import.meta.env.VITE_BACKEND_URL}/sessions/current`;
        let user = "";
        try {
          if (role != null) {
            const resp = await axios.get(url2);

            user = resp.data.user[0];
          }
        } catch (error) {
          swal({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
          });
        }
        setUser(user);
        setLoading(false);
      };

    getUser();
  }, []);

  return (
    <>
      {role === null ? null : !loading ? (
        <Box
          maxW="md"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p="4"
          boxShadow="md"
          margin="5% auto"
        >
          <Avatar
            size="3xl"
            border="solid gray 1px"
            name={`${user.first_name} ${user.last_name}`}
            src={user.photo}
            mb="4"
          />

          <VStack spacing="2">
            <Text fontSize="lg" fontWeight="bold">
              {`${user.first_name} ${user.last_name}`}
            </Text>
            <Text fontSize="md">Age: {user.age}</Text>
            <Text fontSize="md">Email: {user.mail}</Text>
          </VStack>
          <>
            {role === 0 ? (
              <Text
                fontSize="md"
                maxW="80%"
                margin="10px auto"
                padding="10px 0"
            
              >
                Privilegios: Usuario Básico
              </Text>
            ) : role === 2 ? (
              <Text
                fontSize="md"
              
                maxW="80%"
                margin="10px auto"
                padding="10px 0"
           
              >
                Privilegios: Usuario Premium
              </Text>
            ) : null}
            {role === 1 ? (
              <Text
                fontSize="md"
                backgroundColor="blue.500"
                maxW="80%"
                margin="10px auto"
                padding="10px 0"
                borderRadius="2rem"
              >
                Usuario Administrador
              </Text>
            ) : (
              <Button
                mt="10px"
                bgColor="blue.500"
                color="white"
                onClick={handlePremium}
              >
                {role === 0 ? "Ser Premium" : "Dejar de ser Premium"}
              </Button>
            )}
          </>
        </Box>
      ) : (
        <Flex
          minH="90vh"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="6"
        >
          <Spinner size="xl" />
          <Text>Cargando....</Text>
        </Flex>
      )}
    </>
  );
};

export default Profile;
