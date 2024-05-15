import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartFoodData, setCartFoodData] = useState([]);
  const [cartFoodLoading, setCartFoodLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [editItemId, setEditItemId] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');

  const handleCheckout = () => {
    navigate('/payment', { state: { total, cartFoodData } });
  };

  const fetchCartFoodData = async () => {
    setCartFoodLoading(true);
    try {
      const { data: response } = await axios.get(`http://localhost:8080/api/cart/user/${localStorage.getItem('username')}`);
      setCartFoodData(response);
      const totalSubTotal = response.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.subTotal;
      }, 0);
      setTotal(totalSubTotal);
    } catch (error) {
      console.error(error.message);
    }
    setCartFoodLoading(false);
  };

  useEffect(() => {
    fetchCartFoodData();
  }, []);

  const deleteItem = async (id) => {
    await Swal.fire({
      title: 'Do you want to remove this item?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Remove',
      denyButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/cart/delete-item/${id}`);
          setCartFoodData(cartFoodData.filter(item => item._id !== id));
          Swal.fire('Item Removed!', '', 'success');
        } catch (error) {
          console.error('Error deleting item:', error);
          Swal.fire('Error!', 'Failed to remove item from cart.', 'error');
        }
      }
    });
  };

  const handleEdit = (id, quantity) => {
    setEditItemId(id);
    setEditQuantity(quantity);
  };

  const updateCartItem = async (id, newQuantity) => {
    try {
      if(newQuantity>0){
        await axios.put(`http://localhost:8080/api/cart/update-item/${id}`, { quantity: newQuantity });
        setCartFoodData(cartFoodData.map(item => (item._id === id ? { ...item, quantity: newQuantity } : item)));
        Swal.fire('Item Updated!', '', 'success');
        setEditItemId(null);
      }
      else{
        Swal.fire('Error!', 'Quantity Should be greater than 0.', 'error');
      }
      
    } catch (error) {
      console.error('Error updating item:', error);
      Swal.fire('Error!', 'Failed to update item in cart.', 'error');
    }
  };

  useEffect(() => {
    const newTotal = cartFoodData.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.subTotal;
    }, 0);
    setTotal(newTotal);
  }, [cartFoodData]);

  const filteredCartItems = cartFoodData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container'>
      <h2 className="mt-3 mb-4">Your Cart</h2>
      <Form.Group controlId="formBasicSearch" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </Form.Group>
      {cartFoodLoading && <div>Loading</div>}
      {!cartFoodLoading && (
        <>
          {filteredCartItems.map(item => (
            <Card key={item._id} className="mb-3">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <img className='img-thumbnail mr-3' src={item.imageUrl} alt="..." style={{ width: '150px', height: '100px' }} />
                  <div>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>Price: Rs. {item.price}</Card.Text>
                    {editItemId === item._id ? (
                      <Form.Control
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                      />
                    ) : (
                      <Card.Text>Quantity: {item.quantity}</Card.Text>
                    )}
                    <Card.Text>Subtotal: Rs. {item.subTotal}</Card.Text>
                    {editItemId === item._id ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => updateCartItem(item._id, editQuantity)}
                      >
                        Update
                      </Button>
                    ) : (
                      <Button variant="outline-primary" onClick={() => handleEdit(item._id, item.quantity)}>Edit</Button>
                    )}
                    <Button variant="outline-danger" onClick={() => deleteItem(item._id)}>Remove</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </>
      )}
      <div className='d-flex justify-content-end'>
        <h4>Total: Rs.{total}</h4>
      </div>
      <div className='d-flex justify-content-end mt-4'>
        <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
