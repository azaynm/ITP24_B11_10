import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import PDFFeedback from '../../utils/Geethika/PDFFeedback';

const API_BASE = "http://localhost:8080";
const FeedbackMonitor = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [cheff, setCheff] = useState({});
    const [deliveryStaff, setDeliveryStaff] = useState({})

    const fetchFeedbacks = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/feedback/feedbacks`);
            const feedbacks = response.data;
            setFeedbacks(feedbacks);
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchStaff = async (orderId) => {
        try {
            const response = await axios.get(`${API_BASE}/api/feedback/fetch-staff/${orderId}`);
            if (response.status === 200) {
                const { cheff, deliveryStaff } = response.data;
                setCheff(prevState => ({
                    ...prevState,
                    [orderId]: cheff
                }));
                setDeliveryStaff(prevState => ({
                    ...prevState,
                    [orderId]: deliveryStaff
                }));
            }
        } catch (error) {
            console.error('Error fetching paid status:', error);
        }
    };

    useEffect(() => {
        // Fetch paid status for each employee when employees change
        feedbacks.forEach(feedback => {
            fetchStaff(feedback.orderId);
        });
    }, [feedbacks]);


    const filteredReservations = feedbacks.filter(feedback =>
        feedback.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container h-100">
            <h2>Received Feedbacks</h2>
            <div className="mb-3">
                <input
                    className='form-control'
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <PDFFeedback />
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Customer</th>
                                <th>Order Id</th>
                                <th>Feedback</th>
                                <th>Cheff</th>
                                <th>Delivery Staff</th>
                                <th>Feedback Date</th>
                                <th>Rating</th>
                              
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map(feedback => (
                                <React.Fragment key={feedback._id}>
                                    <tr>
                                        <td rowSpan="2">{feedback.customer}</td>
                                        <td rowSpan="2">{feedback.orderId}</td>
                                        <td rowSpan="2">{feedback.note}</td>
                                        <td rowSpan="2">{cheff[feedback.orderId]}</td>
                                        <td rowSpan="2">{deliveryStaff[feedback.orderId]}</td>
                                        <td rowSpan="2" className="align-middle">{new Date(feedback.createdAt).toLocaleString()}</td>
                                        <td className="align-middle">
                                            <div>Food: </div>
                                            <div><Rating name="read-only" value={feedback.foodRating} readOnly /></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="align-middle">
                                            <div>Delivery: </div>
                                            <div><Rating name="read-only" value={feedback.deliveryRating} readOnly /></div>

                                        </td>

                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

    );
}

export default FeedbackMonitor