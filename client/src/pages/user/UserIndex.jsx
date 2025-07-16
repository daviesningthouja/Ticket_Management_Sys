import React, { useState } from 'react'
import { getUser } from '../../utils/authUtils'
import Navbar from '../../components/Navbar'
const UserIndex = () => {
  const [user] = useState(getUser());  
  return (
    <>
    <Navbar/>
    <div>
      <h1>Welcome to your Dashboard </h1>
      <h2>hi {user.name}</h2>
    </div>
    </>
  )
}

export default UserIndex
