import axios from 'axios';
import React, { useEffect } from 'react'
import FormData from 'form-data';
import Swal from 'sweetalert2';
import { useState, } from "react";

const API_BASE = "http://localhost:8080";

const AddMenuItem = ({ categories, setActiveTab }) => {
    const [inventoryItems, setInventoryItems] = useState([]);

    const fetchInventoryItems = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/inventory/inventory`);
            setInventoryItems(response.data)
            console.log("Inventory Items: ", response.data)
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
        }
    };


    useEffect(() => {
        fetchInventoryItems(); // Initial fetch
    }, []); // Fetch campaigns initially


    const [file, setFile] = useState(null);
    const [newFood, setNewFood] = useState(
        {
            name: '',
            description: '',
            category: '',
            sellingPrice: '',
            inventoryItems: [],
            image: '',

        }
    );

    const handleChange = ({ target }) => {
        setNewFood({ ...newFood, [target.name]: target.value });
    }

    const handlePhoto = ({ target }) => {
        setFile(URL.createObjectURL(target.files[0]));
        setNewFood({ ...newFood, image: target.files[0] });
        console.log(newFood.image);
    }

    const handleInventoryChange = (event) => {
        const options = event.target.options;
        const selectedItems = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedItems.push(options[i].value);
            }
        }
        setNewFood({ ...newFood, inventoryItems: selectedItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!newFood.name || !newFood.description || !newFood.category || !newFood.sellingPrice || !newFood.image || newFood.inventoryItems.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Fields',
                text: 'Please fill out all fields.',
            });
            return;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to add the menu item.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, add it!',
            cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();

                formData.append('name', newFood.name);
                formData.append('description', newFood.description);
                formData.append('category', newFood.category);
                formData.append('sellingPrice', newFood.sellingPrice);
                formData.append('inventoryItems', newFood.inventoryItems.join('\n'));
                formData.append('image', newFood.image);
                
                try {
                    const response = await axios.post('http://localhost:8080/api/menu/upload', formData);
                    console.log(response);

                    // Show success message using SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Menu added successfully.',
                    });
                    setActiveTab("tab8")
                } catch (error) {
                    console.error('Error occurred:', error);
                    // Show error message using SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    });
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // If user cancels, show a message
                Swal.fire('Cancelled', 'Menu adding cancelled.', 'info');
            }
        });
    }




    return (
        <section class="container vh-100">
            <div>
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col d-flex">
                        <div class="d-flex justify-content-center">
                            <img
                                src={file}
                                style={{ width: '400px', height: '300px' }} />
                        </div>
                        <div class="col-md- col-lg-6 col-xl-4 offset-xl-1">

                            <form onSubmit={handleSubmit} encType="multipart/form-data">

                                <div class="form-outline mb-4">
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handlePhoto}
                                    />

                                </div>




                                <div class="form-outline mb-4">
                                    <input
                                        className="form-control"
                                        placeholder="Enter Food Name"
                                        name="name"
                                        value={newFood.name}
                                        onChange={handleChange}
                                        style={{ width: '100%' }} // Increase input width
                                    />
                                    <label class="form-label" for="form3Example3">Enter food name</label>
                                </div>

                                <div class="form-outline mb-4">
                                    <input
                                        className="form-control"
                                        placeholder="Enter Food Description"
                                        name="description"
                                        value={newFood.description}
                                        onChange={handleChange}
                                        style={{ width: '100%' }} // Increase input width
                                    />
                                    <label class="form-label" for="form3Example3">Enter description</label>
                                </div>



                                <div class="form-outline mb-4">

                                    <select
                                        className="form-select"
                                        name="category"
                                        value={newFood.category}
                                        onChange={handleChange}
                                        style={{ width: '100%' }} // Increase input width
                                    >
                                        <option value="">Select Food category</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                    <label class="form-label" for="form3Example3">Enter food category</label>
                                </div>


                                <div class="form-outline mb-4">
                                    <input
                                        className="form-control"
                                        placeholder="Enter Food sellingPrice"
                                        name="sellingPrice"
                                        value={newFood.sellingPrice}
                                        onChange={handleChange}
                                        style={{ width: '100%' }} // Increase input width
                                    />
                                    <label class="form-label" for="form3Example3">Enter food Selling Price</label>
                                </div>

                                <div className="mb-3 my-5">
                                    <label htmlFor="inventoryItems">Select Inventory Items:</label>
                                    <select
                                        className="form-control"
                                        id="inventoryItems"
                                        multiple
                                        value={newFood.inventoryItems}
                                        onChange={handleInventoryChange}
                                    >
                                        {inventoryItems.map(item => (
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>


                                <div class="text-center text-lg-start mt-4 pt-2">
                                    <input className="btn btn-warning" type="submit" value="Add Food" />
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </section>


    )
}

export default AddMenuItem