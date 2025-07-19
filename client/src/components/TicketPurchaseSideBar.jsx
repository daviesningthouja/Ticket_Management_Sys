// src/components/TicketPurchaseSidebar.jsx
import React, { useState } from 'react';
import '../styles/component/ticketPurchaseSidebar.css';

const TicketPurchaseSidebar = ({ event, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);

  const total = quantity * event.price;

  return (
    <div className="ticket-sidebar">
      <button className="close-btn" onClick={onClose}>✖</button>
      <h4>Buy Tickets for {event.title}</h4>
      <label>Quantity:</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
        min="1"
      />
      <p>Total Price: ₹{total}</p>
      <button className="confirm-btn" onClick={() => onConfirm(quantity)}>Confirm Purchase</button>
    </div>
  );
};

export default TicketPurchaseSidebar;
