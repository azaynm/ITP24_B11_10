import axios from 'axios';
import React, { useEffect, useState } from 'react'

import { Button, TextField } from '@mui/material';
import PDFPurchasedGiftCard from '../../utils/Thilini/PDFPurchasedGiftCards';
import LoadingSpinner from '../LoadingSpinner';

const API_BASE = "http://localhost:8080";
const MyGiftCards = () => {

    const [giftCards, setGiftCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSendGiftPopup, setShowSendGiftPopup] = useState(false);
    const [selectedGiftCard, setSelectedGiftCard] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [invalidUser, setInvalidUser] = useState(true)


    const fetchGiftCards = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/gift-card/gift-cards/user/${localStorage.getItem("username")}`);
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

    const copyCode = (code) => {
        // Create a textarea element to hold the code
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);

        // Select the code in the textarea
        textarea.select();

        // Copy the selected code to clipboard
        document.execCommand('copy');

        // Remove the textarea from the DOM
        document.body.removeChild(textarea);

        // Show a notification or alert to indicate successful copy
        alert('Code copied to clipboard!');
    };

    const sendGiftPopup = (id) => {
        console.log(id)
        setSelectedGiftCard(id);
        setShowSendGiftPopup(true);
        console.log(showSendGiftPopup)
    }

    const handleChange = ({ target }) => {
        setSelectedUser(target.value)
    }

    const sendGift = async () => {
        console.log("assign order")
        console.log(selectedGiftCard);
        console.log(selectedUser);
        try {
            const response = await axios.put(`${API_BASE}/api/gift-card/update-user`, { selectedGiftCard, selectedUser }); // Fixed selectedStaff to staffId
            console.log('Delivery staff updated successfully:', response.data);
            showSendGiftPopup(false);
        } catch (error) {
            console.error('Error updating delivery staff:', error.response.data);
        }
    }

    const handleGiftUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const handleCheckUser = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/users/getId/${selectedUser}`);
            const user = response.data.user; // Extract user object directly from response

            if (user) {
                console.log(user.userName);
                setInvalidUser(false);
            } else {
                console.error('No User found');
                setInvalidUser(true);
            }
        } catch (error) {
            console.error('Error while fetching user:', error);
            setInvalidUser(true);
        }
    };



    return (
        <div className='container vh-100'>
            <PDFPurchasedGiftCard/>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="row">
                    {giftCards.map((giftCard) => (
                        <div className="col-md-4 mb-4" key={giftCard._id}>
                            <div className="card">
                                <img className="card-img-top" src="./giftcard.jpg" width="100px" height="100px" alt="Card image cap" />
                                <div className="card-body">
                                    <h5 className="card-title">{giftCard.category}</h5>
                                    <p className="card-text">Rs.{giftCard.amount}</p>
                                    <p className="card-text">Code: {giftCard.code}</p>

                                    <button className="btn btn-primary" onClick={() => copyCode(giftCard.code)}>Copy Code</button>
                                    <button className="btn btn-secondary" onClick={() => sendGiftPopup(giftCard._id)}>Send Gift</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            )}


            {showSendGiftPopup && (
                <div className="form-overlay">
                    <div className="form-container">
                        <form className="d-flex flex-column justify-content-between">
                            <div className="m-4 d-flex justify-content-around">
                                <button className="btn btn-danger" type="button" onClick={() => setShowSendGiftPopup(false)}>
                                    Close
                                </button>
                                {
                                    invalidUser === false ? (
                                        <button className="btn btn-primary" onClick={() => sendGift()}>Send Gift</button>
                                    ) : null
                                }

                            </div>
                            <div className="m-4">
                                <div className="row mb-3 align-items-center">
                                    <div className="col">
                                        <TextField
                                            label="Enter the receiver's username"
                                            variant="outlined"
                                            value={selectedUser}
                                            onChange={handleGiftUserChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleCheckUser}
                                            className="btn btn-primary"
                                        >
                                            Check User
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    {invalidUser === true && <div className="text-danger">Invalid User</div>}
                                    {invalidUser === false && <div className="text-success">{selectedUser} user exists</div>}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            )}
        </div>
    )
}

export default MyGiftCards