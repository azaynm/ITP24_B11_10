import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import './DeliveryManagementCategory.css';
import FormData from 'form-data';
import LoadingSpinner from '../LoadingSpinner';
import PDFDeliveries from '../../utils/Maleesha/PDFDeliveries';

const DeliveryManagementCategory = ({ category }) => {

    const API_BASE = "http://localhost:8080";
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenDeliveryAssign, setIsOpenDeliveryAssign] = useState(false);
    const [isOpenCheffAssign, setIsOpenCheffAssign] = useState(false);

    const [deliveryStaff, setDeliveryStaff] = useState([]);
    const [isLoadingDeliveryStaff, setIsLoadingDeliveryStaff] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState("");

    const [selectedOrder, setSelectedOrder] = useState("");

    const [cheff, setCheff] = useState([]);
    const [isLoadingCheff, setIsLoadingCheff] = useState(false);
    const [selectedCheff, setSelectedCheff] = useState("");
    const [searchQuery, setSearchQuery] = useState('');


    const fetchDeliveryStaff = async () => {
        try {
            setIsLoadingDeliveryStaff(true);
            const response = await axios.get(`${API_BASE}/api/delivery-staff/delivery-staff`);
            setDeliveryStaff(response.data);
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoadingDeliveryStaff(false);
        }
    }

    const fetchCheff = async () => {
        try {
            setIsLoadingCheff(true);
            const response = await axios.get(`${API_BASE}/api/cheff/cheff`);
            setCheff(response.data);
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoadingCheff(false);
        }
    }

    const fetchReadyItems = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/order/${category}`);
            setItems(response.data);
            console.log(response.data)
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReadyItems(); // Initial fetch
        fetchDeliveryStaff();
        fetchCheff();
    }, []); // Fetch campaigns initially

    const openDeliveryAssign = (id) => {
        setSelectedOrder(id)
        console.log("Selected Order id: ", id)
        setIsOpenDeliveryAssign(true);

    }

    const openCheffAssign = (id) => {
        setSelectedOrder(id)
        console.log("Selected Order id: ", id)
        setIsOpenCheffAssign(true);
    }

    const deleteDelivery = (id) => {
        // Show confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this order.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                // If user confirms, proceed with deletion
                axios.delete(`${API_BASE}/api/delivery/orders/${id}`)
                    .then(function (response) {
                        console.log('Order deleted successfully:', response.data);
                        fetchReadyItems();
                        // Show success message
                        Swal.fire('Deleted!', 'The order has been deleted.', 'success');
                    })
                    .catch(function (error) {
                        console.error('Error deleting order:', error);
                        // Show error message
                        Swal.fire('Error!', 'Failed to delete the order.', 'error');
                    });
            } else {
                // If user cancels, do nothing
                Swal.fire('Cancelled', 'The order deletion was cancelled.', 'info');
            }
        });
    }

    const makeReady = async () => {
        setIsOpenCheffAssign(false);
        // Show confirmation dialog before making the order ready
        const result = await Swal.fire({
            icon: 'question',
            title: 'Assign Cheff',
            text: 'Are you sure you want to assign a cheff to this order?',
            showCancelButton: true,
            confirmButtonText: 'Yes, assign',
            cancelButtonText: 'No, cancel',
        });
    
        if (result.isConfirmed) {
            try {
                const response = await axios.put(`${API_BASE}/api/order/update-status/${selectedOrder}`, { status: "ready-to-deliver", selectedCheff });
    
                console.log(response.data);
              
    
                // Show success message
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Order assigned successfully!',
                    timer: 1500
                });
                fetchReadyItems();
            } catch (error) {
                console.error("Error updating order status:", error);
                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to make order ready. Please try again later.',
                    timer: 1500
                });
                throw error;
            }
        }
    };
    




    const assignOrder = async () => {
        setIsOpenDeliveryAssign(false);
        const orderId = selectedOrder;
        const staffId = selectedStaff;

        // Show confirmation dialog before assigning order
        Swal.fire({
            icon: 'question',
            title: 'Assign Delivery',
            text: 'Are you sure you want to assign this delivery staff?',
            showCancelButton: true,
            confirmButtonText: 'Yes, assign',
            cancelButtonText: 'No, cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(`${API_BASE}/api/order/assign-delivery`, { orderId, staffId });

                    const preparedTime = new Date();
                    // Execute the POST request to add delivery after the PUT request
                    const deliveryResponse = await axios.post(`${API_BASE}/api/delivery/add-delivery`, { orderId: orderId, preparedTime: preparedTime });
                    
                    console.log(deliveryResponse.data);

                    console.log('Delivery staff updated successfully:', response.data);
                    fetchReadyItems();
                    setIsOpenDeliveryAssign(false);
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Order assigned successfully!',
                        timer: 1500
                    });
                } catch (error) {
                    console.error('Error updating delivery staff:', error.response.data);
                    // Show error message
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to assign delivery. Please try again later.',
                        timer: 1500
                    });
                }
            }
        });
    };



    const handleChange = ({ target }) => {
        console.log("sd", target.value)
        setSelectedStaff(target.value)
    }

    const handleChangeCheff = ({ target }) => {
        console.log("sd", target.value)
        setSelectedCheff(target.value)
    }

    const filteredPendingOrders = items.filter(pendingOrder =>
        pendingOrder.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pendingOrder.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pendingOrder._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category === "ready-to-deliver" && pendingOrder.cheff.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (category === "delivering" && (pendingOrder.cheff.toLowerCase().includes(searchQuery.toLowerCase()) || pendingOrder.deliveryStaff.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (category === "finished" && (pendingOrder.cheff.toLowerCase().includes(searchQuery.toLowerCase()) || pendingOrder.deliveryStaff.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const finishOrder = async (selectedOrder) => {
        try {
            const confirmed = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to complete this order?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, complete it!",
            });
    
            if (confirmed.isConfirmed) {
                const response = await axios.put(`http://localhost:8080/api/order/complete-order/${selectedOrder}`);
                console.log(response.data);
                
                
                // Second PUT request
                const orderId = selectedOrder; // Replace 'your_delivery_id_here' with the actual delivery ID
                const deliveredTime = new Date(); // Assuming you want to set the delivered time to the current time
                const secondResponse = await axios.put(`${API_BASE}/api/delivery/update-time/${orderId}`, { deliveredTime });
                console.log(secondResponse.data);
                fetchReadyItems();
                // Handle success response
            } else {
                // User clicked cancel, do nothing or handle accordingly
            }
        } catch (error) {
            console.error("Error completing order:", error);
            // Handle error
        }
    };
   
    function getDate(time) {
        const date = new Date(time);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return formattedDate;
    }

    return (
        <div className="scrollable-container py-3">

            {category === "finished" && (
                <PDFDeliveries />
            )}
            <div className="mb-3">
                <input
                    className='form-control'
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="row row-cols-1 row-cols-md-2 g-4">

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    filteredPendingOrders.map((item, index) => (
                        <div className="card" style={{}} key={index}>
                            <div className="card-body">
                                <h5 className="card-title">Order Details</h5>
                                <div className="row">
                                    <div className="row">
                                        <table className="table sub-table">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th className="text-end">Quantity</th>
                                                    <th className="text-end">Price</th>
                                                    <th className="text-end">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.foods.map((food, index) => (
                                                    <tr key={index}>
                                                        <td><img src={food.imageUrl} width={40} alt={food.name} /></td>
                                                        <td>{food.name}</td>
                                                        <td className="text-end">{food.quantity}</td>
                                                        <td className="text-end">{food.price}</td>
                                                        <td className="text-end">Rs.{food.subTotal}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row">
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td>Amount</td>
                                                    <td className='text-end'><b>Rs.{item.amount}</b></td>
                                                </tr>
                                                <tr>
                                                    <td>Customer</td>
                                                    <td className='text-end'>{item.customer}</td>
                                                </tr>
                                                <tr>
                                                    <td>Order Id</td>
                                                    <td className='text-end'>{item._id}</td>
                                                </tr>
                                                <tr>
                                                    <td>PaymentId</td>
                                                    <td className='text-end'>{item.paymentId}</td>
                                                </tr>
                                                {category === "ready-to-deliver" && (
                                                    <tr>
                                                        <td>Cheff</td>
                                                        <td className='text-end'>{item.cheff}</td>
                                                    </tr>
                                                )}
                                                {category === "delivering" && (
                                                    <>
                                                        <tr>
                                                            <td>Cheff</td>
                                                            <td className='text-end'>{item.cheff}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Delivery Staff</td>
                                                            <td className='text-end'>{item.deliveryStaff}</td>
                                                        </tr>
                                                    </>
                                                )}
                                                {category === "finished" && (
                                                    <>
                                                        <tr>
                                                            <td>Cheff</td>
                                                            <td className='text-end'>{item.cheff}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Delivery Staff</td>
                                                            <td className='text-end'>{item.deliveryStaff}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Time</td>
                                                            <td className='text-end'>{getDate(item.time)}</td>
                                                        </tr>
                                                    </>
                                                )}
                                                <tr>
                                                    <td colSpan="2">
                                                        {category === "pending" && (
                                                            <>
                                                            <button className='btn btn-warning' onClick={() => openCheffAssign(item._id)} style={{ width: '100%' }}>Assign Cheff</button>
                                                            <button className='btn btn-danger my-2' onClick={() => deleteDelivery(item._id)} style={{ width: '100%' }}>Delete</button>
                                                            </>
                                                        )}
                                                        {category === "ready-to-deliver" && (
                                                            <button className='btn btn-warning' onClick={() => openDeliveryAssign(item._id)} style={{ width: '100%' }}>Assign Delivery Staff</button>
                                                        )}
                                                        {category === "delivering" && (
                                                            <button className='btn btn-warning' onClick={() => finishOrder(item._id)} style={{ width: '100%' }}>Finish</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {isOpenDeliveryAssign && (
                    <div className="form-overlay">
                        <div className="form-container">
                            <form className="d-flex flex-column justify-content-between">
                                <div className="m-4 d-flex justify-content-around">
                                    <button className="btn btn-danger" type="button" onClick={() => setIsOpenDeliveryAssign(false)}>
                                        Close
                                    </button>
                                    <button className="btn btn-warning" onClick={() => assignOrder()}>Assign Delivery</button>
                                </div>
                                <div className="m-4">
                                    <div className="form-group">
                                        <select
                                            className="form-select"
                                            name="selectedStaff"
                                            value={selectedStaff}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Delivery Staff:</option>
                                            {deliveryStaff.map((staff, index) => (
                                                <option key={index} value={staff.id}>{staff.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isOpenCheffAssign && (
                    <div className="form-overlay">
                        <div className="form-container">
                            <form className="d-flex flex-column justify-content-between">
                                <div className="m-4 d-flex justify-content-around">
                                    <button className="btn btn-danger" type="button" onClick={() => setIsOpenCheffAssign(false)}>
                                        Close
                                    </button>
                                    <button className="btn btn-warning" onClick={() => makeReady()}>Assign Cheff</button>
                                </div>
                                <div className="m-4">
                                    <div className="form-group">
                                        <select
                                            className="form-select"
                                            name="selectedCheff"
                                            value={selectedCheff}
                                            onChange={handleChangeCheff}
                                        >
                                            <option value="">Select Cheff:</option>
                                            {cheff.map((staff, index) => (
                                                <option key={index} value={staff.id}>{staff.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>


    );
}

export default DeliveryManagementCategory