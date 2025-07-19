// src/components/EventSidebar.jsx
import React from 'react';
import '../styles/component/eventSidebar.css';

const EventSidebar = ({ event, onClose, onBuyClick }) => {
  //console.log(event);
  if (!event) return null;

  return (
    <div className="event-sidebar">
      <button className="close-btn" onClick={onClose}>✖</button>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Price:</strong> ${event.price}</p>
      <button className="buy-btn" onClick={onBuyClick}>Buy Ticket</button>
    </div>
  );
};

export default EventSidebar;
