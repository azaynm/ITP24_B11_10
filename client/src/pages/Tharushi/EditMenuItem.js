import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const API_BASE = "http://localhost:8080";
const EditMenuItem = ({ categories, itemId, setActiveTab }) => {
    const [inventoryItems, setInventoryItems] = useState([])
    const cuisines = ["Italian Cuisine", "Japanese Cuisine", "Indian Cuisine", "French Cuisine"];
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null); // State to store uploaded file
    const [formErrors, setFormErrors] = useState({});
    const [food, setFood] = useState({
        name: "",
        description: "",
        category: "",
        sellingPrice: "",
        inventoryItems: [],
    });

    useEffect(() => {
        fetchMenuItemDetails(itemId);
    }, [itemId]);

    const fetchMenuItemDetails = async (id) => {
        try {
            const response = await axios.get(`${API_BASE}/api/menu/${id}`);
            setFood(response.data);
            setLoading(false); // Set loading to false when data is fetched
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching food details:', error);
        }
    };

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

    const handleChange = ({ target }) => {
        setFood({ ...food, [target.name]: target.value });
    }

    const handlePhoto = ({ target }) => {
        const selectedFile = target.files[0];
        setFile(URL.createObjectURL(selectedFile)); // Update file state with the object URL
        setFood({ ...food, image: target.files[0] }); // Update food.image with the object URL
    };

    
    const handleInventoryChange = (event) => {
        const options = event.target.options;
        const selectedItems = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedItems.push(options[i].value);
            }
        }
        setFood({ ...food, inventoryItems: selectedItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', food.name);
        formData.append('description', food.description);
        formData.append('category', food.category);
        formData.append('sellingPrice', food.sellingPrice);
        formData.append('inventoryItems', food.inventoryItems.join('\n'));

        try {
            const result = await Swal.fire({
                title: 'Do you want to update this menu item?',
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Update',
                denyButtonText: `Cancel`,
            });

            if (result.isConfirmed) {
                Swal.fire('Food Updated!', '', 'success');
                await axios.put(`${API_BASE}/api/menu/${itemId}`, formData);
                setFile(null); // Reset file state after successful upload
                setActiveTab("tab8")
            } else if (result.isDenied) {
                Swal.fire('Action Cancelled', '', 'info');
            }
        } catch (error) {
            console.error('Error updating food:', error);
            Swal.fire('Error', 'Failed to update food', 'error');
        }
    }

    return (
        <section className="vh-100">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="container-fluid h-custom h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100s h-100">
                        <div className="col d-flex" >
                            <div className="d-flex align-items-center justify-content-center">
                                <img src={food.image} style={{ width: '300px', height: '300px' }} alt="Food" />
                            </div>
                            <div className="col offset-xl-1">
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="form-outline mb-4">
                                        <input
                                            className="form-control"
                                            type="file"
                                            name="image"
                                            onChange={handlePhoto}
                                        />
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input
                                            className="form-control"
                                            placeholder="Enter Food Name"
                                            name="name"
                                            value={food.name}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                        <div className="text-danger">{formErrors.name}</div>
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input
                                            className="form-control"
                                            placeholder="Enter Food Description"
                                            name="description"
                                            value={food.description}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                        <div className="text-danger">{formErrors.description}</div>
                                    </div>
                                   

                                    <div className="form-outline mb-4">
                                        <select
                                            className="form-select"
                                            name="category"
                                            value={food.category}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Menu category</option>
                                            {categories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </select>
                                        <label className="form-label">Select Menu category</label>
                                        <div className="text-danger">{formErrors.category}</div>
                                    </div>
                                    <div className="form-outline mb-4">
                                        <input
                                            className="form-control"
                                            placeholder="Enter Item Selling Price"
                                            name="sellingPrice"
                                            value={food.sellingPrice}
                                            onChange={handleChange}
                                            style={{ backgroundColor: '#FFFFFF' }}
                                        />
                                        <div className="text-danger">{formErrors.sellingPrice}</div>
                                    </div>

                                     <div className="mb-3 my-5">
                                    <label htmlFor="inventoryItems">Select Inventory Items:</label>
                                    <select
                                        className="form-control"
                                        id="inventoryItems"
                                        multiple
                                        value={food.inventoryItems}
                                        onChange={handleInventoryChange}
                                    >
                                        {inventoryItems.map(item => (
                                            <option key={item._id} value={item._id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                                    <div className="text-center text-lg-start mt-4 pt-2">
                                        <input className="btn btn-primary" type="submit" value="Update Food" style={{ backgroundColor: '#24FF00', borderColor: '#24FF00' }} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default EditMenuItem;
