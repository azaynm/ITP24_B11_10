import mongoose from "mongoose";

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    deliveryRating: {
        type: Number,
        min: 1,
        max: 5
    },
    foodRating: {
        type: Number,
        min: 1,
        max: 5
    },
    orderId: {
        type: String,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    note: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    deliveryStaff:{
        type: String,
    },
    cheff:{
        type: String,
    },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
