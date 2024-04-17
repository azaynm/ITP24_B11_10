import { Router } from "express";
import Payment from "../../models/Maleesha/Payment.js";

const router = Router();


router.get('/payments', async (req, res) => {
    const payments = await Payment.find();
    res.json(payments);
})

router.post("/add-payment", async (req, res) => {

    const email = req.body.email;
    const reference = req.body.reference;
    const amount = req.body.amount;
    const customer = req.body.customer;
    const userName = req.body.userName;
    
    
    const newPaymentData = {
        email,
        reference,
        amount,
        customer,
        userName
    }

    const newPayment = new Payment(newPaymentData);

    newPayment.save()
        .then((payment) => res.json(payment))
        .catch(err => res.status(400).json('Error: ' + err));
});

export default router;