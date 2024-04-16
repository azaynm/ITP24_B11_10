import mongoose from "mongoose";

const Schema = mongoose.Schema;

const employeeTokenSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    token:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        //86400 = 24 hours 
        expires: 30 * 86400 // 30 days
    },
})

const EmployeeToken = mongoose.model("EmployeeToken", employeeTokenSchema);
export default EmployeeToken;