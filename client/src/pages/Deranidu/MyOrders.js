import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './MyOrders.css';
import { useNavigate } from 'react-router-dom';
import PDFMyOrders from '../../utils/Deranidu/PDFMyOrders';
import Swal from 'sweetalert2';

const MyOrders = () => {
  const API_BASE = "http://localhost:8080";
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbacks, setFeedbacks] = useState({}); 

  const [isEditing, setIsEditing] = useState(false);
const [editedFeedback, setEditedFeedback] = useState('');

const navigate = useNavigate();

const toggleEditFeedback = (orderId, currentFeedback) => {
  setSelectedOrderId(orderId);
  setIsEditing(true);
  setEditedFeedback(currentFeedback);
};

const handleUpdateFeedback = async () => {
  // Display SweetAlert2 confirmation dialog
  const { value: confirmed } = await Swal.fire({
    title: 'Are you sure?',
    text: 'Once updated, the feedback will be changed!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, update it!'
  });

  // If user confirms
  if (confirmed) {
    try {
      await axios.put(`${API_BASE}/api/feedback/feedbacks/update-feedback/${selectedOrderId}`, { feedback: editedFeedback });
      
      setFeedbacks(prevFeedbacks => ({
        ...prevFeedbacks,
        [selectedOrderId]: { feedback: editedFeedback } // Adjusted property name to match backend
      }));
     
      setIsEditing(false);
      setEditedFeedback('');
      fetchItems();
    } catch (error) {
      console.log("Error updating feedback:", error);
    }
  }
};


const cancelEditFeedback = () => {
  setIsEditing(false);
  setEditedFeedback('');
};

const deleteFeedback = async (feedbackId) => {
  try {
    // Display SweetAlert2 confirmation dialog
    const { value: confirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, the feedback will be permanently removed!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    // If user confirms
    if (confirmed) {
      // Send delete request to the backend
      await axios.delete(`${API_BASE}/api/feedback/feedbacks/delete-feedback/${feedbackId}`);

      // Update feedbacks state to reflect the deletion
      setFeedbacks(prevFeedbacks => {
        const updatedFeedbacks = { ...prevFeedbacks };
        delete updatedFeedbacks[feedbackId];
        return updatedFeedbacks;
      });

      // Optionally, you can fetch items again to refresh the data
      fetchItems();

      // Show success message
      Swal.fire(
        'Deleted!',
        'The feedback has been deleted.',
        'success'
      );
    }
  } catch (error) {
    console.log("Error deleting feedback:", error);
    // Show error message
    Swal.fire(
      'Error!',
      'Failed to delete the feedback.',
      'error'
    );
  }
};


  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE}/api/order/orders/${localStorage.getItem('username')}`);
      setItems(response.data);
      
      // Fetch feedbacks for each order individually
      const feedbackPromises = response.data.map(order => fetchFeedback(order._id));
      const feedbackData = await Promise.all(feedbackPromises);
      
      // Create an object to store feedbacks for each order
      const feedbacksObj = {};
      feedbackData.forEach((feedback, index) => {
        feedbacksObj[response.data[index]._id] = feedback;
      });
      console.log("Feedback all data", feedbackData)
      setFeedbacks(feedbacksObj);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedback = async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE}/api/feedback/feedbacks/get-feedback/${orderId}`);
      console.log("feedback", response.data)
      return response.data;
    } catch (error) {
      console.log("Error fetching feedback:", error);
      return null; // Return null if feedback is not available for the order
    }
  };

  useEffect(() => {
    fetchItems(); // Initial fetch
  }, []); // Fetch campaigns initially

  const handleTrackOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowPopup(true);
  };

  const giveFeedback = (orderId) => {
    navigate('/feedback', { state: { orderId } });
  }

  const filteredOrders = items.filter(item =>
    item._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container vh-100">
      <h2>View Orders</h2>
      <div className="mb-3">
        <input
          type="text"
          className='form-control'
          placeholder="Search by name"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <PDFMyOrders />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Ordered Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment ID</th>
                <th>Status</th>
                <th>City</th>
                <th>Phone</th>
                <th>Action</th>
                <th>Feedback</th> {/* Add Feedback column */}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>{new Date(order.time).toLocaleString()}</td>
                  <td>{order.customer}</td>
                  <td>Rs. {order.amount}</td>
                  <td>{order.paymentId}</td>
                  <td>{order.status}</td>
                  <td>{order.city}</td>
                  <td>{order.phone}</td>
                  <td>
                    {order.status === 'on the way' && (
                      <button className="btn btn-success" onClick={() => handleTrackOrder(order._id)}>Track Order</button>
                    )}
                    {order.status === 'finished' && order.isFeedbackGiven === false && (
                      <button className="btn btn-warning" onClick={() => giveFeedback(order._id)}>Give Feedback</button>
                    )}
                  </td>
                  
                  <td>
  {isEditing && selectedOrderId === order._id ? (
    <div>
      <textarea
        value={editedFeedback}
        onChange={(e) => setEditedFeedback(e.target.value)}
        rows={3}
        className="form-control"
        placeholder="Enter your feedback"
      />
      <div className="mt-2">
        <button className="btn btn-sm btn-primary mr-2" onClick={handleUpdateFeedback}>Update</button>
        <button className="btn btn-sm btn-secondary" onClick={cancelEditFeedback}>Cancel</button>
      </div>
    </div>
  ) : (
    <>
      <span>{feedbacks[order._id] ? feedbacks[order._id].note : 'No feedback available'}</span>
      {feedbacks[order._id] && (
        <div>
        <button className="btn btn-sm btn-primary ml-2" onClick={() => toggleEditFeedback(order._id, feedbacks[order._id].note)}>Edit</button>
        <button className="btn btn-sm btn-danger ml-2" onClick={() => deleteFeedback(feedbacks[order._id]._id)}>Delete</button>
        </div>
      )}
    </>
  )}
</td>
                </tr>
              ))}
            </tbody>
          </table>
          {showPopup && (
            <Popup
              handleClose={() => setShowPopup(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

const Popup = ({ handleClose }) => {
  return (
    <div className="form-overlay bg-light">
      <div className="popup-inner">
        <button className="close-btn" onClick={handleClose}>Close</button>
        <div className="content">
          <div>sdsd</div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
