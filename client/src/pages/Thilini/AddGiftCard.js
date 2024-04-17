import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';

function generateCode() {
    const letters = 'ABCDE';
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomNumber = Math.floor(Math.random() * 10); // Generates a number between 0-9
    return `${randomLetter}${randomLetter}${randomNumber}`;
}

function AddGiftCard() {
    const [customerUsername, setCustomerUsername] = useState('');
    const [code, setCode] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [issueDate, setIssueDate] = useState(new Date());
    const [expireDate, setExpireDate] = useState(new Date());

    useEffect(() => {
        setCode(generateCode());
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validation for empty fields
        if (!customerUsername || !category || !amount || amount <= 0) {
            Swal.fire('Error!', 'Please fill in all fields with valid information.', 'error');
            return;
        }

        const giftCardData = {
            customerUsername,
            code,
            category,
            amount: parseFloat(amount).toFixed(2), // Ensure amount is formatted as a currency value
            issueDate,
            expireDate,
        };

        try {
            // Make the POST request using axios
            const response = await axios.post('http://localhost:8080/api/gift-card/gift-cards', giftCardData);
            console.log("Gift Card Data:", response.data); // Assuming the API returns the created gift card data
            Swal.fire('Success!', 'Gift card added successfully.', 'success');
        } catch (error) {
            console.error("Error adding gift card:", error);
            Swal.fire('Error!', 'There was a problem adding the gift card.', 'error');
        }
    };

    const handleCurrencyChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'); // Only allow numbers and a single dot
        if (!value || parseFloat(value) >= 0) {
            setAmount(value);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add a New Gift Card</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="customerUsername" className="form-label">Customer Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="customerUsername"
                        value={customerUsername}
                        onChange={(e) => setCustomerUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="code" className="form-label">Code (Auto-generated)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="code"
                        value={code}
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        id="category"
                        className="form-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Choose...</option>
                        <option value="Farewell & Best Wishes">Farewell & Best Wishes</option>
                        <option value="Good Job!">Good Job!</option>
                        <option value="Thank You So Much">Thank You So Much</option>
                        <option value="Happy Birthday">Happy Birthday</option>
                        <option value="For Him/Her">For Him/Her</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Amount</label>
                    <input
                        type="text" // Changed to text to handle custom currency formatting
                        className="form-control"
                        id="amount"
                        value={amount}
                        onChange={handleCurrencyChange}
                        placeholder="0.00"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="issueDate" className="form-label">Issue Date</label>
                    <DatePicker
                        selected={issueDate}
                        onChange={(date) => setIssueDate(date)}
                        className="form-control"
                        dateFormat="yyyy/MM/dd"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="expireDate" className="form-label">Expire Date</label>
                    <DatePicker
                        selected={expireDate}
                        onChange={(date) => setExpireDate(date)}
                        className="form-control"
                        dateFormat="yyyy/MM/dd"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default AddGiftCard;
