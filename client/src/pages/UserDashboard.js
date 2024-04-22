import React, { useState } from 'react';
import './Tharushi/Menu.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import RegisterEmployee from './Nidula/RegisterEmployee';
import EditEmployee from './Nidula/EmployeeDetails';
import FeedbackMonitor from './Geethika/FeedbackMonitor';
import PendingReservations from './Shakya/PendingReservations';
import MyOrders from './Deranidu/MyOrders';
import PurchaseGiftCard from './Thilini/GiftCard';
import Reservation from './Shakya/Reservation';

const UserDashboard = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [activeTab, setActiveTab] = useState('tab1'); // State to manage active tab

    const tabDetails = [
        { id: 'tab1', name: 'My Orders', url: '/my-orders' }, // Example tab without category
        { id: 'tab2', name: 'Purchase Gift Cards', url: '/purchase-gift-cards' }, 
        { id: 'tab3', name: 'Reservations', url: '/reservations' }, 
        
    ];

    //s
    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
        
    };

    return (
        <div className=''>
            <div className='row'>
                {/* Sidebar */}
                <div className='col-2 bg-dark'>
                    <div className="nav flex-column nav-pills vh-100" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        {tabDetails.map(tab => (
                            <button
                                key={tab.id}
                                className={`nav-link text-light ${activeTab === tab.id ? 'bg-success active' : ''}`}
                                onClick={() => handleTabClick(tab)} // Call handleTabClick function on click
                                style={{ marginTop: '10px' }}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className='col-10'>
                    <div className="tab-content" id="v-pills-tabContent">
                        {/* Render RegisterEmployee component only if activeTab is 'tab1' */}
                        {activeTab === 'tab1' && <MyOrders />}
                        {activeTab === 'tab2' && <PurchaseGiftCard />}
                        {activeTab === 'tab3' && <Reservation />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
