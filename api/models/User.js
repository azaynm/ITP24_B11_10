import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    roles:{
        type:[String],
        //mongdo db allows only these three values to be added
        enum: ["user","systemAdmin", "developer", "eventCoordinator", "deliveryStaff", "cateringManager", "financialManager", "cheff"],
        default: ["user"], // You can set any default role here
    },
    isAdmin:{
        type: Boolean
    }
});  

const User = mongoose.model("User", userSchema);
export default User;