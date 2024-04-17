import React, { useState } from 'react';
import './Tharushi/Menu.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import RegisterEmployee from './Nidula/RegisterEmployee';
import EditEmployee from './Nidula/EmployeeDetails';
import FeedbackMonitor from './Geethika/FeedbackMonitor';
import DeliveryApproval from './Maleesha/DeliveryApproval';
import PendingReservations from './Shakya/PendingReservations';
import SalaryManagement from './Nidula/SalaryManagement';
import EditInventoryItem from './Charuka/EditInventorItem';
import AddInventoryItem from './Charuka/AddInventoryItem';
import InventoryDashboard from './Charuka/InventoryDashboard';
import AddMenuItem from './Tharushi/AddMenuItem';
import MenuDashbaord from './Tharushi/MenuDashbaord';

const Admin = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [activeTab, setActiveTab] = useState('tab1'); // State to manage active tab

    const tabDetails = [
        { id: 'tab1', name: 'Add Employees', url: '/register-employee' }, // Example tab without category
        { id: 'tab2', name: 'Edit Employees', url: '/edit-employee' }, // Change the URL for other tabs if needed
        { id: 'tab3', name: 'Salary Management', url: '/salary-management' },
        { id: 'tab4', name: 'Feedback Management', url: '/feedback-monitor' },
        { id: 'tab5', name: 'Delivery Approval', url: '/delivery-approval' },
        { id: 'tab6', name: 'Pending Reservations', url: '/pending-reservations' },
        { id: 'tab7', name: 'Inventory Dashboard', url: '/inventory-dashboard' },
        { id: 'tab8', name: 'Menu Dashboard', url: '/menu-dashboard' }

        
    ];

    const [categories, setCategories] = useState(["Entrees", "Appetizers", "SideDishes", "Salads", "Soups", "Desserts", "Beverages", "Specials"]);

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
        
    };

    return (
        <div className='h-100 d-flex'>
    <div className='col-2 bg-dark'>
        <div className="nav flex-column nav-pills vh-100" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            {tabDetails.map(tab => (
                <button
                    key={tab.id}
                    className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab)} // Call handleTabClick function on click
                >
                    {tab.name}
                </button>
            ))}
        </div>
    </div>

    <div className='col-10 h-100'>
        <div className="tab-content" id="v-pills-tabContent">
            {/* Render components based on activeTab */}
            {activeTab === 'tab1' && <RegisterEmployee />}
            {activeTab === 'tab2' && <EditEmployee />}
            {activeTab === 'tab3' && <SalaryManagement />}
            {activeTab === 'tab4' && <FeedbackMonitor />}
            {activeTab === 'tab5' && <DeliveryApproval />}
            {activeTab === 'tab6' && <PendingReservations />}
            {activeTab === 'tab7' && <InventoryDashboard />}
            {activeTab === 'tab8' && <MenuDashbaord />}
        </div>
    </div>
</div>

    );
}

export default Admin;
