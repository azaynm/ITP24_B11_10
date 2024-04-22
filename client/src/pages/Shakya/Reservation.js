import React, { useState } from 'react';
import TableDetails from '../../components/Shakya/TableDetails';
import MyReservation from '../../components/Shakya/MyReservation';

const Reservation = () => {
  const [activeTab, setActiveTab] = useState({ id: 'tab1', type: 'Indoor' });

  const tabDetails = [
    { id: 'tab1', name: 'Table Details', type: 'Indoor', component: <TableDetails /> },
    { id: 'tab2', name: 'My Reservation', type: 'Outdoor', component: <MyReservation /> },
  ];

  const handleTabClick = (tabId, tabType) => {
    setActiveTab({ id: tabId, type: tabType });
  };

  return (
    <div>
      <div className="tabs m-4">
        {tabDetails.map((tab) => (
          <button
            key={tab.id}
            className={`tab btn btn-success mx-2 ${activeTab.id === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id, tab.type)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className='tab-content'>
        {tabDetails.map((tab) => activeTab.id === tab.id && tab.component)}
      </div>
    </div>
  );
};

export default Reservation;
