import { Router } from "express";

import Order from "../../models/Deranidu/Order.js";
import Address from "../../models/Maleesha/Address.js";


const router = Router();


router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const addresses = await Address.find({ userId });
    res.json(addresses);
})

router.post('/add-address', async (req, res) => {
    try {
        const newAddress = new Address(
            req.body
        );
        await newAddress.save();
        res.status(201).json({ message: 'Address added successfully' });
    } catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({ error: 'Failed to add address' });
    }
});

router.put('/update-address/:addressId', async (req, res) => {
    const addressId = req.params.addressId;
    console.log("body", req.body)
    try {
        const address = await Address.findByIdAndUpdate(addressId, req.body, { new: true });

        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }
        res.json({ message: 'Address updated successfully', address });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ error: 'Failed to update address' });
    }
});

router.delete("/:addressId", async (req, res) => {
    try {
        const addressId = req.params.addressId;

        // Find the employee by ID and delete it
        const deletedAddress = await Address.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.json({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ error: "Failed to delete address" });
    }
});

export default router;