import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AboutUs = () => {
    return (
        <div className='container my-5'>
            <h2 className='text-center mb-4'>
                Welcome To Live Life!
            </h2>
            <div className='row'>
                <div className='col-md-6'>
                    <img src='/about.jpg' className='img-fluid rounded' alt='About Us' />
                </div>
                <div className='col-md-6 d-flex align-items-center'>
                    <div className='card border-0'>
                        <div className='card-body'>
                            <p className='card-text'>
                                Established in 2007, Sanmik is proudly Australian owned and possesses a wealth of experience in supplying a broad and diverse range of premium quality organic and natural food products to global customers within the food industry. Manufacturing and processing products such as dried fruit, coconut-based produce, herbs, spices and much more.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
