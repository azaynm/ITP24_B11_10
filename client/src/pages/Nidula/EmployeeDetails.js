import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import EditEmployee from '../../components/Nidula/EditEmployee';

const API_BASE = "http://localhost:8080";

const EmployeeDetails = () => {
    const [employeeData, setEmployeeData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchEmployeeData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/employee/view-employees`);
            const employees = response.data;
            setEmployeeData(employees);
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredEmployees = employeeData.filter((emp) =>
        emp.empName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="vh-100">
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
                        filteredEmployees.map((emp) => (
                            <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={emp._id}>
                                <EditEmployee emp={emp} fetchEmployeeData={fetchEmployeeData} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default EmployeeDetails;
