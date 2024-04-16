import React from 'react'
import { useState, useEffect } from 'react';
import '../../index.css';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import FormData from 'form-data';
import Swal from 'sweetalert2';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';


const Cart = () => {

  const [cartFoodData, setCartFoodData] = useState([]);
  const [cartFoodLoading, setCartFoodLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCheckout = () => {
    navigate('/payment', { state: { total, cartFoodData } });
  };

  const fetchCartFoodData = async () => {
    setCartFoodLoading(true);
    try {
      const { data: response } = await axios.get(`http://localhost:8080/api/cart/user/${localStorage.getItem('username')}`);
      setCartFoodData(response);
      console.log(response);

      const totalSubTotal = response.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.subTotal;
      }, 0);
      setTotal(totalSubTotal);
      console.log(cartFoodData)

    } catch (error) {
      console.error(error.message);
    }
    setCartFoodLoading(false);
  }

  useEffect(() => {
    fetchCartFoodData();
    console.log("Total", total);
  }, []);

  const deleteItem = async (id) => {
    await Swal.fire({
      title: 'Do you want to remove this from?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Remove',
      denyButtonText: `Cancel`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Removed Item!', '', 'success')
        try {
          await fetch(`http://localhost:8080/api/cart/delete-item/${id}`, { method: "DELETE" });
          // Update cartFoodData after successful deletion
          setCartFoodData(cartFoodData.filter(cartFoodItem => cartFoodItem._id !== id));

        } catch (error) {
          console.error('Error deleting item:', error);
          Swal.fire('Error!', 'Failed to remove item from cart.', 'error');
        }
      } else if (result.isDenied) {
        Swal.fire('Item is not removed', '', 'info')
      }
    });
  }

  useEffect(() => {
    const newTotal = cartFoodData.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.subTotal;
    }, 0);
    setTotal(newTotal);
  }, [cartFoodData]);

  const filteredCartItems = cartFoodData.filter(cartFoodItem =>
    cartFoodItem.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <Card.Text>Quantity: {item.quantity}</Card.Text>
                    <Card.Text>Subtotal: Rs. {item.subTotal}</Card.Text>
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
  )
}

export default Cart