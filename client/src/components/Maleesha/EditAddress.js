import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:8080";

const EditAddress = ({ address, fetchAddresses, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedAddress, setEditedAddress] = useState(address);
    const [originalAddress, setOriginalAddress] = useState(address);
    const navigate = useNavigate();
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setEditedAddress({ ...editedAddress, [name]: value });

    };

    const handleDelete = async (addressId) => {
        Swal.fire({
            icon: 'warning',
            title: 'Delete Address',
            text: 'Are you sure you want to delete this address?',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'No, cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Send delete request to backend
                    await axios.delete(`${API_BASE}/api/address/${addressId}`);
                    fetchAddresses();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Address deleted successfully!',
                        timer: 1500
                    });
                } catch (error) {
                    console.error('Error deleting address:', error);
                    // Show error message
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete address. Please try again later.',
                        timer: 1500
                    });
                }
            }
        });
    };


    const saveChanges = async () => {
        if (editedAddress.name.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Name cannot be empty!',
                timer: 1500
            });
            return;
        }
    
        if (editedAddress.address.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Address line cannot be empty!',
                timer: 1500
            });
            return;
        }
    
        if (editedAddress.zip.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ZIP code cannot be empty!',
                timer: 1500
            });
            return;
        }
    
        if (editedAddress.city.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'City cannot be empty!',
                timer: 1500
            });
            return;
        }
    
        Swal.fire({
            icon: 'question',
            title: 'Save Changes',
            text: 'Are you sure you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Yes, save',
            cancelButtonText: 'No, cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(`${API_BASE}/api/address/update-address/${address._id}`, editedAddress);
                    fetchAddresses();
                    const updatedAddress = response.data;
                    setOriginalAddress(updatedAddress);
                    setIsEditing(false);
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Changes saved successfully!',
                        timer: 1500
                    });
                    navigate("/user-dashboard")
                } catch (error) {
                    console.error('Error saving changes:', error);
                    // Show error message
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to save changes. Please try again later.',
                        timer: 1500
                    });
                }
            }
        });
    };


    const cancelEdit = () => {
        // Show confirmation dialog before canceling edit
        Swal.fire({
            icon: 'question',
            title: 'Cancel Edit',
            text: 'Are you sure you want to cancel editing?',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel',
            cancelButtonText: 'No, keep editing',
        }).then((result) => {
            if (result.isConfirmed) {
                setIsEditing(false);
                setEditedAddress(originalAddress);
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Canceled',
                    text: 'Editing canceled!',
                    timer: 1500
                });
            }
        });
    };

    return (
        <div className="card">
            <div className="card-body">
                {isEditing ? (
                    <div>
                        <h5 className="card-title">Addresss {index+1}</h5>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" name="name" value={editedAddress.name} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Address Line</label>
                            <input type="text" className="form-control" name="address" value={editedAddress.address} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">ZIP</label>
                            <input type="text" className="form-control" name="zip" value={editedAddress.zip} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">City</label>
                            <input type="text" className="form-control" name="city" value={editedAddress.city} onChange={handleChange} />
                        </div>
                        <div className="d-grid gap-2">
                            <button onClick={saveChanges} className="btn btn-warning">Save</button>
                            <button onClick={cancelEdit} className="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h5 className="card-title">Address {index+1}</h5>
                        <div><strong>Name:</strong> {address.name}</div>
                        <div><strong>Address Line:</strong> {address.address}</div>
                        <div><strong>ZIP:</strong> {address.zip}</div>
                        <div><strong>City:</strong> {address.city}</div>
                        <button onClick={handleEdit} className="btn btn-sm btn-secondary mt-2">Edit</button>
                        <button onClick={() => handleDelete(address._id)} className="btn btn-sm btn-danger mt-2">Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditAddress;
