import { Router } from "express";
import Inventory from "../../models/Charuka/Inventory.js";

const router = Router();

router.get('/inventory', async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




router.post("/add-inventory", async (req, res) => {
    const { name, quantity, price, supplier, expirationDate, category } = req.body;
    
    const newInventoryData = {
        name,
        quantity,
        price,
        supplier,
        expirationDate,
        category        
    };

    const newInventory = new Inventory(newInventoryData);

    try {
        await newInventory.save();
        res.status(201).json('Inventory Item Added to the DB');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/get-inventory/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const inventory = await Inventory
            .findById(id)
            .populate('category')
            .exec();

        res.json(inventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/update-inventory/:id', async (req, res) => {
    const { name, quantity, price, supplier, expirationDate, category } = req.body;
    const { id } = req.params;

    try {
        const updatedInventory = await Inventory.findByIdAndUpdate(id, {
            name,
            quantity,
            price,
            supplier,
            expirationDate,
            category
        });

        res.json(updatedInventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/delete-inventory/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedInventory = await Inventory.findByIdAndDelete(id);
        res.json(deletedInventory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


export default router;
