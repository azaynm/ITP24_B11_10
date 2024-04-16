import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Swal from "sweetalert2";
import Stripe from 'react-stripe-checkout';
import { useLocation } from 'react-router-dom';

const API_BASE = "http://localhost:8080";

function ReservationForm() {
  const [formErrors, setFormErrors] = useState({});
  const location = useLocation();
  const { tableType } = location.state;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [guestCount, setGuestCount] = useState(0);
  const [reservationFee, setReservationFee] = useState(200);
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  const [timeOptions] = useState([
    "8.00 AM - 9.00 AM",
    "9.00 AM - 10.00 AM",
    "10.00 AM - 11.00 AM",
    "11.00 AM - 12.00 PM",
    "12.00 PM - 1.00 PM",
    "1.00 PM - 2.00 PM",
    "2.00 PM - 3.00 PM",
    "3.00 PM - 4.00 PM",
    "4.00 PM - 5.00 PM",
  ]);

  const handleTimeChange = (e) => {
    const selected = e.target.value;
    setSelectedTime(selected);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  const handleNumberChange = (e) => {
    const newNumber = e.target.value;
    setNumber(newNumber);
  };

  const handleGuestCountChange = (e) => {
    const newGuestCount = e.target.value;
    setGuestCount(newGuestCount);
  }

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!selectedDate) {
      errors.selectedDate = "Selected Date is required";
      formIsValid = false;
    }

    if (!selectedTime) {
      errors.selectedTime = "Selected Time is required";
      formIsValid = false;
    }

    if (!name.trim()) {
      errors.name = "Name is required";
      formIsValid = false;
    }

    if (!guestCount) {
      errors.guestCount = "Guest Count is required";
      formIsValid = false;
    }

    if (!email.trim()) {
      errors.email = "Email is required";
      formIsValid = false;
    }

    if (!number.trim()) {
      errors.number = "Number is required";
      formIsValid = false;
    }

    setFormErrors(errors);
    return formIsValid;
  }

  const handleToken = async (token) => {
    if (!validateForm()) return;
  
    try {
      // First POST request to Stripe API
      const responseStripe = await axios.post(`${API_BASE}/api/stripe/pay`, {
        token: token.id,
        amount: reservationFee, // Convert fee to cents
      });
  
      if (responseStripe.status === 200) {
        const charge = responseStripe.data;
  
        // Second POST request to your local server for adding payment
        const responsePayment = await axios.post("http://localhost:8080/api/payment/add-payment", {
          email: charge.billing_details.name,
          reference: charge.id,
          amount: charge.amount / 100,
          customer: charge.customer,
          userName: localStorage.getItem("username")
        });
  
        if (responsePayment.status === 200) {
          const paymentId = responsePayment.data._id;
          console.log("payment id", paymentId)
          const username = localStorage.getItem('username');
  
          // Prepare data for reservation
          const data = {
            selectedDate,
            selectedTime,
            name,
            username,
            email,
            number,
            tableType,
            guestCount,
            fee: reservationFee,
            paymentId, // Pass payment ID
          };
  
          // Third POST request to submit reservation
          const reservationResponse = await axios.post(`${API_BASE}/api/reservation/reservations`, data);
  
          console.log("Reservation submitted successfully:", reservationResponse.data);
          console.log('Reservation Request Added!');
  
          // Reset form fields
          setSelectedDate(null);
          setSelectedTime(null);
          setName("");
          setEmail("");
          setNumber("");
          setGuestCount(0);
          setShowPaymentButton(false); // Reset showPaymentButton state
        } else {
          console.log("Payment request failed");
          return Promise.reject("Payment request failed");
        }
      } else {
        console.log("Stripe payment request failed");
        return Promise.reject("Stripe payment request failed");
      }
    } catch (error) {
      console.error("Error:", error);
      return Promise.reject(error);
    }
  };
  

  const showPayment = () => {
    if (!validateForm()) return;

    Swal.fire({
      title: 'Proceed with payment?',
      text: 'Are you sure you want to proceed with the payment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setShowPaymentButton(true);
      } else {
        // User cancelled, do nothing
      }
    });
  };

  return (
    <div>
      {showPaymentButton === false ? (
        <div className="card m-5">
          <div className="card-body">
            <div className="row m-3">
              <h2>Reservation Form - {tableType}</h2>
              <hr></hr>
            </div>
            <div className="row m-3 p-2">
              <div className="col-4 ">
                <span>Select Date</span>
                <div className="form-group">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    isClearable
                  />
                  <div className="text-danger">{formErrors.selectedDate}</div>
                </div>
              </div>
              <div className="col-4">
                <span>Select Time</span>
                <select
                  className="form-select"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  aria-label="Default select example"
                >
                  <option value={null}>Select Time</option> {/* Add default option */}
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <div className="text-danger">{formErrors.selectedTime}</div>
              </div>
              <div className="col-4">
                <span>Select Guest Count</span>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={guestCount}
                  onChange={handleGuestCountChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                <div className="text-danger">{formErrors.guestCount}</div>
              </div>
            </div>
            <div className="row m-3 p-2">
              <hr></hr>
              <h5>Personal Details</h5>
              <div className="col-4 p-3">
                <span>Name</span>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                />
                <div className="text-danger">{formErrors.name}</div>
              </div>
              <div className="col-4 p-3">
                <span>Email</span>
                <input
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your Email"
                />
                <div className="text-danger">{formErrors.email}</div>
              </div>
              <div className="col-4 p-3">
                <span>Phone Number</span>
                <input
                  type="text"
                  className="form-control"
                  value={number}
                  onChange={handleNumberChange}
                  placeholder="Enter your Phone number"
                />
                <div className="text-danger">{formErrors.number}</div>
              </div>
            </div>
            <div className="row m-3 p-2 d-flex justify-content-end">
              <div className="col-2">
                <div className="d-flex">
                  <button className="btn btn-primary" onClick={showPayment}>Reserve</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Stripe
          stripeKey="pk_test_51OuRCSJ53U8MN5Mj2obY1BkeJ1cl0bDIc5PnHEAOWQZUaipW0AUb95gC5z0wV8ohGaV4nS9rk3t0q0nM9A4z9tjP00MZmzpukX"
          token={handleToken}
          style={{ width: '200px' }}
        />
      )}
    </div>
  );
}

export default ReservationForm;
