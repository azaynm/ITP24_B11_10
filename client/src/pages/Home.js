import React, { useState } from 'react'
import GridLayout from '../components/GridLayout'

import Menu from './Tharushi/Menu';

const Home = ({ homeFoodData, homeFoodLoading}) => {
  
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <div>
        <Menu/>
    </div>
  )
}

export default Home