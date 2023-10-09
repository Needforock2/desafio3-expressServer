import { Card, Flex, Image, Stack, Heading, Text, Divider, CardFooter, ButtonGroup, Button, Input } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'



export default function ProductCardCart({ producto, qty, handleDelete, handleRefresh, key }) {
  const { title, decription, price, stock, category, _id } = producto;

  const [inputValue, setInputValue] = useState("");
  const [updated, setUpdated] = useState(false);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <Card key={key} width={600} mb={7} boxShadow="5px 5px 17px 0px rgba(0,0,0,0.75);">
      <Flex
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        p={5}
      >
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
          borderRadius="lg"
          maxWidth={200}
        />
        <Stack mt="6" spacing="3" p={1}>
          <Heading size="md">{title}</Heading>
          <Text>{decription}</Text>
          <Text color="blue.600" fontSize="2xl">
            ${price}
          </Text>
          <Flex gap={2} justifyContent="center" alignItems="center">
            <Text color="blue.600" fontSize="2xl">
              Cantidad:
            </Text>
            <Input
              placeholder={qty}
              size="lg"
              maxWidth={16}
              type="number"
              value={inputValue}
              onChange={handleInputChange}
            />
          </Flex>
        </Stack>
        <CardFooter>
          <ButtonGroup spacing="0" flexDir="column">
            <Button
              fontSize="l"
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleRefresh(_id, inputValue)}
            >
              Actualizar
            </Button>
            <Button
              fontSize="xl"
              variant="ghost"
              colorScheme="blue"
              onClick={() => handleDelete(_id)}
            >
              Eliminar
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Flex>
    </Card>
  );
}
