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
import Card from '../../components/Card';


const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBuySidebar, setShowBuySidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [filter, setFilter] = useState("all");
    // For search
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    
    fetchEvents();
  }, []);
  
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
      if(search == ""){
        await fetchEvents();
      }else{
        const results = await searchEvents(search);
        setEvents(results);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

   const handleFilterChange = async (newFilter) => {
      setLoading(true);
      try {
        
        /*
        const data = await getApprovedEvents(); // gets all events

        let fdata;
        if (newFilter === "completed") {
          fdata = data.filter(event => event.status === "Completed");
        } else {
          fdata = data.filter(event => event.status === "Approved");
        }

        setEvents(fdata);     // update the state with filtered data
        setFilter(newFilter);
        */
        const data = await getApprovedEvents();
        setEvents(data);  // don't filter here
        setFilter(newFilter);
        
      } catch (err) {
        console.error("Error loading filtered events", err);
      } finally {
        setLoading(false);
      }
    };
  
    const filteredEvents = events.filter((event) => {
      if (filter === "" || filter === "all") return event.status === "Approved";
      return event.status.toLowerCase() === filter.toLowerCase();
    });
  
    const statusOptions = ["all", "completed"];
  


  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Manage Events</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search event"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-1 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Search
            </button>
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  handleFilterChange("all");
                }}
                type="button"
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Clear
              </button>
            )}
          </form>

          {/* 🔽 Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-1 border rounded"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p>No events found for selected filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(event)}
              className="cursor-pointer"
            >
              <Card
                title={event.title}
                img={event.imageUrl}
                alt={event.title}
                onClick={() => handleCardClick(event)}
                value={
                  <div className="text-sm text-gray-700 line-clamp-3">
                    {event.description}
                  </div>
                }
                description={`${event.location} • ${new Date(
                  event.eventDate
                ).toLocaleString(undefined, {
                  weekday: "short", // e.g. "Sat"
                  year: "numeric",
                  month: "short", // e.g. "Jul"
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true, // or false for 24-hour format
                })}`}
                className="h-[320px] flex flex-col justify-between overflow-hidden"
              />
            </div>
          ))}
          
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
        
      )}
    </div>
  );
};

export default UserEvents;
/*
    <div className='user-events-container'>
      <h2>Available Events</h2>
   
      <form onSubmit={handleSearch} className="event-search-form">
        <input
          type="text"
          placeholder="Search event"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <button type="submit">Search</button>
      </form>

     
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
    */