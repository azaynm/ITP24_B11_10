import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const API_BASE = "http://localhost:8080";

function MyReservation() {

  const [myReservations, setMyReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyReservation = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE}/api/reservation/reservations/user/${localStorage.getItem('username')}`);
      setMyReservations(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const cancelReservation = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You can not claim a refund for that.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it, No need a refund!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${API_BASE}/api/reservation/cancel-reservations/${id}`);
          console.log(response.data);
          setMyReservations(myReservations.filter(reservation => reservation._id !== id));
          Swal.fire('Canceled!', 'Your reservation has been canceled.', 'success');
        } catch (error) {
          console.log("Error canceling reservation:", error);
          Swal.fire('Error!', 'Failed to cancel reservation. Please try again later.', 'error');
        }
      }
    });
  }

  useEffect(() => {
    fetchMyReservation();
  }, []);

  return (
    <div className="container">
  <h2 className="mt-4 mb-4">View Reservations</h2>
  {isLoading ? (
    <p>Loading...</p>
  ) : (
    <div className="table-responsive">
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
          {myReservations.map(reservation => (
            <tr key={reservation._id}>
              <td>{new Date(reservation.selectedDate).toLocaleString()}</td>
              <td>{reservation.selectedTime}</td>
              <td>{reservation.name}</td>
              <td>{reservation.email}</td>
              <td>{reservation.tableType}</td>
              <td>{reservation.number}</td>
              <td>{reservation.guestCount}</td>
              <td>{new Date(reservation.createdAt).toLocaleString()}</td>
              <td>{reservation.isApproved ? "Approved" : "Pending"}</td>
              <td>
                {reservation.isApproved === false && (
                  <button className="btn btn-danger btn-sm" onClick={() => cancelReservation(reservation._id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  )
}

export default MyReservation;
