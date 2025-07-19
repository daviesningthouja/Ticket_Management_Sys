import React, { useEffect, useState } from "react";
import "../../styles/user/myticket.css";
import { getUserTicket } from "../../services/ticketService";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getUserTicket();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  if (loading) return <div className="loading">Loading tickets...</div>;

  return (
    <div className="my-tickets">
      <h2>My Tickets</h2>
      {tickets.length === 0 ? (
        <p>You have not booked any tickets yet.</p>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ticket No</th>
              <th>Event</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket.id}>
                <td>{index + 1}</td>
                <td>{ticket.ticketNumber}</td>
                <td>{ticket.eventTitle}</td>
                <td>{new Date(ticket.bookingTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyTickets;
