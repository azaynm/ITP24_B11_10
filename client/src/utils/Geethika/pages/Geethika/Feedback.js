import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button } from 'bootstrap';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Feedback = () => {

    const location = useLocation();
    const { orderId } = location.state;

    const [deliveryRating, setDeliveryRating] = useState(null);
    const [foodRating, setFoodRating] = useState(null);
    const [note, setNote] = useState('');

    
    const API_BASE = "http://localhost:8080";
    
    const giveFeedback = () => {
        // Get orderId and note from wherever they are defined
      
        const feedbackData = {
          deliveryRating: deliveryRating, // Assuming deliveryRating and foodRating are defined elsewhere
          foodRating: foodRating,
          orderId: orderId,
          customer: localStorage.getItem('username'),
          note: note
        };
      
        // Define the URL of your backend route
        const url = `${API_BASE}/api/feedback/submit-feedback`;
      
        // Make the POST request using Axios
        axios.post(url, feedbackData)
          .then(response => {
            console.log('Response:', response.data);
            // Show success message
            Swal.fire({
              icon: 'success',
              title: 'Feedback Submitted',
              text: 'Thank you for your feedback!'
            });
          })
          .catch(error => {
            console.error('Error:', error.response.data);
            // Show error message
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Failed to submit feedback. Please try again later.'
            });
          });
      };
      

    return (
        <Box
            sx={{
                '& > legend': { mt: 2 },
            }}>

            <Box
                sx={{
                    '& > legend': { mt: 2 },
                }}>
                <Typography component="legend">Food</Typography>
                <Rating
                    name="food-rating"
                    value={foodRating}
                    onChange={(event, newValue) => {
                        setFoodRating(newValue);
                    }} />
            </Box>

            <Box
                sx={{
                    '& > legend': { mt: 2 },
                }}>
                <Typography component="legend">Delivery</Typography>
                <Rating
                    name="delivery-rating"
                    value={deliveryRating}
                    onChange={(event, newValue) => {
                        setDeliveryRating(newValue);
                    }} />
            </Box>

            <TextField
                label="Add Note (optional)"
                multiline
                rows={4}
                variant="outlined"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                fullWidth
                margin="normal"
            />

            <button className='btn btn-secondary' onClick={giveFeedback}>Give Feedback</button>
        </Box>
    );
}

export default Feedback;
