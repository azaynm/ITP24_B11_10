import React, { useEffect, useState } from 'react';
import './Menu.css';
import axios from 'axios';
import MenuCategory from '../../components/Tharushi/MenuCategory';


const Menu = () => {
    const API_BASE = "http://localhost:8080";
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('tab1'); // State to manage active tab

    const tabDetails = [
        { id: 'tab1', name: 'Appetizers', category: 'appetizers' }, // Example tab without category
        { id: 'tab2', name: 'Entrees', category: 'entrees' },
        { id: 'tab3', name: 'Side Dishes', category: 'sideDishes' },
        { id: 'tab4', name: 'Salads', category: 'salads' },
        { id: 'tab5', name: 'Soups', category: 'soups' },
        { id: 'tab6', name: 'Desserts', category: 'desserts' },
        { id: 'tab7', name: 'Beverages', category: 'beverages' },
        { id: 'tab8', name: 'Specials', category: 'specials' },
        // Add more tabs as needed
    ];
    return (
        <div className="">
            <div className="container">
                <div className="tabs">
                    {tabDetails.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab btn btn-primary mx-2 ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
                <div className="tab-content">
                    {tabDetails.map(tab => (
                        <div key={tab.id}>
                            {activeTab === tab.id && (
                                <MenuCategory category={tab.category} />
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Menu;
