import React from 'react'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
const API_BASE = "http://localhost:8080";


const UpdateFood = () => {
    let { id } = useParams();
    const baseURL = `http://localhost:8080/api/${id}`;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([])

    const [total, setTotal] = useState("")
    const [quantity, setQuantity] = useState("")


    const calculateTotal = ({ target }) => {
        setQuantity(target.value);
        setTotal(target.value * (data.total / data.quantity));
    }


    const updateCart = async () => {

        await Swal.fire({
            title: 'Do you want to update the cart?',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Update Cart',
            denyButtonText: `Cancel`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire('Updated Cart!', '', 'success')
                const cartItem = {
                    userId: localStorage.getItem('username'),
                    foodId: data._id,
                    foodName: data.name,
                    foodImage: data.image,
                    quantity: quantity,
                    total: total
                };

                const headers = {
                    'Authorization': 'Bearer my-token',
                    'My-Custom-Header': 'foobar'
                };
                axios.post(API_BASE + `/api/cart/${data._id}`, cartItem, { headers });

            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        })


    }


    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: response } = await axios.get(`http://localhost:8080/api/cart/${id}`);
                setData(response);
                setQuantity(response.quantity);




            } catch (error) {
                console.error(error.message);
            }

            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-8' >
                    <h1><center>{data.foodName}</center></h1>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={data.foodImage} style={{ width: '50%', height: '50%' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>{data.description}</div>
                </div>

                <div className='col-4' style={{ paddingTop: '20%' }}>

                    <div className='row'>
                        <TextField id="outlined-basic" label="Quantity" variant="outlined" onChange={calculateTotal} />

                    </div>
                    <div className='row'>
                        <div className='col'>Total</div>
                        <div className='col'>{total}</div>
                    </div>
                    <div className='row'>
                        <Button variant="contained" onClick={() => updateCart(id)}>Update</Button>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default UpdateFood