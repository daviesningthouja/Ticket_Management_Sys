import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../../services/eventService';
//import { getImageUrl } from '../../services/apiConfig';
import EventCard from '../../components/EventCard';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error('Error loading event', err);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <EventCard event={event}/>
    </div>
  );
};

export default EventDetail;
