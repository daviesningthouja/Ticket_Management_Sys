// src/services/eventService.js
//import axios from "axios";
import api, { API_URL } from "./apiConfig";

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

export const getLastestEventSale = async(eventId) => {
  try{
    const response = await api.get(`latest-buyers/${eventId}`);
    return response.data;
  }catch(err){
    console.error("Error fetching Lastest events:", err);
  }
}

export const getApprovedEvents = async () => {
  try {
    const res = await api.get(`events`);
    return res.data;
  } catch (err) {
    console.error("Error Fetching App Events", err);
    throw err;
  }
};

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
export const searchEvents = async (data) => {
  try {
    const res = await api.get("/search", {
      params: { title: data },
    });
    const searchitem = res.data;
    console.log(searchitem);
    if (searchitem.length === 0) {
      const res = await api.get("/search", {
        params: { location: data },
      });
      console.log(res.data);
      return res.data;
    }
    return searchitem;
  } catch (err) {
    console.error("Error while searching event OR event not found", err);
    throw err;
  }
};

//organizer
//`${EVENTS_API}`
export const getOrgEvents = async () => {
  try {
    const res = await api.get(`/org/events`);
    return res.data;
  } catch (err) {
    console.error("Error fetching Org event:", err);
    throw err;
  }
};

export const createEvent = async (FormData) => {
  try {
    const res = await api.post(`/event/create`, FormData);
    return res.data;
  } catch (err) {
    console.error("Error Creating Event", err);
    throw err;
  }
};

export const updateEvent = async (id, FormData) => {
  try {
    const res = await api.put(`/event/${id}`, FormData);
    return res.data;
  } catch (err) {
    console.error("Error Updating Event", err);
    throw err;
  }
};

export const getSalesReport = async () => {
  try{
    const res = await api.get('/tickets/sales-report')
    //console.log(res);
    console.log(res.data)
    return res.data;
  } catch (err){
    console.error("Error getting sale reprot",err);
    throw err
  }
}

// admin
export const updateEventStatus = async (id, status) => {
  try {
    console.log(id,status)
    const res = await api.patch(`/admin/events/${id}/status?status=${status}`);
    console.log(res)
    return res.data;
  } catch (err) {
    console.error("Error updating event", err);
    throw err;
  }
};

export const getPendingEvent = async () => {
  try {
    const res = await api.get("admin/events/pending");
    return res.data;
  } catch (err) {
    console.error("Error getPending Event", err);
    throw err;
  }
};

export const deleteEvent = async (id) => {
  try {
    const res = await api.delete(`/event/delete/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting event", err);
    throw err;
  }
};
