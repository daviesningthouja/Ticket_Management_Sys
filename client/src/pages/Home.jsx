// src/pages/Home.jsx
//import React, { useEffect, useState } from "react";
//import { getEvents } from "../services/eventService";
import EventCard from "../components/EventCard";
import Navbar from "../components/Navbar";

const Home = () => {
   return (<>
    <Navbar/>
    <div className="home-container">
      <h1>Welcome to the Ticket Management System</h1>
      <p>Login to view or manage events.</p>
    </div>
   </>
  );
};

export default Home;
