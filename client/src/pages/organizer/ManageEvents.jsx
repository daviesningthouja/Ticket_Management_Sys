import React, { useEffect, useState } from "react";
import {
  getAllEvents,
  getOrgEvents,
  searchEvents,
} from "../../services/eventService";
import Card from "../../components/Card.jsx";
//import { getImageUrl } from '../../services/apiConfig';
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/authUtils.jsx";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const role = getUserRole();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data =
          role === "Admin" ? await getAllEvents() : await getOrgEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error loading events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [role]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchEvents(search);
      setEvents(results);
      setFilter("");
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilter) => {
    setLoading(true);
    try {
      const data =
        role === "Admin" ? await getAllEvents() : await getOrgEvents();
      setEvents(data);
      setFilter(newFilter);
    } catch (err) {
      console.error("Error loading filtered events", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "" || filter === "all") return true;
    return event.status.toLowerCase() === filter.toLowerCase();
  });

  const statusOptions = ["all", "approved", "completed", "pending", "rejected"];

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
              onClick={() => {
                role === "Admin"
                  ? navigate(`/admin/event/${event.id}`)
                  : navigate(`/organizer/event/${event.id}`);
              }}
              className="cursor-pointer"
            >
              <Card
                title={event.title}
                img={event.imageUrl}
                alt={event.title}
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
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
