// src/components/BookingPopup.jsx
import React from 'react';
import '../styles/component/bookingPopup.css';

const Popup = ({ h,d,onClose }) => {
  return (
    <div className="booking-popup">
      <div className="popup-content">
        {h && <h3>{h}</h3>}
        {d && <p>{d}</p>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
