import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Form } from 'react-bootstrap'; // Added import for Button and Form
import 'bootstrap/dist/css/bootstrap.min.css';
import PDFInventory from '../../utils/Charuka/PDFInventory';

const API_BASE = "http://localhost:8080";

const CheffInventory = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editItemId, setEditItemId] = useState(null);
    const [editQuantity, setEditQuantity] = useState(null); // Added state for editQuantity

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

    const handleEdit = (id, quantity) => {
        setEditItemId(id);
        setEditQuantity(quantity);
    };

    const updateInventory = async (id, quantity) => { // Changed function name to lowercase
        try {
            await axios.put(`${API_BASE}/api/inventory/update-inventory/${id}`, { quantity });
            setInventoryData(inventoryData.map(item => (item._id === id ? { ...item, quantity } : item)));
            Swal.fire('Item Updated!', '', 'success');
            setEditItemId(null);
        } catch (error) {
            console.error('Error updating item:', error);
            Swal.fire('Error!', 'Failed to update item in inventory.', 'error');
        }
    }

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
            
            <PDFInventory />

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Item Name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Supplier</th>
                            <th scope="col">Add Date</th>
                            <th scope="col">Expiration Date</th>
                            <th scope="col">Category</th>
                            <th scope="col">Quantity</th>
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
                                    <td>{item.price}</td>
                                    <td>{item.supplier}</td>
                                    <td>{item.date}</td>
                                    <td>{new Date(item.expirationDate).toLocaleString()}</td>
                                    <td>{item.category}</td>
                                    <td>
                                        {editItemId === item._id ? (
                                            <Form.Control
                                                type="number"
                                                value={editQuantity}
                                                onChange={(e) => setEditQuantity(e.target.value)}
                                            />
                                        ) : (
                                           <>{item.quantity}</>
                                        )}
                                        
                                        {editItemId === item._id ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => updateInventory(item._id, editQuantity)} // Corrected function name
                                            >
                                                Update
                                            </Button>
                                        ) : (
                                            <Button variant="outline-primary" onClick={() => handleEdit(item._id, item.quantity)}>Edit</Button>
                                        )}

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

export default CheffInventory;
