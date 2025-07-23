import React, { useEffect, useState } from 'react';
import EventCard from '../../components/EventCard';
import { getApprovedEvents, searchEvents } from '../../services/eventService';
import EventSidebar from '../../components/EventSideBar';
import TicketPurchaseSidebar from '../../components/TicketPurchaseSidebar';
import Popup from '../../components/Popup';
import Loading from '../../components/Loading';
import '../../styles/user/userEvents.css';
import { getUserId } from '../../utils/authUtils';
import { bookTicket } from '../../services/ticketService';


const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBuySidebar, setShowBuySidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

    // For search
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getApprovedEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setShowBuySidebar(false);
  };

  const handleBuyClick = () => {
    setShowBuySidebar(true);
  };

  const handlePurchase = async (quantity) => {
    console.log("Booking tickets:", quantity);
    // Here you can call your backend to complete booking
    try{
      const uID = getUserId();
      //console.log(uID)
      const formData = {
        userId: uID,
        eventId: selectedEvent.id,
        quantity: quantity ,   
      }
      console.log(formData);
      await bookTicket(formData);

      setSelectedEvent(null);
      setShowBuySidebar(false);
      setShowPopup(true);
    }catch(err){
      console.log("Ticket booking failed:", err)
    }
  };

   const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchEvents(search);
      setEvents(results);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='user-events-container'>
      <h2>Available Events</h2>
       {/* Search Bar */}
      <form onSubmit={handleSearch} className="event-search-form">
        <input
          type="text"
          placeholder="Search event"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <button type="submit">Search</button>
      </form>

      {/* Event Grid */}
      {loading ? (
        <Loading message="Loading events..." />
      ) : events.length > 0 ? (
        <div className="event-grid">
          {events.map(event => (
            <EventCard key={event.id} event={event} onClick={() => handleCardClick(event)} />
          ))}
        </div>
      ) : (
        <p>No events found.</p>
      )}


      <EventSidebar
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onBuyClick={handleBuyClick}
      />

      {showBuySidebar && selectedEvent && (
        <TicketPurchaseSidebar
          event={selectedEvent}
          onClose={() => setShowBuySidebar(false)}
          onConfirm={handlePurchase}
        />
      )}

      {showPopup && <Popup h={'Booking Successfull ✅'} d={'Your ticket has been booked successfully!'} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default UserEvents;
