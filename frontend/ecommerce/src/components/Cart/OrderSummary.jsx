import { Card, CardBody, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";

export default function OrderSummary({total}) {
  return (
    <Card p={10} >
      <Heading>Resumen de la Compra</Heading>
      <CardBody>
        <Stack>
          <Text fontSize="2xl">Total: ${total}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
}
