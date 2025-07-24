import React, { useEffect, useState } from 'react'
import pfp from '../../assets/images.png';
import UserCard from '../../components/UserCard';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserByID } from '../../services/userService';

const UserDetail = () => {
  const {id} = useParams();
  //const navigate = useNavigate();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true)
    try{
      
      const user = getUserByID(id);
      console.log(user);
      setUser(user);
    }catch(err){
      console.error('error while fetching user',err)
    }
  }

  useEffect(() => {
    Promise.all([fetchUser()]).finally(()=> setLoading(false))
  },[id])
  return (
    <div>
      {loading ? '':
      <UserCard
        user={user}
        onEdit={(id) => console.log("Edit user", id)}
        onDelete={(id) => console.log("Delete user", id)}
      />}
    </div>
  )
}

export default UserDetail
