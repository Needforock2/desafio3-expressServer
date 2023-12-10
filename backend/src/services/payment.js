import Stripe from 'stripe'

export default class PaymentService{
    constructor() {
        this.stripe = new Stripe(
          "sk_test_51OLmfAFTUNe0CWLFSafCSBtcAST8oehlX8TGCwjuhblhfCuJi5nhZh7bPAUia2AoPzjsDlyK7yZI0f8wvR9Jmd4900jyCE7EId"
        );
    }
    createPaymentIntent = async (data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}