import React, {useEffect, useState} from 'react'
import EventCard from '../../components/EventCard'
import { getApprovedEvents } from '../../services/eventService';
import Loading from '../../components/Loading'
const UserEvents = () => {
  const[events, setEvents] = useState([]);
  const[loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
        try{
            const data = await getApprovedEvents();
            setEvents(data);
        }catch(error){
            console.error("Failed to fetch events", error);
        } finally{
            setLoading(false);
        }
    };

    fetchEvents();
  },[])
  if(loading) return <Loading message='Loading event...'/>
  
  return (
    <div className='user-events-container'>
      <h2>Available Events</h2>
      {events.length > 0 ? (
        <div className="event-grid">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
        </div>
      ) :  (
        <p>No approved events available.</p>
      )}
    </div>
  )
}

export default UserEvents
