import axios from 'axios';
import { Button } from 'bootstrap';
import React, { useEffect, useState } from 'react';
import PDFReservations from '../../utils/Shakya/PDFReservations';

const PendingReservations = () => {
    const API_BASE = "http://localhost:8080";
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchReservations = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/reservation/reservations`);
            setReservations(response.data);
            console.log(response.data)
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations(); // Initial fetch
    }, []); // Fetch campaigns initially

    const handleApproval = async (reservationId, isApproved) => {
        try {
            const response = await axios.put(`${API_BASE}/api/reservation/reservation/${reservationId}`, { isApproved });
            // Update the reservation status locally
            setReservations(prevReservations => {
                return prevReservations.map(reservation => {
                    if (reservation._id === reservationId) {
                        return { ...reservation, isApproved };
                    } else {
                        return reservation;
                    }
                });
            });
            console.log("Reservation status updated:", response.data);
        } catch (error) {
            console.log("Error updating reservation status:", error);
        }
    };

     // Filter reservations based on search query
     const filteredReservations = reservations.filter(reservation =>
        reservation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.tableType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.isApproved.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="container v-100">
            <h2>View Reservations</h2>
           
            <PDFReservations/>
            <div className="mb-3">
                <input
                    type="text"
                    className='form-control'
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Ordered Date</th>
                            <th>Time</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Table Type</th>
                            <th>Number</th>
                            <th>Guest Count</th>
                            <th>Reserved Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReservations.map(reservation => (
                            <tr key={reservation._id}>
                                <td>{new Date(reservation.selectedDate).toLocaleString()} </td>
                                <td>{reservation.selectedTime} </td>
                                <td>{reservation.name}</td>
                                <td>{reservation.email}</td>
                                <td>{reservation.tableType}</td>
                                <td>{reservation.number}</td>
                                <td>{reservation.guestCount}</td>
                                <td>{new Date(reservation.createdAt).toLocaleString()}</td>
                                <td>{reservation.isApproved ? "Approved" : "Pending"}</td>
                                <td>
                                    {reservation.isApproved ? (
                                        <button className="btn btn-danger" onClick={() => handleApproval(reservation._id, false)}>Disapprove</button>
                                    ) : (
                                        <button className="btn btn-success" onClick={() => handleApproval(reservation._id, true)}>Approve</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PendingReservations;