import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Stripe from 'react-stripe-checkout';
import Swal from "sweetalert2";
import LoadingSpinner from '../LoadingSpinner';

const API_BASE = "http://localhost:8080";
const PurchaseGiftCard = () => {

    const [giftCards, setGiftCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchGiftCards = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/gift-card-template/gift-card-templates`);
            const giftCards = response.data;
            setGiftCards(giftCards);
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGiftCards();
    }, []);

    const generateCode = () => {
        const letters = 'ABCDE';
        let code = '';
        for (let i = 0; i < 5; i++) {
            const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
            code += randomLetter;
        }
        for (let i = 0; i < 2; i++) {
            const randomNumber = Math.floor(Math.random() * 10); // Generates a number between 0-9
            code += randomNumber;
        }
        return code;
    }

    const filteredGiftCards = giftCards.filter(giftCard =>
        giftCard.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToken = async (amount, token, type) => {
        try {
            // First POST request to Stripe API
            const responseStripe = await axios.post("http://localhost:8080/api/stripe/pay", {
                token: token.id,
                amount: amount,
            });

            console.log(responseStripe);

            if (responseStripe.status === 200) {
                const charge = responseStripe.data;

                try {
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
                        const fee = responsePayment.data.amount;
                        const username = localStorage.getItem('username');
                        const code = generateCode();

                        // Prepare data to send for reservation
                        const data = {
                            customerUsername: username,
                            code,
                            category: type,
                            amount: fee,
                            paymentId,
                        };

                        // Third POST request to submit reservation
                        const reservationResponse = await axios.post(`${API_BASE}/api/gift-card/gift-cards`, data);

                        // Handle success
                        console.log("Reservation submitted successfully:", reservationResponse.data);
                        console.log('Reservation Request Added!');

                    } else {
                        console.log("Payment request failed");
                        return Promise.reject("Payment request failed");
                    }
                } catch (error) {
                    console.error("Error in second POST request:", error);
                    return Promise.reject(error);
                }
            } else {
                console.log("Stripe payment request failed");
                return Promise.reject("Stripe payment request failed");
            }
        } catch (error) {
            console.error("Error in first POST request:", error);
            return Promise.reject(error);
        }
    };




    const tokenHandler = async (token, amount, type) => {
        await handleToken(amount, token, type);
    }

    return (
        <div className='container vh-100'>
              
            {isLoading ? (
                <LoadingSpinner/>
            ) : (
                <div className="row">
                    <div className="my-2">
                        <input
                            className='form-control'
                            type="text"
                            placeholder="Search by type"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {
                        filteredGiftCards.map((giftCard) => (
                            <div className="col-md-4 mb-4" key={giftCard._id}>
                                <div className="card">
                                    <img className="card-img-top" src="./giftcard.jpg" width="100px" height="100px" alt="Card image cap" />
                                    <div className="card-body">
                                        <h5 className="card-title">{giftCard.type}</h5>
                                        <p className="card-text">Rs.{giftCard.amount}</p>

                                        <Stripe
                                            stripeKey="pk_test_51OuRCSJ53U8MN5Mj2obY1BkeJ1cl0bDIc5PnHEAOWQZUaipW0AUb95gC5z0wV8ohGaV4nS9rk3t0q0nM9A4z9tjP00MZmzpukX"
                                            token={(token) => tokenHandler(token, giftCard.amount, giftCard.type)}
                                            style={{ width: '200px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}
        </div>


    )
}

export default PurchaseGiftCard