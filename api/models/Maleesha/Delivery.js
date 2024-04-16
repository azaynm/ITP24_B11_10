import mongoose from "mongoose";

const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    orderId: {
        type: String
    },
    preparedTime: {
        type: Date
    },
    deliveredTime: {
        type: Date
    }
});

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;
