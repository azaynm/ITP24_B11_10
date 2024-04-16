import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = "http://localhost:8080";
const allRoles = ["systemAdmin", "employee", "eventCoordinator", "deliveryStaff", "cateringManager", "financialManager", "cheff"];

const EditEmployee = ({ emp, fetchEmployeeData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState(emp);
    const [originalEmployee, setOriginalEmployee] = useState(emp);
    const [additionalRoles, setAdditionalRoles] = useState([]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "role") {
            const updatedRoles = e.target.checked
                ? [...editedEmployee.roles, value]
                : editedEmployee.roles.filter(role => role !== value);
            setEditedEmployee({ ...editedEmployee, roles: updatedRoles });
        } else {
            setEditedEmployee({ ...editedEmployee, [name]: value });
        }
    };

    const saveChanges = async () => {
        // Show confirmation dialog before saving changes
        Swal.fire({
            icon: 'question',
            title: 'Save Changes',
            text: 'Are you sure you want to save the changes?',
            showCancelButton: true,
            confirmButtonText: 'Yes, save',
            cancelButtonText: 'No, cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(`${API_BASE}/api/employee/employees/${emp._id}`, editedEmployee);
                    fetchEmployeeData();
                    const updatedEmployeeData = response.data;
                    setOriginalEmployee(updatedEmployeeData);
                    setIsEditing(false);
                    // Show success message
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Changes saved successfully!',
                        timer: 1500
                    });
                } catch (error) {
                    console.error('Error saving changes:', error);
                    // Show error message
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to save changes. Please try again later.',
                        timer: 1500
                    });
                }
            }
        });
    };


    const cancelEdit = () => {
        // Show confirmation dialog before canceling edit
        Swal.fire({
            icon: 'question',
            title: 'Cancel Edit',
            text: 'Are you sure you want to cancel editing?',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel',
            cancelButtonText: 'No, keep editing',
        }).then((result) => {
            if (result.isConfirmed) {
                setIsEditing(false);
                setEditedEmployee(originalEmployee);
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Canceled',
                    text: 'Editing canceled!',
                    timer: 1500
                });
            }
        });
    };

    return (
        <div className="card">
            <div className="card-body">
                {isEditing ? (
                    <div>
                        <h5 className="card-title">Edit Employee</h5>
                        <div className="mb-3">
                            <label className="form-label">Employee Name</label>
                            <input type="text" className="form-control" name="empName" value={editedEmployee.empName} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Position</label>
                            <input type="text" className="form-control" name="position" value={editedEmployee.position} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" value={editedEmployee.email} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Roles</label>
                            <div>
                                {allRoles.map((role, index) => (
                                    <div className="form-check" key={index}>
                                        <input className="form-check-input" type="checkbox" name="role" value={role} checked={editedEmployee.roles.includes(role)} onChange={handleChange} />
                                        <label className="form-check-label">{role}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="d-grid gap-2">
                            <button onClick={saveChanges} className="btn btn-primary">Save</button>
                            <button onClick={cancelEdit} className="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h5 className="card-title">Employee Details</h5>
                        <div><strong>Employee Name:</strong> {emp.empName}</div>
                        <div><strong>Position:</strong> {emp.position}</div>
                        <div><strong>Email:</strong> {emp.email}</div>
                        <div><strong>Roles:</strong> {emp.roles.map(role => `'${role}'`).join(', ')}</div>
                        <button onClick={handleEdit} className="btn btn-sm btn-secondary mt-2">Edit</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditEmployee;
