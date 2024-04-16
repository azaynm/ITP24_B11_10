import mongoose from 'mongoose';

const { Schema } = mongoose;

const reservationSchema = new Schema({
  selectedDate: {
    type: Date,
    required: true
  },
  selectedTime: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  tableType: {
    type: String,
    required: true
  },
  guestCount: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  fee: {
    type: Number
  },
  paymentId:{
    type: String
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
