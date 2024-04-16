import stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import { Router } from "express";


const router = Router();


const stripeSecretKey = "sk_test_51OuRCSJ53U8MN5Mjuyt4MeNKunAa626lxV0xRcyoHk25sPqong1TSrOGayF1ul8xvXgzybOcrXiWmjOcXE1VcHZo00c7S0Rh2P";

const stripeInstance = stripe(stripeSecretKey);

router.get('/payment', (req, res, next) => {
    console.log("GET Response from Developer");
    res.json({
        message: 'works'
    });
});


router.post("/pay", async (req, res, next) => {
    console.log(req.body.token);
    const { token, amount } = req.body;
    const idempotencyKey = uuidv4();

    try {
        const customer = await stripeInstance.customers.create({
            email: token.email,
            source: token
        });

        const charge = await stripeInstance.charges.create({
            amount: amount * 100,
            currency: 'lkr',
            customer: customer.id,
            receipt_email: token.email
        }, { idempotencyKey });
        console.log(charge);
        res.status(200).json(charge);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Payment failed' });
    }
});

export default router;
