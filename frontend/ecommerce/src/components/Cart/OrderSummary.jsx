import { Button, Card, CardBody, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";

export default function OrderSummary({total, handlePay}) {
  return (
    <Card
      p={10}
      boxShadow="5px 5px 17px 0px rgba(0,0,0,0.75);"
      position="sticky"
      top='20%'
      h='240px'
    >
      <Heading>Resumen de la Compra</Heading>
      <CardBody pb={0}>
        <Stack>
          <Text fontSize="2xl">Total: ${total}</Text>
        </Stack>
        <Button mt={10} background={"blue"} color={"white"} onClick={handlePay}>
          Checkout
        </Button>
      </CardBody>
    </Card>
  );
}
