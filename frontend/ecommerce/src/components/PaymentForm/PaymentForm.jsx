import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Spinner, Text, Flex, Box } from "@chakra-ui/react";
import { useState } from 'react';
//import { createAlert, createAlertWithCallback } from '../../../utils/alerts';


const PaymentForm = ({handleSuccessPayment}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(null)

    const handleSubmit = async (e) => {
    setLoading(true)
        e.preventDefault();
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        })
        if (!error) {
       
            handleSuccessPayment(true)
            setLoading(false)
      
        } else {
            handleSuccessPayment(false)
       
        }
    }
    return (
      <>
        <form>
          <PaymentElement />
          <Flex flexDir="column" alignItems="center" justifyContent="center">
            <Button color="blue.500" mt="1rem" onClick={handleSubmit}>
              Pagar
            </Button>
            {loading ? (
              <Box marginTop="1rem">
                <Spinner size="xl" />
                <Text>Procesando la orden....</Text>
              </Box>
            ) : null}
          </Flex>
        </form>
      </>
    );
}
export default PaymentForm;