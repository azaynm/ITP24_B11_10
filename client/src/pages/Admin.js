import React, { useEffect, useState } from 'react';
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
import AddGiftCard from './Thilini/AddGiftCard';
import axios from 'axios';
import CheffInventory from './Charuka/CheffInventory';
import EditMenuItem from './Tharushi/EditMenuItem';

const Admin = () => {
    const [selectedItemId, setSelectedItemId] = useState("")
    const [categories, setCategories] = useState(["Entrees", "Appetizers", "SideDishes", "Salads", "Soups", "Desserts", "Beverages", "Specials"]);
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [activeTab, setActiveTab] = useState('tab1'); // State to manage active tab
    const [role, setRole] = useState([]);
    const tabDetails = [
        { id: 'tab1', name: 'Add Employees', url: '/register-employee' }, // Example tab without category
        { id: 'tab2', name: 'Edit Employees', url: '/edit-employee' }, // Change the URL for other tabs if needed
        { id: 'tab3', name: 'Salary Management', url: '/salary-management' },
        { id: 'tab4', name: 'Feedback Management', url: '/feedback-monitor' },
        { id: 'tab5', name: 'Delivery Approval', url: '/delivery-approval' },
        { id: 'tab6', name: 'Pending Reservations', url: '/pending-reservations' },
        { id: 'tab7', name: 'Inventory Dashboard', url: '/inventory-dashboard' },
        
        { id: 'tab9', name: 'Add Gift Card', url: '/add-gift-card' },
        { id: 'tab10', name: 'Cheff Inventory', url: '/CheffInventory' },
        { id: 'tab8', name: 'Menu Dashboard', url: '/menu-dashboard' },

        
    ];

    const fetchRole = async () => {
        try {
          const { data: response } = await axios.get(`http://localhost:8080/api/users/getId/${localStorage.getItem("username")}`);
    
          setRole(response.user.roles);
          console.log("Admin Page Your role is " + response.user.roles);
          console.log(response);
    
        } catch (error) {
          console.error(error.message);
        }
      }

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
        
    };

    useEffect(()=>{
        fetchRole()
        console.log(role, "role")
    },[])

    const redirectAddMenu = () => {
        setActiveTab('tab11');
    }

    const redirectEditMenu = () => {
        setActiveTab('tab12');
    }

    return (
        <div className='h-100 d-flex'>
        <div className='col-2 bg-dark'>
            <div className="nav flex-column nav-pills vh-100" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                {tabDetails.map(tab => (
                    // Check if the tab is 'Inventory Dashboard' and the user's role is 'cheff'
                    !(tab.id === 'tab9' && !role.includes('systemAdmin')) &&
                    !(tab.id === 'tab1' && !role.includes('systemAdmin')) &&
                    !(tab.id === 'tab2' && !role.includes('systemAdmin')) &&
                    !(tab.id === 'tab3' && !role.includes('systemAdmin')) &&
                    !(tab.id === 'tab10' && !role.includes('cheff')) &&
                    
                    (
                        <button
                            key={tab.id}
                            className={`nav-link text-light ${activeTab === tab.id ? 'bg-success active' : ''}`}
                            onClick={() => handleTabClick(tab)}
                            style={{ marginTop: '10px' }}
                        >
                            {tab.name}
                        </button>
                    )
                    
                ))}
            </div>
        </div>
        <div className='col-10 h-100'>
            <div className="tab-content" id="v-pills-tabContent">
                {/* Render components based on activeTab */}
                {activeTab === 'tab1' && role.includes('systemAdmin') && <RegisterEmployee />}
                {activeTab === 'tab2' && role.includes('systemAdmin') && <EditEmployee />}
                {activeTab === 'tab3' && role.includes('systemAdmin') && <SalaryManagement />}
                {activeTab === 'tab4' && <FeedbackMonitor />}
                {activeTab === 'tab5' && <DeliveryApproval />}
                {activeTab === 'tab6' && <PendingReservations />}
                {activeTab === 'tab7' && <InventoryDashboard />}
                {activeTab === 'tab8' && <MenuDashbaord redirectAddMenu={redirectAddMenu} redirectEditMenu={redirectEditMenu} setSelectedItemId={setSelectedItemId}/>}
                {activeTab === 'tab9' && role.includes('systemAdmin') && <AddGiftCard />}
                {activeTab === 'tab10' && role.includes('cheff') && <CheffInventory />}
                {activeTab === 'tab11' && role.includes('systemAdmin') && <AddMenuItem categories={categories} setActiveTab={setActiveTab}/>}
                {activeTab === 'tab12' && role.includes('systemAdmin') && <EditMenuItem categories={categories} itemId={selectedItemId} setActiveTab={setActiveTab} />}

                


            
            </div>
        </div>
    </div>

    );
}

export default Admin;
