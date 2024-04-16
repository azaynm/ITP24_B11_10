import mongoose from "mongoose";

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
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
    hireDate:{
        type: Date, // Changed type to Date
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    empName:{
        type: String,
        required: true,
    },
    position:{
        type: String,
        required: true,
    },
    dob:{
        type: Date, // Changed type to Date
        required: true,
    },
    roles:{
        type:[String],
        enum: ["systemAdmin", "employee", "eventCoordinator", "deliveryStaff", "cateringManager", "financialManager", "cheff"],
        default: ["employee"], // You can set any default role here
    }
});  


const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
