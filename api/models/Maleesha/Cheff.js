import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cheffSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userId:{
        type: String
    },
    phone: {
        type: String
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'], // Assuming staff status can be available or unavailable
        default: 'available'
    },
    // Add more fields as needed
});

const Cheff = mongoose.model("Cheff", cheffSchema);
export default Cheff;
