import { Router } from "express";
import GiftCardTemplate from "../models/Thilini/GiftCardTemplate.js";


const router = Router();

router.get("/gift-card-templates", async(req, res) => {
    const giftCardsTemplate = await GiftCardTemplate.find();
    return res.json(giftCardsTemplate);
});

router.post("/gift-card-templates", async (req, res) => {
    try {
      const { type, amount } = req.body;
  
      // Create a new instance of GiftCardTemplate model
      const newGiftCardTemplate = new GiftCardTemplate({
        type,
        amount,
      });
  
      // Save the new gift card template to the database
      await newGiftCardTemplate.save();
  
      res.status(201).json({ message: "Gift card template created successfully" });
    } catch (error) {
      console.error("Error creating gift card template:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  export default router;