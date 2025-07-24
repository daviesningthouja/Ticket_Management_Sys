import React, { useEffect, useState } from 'react';
import { getAllEvents, getOrgEvents, searchEvents } from '../../services/eventService';
import Button from '../../components/Button';
import Card from '../../components/Card.jsx';
import { getImageUrl } from '../../services/apiConfig';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../utils/authUtils.jsx';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  //const [status, setStatus] =useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] =useState();
  const navigate = useNavigate();
  const role = getUserRole()
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if(role =="Admin"){
          const data = await getAllEvents();
          setEvents(data);
        }else{
          const data = await getOrgEvents();
          setEvents(data);
        }
        //console.log({})
        //setStatus(data.st)
      } catch (err) {
        console.error("Error loading events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchEvents(search);
      setEvents(results);
      setFilter('')
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAllFilter = async () => {
  setLoading(true);
  try {
    if (role === "Admin") {
      const data = await getAllEvents();
      setEvents(data);
    } else {
      const data = await getOrgEvents();
      setEvents(data);
    }
    setFilter('all');
    setSearch(''); // Optional: reset search input
  } catch (err) {
    console.error("Error loading all events", err);
  } finally {
    setLoading(false);
  }
};

 
  const filteredEvents = events.filter(event => {
    if(filter === '') return true;
    if (filter === 'all') return true;
    if (filter === 'approved') return event.status === 'Approved';
    if(filter === 'pending') return event.status === 'Pending';
    return false;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Events</h2>
        <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search event"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch} type="submit">Search</button>
          {search && (
            <button
              onClick={handleAllFilter}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Clear Search
            </button>
          )}

          <Button
            onClick={handleAllFilter}
            style={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            All
          </Button>

          <Button
            onClick={() => setFilter('approved')}
            style={`px-4 py-2 rounded ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Approved
          </Button>
          <Button
            onClick={() => setFilter('pending')}
            style={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Pending
          </Button>
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
              className="bg-white rounded-lg shadow hover:shadow-xl transition p-4" 
              
              onClick={() =>{
                if(role=="Admin")
                 navigate(`/admin/event/${event.id}`)
                else
                 navigate(`/organizer/event/${event.id}`)
                }}
              >
                <img
                src={getImageUrl(event.imageUrl)} // fallback image if imageUrl is missing
                alt={event.title}
                className="w-full h-40 object-cover rounded mb-4"
                /> 
              <Card
                title={event.title}
                // img ={event.imageUrl}
                // alt = {event.title}
                value={`${event.description}`}
                //description={event.description}
                description={`${event.location} • ${event.eventDate}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
