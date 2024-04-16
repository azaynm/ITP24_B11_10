import mongoose from 'mongoose';

const { Schema } = mongoose;

const salarySchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    month: {
        type: Date,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
