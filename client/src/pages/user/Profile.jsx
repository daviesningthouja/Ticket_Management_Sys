import React, { useEffect, useState } from 'react';
import "../../styles/user/profile.css";
import { changePassword, getUserProfile } from '../../services/userService';
import { getImageUrl } from '../../services/apiConfig';
import { NavLink, Outlet } from 'react-router-dom';
import Loading from '../../components/Loading';
import ChangePasswordPopup from '../../components/ChangePasswordPopup'; // 📌 Make sure path matches
import Button from '../../components/Button';
import { getUserRole } from '../../utils/authUtils';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const role = getUserRole();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async ({ CurrentPassword, NewPassword,ConfirmPassword }) => {
    try {
      await changePassword({ CurrentPassword, NewPassword,ConfirmPassword }); // 👈 Call your service
      alert("Password updated successfully");
      setShowPasswordPopup(false);
    } catch (err) {
      alert("Failed to update password. Please try again.",err);
    }
  };

  if (loading) return <Loading message='Loading profile...' />;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <div className='profile-container'>
      <h2>My Profile</h2>
      <div className="profile-box">
        <div className='img'>
          <img src={getImageUrl(profile.pfpUrl)} alt="Profile" />
        </div>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>

      <div className='profile-actions'>
        {/* full link pidraD ydba */}
        {role === 'User' && <NavLink to='/user/profile/edit'>
          <Button style=''>Edit Profile</Button>
          
        </NavLink>}
        {role === 'Organizer'&& <NavLink to='/organizer/profile/edit'>
          <Button style=''>Edit Profile</Button>
         
        </NavLink>}
        {role === 'Admin' && <NavLink to='/admin/profile/edit'>
          <Button style=''>Edit Profile</Button>
         
        </NavLink>}
        {/* <NavLink to='/user/profile/edit'>
          <Button style=''>Edit Profile</Button>
          
        </NavLink> */}
        {/* <Outlet/> */}
        <Button style='' onClick={() => setShowPasswordPopup(true)}>Change Password</Button>
      </div>

      {showPasswordPopup && (
        <ChangePasswordPopup
          onClose={() => setShowPasswordPopup(false)}
          onChangePassword={handleChangePassword}
        />
      )}
    </div>
  );
};

export default Profile;
