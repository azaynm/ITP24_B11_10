import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import './MenuCategory.css';
import FormData from 'form-data';
import './MenuCategory.css';

const MenuCategory = ({ category }) => {

    const API_BASE = "http://localhost:8080";
    const [categoryMenuItems, setCategoryMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const fetchCategoryMenuItems = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/menu/view-item/${category}`);
            const items = response.data.map(item => ({ ...item, quantity: 1 })); // Add quantity property to each item
    
            const checkInventoryPromises = items.map(async (menuItem) => {
                const inventoryPromises = menuItem.inventoryItems.map(async (inventoryId) => {
                    // Trim whitespace characters from the inventoryId
                    const trimmedInventoryId = inventoryId.trim();
                    const inventoryResponse = await axios.post(`${API_BASE}/api/menu/check-inventory-quantity`, { inventory: [trimmedInventoryId] });
                    return inventoryResponse.data.allQuantitiesGreaterThanZero;
                });
                const inventoryResults = await Promise.all(inventoryPromises);
                const isQuantityGreaterThanZero = inventoryResults.every((result) => result);
                return { ...menuItem, outOfStock: !isQuantityGreaterThanZero, selectedQuantity: 1, isSelected: false  }; // Add outOfStock property to each item
            });
    
            const checkedItems = await Promise.all(checkInventoryPromises);
            setCategoryMenuItems(checkedItems);
            
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };



    const updateSelectedQuantity = (index, value) => {
        if (!isNaN(value) && value > 0) {
            setCategoryMenuItems(prevItems => {
                const updatedItems = [...prevItems];
                updatedItems[index].selectedQuantity = value;
                return updatedItems;
            });
        }
    };
    
    
    

    useEffect(() => {
        fetchCategoryMenuItems(); // Initial fetch
    }, []); // Fetch campaigns initially


    const addItemToCart = (foodId, selectedQuantity) => {

        Swal.fire({
            title: "Add this to Cart?",
            text: "You can remove this from the Cart!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Add it!"
        }).then((result) => {
            if (result.isConfirmed) {

                const data = {
                    id: localStorage.getItem('username'),
                    food: foodId,
                    quantity: selectedQuantity
                };

                try {
                    axios.post(`${API_BASE}/api/cart/add-item`, data);
                    console.log("Data uploaded successfully:", data);
                    Swal.fire({
                        title: "Added!",
                        text: "Item Added.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error("Error uploading data:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to add item to cart.",
                        icon: "error"
                    });
                }
            }
        });
    };


    const handleIncreaseQuantity = (index) => {
        console.log('Increasing quantity for item at index:', index);
        setCategoryMenuItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index].quantity += 1;
            console.log('Updated items:', updatedItems);
            return updatedItems;
        });
    };

    const handleDecreaseQuantity = (index) => {
        console.log('Decreasing quantity for item at index:', index);
        setCategoryMenuItems(prevItems => {
            const updatedItems = [...prevItems];
            if (updatedItems[index].quantity > 1) {
                updatedItems[index].quantity -= 1;
            }
            console.log('Updated items:', updatedItems);
            return updatedItems;
        });
    };

    const filteredMenuItems = categoryMenuItems.filter((menuItem) =>
        menuItem.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div className="scrollable-container">
            <input
                type="text"
                className="form-control my-5"
                placeholder="Search by name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
            />
            <div className="row row-cols-1 row-cols-md-3 g-4">

                {filteredMenuItems.map((menuItem, index) => (
                    <div key={index} className="col">
                        <div className="card h-100">
                            <img src={menuItem.image} className="card-img-top" alt="..." style={{ width: '100px', height: '100px' }} />
                            <div className="card-body">
                                <h5 className="card-title">{menuItem.name}</h5>
                                <p className="card-text">Rs. {menuItem.sellingPrice}</p>
                                <div className='d-flex justify-content-center align-items-center'>
                                   
                                    <input
                                            type="number"
                                            className="form-control"
                                            value={menuItem.selectedQuantity}
                                            onChange={(e) => updateSelectedQuantity(index, parseInt(e.target.value))}
                                            style={{ backgroundColor: '#F3F3F3' }}
                                        />
                                </div>
                                {menuItem.outOfStock && <button className="btn btn-danger mt-2">Out of Stock</button>}
                                {!menuItem.outOfStock && <button className='btn btn-primary mt-2' onClick={() => addItemToCart(menuItem._id, menuItem.selectedQuantity)}>Add to Cart</button>}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default MenuCategory