import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import EditEmployee from '../../components/Nidula/EditEmployee';
import EditAddress from '../../components/Maleesha/EditAddress';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:8080";

const ViewAddresses = ({redirectAddAddress}) => {
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchAddresses = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/address/${localStorage.getItem('username')}`);
            const addresses = response.data;
            setAddresses(addresses);
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredAddresses = addresses.filter((address) =>
        address.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="vh-100">
            <div className='container'>
            <button className='btn btn-warning' onClick={()=>redirectAddAddress() }>ADD ADDRESS</button>
            </div>
          
            <div className="row m-3">
                
                    <div className="col-md-6 offset-md-3">
                   
                        <div className="input-group mb-3">
                        
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            <button className="btn btn-outline-secondary" type="button" id="button-addon2">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            <div className="container-fluid h-custom d-flex justify-content-center align-items-center">
            
                <div className="row  w-100">
                    {isLoading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        filteredAddresses.map((address, index) => (
                            <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={address._id}>
                                <EditAddress address={address} fetchAddresses={fetchAddresses} index={index}/>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ViewAddresses;
