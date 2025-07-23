// src/pages/UpdateEvent.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReusableForm from '../../components/Form';
import { getEventById, updateEvent } from '../../services/eventService';
import { getImageUrl } from '../../services/apiConfig';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  useEffect(() => {
    getEventById(id)
      .then(setEventData)
      .finally(() => setLoading(false));
  }, [id]);

  const fields = [
    { name: 'title',       label: 'Title',        type: 'text',        placeholder: 'Event title' },
    { name: 'description', label: 'Description',  type: 'textarea',    placeholder: 'Tell people about the event' },
    { name: 'location',    label: 'Location',     type: 'text',        placeholder: 'Venue or address' },
    { name: 'eventDate',   label: 'Date & Time',  type: 'datetime-local' },
    { name: 'imageFile',    label: 'Event Image',  type: 'file' },
    { name: 'price',       label: 'Price ($)',    type: 'number',      placeholder: '0' },
    //{ name: 'status',      label: 'Status',       type: 'select',      options: ['Active', 'Inactive', 'Cancelled', 'SoldOut'] },
  ];

  const handleUpdate = async (data) => {
    setLoading(true);
    const formData = new FormData();
    if (data.imageFile?.[0]) formData.append('imageFile', data.imageFile[0]);
    Object.keys(data).forEach((k) => k !== 'imageFile' && formData.append(k, data[k]));
    try {
      await updateEvent(id, formData);
      navigate(`/organizer/event/${id}`);
    } catch {
      alert('Error updating event');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading event…</p>;
  if (!eventData)   return <p className="p-8 text-center">Event not found.</p>;

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Update Event</h1>

      {eventData.imageUrl && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
          <img
            src={getImageUrl(eventData.imageUrl)}
            alt="Current event"
            className="h-32 w-auto rounded-md shadow"
          />
        </div>
      )}

      <ReusableForm
        fields={fields}
        defaultValues={{
          ...eventData,
          eventDate: new Date(eventData.eventDate).toISOString().slice(0, 16),
        }}
        onSubmit={handleUpdate}
        submitLabel="Update Event"
        loading={loading}
      />
    </div>
  );
};

export default EditEvent;