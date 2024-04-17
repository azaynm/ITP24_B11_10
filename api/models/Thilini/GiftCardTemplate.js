import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define the enum for gift card types
const GiftCardTypeEnum = ['Farewell & Best Wishes', 'Good Job!', 'Thank You So Much', 'Happy Birthday', 'For Him/Her'];

const giftCardTemplateSchema = new Schema({
    type: {
        type: String,
        enum: GiftCardTypeEnum,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});


const GiftCardTemplate = mongoose.model("GiftCardTemplate", giftCardTemplateSchema);
export default GiftCardTemplate;


