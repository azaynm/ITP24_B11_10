import React from 'react'
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';


import TextField from '@mui/material/TextField';
const API_BASE = "http://localhost:8080";


const SingleFood = ({fetchCartFoodData, fetchCartCount, addToCart, setLoading, setData, total, calculateTotal, data}) => {
    let { id } = useParams();
    const baseURL = `http://localhost:8080/api/${id}`;
    

    
   
    


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: response } = await axios.get(baseURL);
                setData(response);

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
                    <h1><center>{data.name}</center></h1>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={data.image} style={{ width: '50%', height: '50%' }} />
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
                        <Button variant="contained" onClick={async()=>{
                            await addToCart();
                        
                            
                            
    
                        }}>Add to Cart</Button>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default SingleFood