import React, { useEffect, useState } from 'react';
import UserCard from '../../components/UserCard';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUser, getUserByID } from '../../services/userService';
import { getTicketByUserID } from '../../services/ticketService';
import { getAllEvents } from '../../services/eventService';
import DataTable from '../../components/Table';
import Popup from '../../components/Popup';
import Loading from '../../components/Loading';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const ticketColumns = [
    { header: 'Event', accessor: 'eventTitle' },
    { header: 'Ticket No', accessor: 'ticketNumber' },
    {
      header: 'Date',
      accessor: 'bookingTime',
      render: row => new Date(row.bookingTime).toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    },
    { header: 'Price', accessor: 'totalPrice', render: r => `$${r.totalPrice.toFixed(2)}` }
  ];

  const eventColumns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Date', accessor: 'eventDate' },
    { header: 'Location', accessor: 'location' },
    { header: 'Status', accessor: 'status' },
  ];

  const fetchUser = async () => {
    try {
      const userData = await getUserByID(id);
      setUser(userData);
    } catch (err) {
      console.error('Error while fetching user', err);
    }
  };

  const fetchUserTickets = async () => {
    try {
      const userTickets = await getTicketByUserID(id);
      setTickets(userTickets);
    } catch (err) {
      console.error('Error while fetching tickets', err);
    }
  };

  const fetchOrganizerEvents = async () => {
    try {
      const allEvents = await getAllEvents();
      const userEvents = allEvents.filter(ev => ev.organizerId == id);
      setEvents(userEvents);
      setFilteredEvents(userEvents);
    } catch (err) {
      console.error('Error while fetching organizer events', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUser();
      await fetchUserTickets();
      await fetchOrganizerEvents();
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteUser(id);
      navigate('/admin/users');
    } catch (err) {
      console.error('Error deleting user', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(ev => ev.status.toLowerCase() === status));
    }
  };

  if (loading) return <Loading message="Loading user details..." />;

  return (
    <>
      {popup ? (
        <Popup
          h={`Delete ${user?.name}`}
          d={'Are you sure you want to delete this user?'}
          onConfirm={() => handleDelete(id)}
          onCancel={() => setPopup(false)}
        />
      ) : (
        <div className="p-6 space-y-6">
          {user ? (
            <UserCard
              user={user}
              onDelete={() => setPopup(true)}
            />
          ) : (
            <p className="text-center text-gray-500 mt-4">User not found.</p>
          )}

          {user?.role === 'Organizer' ? (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Organizer Events</h2>
                <select
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-3 py-1 border rounded"
                >
                  <option value="all">All</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <DataTable columns={eventColumns} data={filteredEvents} />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-3">User Tickets</h2>
              <DataTable columns={ticketColumns} data={tickets} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserDetail;
