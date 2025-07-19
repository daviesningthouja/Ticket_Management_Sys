// src/components/BookingPopup.jsx
import React from 'react';
import '../styles/component/bookingPopup.css';

const BookingPopup = ({ onClose }) => {
  return (
    <div className="booking-popup">
      <div className="popup-content">
        <h3>Booking Successful ✅</h3>
        <p>Your ticket has been booked successfully!</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BookingPopup;
