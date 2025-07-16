import React, { useEffect, useState } from 'react'
import "../../styles/profile.css";
import { getUserProfile } from '../../services/userService';
import { getImageUrl } from '../../services/apiConfig';
import Loading from '../../components/Loading';

const Profile = () => {
  const [profile,setProfile] = useState(null);
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      }catch(err){
        console.error('Failed to fetch profile:', err)
      } finally{
        setLoading(false);
      }
    }
    fetchProfile();
  },[]);

  if(loading) return <Loading message='loading profile'/>
  if(!profile) return <p>No profile data found.</p>;
  return (
    <div className='profile-container'>
      <h2>My Profile</h2>
      {profile ? (
        <div className="profile-box">
          <div><img src={getImageUrl(profile.pfpUrl)} alt="" /></div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  )
}

export default Profile
