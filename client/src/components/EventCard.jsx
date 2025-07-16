// src/components/EventCard.jsx
import React from "react";

const EventCard = ({ event }) => {
  return (
    <div className="event-card" style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        Date: {new Date(event.eventDate).toLocaleDateString()} | Location: {event.location}
      </p>
      {event.imageUrl && (
        <img
          src={`https://localhost:7204${event.imageUrl}`} // Adjust if deployed differently
          alt={event.title}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      )}
      <p>Price: ${event.price}</p>
    </div>
  );
};

export default EventCard;
