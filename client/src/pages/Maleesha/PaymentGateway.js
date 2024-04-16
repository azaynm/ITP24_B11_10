import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Stripe from 'react-stripe-checkout';
import { Button, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PaymentGateway = () => {
    const API_BASE = "http://localhost:8080";
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);

    const [customer, setCustomer] = useState({});

    const [address, setAddress] = useState("");

    const [city, setCity] = useState("");
    const [phone, setPhone] = useState("");

    const [invalidCoupon, setInvalidCoupon] = useState(false);

    const location = useLocation();
    const { total, cartFoodData } = location.state;

    const [totalAfterCoupon, setTotalAfterCoupon] = useState(total);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };

    const handleCouponCodeChange = (event) => {
        setCouponCode(event.target.value);
    };

    const handleApplyCoupon = async () => {
        const username = localStorage.getItem('username');
        try {
            const response = await axios.get(`${API_BASE}/api/gift-card/check-gift-card`, {
                params: { customer: username, code: couponCode } // Use params to send query parameters
            });

            const giftCards = response.data;

            if (giftCards && giftCards.length > 0) {
                // Assuming couponDiscountValue is a field in the first gift card returned
                const couponDiscountValue = giftCards[0].amount;
                console.log(couponDiscountValue);

                // Update coupon discount state
                setCouponDiscount(couponDiscountValue);

                // Calculate total after applying coupon
                const totalWithDiscount = total - couponDiscountValue;
                if (totalWithDiscount < 0) {
                    setTotalAfterCoupon(0);
                } else if (totalWithDiscount < 100) {
                    setTotalAfterCoupon(100); // Set totalAfterCoupon to minimum value of 100
                    setErrorMessage('Total amount after discount must be at least 100');
                } else {
                    setTotalAfterCoupon(totalWithDiscount);
                    setErrorMessage(''); // Clear error message if totalWithDiscount is valid
                }

                setInvalidCoupon(false);
            } else {
                console.error('No gift cards found for the provided customer and code.');
                setInvalidCoupon(true);
            }
        } catch (error) {
            console.error('Error while fetching coupon discount:', error);
            // Handle error, e.g., display an error message to the user
            setInvalidCoupon(true);
        }
    };

    const handleToken = async (totalAmount, token) => {
        try {
        

                const response = await axios.post("http://localhost:8080/api/stripe/pay", {
                    token: token.id,
                    amount: totalAmount,
                });

                console.log(response);

                if (response.status === 200) {
                    const charge = response.data;

                    // Chain the second POST request inside the first one
                    return axios.post("http://localhost:8080/api/payment/add-payment", {
                        email: charge.billing_details.name,
                        reference: charge.id,
                        amount: charge.amount / 100,
                        customer: charge.customer,
                        userName: localStorage.getItem("username")
                    })
                        .then((res2) => {
                            // Access the data from the response of the second POST request
                            const paymentId = res2.data._id;
                            console.log("Payment ID:", paymentId);

                            // Assuming cartFoodData is defined somewhere in your code
                            // Ensure it's accessible and has the correct data
                            console.log("Cart Food Data:", cartFoodData);

                            // Assuming localStorage is accessible and has the correct data
                            const customer = localStorage.getItem("username");

                            // Make the second POST request to add order
                            const orderPromise = axios.post("http://localhost:8080/api/order/add-order", {
                                foods: cartFoodData,
                                amount: totalAmount, // Use totalAmount for order amount?
                                customer: customer,
                                paymentId: paymentId,
                                address: address,
                                city: city,
                                phone: phone
                            });

                            // Chain the deletion of cart items after the order is successfully added
                            return orderPromise.then(() => {
                                navigate(`/cart/${localStorage.getItem("username")}`);
                                deleteAllCartItems();
                            });
                        })
                        .catch(error => {
                            console.error("Error in second POST request:", error);
                            return Promise.reject(error);
                        });
                } else {
                    console.log("Stripe payment request failed");
                    return Promise.reject("Stripe payment request failed");
                }
            
        } catch (error) {
            console.error("Error in first POST request:", error);
            return Promise.reject(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };



    const tokenHandler = (token) => {
        handleToken(totalAfterCoupon, token);


    }

    const deleteAllCartItems = () => {
        axios.delete(`http://localhost:8080/api/cart/delete/${localStorage.getItem('username')}`)
            .then(response => {
                console.log("Delete operation result:", response.data);
            })
            .catch(error => {
                console.error("Error deleting carts:", error);
            });
    }
    return (
        <div className="container">
            <h1>Payment</h1>
            <div className="row mb-3">
                <div className="col-6">
                    <TextField
                        label="Enter Coupon Code"
                        variant="outlined"
                        value={couponCode}
                        onChange={handleCouponCodeChange}
                        className="form-control"
                    />
                </div>
                <div className="col-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyCoupon}
                        className="btn btn-primary"
                    >
                        Apply Coupon
                    </Button>
                </div>
            </div>
            <div>
                {/* Display message for invalid coupon */}
                {invalidCoupon && <div style={{ color: 'red' }}>Invalid Coupon</div>}
                <div>Total: Rs. {total}</div>
                {couponDiscount > 0 && <div>Coupon Discount: Rs. {couponDiscount}</div>}
                {couponDiscount > 0 && <div className='text-success'>Total After Coupon: Rs. {totalAfterCoupon}</div>}
                {totalAfterCoupon <= 100 ? (
                    <div className='text-danger'>Total should be at least Rs. 100</div>
                ) : null}

            </div>

            <div >
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={customer.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" name="address" value={address} onChange={handleAddressChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" name="city" value={city} onChange={handleCityChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="text" className="form-control" id="phone" name="phone" value={phone} onChange={handlePhoneChange} />
                </div>
            </div>

            {totalAfterCoupon <= 100 ? (
                    <div className='text-danger'>Total should be at least Rs. 100</div>
                ) : (
                    <Stripe
                stripeKey="pk_test_51OuRCSJ53U8MN5Mj2obY1BkeJ1cl0bDIc5PnHEAOWQZUaipW0AUb95gC5z0wV8ohGaV4nS9rk3t0q0nM9A4z9tjP00MZmzpukX"
                token={tokenHandler}
            />
                )}
            
        </div>
    )
}

export default PaymentGateway