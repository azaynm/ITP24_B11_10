
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adressSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
});

const Address = mongoose.model("Address", adressSchema);
export default Address;
