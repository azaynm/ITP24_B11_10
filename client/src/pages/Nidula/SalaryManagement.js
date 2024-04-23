import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import PDFSalary from '../../utils/Nidula/PDFSalary';

const API_BASE = "http://localhost:8080";

const SalaryManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [paidStatus, setPaidStatus] = useState({});
    const [paidAmount, setPaidAmount] = useState({})
    const [amountInput, setAmountInput] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE}/api/employee/view-employees`);
            const employees = response.data;
            setEmployees(employees);
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPaidStatus = async (userName) => {
        try {
            const response = await axios.get(`${API_BASE}/api/salary/check-payment/${userName}`);
            if (response.status === 200) {
                const { paid, salary } = response.data;
                setPaidStatus(prevState => ({
                    ...prevState,
                    [userName]: paid
                }));
                setPaidAmount(prevState => ({
                    ...prevState,
                    [userName]: salary
                }));
            }
        } catch (error) {
            console.error('Error fetching paid status:', error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        // Fetch paid status for each employee when employees change
        employees.forEach(employee => {
            fetchPaidStatus(employee.userName);
        });
    }, [employees]);

    const handleAmountInputChange = (e, userName) => {
        const { value } = e.target;
        setAmountInput(prevState => ({
            ...prevState,
            [userName]: value
        }));
    };

    const filteredEmployees = employees.filter(employee =>
        employee.empName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paySalary = async (userName, salary) => {
        try {
            // Get the current year and month
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // Add 1 to get the month number starting from 1 (January)

            // Format the date to include only year and month (YYYY-MM)
            const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;

            // Show confirmation dialog before paying salary
            Swal.fire({
                icon: 'question',
                title: 'Pay Salary',
                text: `Are you sure you want to pay Rs. ${salary} to ${userName}?`,
                showCancelButton: true,
                confirmButtonText: 'Yes, pay',
                cancelButtonText: 'No, cancel',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await axios.post(`${API_BASE}/api/salary/employee-add-salary`, {
                        userName: userName,
                        month: formattedMonth,
                        salary: salary,
                        isPaid: true
                    });

                    // After paying the salary, update the paid status
                    fetchPaidStatus(userName);
                    console.log(response.data); // Handle the response data as needed
                    setSelectedEmployee(null);
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Salary paid successfully!',
                        timer: 1500
                    });
                }
            });
        } catch (error) {
            console.error('Error paying salary:', error);
            // Show error message
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to pay salary. Please try again later.',
                timer: 1500
            });
        }
    };



    return (
        <div className="container vh-100">
            <h2>Salary Management</h2>
          

            <PDFSalary/>


            <div className="mb-3">
                <input
                    type="text"
                    className='form-control'
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Employee Name</th>
                            <th>Position</th>
                            <th>Username</th>
                            <th>Paid</th>
                            <th>Paid Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(employee => (
                            <tr key={employee._id}>
                                <td>{employee.empName}</td>
                                <td>{employee.position}</td>
                                <td>{employee.userName}</td>
                                <td>{paidStatus[employee.userName] ? 'Paid' : 'Not Paid'}</td>
                                <td>Rs. {paidAmount[employee.userName]}</td>
                                <td>
                                    {!paidStatus[employee.userName] && (
                                        <button
                                            className="btn btn-warning mr-2"
                                            onClick={() => {
                                                // Show input field
                                                setSelectedEmployee(employee.userName);
                                                setAmountInput(prevState => ({
                                                    ...prevState,
                                                    [employee.userName]: ''
                                                }));
                                            }}
                                        >
                                            Enter Amount
                                        </button>
                                    )}
                                    {selectedEmployee === employee.userName && (
                                        <>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={amountInput[employee.userName]}
                                                onChange={(e) => handleAmountInputChange(e, employee.userName)}
                                            />
                                            <button className='btn btn-success' onClick={() => paySalary(employee.userName, amountInput[employee.userName])}>Pay</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SalaryManagement;
