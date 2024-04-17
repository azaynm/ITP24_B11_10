import { Router } from "express";
import mongoose from "mongoose";
import Cart from "../../models/Deranidu/Cart.js";
import Food from "../../models/Tharushi/Menu.js";
import User from "../../models/User.js";

const router = Router();





router.post("/add-item", async (req, res) => {
    try {
        const { id, food, quantity } = req.body;

        // Find the user by username
        const user = await User.findOne({ userName: id });
        if (!user) {
            return res.status(404).json('User not found');
        }

        // Find the food item by its ID
        const foodData = await Food.findById(food);
        if (!foodData) {
            return res.status(404).json('Food item not found');
        }

        // Extract userId and food details
        const customerId = String(user._id);
        const { name, image, cost, sellingPrice } = foodData;
        console.log("selling price is"+ sellingPrice)

        const subTotal = quantity*sellingPrice;
        // Create a new cart item
        const newCartData = {
            customerId,
            food,
            name,
            price: sellingPrice,
            imageUrl: image,
            quantity,
            subTotal
        };

        // Save the new cart item to the database
        const newCart = new Cart(newCartData);
        await newCart.save();

        res.json('Item Added to the Cart');
        console.log('Item Added to the Cart');
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(400).json('Error: ' + error.message);
    }
})

router.get("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const cartItems = await Cart.find();
        
        const user = await User.findOne({ userName: id });

        const cartItem = cartItems.filter(e => String(e.customerId) === String(user._id) && e.isConfirmed === false);
        res.json(cartItem);
    } catch (error) {
        console.error("Error fetching cart items for user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.put("/user/setConfirmed/:id", async (req, res) => {
    const id = req.params.id;
    
    const filter = { userId: id };
    const update = { isConfirmed: true };

    let doc = await Cart.updateMany(filter, update);

    res.json(doc);
});



router.get("/user/getTotal/:id", async (req, res) => {
    let sum = 0;
    const id = req.params.id;
    const cartItems = await Cart.find();
    const cartItem = cartItems.filter(e => e.userId == id );
    cartItem.forEach(e => {
        sum += parseFloat(e.total)
    })
    res.json(sum);
});

router.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const cartItems = await Cart.find();
    const cartItem = cartItems.filter(e => e.userId == id && e.isConfirmed == false);
    res.json(cartItem.length);
});

router.delete('/delete-item/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Cart.findOneAndDelete(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error deleting carts", error: error });
    }
});

router.delete('/delete/:customerId', async (req, res) => {
    try {
        const username = req.params.customerId;
        const {_id} = await User.findOne({userName:username});
        console.log("Delete :"+_id);
        const result = await Cart.deleteMany({ customerId: _id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error deleting carts", error: error });
    }
});

router.get('/check/:id', async (req, res) => {
    const id = req.params.id;
    const cartItem = await Cart.findById(id);
    res.json(cartItem.image);
})


router.post('/:id', async (req, res) => {
    const cart = await Cart.findByIdAndUpdate(req.params.id, {
        userId: req.body.userId,
        foodId: req.body.foodId,
        foodName: req.body.foodName,
        foodImage: req.body.foodImage,
        quantity: req.body.quantity,
        total: req.body.total,
    });


    res.json(cart);
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const cartItems = await Cart.findById(id);

    res.json(cartItems)
})








export default router;