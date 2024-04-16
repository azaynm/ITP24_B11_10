import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import PDFInventory from '../../utils/Charuka/PDFInventory';

const API_BASE = "http://localhost:8080";

const InventoryDashboard = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchInventoryData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/inventory/inventory`);
            const inventory = response.data;
            setInventoryData(inventory);
        } catch (error) {
            console.log("Error fetching data:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error fetching inventory data!',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const handleEdit = (itemId) => {
        window.location.href = `/edit-inventor-item/${itemId}`;
    };

    const handleDelete = async (itemId) => {
        try {
            await axios.delete(`${API_BASE}/api/inventory/delete-inventory/${itemId}`);
            Swal.fire({
                icon: 'success',
                title: 'Inventory Item Deleted',
                showConfirmButton: false,
                timer: 1500
            });
            fetchInventoryData(); // Refresh inventory data after deletion
        } catch (error) {
            console.log("Error deleting item:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error deleting inventory item!',
            });
        }
    };

    const filteredInventory = inventoryData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-5 vh-100">
            <h1 className="mb-4">Inventory Details</h1>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="btn btn-primary mb-3" onClick={() => window.location.href = '/add-inventory-item'}>Add Inventory Item</button>
            <PDFInventory />
           
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Item Name</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col">Supplier</th>
                            <th scope="col">Add Date</th>
                            <th scope="col">Expiration Date</th>
                            <th scope="col">Category</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="8">Loading...</td>
                            </tr>
                        ) : (
                            filteredInventory.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price}</td>
                                    <td>{item.supplier}</td>
                                    <td>{item.date}</td>
                                    <td>{new Date(item.expirationDate).toLocaleString()}</td>
                                    <td>{item.category}</td>
                                    <td>
                                        <button className="btn btn-primary me-2" onClick={() => handleEdit(item._id)}><FontAwesomeIcon icon={faEdit} /></button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(item._id)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InventoryDashboard;
