import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = "http://localhost:8080";

const EditInventoryItem = () => {
    const getItemId = window.location.pathname.split("/")[2];

    const [item, setItem] = useState({
        name: "",
        quantity: "",
        price: "",
        supplier: "",
        expirationDate: "",
        category: ""
    });

    useEffect(() => {
        fetchInventoryItem();
    }, []);

    const fetchInventoryItem = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/inventory/get-inventory/${getItemId}`);
            const inventoryItem = response.data;
            setItem(inventoryItem);
        } catch (error) {
            console.log("Error fetching inventory item:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error fetching inventory item!',
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE}/api/inventory/update-inventory/${getItemId}`, item);
            Swal.fire({
                icon: 'success',
                title: 'Inventory Item Updated',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = '/inventory-dashboard'; // Redirect to inventory dashboard after Swal confirmation
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message
            });
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Edit Inventory Item</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Item Name</label>
                    <input type="text" className="form-control" name="name" value={item.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input type="number" className="form-control" name="quantity" value={item.quantity} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input type="number" className="form-control" name="price" value={item.price} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Supplier</label>
                    <input type="text" className="form-control" name="supplier" value={item.supplier} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Expiration Date</label>
                    <input type="date" className="form-control" name="expirationDate" value={item.expirationDate} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input type="text" className="form-control" name="category" value={item.category} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary">Update Item</button>
            </form>
        </div>
    );
};

export default EditInventoryItem;
