import { Router } from "express";
import Order from "../../models/Deranidu/Order.js";
import Cart from "../../models/Deranidu/Cart.js";



const router = Router();


router.get('/orders', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
})

router.get('/completed-orders/:username/:status', async (req, res) => {
    const { username, status } = req.params;

    try {
        const orders = await Order.find({ customer: username, status });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Error fetching orders" });
    }
});




router.post("/add-order", async (req, res) => {
    try {
        const { foods, amount, customer, paymentId, address, city, phone } = req.body;


        // Create a new order document
        const newOrder = new Order({
            foods,
            amount,
            customer,
            paymentId,
            address,
            city,
            phone
        });

        // Save the new order to the database
        await newOrder.save();

        res.json('Order Added to the DB');
    } catch (error) {
        res.status(400).json('Error: ' + error);
    }
});

router.get('/orders/:customer', async (req, res) => {
    try {
      const customer = req.params.customer;
      const orders = await Order.find({ customer });
  
      if (!orders) {
        return res.status(404).json({ message: 'Orders not found for this customer' });
      }
  
      return res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

router.get('/:status', async (req, res) => {
    const status = req.params.status;
    try {
        const readyOrders = await Order.find({ status: status });
        res.json(readyOrders);
    } catch (error) {
        console.error(`Error fetching ${status}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.put('/update-status/:selectedOrder', async (req, res) => {
    const orderId = req.params.selectedOrder;
    const { status, selectedCheff } = req.body;
    console.log("selected order", orderId)
    console.log("selected Staff", selectedCheff)

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        order.cheff = selectedCheff;
        console.log("New order ",order.cheff)
        await order.save();

        res.json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/complete-order/:selectedOrder', async (req, res) => {
    const orderId = req.params.selectedOrder;
   

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = "finished";
        await order.save();

        res.json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/assign-delivery', async (req, res) => {
    const { orderId, staffId } = req.body;
    console.log("Selected Staff",staffId)
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.deliveryStaff = staffId;
        order.status = "delivering";
        console.log(order.status)
        await order.save();

        res.json({ message: "Delivert Staffupdated successfully", order });
    } catch (error) {
        console.error("Error updating delivery staff:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;