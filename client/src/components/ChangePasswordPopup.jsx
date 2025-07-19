import React, { useState } from 'react';
import '../styles/component/changePasspopup.css';

const ChangePasswordPopup = ({ onClose, onChangePassword }) => {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPass !== confirm) {
      setError("New password and confirmation do not match");
      return;
    }
    if(current === newPass)
    {
        setError("Current password and new password cannot be same");
        return;
    }
    onChangePassword({ CurrentPassword: current, NewPassword: newPass , ConfirmPassword: confirm});
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="Current Password" value={current} onChange={e => setCurrent(e.target.value)} required />
          <input type="password" placeholder="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} required />
          <input type="password" placeholder="Confirm New Password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} className="cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
