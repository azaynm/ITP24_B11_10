import { Router } from "express";
import Feedback from "../../models/Geethika/Feedback.js";
import Order from "../../models/Deranidu/Order.js";


const router = Router();

router.get("/feedbacks", async (req, res) => {
    try {
      // Find all feedbacks
      const feedbacks = await Feedback.find();
      // Return the feedbacks as JSON response
      return res.json(feedbacks);
    } catch (error) {
      // If an error occurs, handle it
      console.error("Error fetching feedbacks:", error);
      return res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
  });

  router.get("/feedbacks/get-feedback/:feedbackId", async (req, res) => {
    try {
      // Find feedback by ID
      const orderId = req.params.feedbackId;
      console.log(orderId)
      const feedback = await Feedback.findOne({ orderId: orderId }); // Assuming orderId is a field in the feedback document
  
      // Check if feedback exists
      if (!feedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }
      console.log(feedback)
      // Return the feedback as JSON response
      return res.json(feedback);
    } catch (error) {
      // If an error occurs, handle it
      console.error("Error fetching feedback:", error);
      return res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  router.put("/feedbacks/update-feedback/:id", async (req, res) => {
    try {
      const orderId = req.params.id;
      const { feedback } = req.body;
      console.log(orderId, feedback)
  
    
      // Update the feedback in the database
      const updatedFeedback = await Feedback.findOneAndUpdate(
        { orderId },
        { $set: { note: feedback } }
      );
  
      if (!updatedFeedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }
  
      res.json(updatedFeedback);
    } catch (error) {
      console.error("Error updating feedback:", error);
      res.status(500).json({ error: "Failed to update feedback" });
    }
  });


  router.delete("/feedbacks/delete-feedback/:id", async (req, res) => {
    try {
      const feedbackId = req.params.id;
      
      // Find the feedback by orderId and delete it
      const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
  
      if (!deletedFeedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }
  
      res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).json({ error: "Failed to delete feedback" });
    }
  });



  
router.post("/submit-feedback", async (req, res) => {
    try {
      const { deliveryRating, foodRating, orderId, customer, note } = req.body;
  
      // Find the order by its ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      // Access deliveryStaff and cheff from the order object
      const { deliveryStaff, cheff } = order;
  
      // Create a new Feedback document
      const feedback = new Feedback({
        deliveryRating,
        foodRating,
        orderId,
        customer,
        note,
        deliveryStaff,
        cheff
      });
  
      // Save the feedback to the database
      await feedback.save();
  
      res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });



  router.get("/fetch-staff/:orderId", async (req, res) => {
    const orderId = req.params.orderId;
    try {
      // Find all feedbacks
      const order = await Order.findById(orderId);
      // Return the feedbacks as JSON response
      return res.json({cheff: order.cheff, deliveryStaff: order.deliveryStaff});
    } catch (error) {
      // If an error occurs, handle it
      console.error("Error fetching feedbacks:", error);
      return res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
  });
  

  export default router;