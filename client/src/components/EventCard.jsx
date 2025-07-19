import React, {  useEffect, useState } from "react";

const EventCard = ({ event,onClick }) => {
  const [organizer ,setOrganizer] = useState({});
  
  //const Orgname = event.organizer.name;
  useEffect(() => {
    if (event?.organizer) {
      setOrganizer(event.organizer);
    }
  }, [event]); 

  // <p>Organizer: {event.organizer}</p>
  return (
    <div
      className="event-card"
      onClick={onClick}
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "1rem",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
    >
      {event.imageUrl && (
        <img
          src={`https://localhost:7204${event.imageUrl}`}
          alt={event.title}
          style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
        />
      )}
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>Organizer: {organizer.name}</p>
      <p>
        Date: {new Date(event.eventDate).toLocaleDateString()} | Location: {event.location}
      </p>
      <p>Price: ${event.price}</p>
    </div>
  );
};

export default EventCard;
