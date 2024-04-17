import { Router } from "express";
import DeliveryStaff from "../../models/Maleesha/DeliveryStaff.js";


const router = Router();

router.get("/delivery-staff", async (req, res) => {
    try {
        const deliveryStaff = await DeliveryStaff.find({ status: "available" });
        res.json(deliveryStaff);
    } catch (error) {
        console.error("Error fetching available delivery staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/cheff", async (req, res) => {
    try {
        const cheff = await DeliveryStaff.find({ status: "available" });
        res.json(cheff);
    } catch (error) {
        console.error("Error fetching available delivery staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.post("/add-delivery-staff", async (req, res) => {
    try {
        // Extract data from request body
        const { name, userId, phone, status } = req.body;

        // Create a new delivery staff instance
        const newStaff = new DeliveryStaff({
            name,
            userId,
            phone,
            status
        });

        // Save the new staff member to the database
        const savedStaff = await newStaff.save();

        // Respond with the saved staff member
        res.status(201).json(savedStaff);
    } catch (error) {
        // Handle errors
        console.error("Error adding delivery staff:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;