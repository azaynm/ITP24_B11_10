import mongoose from "mongoose";

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    email:{
        type: String
    },
    reference:{
        type: String
    },
    amount:{
        type: Number
    },
    customer:{
        type: String
    },
    userName:{
        type: String
    },
    time: { type: Number, default: Date.now }
});  

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;