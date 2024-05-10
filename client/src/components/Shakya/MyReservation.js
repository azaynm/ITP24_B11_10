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
  };

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
  };

  const updateReservation = (id) => {
    // Add logic to handle update reservation action
  };

  useEffect(() => {
    fetchMyReservation();
  }, [fetchMyReservation]);

  return (
    <div>
      {myReservations.map(reservation => (
        <div key={reservation._id} className="card p-2 mx-5 mb-2 custom-card">
          <div className="card-body">
            <h6>{reservation.isApproved ? "Approved" : "Pending"}</h6>
            <h5 className="card-title">{reservation.name}</h5>
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Time</th>
                  <th scope="col">Table Type</th>
                  <th scope="col">Table Number</th>
                  <th scope="col">Guest Count</th>
                  <th scope="col">Phone No</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{new Date(reservation.selectedDate).toLocaleString()}</td>
                  <td>{reservation.selectedTime}</td>
                  <td>{reservation.tableType}</td>
                  <td>No 4</td>
                  <td>{reservation.guestCount}</td>
                  <td>{reservation.number}</td>
                  <td>{reservation.email}</td>
                </tr>
              </tbody>
            </table>
            <button type="button" className="btn btn-dark" onClick={() => updateReservation(reservation._id)}>Update</button>
            <button type="button" className="btn btn-danger m-3" onClick={() => cancelReservation(reservation._id)}>Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyReservation;
