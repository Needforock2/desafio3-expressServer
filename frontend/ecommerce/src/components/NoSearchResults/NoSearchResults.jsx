import { Heading, Flex, Text } from '@chakra-ui/react'

export default function NoSearchResults() {
  return (
    <Flex minH='60vh' flexDir='column' justifyContent='center' >
      <Heading>Lo sentimos, no encontramos resultados</Heading>
      <Text fontSize='20px' >
        Tal vez su búsqueda fue demasiado específica, intente buscar con un
        término más general.
      </Text>
    </Flex>
  );
}
