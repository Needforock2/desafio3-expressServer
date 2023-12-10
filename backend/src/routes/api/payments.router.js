import { Router } from "express";
import PaymentService from "../../services/payment.js";

const router = Router()

router.post('/intents', async (req, res) => {
    const { total } = req.body
    const paymentIntentInfo = {
        amount: total*100,
        currency: 'usd'
    }
    const service = new PaymentService()
    let result = await service.createPaymentIntent(paymentIntentInfo);
    res.send({status: "success", payload: result})
})

export default router