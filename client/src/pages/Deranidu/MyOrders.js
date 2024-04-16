import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './MyOrders.css';
import { useNavigate } from 'react-router-dom';
import PDFMyOrders from '../../utils/Deranidu/PDFMyOrders';

const MyOrders = () => {

  const API_BASE = "http://localhost:8080";
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE}/api/order/orders/${localStorage.getItem('username')}`);
      setItems(response.data);
      console.log(response.data)
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(); // Initial fetch
  }, []); // Fetch campaigns initially

  const handleTrackOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowPopup(true);
  };

  const giveFeedback = (orderId)=>{
    navigate('/feedback', { state: { orderId } });
  }

  const filteredOrders = items.filter(item =>
    item._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <PDFMyOrders/>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Order ID</th>
                <th>Ordered Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment ID</th>
                <th>Status</th>
                <th>Address</th>
                <th>City</th>
                <th>Phone</th>
                <th>Action</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.time).toLocaleString()}</td>
                  <td>{order.customer}</td>
                  <td>Rs. {order.amount}</td>
                  <td>{order.paymentId}</td>
                  <td>{order.status}</td>
                  <td>{order.address}</td>
                  <td>{order.city}</td>
                  <td>{order.phone}</td>
                  <td>
                    {order.status === 'on the way' && (
                      <button className="btn btn-primary" onClick={() => handleTrackOrder(order._id)}>Track Order</button>
                    )}
                    {order.status === 'finished' && order.isFeedbackGiven === false && (
                      <button className="btn btn-primary" onClick={() => giveFeedback(order._id)}>Give Feedback</button>
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
