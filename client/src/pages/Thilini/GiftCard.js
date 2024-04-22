import React, { useState } from 'react';
import PurchaseGiftCard from '../../components/Thilini/PurchaseGiftCard';
import MyGiftCards from '../../components/Thilini/MyGiftCards';

const API_BASE = "http://localhost:8080";

const GiftCard = () => {
    const [activeTab, setActiveTab] = useState('tab1');

    const tabDetails = [
        { id: 'tab1', name: 'Available', category: 'available' },
        { id: 'tab2', name: 'Purchased', category: 'purchased' }
    ];

    return (
        <div className='container vh-100'>
            <div className="" style={{ width: '100%' }}>
                <div className="tabs">
                    {tabDetails.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab btn btn-success mx-2 ${activeTab === tab.id ? 'active' : ''}`}
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
                                <div>
                                    {/* Different content based on active tab */}
                                    {tab.category === 'available' && <div>
                                        <PurchaseGiftCard/>
                                            </div>}
                                    {tab.category === 'purchased' && <div>
                                         <MyGiftCards/>
                                        </div>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GiftCard;
