import axios from 'axios';
import React, { useEffect } from 'react'
import FormData from 'form-data';

import { useState, } from "react";
import LoadingSpinner from '../../components/LoadingSpinner';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import './DeliveryManagement.css'

const API_BASE = "http://localhost:8080";

const DeliveryManagement = () => {

  const [deliveryData, setDeliveryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDeliveryStatus, setIsOpenDeliveryStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState('');

  const fetchDeliveryData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE}/api/delivery/deliveries`);
      const deliveries = response.data;

      setDeliveryData(deliveries);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Set isLoading to false regardless of success or error
    }
  };

  useEffect(() => {
    fetchDeliveryData(); // Initial fetch
  }, []); // Fetch campaigns initially


  const showDeliveryStatus = (deliveryItem) => {
    console.log("Clicked", deliveryItem);
    setIsOpenDeliveryStatus(true);
    setSelectedDelivery(deliveryItem._id);

  }

  const handleChangeDelivertStatusSubmit = () => {
    console.log("status updated");
    axios.post(`${API_BASE}/api/delivery/update-delivery/${selectedDelivery}`, { "deliveryStatus": selectedOption });
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    console.log(event.target.value)
  };

  // Function to handle update button click
  const handleUpdateClick = () => {
    // Perform any action you want when the button is clicked, e.g., update state, send data to server, etc.
    console.log("Selected Option:", selectedOption);
  };

  return (
    <section className="vh-100">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="row">
          {deliveryData
            .sort((a, b) => a.time - b.time)
            .map((deliveryItem, index) => (
              <div className="card" style={{ width: '18rem' }} key={index}>

                <div className="card-body">
                  <h5 className="card-title">Order Details</h5>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>OrderID</td>
                        <td>{deliveryItem.orderID}</td>
                      </tr>
                      <tr>
                        <td>CustomerID</td>
                        <td>{deliveryItem.customerID}</td>
                      </tr>
                      <tr>
                        <td>DeliveryAddress</td>
                        <td>{deliveryItem.deliveryAddress}</td>
                      </tr>
                      <tr>
                        <td>DeliveryStatus</td>
                        <td>{deliveryItem.deliveryStatus}</td>
                      </tr>
                      <tr>
                        <td>TotalAmount</td>
                        <td>{deliveryItem.totalAmount}</td>
                      </tr>
                      <tr>
                        <td>DeliveryCost</td>
                        <td>{deliveryItem.deliveryCost}</td>
                      </tr>
                      <tr>
                        <td>DeliveryNote</td>
                        <td>{deliveryItem.deliveryNote}</td>
                      </tr>
                      <tr>
                        <td>Change Status</td>
                        <td><button className='btn btn-primary' onClick={() => showDeliveryStatus(deliveryItem)}>Status</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      )}

      {isOpenDeliveryStatus && (
        <div className="form-overlay">
          <div className="form-container">
            <form onSubmit={handleChangeDelivertStatusSubmit()} className="d-flex flex-column justify-content-between">
              <label>
                Set Delivery Status
              </label>
              <select className="form-select mb-3" value={selectedOption} onChange={handleOptionChange}>
                <option value="">Select an option...</option>
                <option value="inProgress">inProgress</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>

              <div className="m-4 d-flex justify-content-around">
                <button className="btn btn-danger" type="button" onClick={() => setIsOpenDeliveryStatus(false)}>
                  Close
                </button>
                <button className="btn btn-primary" >Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>

  )
}

export default DeliveryManagement