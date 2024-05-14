import React from 'react'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {
    const navigate = useNavigate();
  return (
    <div className='container vh-100'>
        <button className="btn btn-warning" onClick={()=> navigate("/view-addresses")}>Edit Addresses</button>
    </div>
  )
}

export default MyProfile