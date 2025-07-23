import React, { useState, useEffect } from 'react';
import '../../styles/user/editProfile.css';
import { getUserProfile, editUserProfile } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import SuccessPopup from '../../components/SuccessPopup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import noPFP from '../../assets/no-profile.jpg';
import { getUserRole } from '../../utils/authUtils';

const EditProfile = () => {
  const [user, setUser] = useState({ name: '', pfpUrl: '' });
  const [image, setImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();
      setUser(data);
    };
    fetchProfile();
  }, []);

 const role = getUserRole();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const formData = new FormData();
        formData.append("name", user.name);
        if (image) formData.append("pfpUrl", image);
        console.log(formData)
        await editUserProfile(formData);
        //alert("Profile updated successfully");
        setShowSuccess(true);
        //if(!SuccessPopup){navigate("/user/profile");}
        //setTimeout(() => {navigate("/user/profile");}, 2000);
    }catch(err){
        console.log(err)
    }
  };

  const handleOnClick= () => {
    setShowSuccess(false)
    if(role === 'User')
      return navigate("/user/profile");
    if(role === 'Organizer')
      return navigate("/organizer/profile");
    if(role === 'Admin')
      return navigate("/admin/profile");
  }
  // () => {setShowSuccess(false); navigate("/user/profile");}
// e => setUser({ ...user, name: e.target.value })
//  <label>Profile Picture</label>
//         {user.pfpUrl && <img src={`https://localhost:7204${user.pfpUrl}`} alt="Profile" className="preview-image" />}
//         <Input type="file" onChange={e => setImage(e.target.files[0])} accept="image/*" />
  return (
    <div className="edit-profile-container">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Name" name="name" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} />
        <div>
          <label className="text-sm font-medium">Profile Picture</label>
          {user.pfpUrl ? <img src={`https://localhost:7204${user.pfpUrl}`} alt="Profile" className="preview-image" /> : <img src={noPFP} alt="Profile" className="preview-image" />}
          <Input type="file" onChange={e => setImage(e.target.files[0])} accept="image/*" className='mt-1' />
          
        </div>
        <Button type="submit " style="btn">Save Changes</Button>
      </form>
      {showSuccess && (
        <SuccessPopup message="Profile updated successfully!" onClose={handleOnClick} />
        )}

    </div>
  );
};

export default EditProfile;
