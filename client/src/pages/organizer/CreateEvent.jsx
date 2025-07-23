// src/pages/CreateEvent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableForm from '../../components/Form';
import { createEvent } from '../../services/eventService';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: 'title',       label: 'Title',        type: 'text',        placeholder: 'Event title' },
    { name: 'description', label: 'Description',  type: 'textarea',    placeholder: 'Tell people about the event' },
    { name: 'location',    label: 'Location',     type: 'text',        placeholder: 'Venue or address' },
    { name: 'eventDate',   label: 'Date & Time',  type: 'datetime-local' },
    { name: 'imageFile',    label: 'Image URL',    type: 'file',         placeholder: 'https://example.com/image.jpg' },
    { name: 'price',       label: 'Price ($)',    type: 'number',      placeholder: '0' },
    //{ name: 'status',      label: 'Status',       type: 'select',      options: ['Active', 'Inactive', 'Cancelled', 'SoldOut'] },
  ];

const handleCreate = async (data) => {
  setLoading(true);
  try {
    const formData = new FormData();

    // file field (name="image" in the form)
    if (data.imageFile?.[0]) formData.append('imageFile', data.imageFile[0]);
    // all other fields
    Object.keys(data).forEach((key) => {
      if (key !== 'image') formData.append(key, data[key]);
    });
    console.log(data.imageFile);
    console.log(data);
    console.log(formData);

    await createEvent(formData);
    navigate('/organizer/events');
    alert('created event');
  } catch {
    alert('Error creating event');
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <ReusableForm
        fields={fields}
        defaultValues={{ eventDate: new Date().toUTCString().slice(0, 16) }}
        onSubmit={handleCreate}
        submitLabel="Create Event"
        loading={loading}
      />
    </div>
  );
};

export default CreateEvent;