import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PDFMenu from '../../utils/Tharushi/PDFMenu';

const API_BASE = "http://localhost:8080";

const MenuDashbaord = ({redirectAddMenu, redirectEditMenu, setSelectedItemId}) => {

    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMenuItems = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/menu/menu`);
            setMenuItems(response.data);
            console.log(response.data)
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems(); // Initial fetch
    }, []); // Fetch campaigns initially

    const handleEdit = (itemId) => {
        setSelectedItemId(itemId)
        redirectEditMenu();
    };

    const handleDelete = async (itemId) => {
        try {
            await axios.delete(`${API_BASE}/api/menu/delete-item/${itemId}`);
            Swal.fire({
                icon: 'success',
                title: 'Inventory Item Deleted',
                showConfirmButton: false,
                timer: 1500
            });
            fetchMenuItems(); // Refresh inventory data after deletion
        } catch (error) {
            console.log("Error deleting item:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error deleting inventory item!',
            });
        }
    };

    const filteredMenuItems = menuItems.filter(menuItem =>
        menuItem.name.toLowerCase().includes(searchQuery.toLowerCase())
        
    );
  return (
    <div className="container mt-5">
            <h1 className="mb-4">Menu Dashboard</h1>
            <button className="btn btn-warning mb-3" onClick={() => redirectAddMenu()}>Add Menu Item</button>
            <td><PDFMenu /></td> 
            <div className="mb-3">
                <input
                    type="text"
                    className='form-control'
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                       
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Category</th>
                            <th scope="col">Selling Price</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {isLoading ? (
                            <tr>
                                <td colSpan="8">Loading...</td>
                            </tr>
                        ) : (
                            filteredMenuItems.map((item) => (
                                <tr key={item.id}>
                                <td><img src={item.image} style={{width:'100px', height:'100px'}}/></td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.category}</td>
                                    <td>{item.sellingPrice}</td>
                                    <td>
                                        <button className="btn btn-warning me-2" onClick={() => handleEdit(item._id)}><FontAwesomeIcon icon={faEdit} /></button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(item._id)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default MenuDashbaord 