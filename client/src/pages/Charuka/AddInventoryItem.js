import React from 'react';
import { useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = "http://localhost:8080";

const AddInventoryItem = () => {
    const [name, setItemName] = useState("");
    const [quantity, setItemQuantity] = useState("");
    const [price, setItemPrice] = useState("");
    const [supplier, setItemSupplier] = useState("");
    const [expirationDate, setItemExpirationDate] = useState("");
    const [category, setItemCategory] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newInventoryItem = {
            name,
            quantity,
            price,
            supplier,
            expirationDate,
            category
        }

        try {
            await axios.post(`${API_BASE}/api/inventory/add-inventory`, newInventoryItem);
            Swal.fire({
                icon: 'success',
                title: 'Inventory Item Added to the DB',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.href = '/inventory-dashboard';
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message
            })
        }
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Add Inventory Item</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Item Name</label>
                    <input type="text" className="form-control" name="name" value={name} onChange={(e) => setItemName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input type="number" className="form-control" name="quantity" value={quantity} onChange={(e) => setItemQuantity(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input type="number" className="form-control" name="price" value={price} onChange={(e) => setItemPrice(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Supplier</label>
                    <input type="text" className="form-control" name="supplier" value={supplier} onChange={(e) => setItemSupplier(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Expiration Date</label>
                    <input type="date" className="form-control" name="expirationDate" value={expirationDate} onChange={(e) => setItemExpirationDate(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select" name="category" value={category} onChange={(e) => setItemCategory(e.target.value)}>
                        <option value="ingredient">Ingredient</option>
                        <option value="food">Food</option>
                        <option value="beverage">Beverage</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Inventory Item</button>
            </form>
        </div>
    )
}

export default AddInventoryItem;
