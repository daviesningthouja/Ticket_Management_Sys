import React, { useEffect, useState } from 'react'
import { getPendingEvent, updateEventStatus } from '../../services/eventService';
import JTable from '../../components/JTable';
import Popup from '../../components/Popup';

const PendingEvents = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [status, setStatus] = useState()
  useEffect(() => {
    console.log(pendingEvents);
    loadPendingEvents();
  }, []);
  const loadPendingEvents = async () => {
    try {
      const data = await getPendingEvent();
      setPendingEvents(data);
      console.log(data)
      //console.log(pendingEvents)
    } catch (err) {
      console.error('Failed to load pending events', err);
    }
  };
  
  
  //console.log(pendingEvents)
  const handleAction = async (status, eventId) => {
    try {
      await updateEventStatus(eventId, status);
      await loadPendingEvents();
      console.log(eventId,status)
      //setPendingEvents(prev => prev.filter(e => e.id !== eventId)); // remove from UI
      setStatus(status)
      setShowPopup(true)// refresh after action
    } catch (err) {
      console.error(`Failed to ${status} event`, err);
    }
  };

  return (
    <div className="p-4 overflow-hidden h-full">
      <h1 className="text-xl font-semibold mb-4">Pending Event Approvals</h1>
      <JTable events={pendingEvents} onAction={handleAction} />
      {showPopup && <Popup h={'Updated Status Successfull ✅'} d={`Event status change to ${status} !`} onClose={() => setShowPopup(false) } />}  
    </div>
  );
};

export default PendingEvents
