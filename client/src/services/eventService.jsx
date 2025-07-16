// src/services/eventService.js
//import axios from "axios";
import api,{API_URL} from "./apiConfig";


// Get all events
export const getAllEvents = async () => {
  try {
    const response = await api.get(`events/all`);
    return response.data; // array of event DTOs
  } catch (error) {
    console.error("Error fetching All events:", error);
    throw error;
  }
};

export const getApprovedEvents = async () => {
  try{
    const res = await api.get(`events`)
    return res.data;
  }catch(err){
    console.error("Error Fetching App Events",err)
    throw err;
  }
}


// Get event by ID (example)
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/event/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ById event:", error);
    throw error;
  }
};


//search by location and event name
export const searchEvents = async (title, location) => {
  try{
    const res = await api.get('/search',{
      params: {title, location}
    });
    return res.data;
  }catch(err){
    console.error("Error while searching event OR event not found", err);
    throw err;
  }
}

//organizer
//`${EVENTS_API}`
export const getOrgEvents = async () => {
  try{
    const res = await api.get(`/org/events`);
    return res.data;
  }catch(err){
    console.error("Error fetching Org event:", err);
    throw err;
  }
}

export const createEvent = async (FormData) => {
  try{
    const res = await api.post(`/event/create`, FormData)
    return res.data;
  }catch(err){
    console.error("Error Creating Event", err)
    throw err;
  }
} 


export const updateEvent = async (id,FormData) => {
  try{
    const res = await api.put(`/event/${id}`, FormData)
    return res.data;
  }catch(err){
    console.error("Error Updating Event", err);
    throw err;
  }
}


// admin
export const updateEventStatus = async (id, status) => {
  try{
    const res = await api.patch(`/admin/events/${id}/status?status=${status}`);
    return res.data;
  }catch(err){
    console.error("Error updating event", err);
    throw err;
  }
}

export const getPendingEvent = async () => {
  try{
    const res = await api.get('admin/events/pending');
    return res.data;
  }catch(err){
    console.error("Error getPending Event", err)
    throw err;
  }
}

export const deleteEvent = async (id) => {
  try{
    const res = await api.delete(`/event/delete/${id}`);
    return res.data;
  }catch(err){
    console.error("Error deleting event",err);
    throw err;
  }
}


