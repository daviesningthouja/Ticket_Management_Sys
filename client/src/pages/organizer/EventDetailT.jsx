// src/pages/EventDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  deleteEvent,
  getLastestEventSale,
} from "../../services/eventService";
import DataTable from "../../components/Table";
import EventCard from "../../components/EventCard";
import { getUserRole } from "../../utils/authUtils";
//import { toast } from 'react-hot-toast'; // or any toast lib you use

const EventDetailT = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = getUserRole();
  const columns = [
    { header: "Buyer", accessor: "userName" },
    { header: "Tickets", accessor: "quantity" },
    { header: "Amount", accessor: "totalPrice" },
    {
      header: "Latest Booking",
      accessor: "latestBookingTime",
      render: (row) =>
        new Date(row.latestBookingTime).toLocaleString(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
}),
    },
  ];

  const fetchEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      console.log("Could not load event", err);
    }
  };

  const fetchSales = async () => {
    try {
      const data = await getLastestEventSale(id);
      setSales(data);
      console.log(data);
    } catch (err) {
      console.log("Could not load sales", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await deleteEvent(id);
      console.log("Event deleted");
      navigate("/organizer/events");
    } catch (err) {
      console.log("Could not delete event", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchEvent(), fetchSales()]).finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <p className="p-6 text-center">Loading event details...</p>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSales}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Refresh sales
          </button>
          {role=="Organizer" ? <>
          <button
            onClick={() => navigate(`/organizer/event/${id}/update`)}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
          </> : <>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
          </>
          }
        </div>
      </div>

      {/* Card */}
      <EventCard event={event} />

      {/* Recent Sales */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
        <DataTable columns={columns} data={sales} />
      </section>
    </div>
  );
};

export default EventDetailT;
