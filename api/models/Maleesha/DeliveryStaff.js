import mongoose from "mongoose";

const Schema = mongoose.Schema;

const deliveryStaffSchema = new Schema({
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

const DeliveryStaff = mongoose.model("DeliveryStaff", deliveryStaffSchema);
export default DeliveryStaff;
