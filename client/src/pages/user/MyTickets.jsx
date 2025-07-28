import React, { useEffect, useState } from "react";
import "../../styles/user/myticket.css";
import { getUserTicket } from "../../services/ticketService";
import Popup from "../../components/Popup";
import DataTable from "../../components/Table";

const MyTickets = () => {
  const [popup, setPopup] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTickets, setFilteredTickets] = useState([])
  const [filter, setFilter] = useState('all');
  
  const ticketColumns = [
    { header: 'Event', accessor: 'eventTitle' },
    { header: 'Ticket No', accessor: 'ticketNumber' },
    {
      header: 'Date & Time',
      accessor: 'bookingTime',
      render: row => new Date(row.bookingTime).toLocaleString(undefined, {
         year: 'numeric',
    month: 'short',   // or 'long' for full month
    day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    },
    { header: 'Price', accessor: 'totalPrice', render: r => `$${r.totalPrice.toFixed(2)}` },
    {header: 'Status', accessor : 'status'} 
  ];
  
   const fetchUserTickets = async () => {
      try {
        const allTickets = await getUserTicket();
        const userTickets = allTickets.filter(t => t.userId);
        setTickets(userTickets);
        setFilteredTickets(userTickets);
      } catch (err) {
        console.error('Error while fetching tickets', err);
      }
    };

  useEffect(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchUserTickets();
        setLoading(false);
      };
      loadData();
    }, []);
    
    const handleFilterChange = (status) => {
    setFilter(status);
      if (status === 'all') {
        setFilteredTickets(tickets);
      } else {
        setFilteredTickets(tickets.filter(t => t.status.toLowerCase() === status));
      }
  };

  if (loading) return <div className="loading">Loading tickets...</div>;

  return (
    <>
      {popup ? (
              <Popup
                h={`Delete Ticket`}
                d={`Are you sure you want to delete the ticket bearing no. ${tickets.ticketNumber}?`}
                onConfirm={() => setPopup(false)}
                onCancel={() => setPopup(false)}
              />
            ) : (
              <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">My Tickets</h2>
                <select
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-3 py-1 border rounded"
                >
                  <option value="all">All</option>
                  <option value="valid">Valid</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <DataTable columns={ticketColumns} data={filteredTickets} />
            </div>
            )
      }
    </>
  );
};

export default MyTickets;
