import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = "http://localhost:8080";

const RegisterEmployee = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRe, setPasswordRe] = useState("");
    const [hireDate, setHireDate] = useState("");
    const [address, setAddress] = useState("");
    const [empName, setEmpName] = useState("");
    const [position, setPosition] = useState("");
    const [dob, setDob] = useState("");
    const [roles, setRoles] = useState([]);

    const validatePassword = () => {
        if (password === passwordRe) {
            addUser();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Passwords don't match",
                footer: '<a href="">Why do I have this issue?</a>'
            })
        }
    }


    const addUser = async () => {
        
        const user = {
            userName: userName,
            email: email,
            password: password,
            hireDate: hireDate,
            address: address,
            empName: empName,
            position: position,
            dob: dob,
            roles: roles
        };
        console.log(user)
        axios.post(`${API_BASE}/api/employee/signUpEmployee`, user)
        .then((res) => {
            // Handle successful response
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Account created Successfully',
                showConfirmButton: false,
                timer: 1500
            });
            // Clear form fields after successful registration
            setUserName("");
                setEmail("");
                setPassword("");
                setPasswordRe("");
                setHireDate("");
                setAddress("");
                setEmpName("");
                setPosition("");
                setDob("");
                setRoles([]);
        })
        .catch((error) => {
            // Log error response
            console.error("Error response:", error.response);
            // Show error message to the user
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: '<a href="">Why do I have this issue?</a>'
            });
        });
    }
    return (
        <section className="vh-100">
    <div className="container-fluid h-custom d-flex justify-content-center align-items-center">
        <div className="card shadow-lg p-4">
            <div className="card-body">
                <h2 className="text-center mb-4">Employee Registration</h2>
                <form>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="username" className="form-control" placeholder="Enter a username" onChange={e => setUserName(e.target.value)} value={userName} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input type="email" className="form-control" placeholder="Enter a valid email address" onChange={e => setEmail(e.target.value)} value={email} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" placeholder="Enter password" onChange={e => setPassword(e.target.value)} value={password} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" className="form-control" placeholder="Enter password again" onChange={e => setPasswordRe(e.target.value)} value={passwordRe} />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Hired Date</label>
                                <input type="date" className="form-control" placeholder="Enter Hired Date" onChange={e => setHireDate(e.target.value)} value={hireDate} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input type="text" className="form-control" placeholder="Enter Address" onChange={e => setAddress(e.target.value)} value={address} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Employee Name</label>
                                <input type="text" className="form-control" placeholder="Enter Employee Name" onChange={e => setEmpName(e.target.value)} value={empName} />
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">Position</label>
                                <input type="text" className="form-control" placeholder="Enter Position" onChange={e => setPosition(e.target.value)} value={position} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">DOB</label>
                                <input type="date" className="form-control" placeholder="Enter DOB" onChange={e => setDob(e.target.value)} value={dob} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <select className="form-select" onChange={e => setRoles(Array.from(e.target.selectedOptions, option => option.value))} multiple>
                                    <option value="systemAdmin">System Admin</option>
                                    <option value="employee">Employee</option>
                                    <option value="eventCoordinator">Event Coordinator</option>
                                    <option value="deliveryStaff">Delivery Staff</option>
                                    <option value="cateringManager">Catering Manager</option>
                                    <option value="financialManager">Financial Manager</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="d-grid gap-2">
                        <button type="button" className="btn btn-primary btn-lg" onClick={validatePassword}>ADD</button>
                    </div>

                </form>
            </div>
        </div>
    </div>
</section>

    )
}

export default RegisterEmployee