import mongoose from "mongoose";

const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    expirationDate: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['ingredient', 'food', 'beverage']        
    }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
    
