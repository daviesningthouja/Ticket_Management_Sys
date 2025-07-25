// src/components/BookingPopup.jsx
import React from 'react';
import '../styles/component/bookingPopup.css';

const Popup = ({ h,d,onClose,onConfirm,onCancel }) => {
  return (
    <div className="booking-popup">
      <div className="popup-content">
        {h && <h3>{h}</h3>}
        {d && <p>{d}</p>}
        {onConfirm && <button onClick={onConfirm} className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 rounded-full font-medium  text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 '>Confirm</button>}
        {onClose && <button onClick={onClose} className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none  font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 '>Close</button>}
        {onCancel && <button  onClick={onCancel} className="text-white bg-red-700 hover:bg-red-700 focus:outline-none  focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 ">Cancel</button>}

      </div>
    </div>
  );
};

export default Popup;
