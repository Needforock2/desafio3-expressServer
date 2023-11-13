import { useContext, useEffect, useState } from "react";
import { Box, Avatar, Text, VStack, Flex, Spinner } from "@chakra-ui/react";
import swal from "sweetalert";
import axios from "axios";
import { CartContext } from "../../store/context";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { role } = useContext(CartContext);
  const navigate = useNavigate();
  console.log(role)
  useEffect(() => {
    if (role === null) {
      navigate("/");
    }
  }, []);

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    setLoading(true);
    const url2 = "http://localhost:8080/api/sessions/current";
    let user = "";
    try {
      
       if (role !=null) {
         const resp = await axios.get(url2);
         console.log(resp)
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

  useEffect(() => {
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
