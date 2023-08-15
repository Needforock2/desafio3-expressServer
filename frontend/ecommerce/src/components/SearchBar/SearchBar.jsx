import { useState } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useTheme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

export default function SearchBar({handleSearch}) {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      handleSearch(value)
  };

  return (
    <Flex justifyContent="center" alignItems="center">
      <InputGroup width="50vw">
        <Input
          placeholder="Buscar en Cachupines.cl"
          type="text"
          name="search"
          value={value}
          onChange={onChange}
          color="black"
          border="1px solid #8C8C8C"
          borderRadius="20px"
          bg="transparent"
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
          autoFocus
        />
        <IconButton
          onClick={handleSubmit}
          size="sm"
          backgroundColor="transparent"
          icon={<Search2Icon size="40px" color="#8C8C8C" />}
          _hover={{ bg: "transparent" }}
          ml="-40px"
          mt="5px"
          zIndex={1}
        />
      </InputGroup>
    </Flex>
  );
}
