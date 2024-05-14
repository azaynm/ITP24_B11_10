import { Router } from "express";
import GiftCard from "../../models/Thilini/GiftCard.js";


const router = Router();


router.get('/gift-cards', async (req, res) => {
    const giftCards = await GiftCard.find();
    res.json(giftCards);
})

router.get('/gift-cards/user/:userId', async (req, res) => {
    const customerUsername = req.params.userId;
    const giftCards = await GiftCard.find({customerUsername, isUsed: false});
    res.json(giftCards);
})

router.post('/gift-cards', async (req, res) => {
    const giftCardData = req.body;

    try {
        const giftCard = new GiftCard(giftCardData);
        await giftCard.save();
        console.log('Gift card saved successfully');
        res.status(201).send('Gift card added successfully');
    } catch (error) {
        console.error('Error saving gift card:', error);
        res.status(500).send('Error adding gift card');
    }
});


router.put('/update-user', async (req, res) => {
    const { selectedGiftCard, selectedUser } = req.body;
    console.log("selected order", selectedGiftCard)
    console.log("selected Staff", selectedUser)

    try {
        const giftCard = await GiftCard.findById(selectedGiftCard);
        if (!giftCard) {
            return res.status(404).json({ message: "Gift Card not found" });
        }

        giftCard.customerUsername = selectedUser;
        console.log("New Gift Card ", giftCard.customerUsername)
        await giftCard.save();

        res.json({ message: "Gift card updated successfully", order });
    } catch (error) {
        console.error("Error updating gift card status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// router.post("/add-gift-card", async (req, res) => {

//     const customer = req.body.customer;
//     const code = req.body.code;
//     const category = req.body.category;
//     const amount = req.body.amount;
//     const issue_date = req.body.issue_date;
//     const expire_date = req.body.expire_date;


//     //res.secure_url

//     const newGiftCardData = {
//         customer,
//         code,
//         category,
//         amount,
//         issue_date,
//         expire_date
//     }

//     const newGiftCard = new GiftCard(newGiftCardData);

//     newGiftCard.save()
//         .then(() => res.json('Gift Card Added to the DB'))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

router.get('/check-gift-card', async (req, res) => {
    try {
        const customer = req.query.customer; // Use req.query to access query parameters
        const code = req.query.code;

        const giftCards = await GiftCard.find({ customer, code });

        if (giftCards && giftCards.length > 0) {
            res.status(200).json(giftCards);
        } else {
            res.status(404).json({ error: 'No gift cards found for the provided customer and code.' });
        }
    } catch (error) {
        console.error('Error while checking gift card:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/gift-cards/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const deletedGiftCard = await GiftCard.findOneAndDelete({ code });

        if (!deletedGiftCard) {
            return res.status(404).json({ message: 'Gift card not found' });
        }

        res.json({ message: 'Gift card deleted successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error deleting gift card:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;