import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const API_BASE = "http://localhost:8080";
const AddAddress = () => {

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Name cannot be empty!',
                timer: 1500
            });
            return;
        }
    
        if (address.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Address line cannot be empty!',
                timer: 1500
            });
            return;
        }
    
        if (zip.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ZIP code cannot be empty!',
                timer: 1500
            });
            return;
        }
    
        if (city.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'City cannot be empty!',
                timer: 1500
            });
            return;
        }
     
        const newDeliveryAddress = {
            name,
            address,
            zip,
            city,
            userId: localStorage.getItem('username')
        }

        try {
            await axios.post(`${API_BASE}/api/address/add-address`, newDeliveryAddress);
            Swal.fire({
                icon: 'success',
                title: 'Address Added to the DB',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.href = '/user-dashboard';
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
            <h1 className="mb-4">Add Address</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Address Line</label>
                    <input type="text" className="form-control" name="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">ZIP</label>
                    <input type="text" className="form-control" name="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">City</label>
                    <input type="text" className="form-control" name="city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
               
                <button type="submit" className="btn btn-warning">Save Address</button>
            </form>
        </div>
  )
}

export default AddAddress