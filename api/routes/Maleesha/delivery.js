import { Router } from "express";
import Delivery from "../../models/Maleesha/Delivery.js";
import Order from "../../models/Deranidu/Order.js";


const router = Router();


router.get('/deliveries', async (req, res) => {
    const deliveries = await Delivery.find();
    res.json(deliveries);
})

router.post('/add-delivery', async (req, res) => {
    try {
        // Extract data from the request body
        const { orderId, preparedTime } = req.body;
        // Create a new delivery instance
        const newDelivery = new Delivery({
            orderId,
            preparedTime
        });

        // Save the new delivery to the database
        await newDelivery.save();

        // Send a success response
        res.status(201).json({ message: 'Delivery created successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error creating delivery:', error);
        res.status(500).json({ error: 'Failed to create delivery' });
    }
});

router.put('/update-time/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const { deliveredTime } = req.body;

    try {
        // Find the delivery by ID
        const delivery = await Delivery.findOne({orderId});

        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        if (deliveredTime) {
            delivery.deliveredTime = deliveredTime;
        }

        // Save the updated delivery
        await delivery.save();

        // Send a success response
        res.json({ message: 'Delivery time updated successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error updating delivery time:', error);
        res.status(500).json({ error: 'Failed to update delivery time' });
    }
});


router.post("/update-delivery/:deliveryID", async (req, res) => {
    const deliveryID = req.params.deliveryID; // Extract deliveryID from request parameters

    // Retrieve the new deliveryStatus from the request body
    const newDeliveryStatus = req.body.deliveryStatus;

    try {
        // Find the delivery by ID and update only the deliveryStatus field
        const updatedDelivery = await Delivery.findByIdAndUpdate(deliveryID, { deliveryStatus: newDeliveryStatus }, { new: true });

        if (!updatedDelivery) {
            return res.status(404).json({ message: "Delivery not found" });
        }

        res.json({ message: "Delivery status updated successfully", updatedDelivery });
    } catch (error) {
        res.status(400).json({ message: "Error updating delivery status", error: error.message });
    }
});


router.post('/completed-deliveries', async (req, res) => {
    try {
      const { date } = req.body;
      if (!date) {
        return res.status(400).json({ error: 'Date is required in the request body' });
      }
  
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0); // Start of the passed date
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999); // End of the passed date
  
      // Query for reservations with isApproved=true and selectedDate within the passed date
      const orders = await Order.find({
        time: { $gte: startOfDay, $lte: endOfDay },
        status: "finished"
      });
  
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/get-time/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        

        // Check if there is a salary entry for the current month and year for the given employee
        const deliveryEntry = await Delivery.findOne({
            orderId
           
        });

        // Return whether the employee was paid or not
        if (deliveryEntry) {
            res.json({ preparedTime: deliveryEntry.preparedTime, deliveredTime: deliveryEntry.deliveredTime });
        } else {
            res.status(404).json({ error: 'Delivery entry not found' });
        }
    } catch (error) {
        console.error('Error checking delivery time:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;