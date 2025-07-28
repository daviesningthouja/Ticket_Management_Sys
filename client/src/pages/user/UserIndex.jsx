import React, { useEffect, useState } from 'react'

import Navbar from '../../components/Navbar'
import { getUserTicket } from '../../services/ticketService';
import { getApprovedEvents } from '../../services/eventService';
import Card from "../../components/Card"; // assuming reusable card component
import EventSidebar from "../../components/EventSideBar";
import TicketPurchaseSidebar from "../../components/TicketPurchaseSidebar";
import Popup from "../../components/Popup";
const UserIndex = () => {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBuySidebar, setShowBuySidebar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);
// const endOfWeek = new Date();
// endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // Sunday
const upcomingWeekEvents = events.filter(event => {
   const eventDate = new Date(event.eventDate);
  return eventDate >= today && eventDate <= threeDaysLater && event.status === "Approved";
});
  const validTickets = tickets.filter(ticket => ticket.status === "Valid").length;
  const approvedEvents = events.length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userTickets = await getUserTicket();
        const approvedEvents = await getApprovedEvents();
        setTickets(userTickets);
        setEvents(approvedEvents);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handleCardClick = (event) => {
    setSelectedEvent(event);
  };

  const handleBuyClick = () => {
    setShowBuySidebar(true);
  };

  const handlePurchase = () => {
    setShowPopup(true);
    setShowBuySidebar(false);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-semibold">Welcome to Your Dashboard 👋</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Valid Tickets</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">{validTickets}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Approved Events</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">{approvedEvents}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Upcoming Events</h3>
          <p className="text-3xl font-bold mt-2 text-purple-600">{upcomingWeekEvents.length}</p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="text-xl font-semibold mb-4 mt-8">Upcoming Events</h3>
        {loading ? (
          <p>Loading events...</p>
        ) : upcomingWeekEvents.length === 0 ? (
          <p className="text-gray-600">No upcoming events found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingWeekEvents.map((event, idx) => (
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
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}`}
                  className="h-[320px] flex flex-col justify-between overflow-hidden"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebars and Popup */}
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
      {showPopup && (
        <Popup
          h={"Booking Successful ✅"}
          d={"Your ticket has been booked successfully!"}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default UserIndex
