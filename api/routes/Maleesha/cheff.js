import { Router } from "express";
import Cheff from "../../models/Maleesha/Cheff.js";


const router = Router();

router.get("/cheff", async (req, res) => {
    try {
        const cheff = await Cheff.find({ status: "available" });
        res.json(cheff);
    } catch (error) {
        console.error("Error fetching available cheff:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/add-cheff", async (req, res) => {
    try {
        // Extract data from request body
        const { name, userId, phone, status } = req.body;

        // Create a new delivery staff instance
        const newCheff = new Cheff({
            name,
            userId,
            phone,
            status
        });

        // Save the new staff member to the database
        const savedCheff = await newCheff.save();

        // Respond with the saved staff member
        res.status(201).json(savedCheff);
    } catch (error) {
        // Handle errors
        console.error("Error adding delivery staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;