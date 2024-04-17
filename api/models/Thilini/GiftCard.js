import mongoose from "mongoose";

const Schema = mongoose.Schema;

const giftCardSchema = new Schema({
    customerUsername: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true // Assuming each gift card code should be unique
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0 // Assuming the amount cannot be negative
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now // Default to current date if not specified
    },
    expireDate: {
        type: Date,
        default: () => {
            const currentDate = new Date();
            // Add one month to the current date
            currentDate.setMonth(currentDate.getMonth() + 1);
            return currentDate;
        }
    },
    paymentId: {
        type: String
    },
    isUsed: {
        type: Boolean,
        default: false
    }
});

const GiftCard = mongoose.model("GiftCard", giftCardSchema);
export default GiftCard;
